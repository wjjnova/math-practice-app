const STORAGE_KEY = 'math-quest-progress-v1';
const DATASET_ENDPOINT = '/api/questions/all';
let QUESTIONS = [];
let QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]));

const elements = {};

const state = loadState();
let currentQuestion = null;
const recentlyAsked = [];
const browserState = { page: 1, pageSize: 8 };
let audioController = null;

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    init().catch((error) => {
      console.error('Failed to init Math Quest', error);
    });
  });
} else {
  init().catch((error) => {
    console.error('Failed to init Math Quest', error);
  });
}

async function init() {
  elements.questionText = document.getElementById('question-text');
  elements.questionMode = document.getElementById('question-mode');
  elements.answerForm = document.getElementById('answer-form');
  elements.answerInput = document.getElementById('answer-input');
  elements.checkButton = document.getElementById('check-button');
  elements.skipButton = document.getElementById('skip-button');
  elements.optionsContainer = document.getElementById('options-container');
  elements.feedback = document.getElementById('feedback');
  elements.historyList = document.getElementById('history-list');
  elements.reviewToggle = document.getElementById('review-toggle');
  elements.questionList = document.getElementById('question-list');
  elements.prevPage = document.getElementById('prev-page');
  elements.nextPage = document.getElementById('next-page');
  elements.pageIndicator = document.getElementById('page-indicator');
  elements.stats = {
    solved: document.getElementById('stat-solved'),
    attempts: document.getElementById('stat-attempts'),
    streak: document.getElementById('stat-streak'),
    best: document.getElementById('stat-best'),
  };
  elements.confettiLayer = document.getElementById('confetti-layer');

  if (!elements.answerForm || !elements.questionText) {
    // DOM did not load correctly; bail early.
    console.error('Math Quest failed to find required DOM nodes.');
    return;
  }

  if (elements.prevPage && elements.nextPage) {
    elements.prevPage.addEventListener('click', () => changeBrowserPage(-1));
    elements.nextPage.addEventListener('click', () => changeBrowserPage(1));
  }
  if (elements.questionList) {
    elements.questionList.innerHTML = '<li class="browser__empty">Loading questions…</li>';
  }
  elements.questionMode.textContent = 'Loading…';

  await ensureQuestionsReady();
  if (!QUESTIONS.length) {
    elements.questionText.textContent = 'Failed to load questions. Refresh or serve the app via localhost.';
    if (elements.questionList) {
      elements.questionList.innerHTML = '<li class="browser__empty">Questions could not be loaded.</li>';
    }
    elements.answerInput.disabled = true;
    elements.checkButton.disabled = true;
    elements.skipButton.disabled = true;
    if (elements.prevPage) {
      elements.prevPage.disabled = true;
    }
    if (elements.nextPage) {
      elements.nextPage.disabled = true;
    }
    if (elements.pageIndicator) {
      elements.pageIndicator.textContent = 'Page 0';
    }
    return;
  }

  elements.reviewToggle.checked = state.focusReview;
  elements.reviewToggle.addEventListener('change', () => {
    state.focusReview = elements.reviewToggle.checked;
    persistState();
    loadNextQuestion(true);
  });

  elements.answerForm.addEventListener('submit', onSubmit);
  elements.skipButton.addEventListener('click', () => loadNextQuestion(true));
  elements.answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      elements.answerForm.requestSubmit();
    }
  });

  updateStats();
  renderHistory();
  renderQuestionList();
  loadNextQuestion();
}

function onSubmit(event) {
  event.preventDefault();
  if (!currentQuestion) {
    return;
  }

  const userInput = elements.answerInput.value.trim();
  if (!userInput) {
    elements.feedback.textContent = 'Type an answer before checking.';
    elements.feedback.className = 'feedback feedback--error';
    return;
  }

  const userNumeric = parseNumeric(userInput);
  const normalizedUser = normalizeAnswer(userInput);

  const correctNumeric = typeof currentQuestion.answerNumeric === 'number' ? currentQuestion.answerNumeric : null;
  const normalizedTarget = normalizeAnswer(currentQuestion.answer);

  const numericMatch = correctNumeric !== null && userNumeric !== null
    ? areNumbersEqual(userNumeric, correctNumeric)
    : false;
  const stringMatch = normalizedUser === normalizedTarget;
  const isCorrect = numericMatch || stringMatch;

  const { revealAnswer } = registerAttempt(currentQuestion, userInput, isCorrect);
  provideFeedback(isCorrect, currentQuestion.answer, revealAnswer);

  if (isCorrect) {
    spawnConfetti();
    playCelebrationSound().catch((error) => {
      console.warn('Celebration audio failed', error);
    });
    window.setTimeout(() => loadNextQuestion(), 550);
  } else {
    elements.answerInput.select();
  }
}

function registerAttempt(question, userInput, isCorrect) {
  const progress = {
    attempts: 0,
    correct: false,
    lastSeen: Date.now(),
    misses: 0,
    ...state.progress[question.id],
  };
  const wasMastered = progress.correct;
  progress.attempts += 1;
  progress.lastSeen = Date.now();
  if (isCorrect) {
    progress.correct = true;
    progress.misses = 0;
  } else {
    progress.misses = (progress.misses ?? 0) + 1;
  }
  state.progress[question.id] = progress;

  state.stats.attempts += 1;
  if (isCorrect) {
    if (!wasMastered && progress.correct) {
      state.stats.solved += 1;
    }
    state.stats.streak += 1;
    state.stats.best = Math.max(state.stats.best, state.stats.streak);
    state.incorrect.delete(question.id);
  } else {
    state.stats.streak = 0;
    state.incorrect.add(question.id);
  }

  const revealAnswer = !isCorrect && (progress.misses ?? 0) >= 2;

  const historyEntry = {
    id: `${question.id}-${progress.attempts}`,
    questionId: question.id,
    question: question.question,
    userAnswer: userInput,
    correctAnswer: question.answer,
    correct: isCorrect,
    timestamp: Date.now(),
    revealAnswer,
  };

  state.history.unshift(historyEntry);
  if (state.history.length > 12) {
    state.history.length = 12;
  }

  persistState();
  updateStats();
  renderHistory();
  renderQuestionList();
  return { progress, revealAnswer };
}

function provideFeedback(isCorrect, correctAnswer, revealAnswer = false) {
  if (isCorrect) {
    elements.feedback.textContent = 'Nice work! You nailed it.';
    elements.feedback.className = 'feedback feedback--success';
  } else {
    elements.feedback.textContent = revealAnswer
      ? `Not yet. Here's the answer: ${correctAnswer}`
      : 'Not yet. Check your work and try again.';
    elements.feedback.className = 'feedback feedback--error';
  }
}

function loadNextQuestion(force = false) {
  if (!force && elements.answerInput.value.trim() && !elements.feedback.textContent) {
    return;
  }

  if (!QUESTIONS.length) {
    elements.questionText.textContent = 'No questions available.';
    elements.questionMode.textContent = 'Unavailable';
    elements.answerInput.disabled = true;
    elements.checkButton.disabled = true;
    elements.skipButton.disabled = true;
    return;
  }

  const nextQuestion = pickQuestion();
  if (!nextQuestion) {
    elements.questionText.textContent = 'Every question is mastered. Fantastic job!';
    elements.answerInput.disabled = true;
    elements.checkButton.disabled = true;
    elements.skipButton.disabled = true;
    elements.questionMode.textContent = 'All Done';
    elements.optionsContainer.hidden = true;
    return;
  }

  setQuestion(nextQuestion, 'auto');
}

function pickQuestion() {
  if (!QUESTIONS.length) {
    return null;
  }

  const focusReview = state.focusReview;
  const incorrectIds = Array.from(state.incorrect).filter((id) => QUESTION_MAP.has(id));
  const unseen = QUESTIONS.filter((q) => !(q.id in state.progress));
  const mastered = QUESTIONS.filter((q) => !incorrectIds.includes(q.id));

  let pool;
  if (focusReview && incorrectIds.length) {
    pool = incorrectIds.map((id) => QUESTION_MAP.get(id));
  } else if (incorrectIds.length) {
    pool = incorrectIds.map((id) => QUESTION_MAP.get(id));
    pool = pool.concat(unseen.length ? unseen : mastered);
  } else if (unseen.length) {
    pool = unseen;
  } else {
    pool = mastered;
  }

  const filteredPool = pool.filter((q) => !recentlyAsked.includes(q.id));
  const finalPool = filteredPool.length ? filteredPool : pool;

  const choice = finalPool[Math.floor(Math.random() * finalPool.length)];
  if (!choice) {
    return null;
  }

  rememberQuestion(choice.id);
  return choice;
}

async function ensureQuestionsReady() {
  if (QUESTIONS.length) {
    return;
  }

  try {
    const response = await fetch(DATASET_ENDPOINT, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        QUESTIONS = normalizeQuestions(data);
        QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]));
        browserState.page = 1;
        return;
      }
    }
  } catch (error) {
    console.error('Dataset API unavailable.', error);
  }

  QUESTIONS = [];
  QUESTION_MAP = new Map();
}

function changeBrowserPage(delta) {
  if (!QUESTIONS.length) {
    return;
  }
  const totalPages = Math.max(1, Math.ceil(QUESTIONS.length / browserState.pageSize));
  browserState.page = Math.min(Math.max(browserState.page + delta, 1), totalPages);
  renderQuestionList();
}

function renderQuestionList() {
  if (!elements.questionList) {
    return;
  }

  if (!QUESTIONS.length) {
    elements.questionList.innerHTML = '<li class="browser__empty">No questions available.</li>';
    updatePagination(0, 0);
    return;
  }

  const totalPages = Math.max(1, Math.ceil(QUESTIONS.length / browserState.pageSize));
  browserState.page = Math.min(Math.max(browserState.page, 1), totalPages);
  updatePagination(browserState.page, totalPages);

  const start = (browserState.page - 1) * browserState.pageSize;
  const pageItems = QUESTIONS.slice(start, start + browserState.pageSize);

  elements.questionList.innerHTML = '';
  if (!pageItems.length) {
    const empty = document.createElement('li');
    empty.className = 'browser__empty';
    empty.textContent = 'No questions on this page.';
    elements.questionList.appendChild(empty);
    return;
  }

  pageItems.forEach((question, index) => {
    const item = document.createElement('li');
    item.className = 'browser__item';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'browser__button';
    if (currentQuestion && currentQuestion.id === question.id) {
      button.classList.add('browser__button--active');
    }

    const title = document.createElement('span');
    title.className = 'browser__button-title';
    title.textContent = getQuestionPreview(question.question);

    const meta = document.createElement('span');
    meta.className = 'browser__button-meta';
    const ordinal = question.position ?? start + index + 1;
    const progress = state.progress[question.id];
    const status = progress?.correct ? 'Mastered' : state.incorrect.has(question.id) ? 'Needs review' : 'Fresh';
    meta.textContent = `#${ordinal} • ${status}`;

    button.append(title, meta);
    button.addEventListener('click', () => {
      setQuestion(question, 'manual');
    });

    item.appendChild(button);
    elements.questionList.appendChild(item);
  });
}

function updatePagination(page, totalPages) {
  if (elements.pageIndicator) {
    elements.pageIndicator.textContent = totalPages > 0 ? `Page ${page} / ${totalPages}` : 'Page 0';
  }
  if (elements.prevPage) {
    elements.prevPage.disabled = page <= 1;
  }
  if (elements.nextPage) {
    elements.nextPage.disabled = totalPages === 0 || page >= totalPages;
  }
}

function setQuestion(question, source) {
  currentQuestion = question;
  rememberQuestion(question.id);

  const questionIndex = QUESTIONS.findIndex((entry) => entry.id === question.id);
  if (questionIndex >= 0) {
    const targetPage = Math.floor(questionIndex / browserState.pageSize) + 1;
    if (targetPage !== browserState.page) {
      browserState.page = targetPage;
    }
  }

  elements.questionText.textContent = question.question;
  elements.answerInput.value = '';
  elements.answerInput.disabled = false;
  elements.checkButton.disabled = false;
  elements.skipButton.disabled = false;
  elements.answerInput.focus();
  elements.feedback.textContent = '';
  elements.feedback.className = 'feedback';

  let modeLabel = 'New Challenge';
  if (source === 'manual') {
    modeLabel = 'Picked by You';
  } else if (state.incorrect.has(question.id)) {
    modeLabel = 'Review Round';
  }
  elements.questionMode.textContent = modeLabel;

  renderChoices(question);
  renderQuestionList();
}

function rememberQuestion(questionId) {
  recentlyAsked.unshift(questionId);
  if (recentlyAsked.length > 5) {
    recentlyAsked.length = 5;
  }
}

function getQuestionPreview(text) {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (compact.length > 140) {
    return `${compact.slice(0, 137)}…`;
  }
  return compact || 'Untitled question';
}


function renderChoices(question) {
  const container = elements.optionsContainer;
  container.innerHTML = '';

  if (typeof question.answerNumeric !== 'number' || !Number.isFinite(question.answerNumeric)) {
    container.hidden = true;
    return;
  }

  const choices = createChoiceSet(question.answerNumeric);
  container.hidden = false;

  choices.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.textContent = option;
    button.addEventListener('click', () => {
      elements.answerInput.value = option;
      elements.answerInput.focus();
    });
    container.appendChild(button);
  });
}

function createChoiceSet(answerNumeric) {
  const choices = new Set();
  const formattedAnswer = formatNumber(answerNumeric);
  choices.add(formattedAnswer);

  const offsets = [1, -1, 5, -5, 10, -10, 0.5, -0.5];
  let attempts = 0;
  while (choices.size < 4 && attempts < 40) {
    const delta = offsets[Math.floor(Math.random() * offsets.length)];
    const candidate = formatNumber(answerNumeric + delta);
    if (candidate !== formattedAnswer) {
      choices.add(candidate);
    }
    attempts += 1;
  }

  while (choices.size < 4) {
    const randomOffset = Math.floor(Math.random() * 20) + 2;
    const candidate = formatNumber(answerNumeric + randomOffset);
    if (candidate !== formattedAnswer) {
      choices.add(candidate);
    }
  }

  const shuffled = Array.from(choices);
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function updateStats() {
  elements.stats.solved.textContent = state.stats.solved;
  elements.stats.attempts.textContent = state.stats.attempts;
  elements.stats.streak.textContent = state.stats.streak;
  elements.stats.best.textContent = state.stats.best;
}

function renderHistory() {
  const list = elements.historyList;
  list.innerHTML = '';
  if (!state.history.length) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'history__item';
    emptyItem.textContent = 'Your progress log will appear here.';
    list.appendChild(emptyItem);
    return;
  }

  state.history.forEach((entry) => {
    const item = document.createElement('li');
    item.className = `history__item${entry.correct ? '' : ' history__item--error'}`;

    const question = document.createElement('p');
    question.className = 'history__question';
    question.textContent = entry.question;

    const result = document.createElement('span');
    result.className = 'history__result';
    const showAnswer = entry.correct || entry.revealAnswer === true || !('revealAnswer' in entry);
    result.textContent = entry.correct
      ? `✅ Answered ${entry.userAnswer}`
      : showAnswer
        ? `❌ You wrote ${entry.userAnswer} • Correct answer ${entry.correctAnswer}`
        : `❌ You wrote ${entry.userAnswer} • Keep practicing!`;

    item.append(question, result);
    list.appendChild(item);
  });
}

function spawnConfetti() {
  const colors = ['#1f56ff', '#5f8cff', '#fdd835', '#ff3d68', '#53d397', '#ffd166', '#06d6a0'];
  const shapes = ['square', 'strip', 'circle'];
  const pieces = 52;

  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const duration = 1500 + Math.random() * 800;
    const startX = Math.random();
    const horizontalSpread = (Math.random() - 0.5) * 260;
    const rotation = Math.random() * 720;
    const size = 10 + Math.random() * 10;

    piece.className = 'confetti';
    piece.dataset.shape = shape;
    piece.style.setProperty('--duration', `${duration}ms`);
    piece.style.setProperty('--x', `${horizontalSpread}px`);
    piece.style.setProperty('--rotation', `${rotation}deg`);
    piece.style.left = `${Math.min(0.85, Math.max(0.15, startX)) * 100}%`;
    piece.style.backgroundColor = color;
    piece.style.width = `${size}px`;
    piece.style.height = shape === 'strip' ? `${size * 2}px` : `${size}px`;

    elements.confettiLayer.appendChild(piece);

    piece.addEventListener('animationend', () => {
      piece.remove();
    });
  }
}

async function playCelebrationSound() {
  if (!audioController) {
    audioController = createAudioController();
  }
  await audioController.resume();
  audioController.playChord([523.25, 659.25, 783.99]);
}

function createAudioController() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return {
      resume: async () => {},
      playChord: () => {},
    };
  }

  const context = new AudioCtx();

  async function resume() {
    if (context.state === 'suspended') {
      await context.resume();
    }
  }

  function playChord(frequencies) {
    const now = context.currentTime;
    const duration = 0.45;
    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = index % 2 === 0 ? 'sine' : 'triangle';
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.02);
    });
  }

  return { resume, playChord };
}

function parseNumeric(value) {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (/^-?\d+\s*\/\s*\d+$/.test(trimmed)) {
    const [numerator, denominator] = trimmed.split('/').map((part) => Number(part.trim()));
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }
  const cleaned = trimmed.replace(/,/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeAnswer(value) {
  return value.replace(/[\s,]/g, '').toLowerCase();
}

function areNumbersEqual(a, b) {
  return Math.abs(a - b) <= Math.max(1e-6, Math.abs(b) * 1e-6);
}

function formatNumber(value) {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return Number(value.toFixed(2)).toString();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState();
    }
    const parsed = JSON.parse(raw);
    parsed.incorrect = new Set(parsed.incorrect ?? []);
    parsed.progress = parsed.progress ?? {};
    parsed.stats = { ...defaultState().stats, ...parsed.stats };
    parsed.history = parsed.history ?? [];
    parsed.focusReview = Boolean(parsed.focusReview);
    Object.values(parsed.progress).forEach((record) => {
      if (!record || typeof record !== 'object') {
        return;
      }
      if (typeof record.misses !== 'number' || Number.isNaN(record.misses)) {
        record.misses = 0;
      }
    });
    return parsed;
  } catch (error) {
    console.error('Failed to load saved state', error);
    return defaultState();
  }
}

function persistState() {
  const toPersist = {
    ...state,
    incorrect: Array.from(state.incorrect),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
}

function defaultState() {
  return {
    stats: {
      solved: 0,
      attempts: 0,
      streak: 0,
      best: 0,
    },
    progress: {},
    incorrect: new Set(),
    history: [],
    focusReview: false,
  };
}

function normalizeQuestions(collection) {
  return collection
    .filter((item) => item && item.question && item.answer)
    .map((item, index) => {
      const questionText = typeof item.question === 'string'
        ? item.question.trim()
        : String(item.question ?? '');
      const answerValue = typeof item.answer === 'string' ? item.answer : String(item.answer ?? '');
      const answerNumeric = typeof item.answerNumeric === 'number'
        ? item.answerNumeric
        : parseNumeric(answerValue);
      return {
        ...item,
        id: item.id ?? item.question_id ?? `q${index}`,
        question: questionText,
        answer: answerValue,
        position: typeof item.position === 'number' ? item.position : index + 1,
        answerNumeric,
      };
    });
}
