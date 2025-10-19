import QUESTIONS_DATA_EN from './data/questions_gsm8k.js?v=223b2b7e10ae';
import QUESTIONS_DATA_ZH from './data/questions_gsm8k_zh.js?v=223b2b7e10ae';
import QUESTIONS_ARC_EASY_EN from './data/questions_arc_easy.js?v=223b2b7e10ae';
import QUESTIONS_ARC_CHALLENGE_EN from './data/questions_arc_challenge.js?v=223b2b7e10ae';
import QUESTIONS_ARC_EASY_ZH from './data/questions_arc_easy_zh.js?v=223b2b7e10ae';
import QUESTIONS_ARC_CHALLENGE_ZH from './data/questions_arc_challenge_zh.js?v=223b2b7e10ae';

const STORAGE_KEY = 'math-quest-progress-v1';
const elements = {};
const rootElement = document.documentElement;
const isIphoneExperience = rootElement.classList.contains('is-iphone');

const SUPPORTED_LOCALES = ['en', 'zh'];
const DEFAULT_LOCALE = 'en';

const TRANSLATIONS = {
  en: {
    documentTitle: 'Math Quest',
    appTitle: 'Math Quest',
    scoreboard: {
      ariaLabel: 'Progress',
      solved: 'Solved',
      attempts: 'Attempts',
      streak: 'Streak',
      best: 'Best Streak',
    },
    badge: {
      loading: 'Loading…',
    },
    action: {
      browseQuestions: 'Browse Questions',
      checkAnswer: 'Check Answer',
      skip: 'Skip',
      readAloud: 'Read aloud',
      readAloudUnavailable: 'Narration unavailable',
      readAloudPause: 'Pause reading',
      readAloudResume: 'Resume reading',
      hint: 'Hint',
      prevPage: 'Previous',
      nextPage: 'Next',
      clearHistory: 'Clear history',
      closeBrowser: 'Close question browser',
    },
    form: {
      answerLabel: 'Your answer',
      answerPlaceholder: 'Choose an option',
    },
    question: {
      loading: 'Loading questions…',
      failedLoad: 'Failed to load questions. Refresh or serve the app via localhost.',
      noQuestions: 'No questions available.',
      masteredAll: 'Every question is mastered. Fantastic job!',
      unavailable: 'Unavailable',
      untitled: 'Untitled question',
    },
    browser: {
      ariaLabel: 'Browse questions',
      title: 'Browse Questions',
      loading: 'Loading questions…',
      error: 'Questions could not be loaded.',
      emptyAll: 'No questions available.',
      emptyPage: 'No questions on this page.',
      itemMeta: '#{number} • {status}',
    },
    history: {
      ariaLabel: 'Recent activity',
      title: 'Recent Turns',
      empty: 'Your progress log will appear here.',
      answered: '✅ Answered {answer}{attempt}',
      answeredRetry: '⚠️ Answered {answer}{attempt}',
      incorrectReveal: '❌ You wrote {answer}{attempt} • Correct answer {correct}',
      incorrectKeep: '❌ You wrote {answer}{attempt} • Keep practicing!',
      attempt: ' (Attempt {count})',
    },
    toggle: {
      focusReview: 'Focus on missed questions',
    },
    feedback: {
      enterAnswer: 'Type an answer before checking.',
      correct: 'Nice work! You nailed it.',
      incorrect: 'Not yet. Check your work and try again.',
      reveal: "Not yet. Here's the answer: {answer}",
      hintPrefix: 'Hint:',
    },
    mode: {
      loading: 'Loading…',
      newChallenge: 'New Challenge',
      pickedByYou: 'Picked by You',
      reviewRound: 'Review Round',
      allDone: 'All Done',
      unavailable: 'Unavailable',
    },
    statusLabel: {
      mastered: 'Mastered',
      needsReview: 'Needs review',
      fresh: 'Fresh',
    },
    pagination: {
      page: 'Page {page} / {total}',
      empty: 'Page 0',
    },
    confirm: {
      clearHistory: 'Clear recent history? This cannot be undone.',
    },
    datasets: {
      label: 'Dataset',
    },
    language: {
      toggleLabel: '🌐 中文',
      toggleAria: 'Switch language to Chinese',
    },
  },
  zh: {
    documentTitle: '数学探险',
    appTitle: '数学探险',
    scoreboard: {
      ariaLabel: '进度',
      solved: '已解',
      attempts: '尝试',
      streak: '连胜',
      best: '最佳连胜',
    },
    badge: {
      loading: '载入中…',
    },
    action: {
      browseQuestions: '浏览题目',
      checkAnswer: '提交答案',
      skip: '跳过',
      readAloud: '朗读题目',
      readAloudUnavailable: '当前设备不支持朗读',
      readAloudPause: '暂停朗读',
      readAloudResume: '继续朗读',
      hint: '提示',
      prevPage: '上一页',
      nextPage: '下一页',
      clearHistory: '清除记录',
      closeBrowser: '关闭题目列表',
    },
    form: {
      answerLabel: '你的答案',
      answerPlaceholder: '请选择一个选项',
    },
    question: {
      loading: '题目载入中…',
      failedLoad: '题目加载失败，请刷新或通过本地服务器访问。',
      noQuestions: '暂无题目。',
      masteredAll: '所有题目都掌握了，太棒了！',
      unavailable: '不可用',
      untitled: '未命名题目',
    },
    browser: {
      ariaLabel: '浏览题目',
      title: '浏览题目',
      loading: '题目载入中…',
      error: '无法加载题目。',
      emptyAll: '暂无可用题目。',
      emptyPage: '本页暂无题目。',
      itemMeta: '第{number}题 • {status}',
    },
    history: {
      ariaLabel: '近期活动',
      title: '最近记录',
      empty: '这里会显示你的练习记录。',
      answered: '✅ 作答 {answer}{attempt}',
      answeredRetry: '⚠️ 作答 {answer}{attempt}',
      incorrectReveal: '❌ 你输入了 {answer}{attempt} • 正确答案 {correct}',
      incorrectKeep: '❌ 你输入了 {answer}{attempt} • 继续加油！',
      attempt: '（第{count}次尝试）',
    },
    toggle: {
      focusReview: '优先练错题',
    },
    feedback: {
      enterAnswer: '请先输入答案。',
      correct: '干得好，答对了！',
      incorrect: '还不对，再检查一下试试。',
      reveal: '还不对，正确答案是：{answer}',
      hintPrefix: '提示：',
    },
    mode: {
      loading: '载入中…',
      newChallenge: '新的挑战',
      pickedByYou: '你选择的题目',
      reviewRound: '复习模式',
      allDone: '全部完成',
      unavailable: '不可用',
    },
    statusLabel: {
      mastered: '已掌握',
      needsReview: '需复习',
      fresh: '待练习',
    },
    pagination: {
      page: '第 {page} / {total} 页',
      empty: '第 0 页',
    },
    confirm: {
      clearHistory: '确定要清除最近记录吗？此操作无法撤销。',
    },
    datasets: {
      label: '题库',
    },
    language: {
      toggleLabel: '🌐 English',
      toggleAria: '切换为英文界面',
    },
  },
};

const DEFAULT_DATASET_ID = 'gsm8k';

const DATASETS = {
  gsm8k: {
    id: 'gsm8k',
    label: { en: 'GSM8K', zh: 'GSM8K' },
    data: { en: QUESTIONS_DATA_EN, zh: QUESTIONS_DATA_ZH },
  },
  arc_easy: {
    id: 'arc_easy',
    label: { en: 'ARC Easy', zh: 'ARC容易' },
    data: { en: QUESTIONS_ARC_EASY_EN, zh: QUESTIONS_ARC_EASY_ZH },
  },
  arc_challenge: {
    id: 'arc_challenge',
    label: { en: 'ARC Challenge', zh: 'ARC挑战' },
    data: { en: QUESTIONS_ARC_CHALLENGE_EN, zh: QUESTIONS_ARC_CHALLENGE_ZH },
  },
};

const DATASET_IDS = Object.keys(DATASETS);

let currentLocale = getInitialLocale();
let currentModeKey = 'mode.loading';
let currentQuestionTextKey = 'question.loading';
let currentBrowserEmptyKey = 'browser.loading';
let questionsReady = false;
let currentDatasetId = DEFAULT_DATASET_ID;

const TELEMETRY_STORAGE_KEY = 'math-quest-telemetry-id';
const TELEMETRY = {
  ready: false,
  distinctId: null,
  initTimer: null,
};

function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  let timestamp = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    timestamp += performance.now();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (timestamp + Math.random() * 16) % 16 | 0;
    timestamp = Math.floor(timestamp / 16);
    return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });
}

function captureEvent(name, properties = {}) {
  if (!TELEMETRY.ready || typeof window === 'undefined' || typeof window.posthog === 'undefined') {
    return;
  }
  try {
    window.posthog.capture(name, { locale: currentLocale, distinctId: TELEMETRY.distinctId, ...properties });
  } catch (error) {
    console.warn('Telemetry capture failed', error);
  }
}

function updateTelemetryIdentity() {
  if (!TELEMETRY.ready || typeof window === 'undefined' || typeof window.posthog === 'undefined') {
    return;
  }
  try {
    window.posthog.identify(TELEMETRY.distinctId, { locale: currentLocale });
  } catch (error) {
    console.warn('Telemetry identify failed', error);
  }
}

function initTelemetry() {
  if (typeof window === 'undefined') {
    return;
  }
  if (typeof window.posthog === 'undefined') {
    if (!TELEMETRY.initTimer) {
      TELEMETRY.initTimer = setTimeout(() => {
        TELEMETRY.initTimer = null;
        initTelemetry();
      }, 1000);
    }
    return;
  }
  if (TELEMETRY.ready) {
    updateTelemetryIdentity();
    return;
  }
  try {
    const storageKey = TELEMETRY_STORAGE_KEY;
    let distinctId = null;
    try {
      distinctId = localStorage.getItem(storageKey);
    } catch (storageError) {
      distinctId = null;
    }
    if (!distinctId) {
      distinctId = generateUUID();
      try {
        localStorage.setItem(storageKey, distinctId);
      } catch (storageWriteError) {
        // ignore
      }
    }
    TELEMETRY.ready = true;
    TELEMETRY.distinctId = distinctId;
    updateTelemetryIdentity();
    captureEvent('app_loaded', { distinctId });
  } catch (error) {
    console.warn('Telemetry initialization failed', error);
    TELEMETRY.ready = false;
  }
}

let QUESTIONS = [];
let QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]));

function setMobileBrowserOpen(open) {
  if (!isIphoneExperience) {
    return;
  }
  const shouldOpen = Boolean(open);
  rootElement.classList.toggle('browser-open', shouldOpen);
  if (elements.mobileBrowserToggle) {
    elements.mobileBrowserToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  }
  if (elements.mobileBrowserScrim) {
    elements.mobileBrowserScrim.hidden = !shouldOpen;
  }
}

function getInitialLocale() {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const qsLocale = params.get('lang') || params.get('locale');
      if (qsLocale) {
        const normalized = qsLocale.toLowerCase();
        if (SUPPORTED_LOCALES.includes(normalized)) {
          return normalized;
        }
      }
    } catch (error) {
      // ignore query string parsing failures
    }
  }
  if (typeof navigator !== 'undefined') {
    const candidates = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : [];
    for (const candidate of candidates) {
      const normalized = String(candidate || '').toLowerCase();
      if (normalized.startsWith('zh')) {
        return 'zh';
      }
      if (normalized.startsWith('en')) {
        return 'en';
      }
    }
  }
  return DEFAULT_LOCALE;
}

function normalizeDatasetId(value) {
  if (!value) {
    return null;
  }
  const normalized = String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
  return DATASETS[normalized] ? normalized : null;
}

function getDatasetFromQuery() {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('dataset') || params.get('set') || params.get('ds');
    return normalizeDatasetId(raw);
  } catch (error) {
    return null;
  }
}

function getDatasetCollection(datasetId, locale) {
  const normalizedId = normalizeDatasetId(datasetId) || DEFAULT_DATASET_ID;
  const definition = DATASETS[normalizedId] || DATASETS[DEFAULT_DATASET_ID];
  if (!definition) {
    return [];
  }
  const perLocale = definition.data || {};
  return perLocale[locale] || perLocale.en || [];
}

function getDatasetLabel(datasetId, locale) {
  const definition = DATASETS[normalizeDatasetId(datasetId) || DEFAULT_DATASET_ID];
  if (!definition) {
    return datasetId;
  }
  return definition.label?.[locale] || definition.label?.en || datasetId;
}

function buildDatasetMenu() {
  if (!elements.datasetMenu) {
    return;
  }
  elements.datasetMenu.innerHTML = '';
  DATASET_IDS.forEach((id) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'dataset-menu__option';
    option.dataset.datasetId = id;
    option.setAttribute('role', 'option');
    option.addEventListener('click', () => {
      setDatasetMenuOpen(false);
      changeDataset(id, { trigger: 'menu' });
    });
    elements.datasetMenu.appendChild(option);
  });
  updateDatasetUI();
}

function updateDatasetUI() {
  const label = getDatasetLabel(currentDatasetId, currentLocale);
  if (elements.datasetToggle) {
    elements.datasetToggle.textContent = label;
    elements.datasetToggle.setAttribute('aria-label', `${t('datasets.label') || 'Dataset'}: ${label}`);
  }
  if (elements.datasetMenu) {
    elements.datasetMenu.querySelectorAll('[data-dataset-id]').forEach((option) => {
      const id = option.dataset.datasetId;
      option.textContent = getDatasetLabel(id, currentLocale);
      const isActive = id === currentDatasetId;
      option.classList.toggle('dataset-menu__option--active', isActive);
      option.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }
}

function setDatasetMenuOpen(open) {
  datasetMenuOpen = Boolean(open);
  if (elements.datasetMenu) {
    elements.datasetMenu.hidden = !datasetMenuOpen;
  }
  if (elements.datasetToggle) {
    elements.datasetToggle.setAttribute('aria-expanded', datasetMenuOpen ? 'true' : 'false');
    elements.datasetToggle.classList.toggle('dataset-toggle--open', datasetMenuOpen);
  }
}

function ensureDatasetMenuListeners() {
  if (datasetMenuListenersRegistered) {
    return;
  }
  document.addEventListener('click', (event) => {
    if (!datasetMenuOpen) {
      return;
    }
    if (elements.datasetMenu && elements.datasetMenu.contains(event.target)) {
      return;
    }
    if (elements.datasetToggle && elements.datasetToggle.contains(event.target)) {
      return;
    }
    setDatasetMenuOpen(false);
  });
  window.addEventListener('keydown', (event) => {
    if (!datasetMenuOpen) {
      return;
    }
    if (event.key === 'Escape') {
      setDatasetMenuOpen(false);
      if (elements.datasetToggle) {
        elements.datasetToggle.focus();
      }
    }
  });
  datasetMenuListenersRegistered = true;
}

function resolveTranslation(locale, key) {
  const source = TRANSLATIONS[locale];
  if (!source) {
    return undefined;
  }
  return key.split('.').reduce((acc, segment) => (
    acc && typeof acc === 'object' && segment in acc ? acc[segment] : undefined
  ), source);
}

function formatTemplate(template, params = {}) {
  if (typeof template !== 'string') {
    return '';
  }
  return template.replace(/\{(\w+)\}/g, (match, token) => (
    Object.prototype.hasOwnProperty.call(params, token) ? params[token] : match
  ));
}

function t(key, params = {}) {
  const localeValue = resolveTranslation(currentLocale, key);
  if (localeValue !== undefined) {
    return typeof localeValue === 'string' ? formatTemplate(localeValue, params) : localeValue;
  }
  const fallback = resolveTranslation(DEFAULT_LOCALE, key);
  if (fallback !== undefined) {
    return typeof fallback === 'string' ? formatTemplate(fallback, params) : fallback;
  }
  return key;
}

function setLocale(locale) {
  const next = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  if (next === currentLocale) {
    return;
  }
  currentLocale = next;

  const questionSnapshot = currentQuestion ? { id: currentQuestion.id } : null;
  QUESTIONS = [];
  QUESTION_MAP = new Map();
  questionsReady = false;

  applyTranslations();
  updateNarrationVoiceForLocale(currentLocale);
  initTelemetry();
  updateTelemetryIdentity();
  captureEvent('language_changed', { locale: currentLocale });
  ensureQuestionsReady().then(() => {
    if (questionSnapshot) {
      const localizedQuestion = QUESTIONS.find((q) => q.id === questionSnapshot.id);
      if (localizedQuestion) {
        setQuestion(localizedQuestion, 'auto');
      } else {
        loadNextQuestion(true);
      }
    } else if (!currentQuestion) {
      loadNextQuestion(true);
    }
  }).catch((error) => {
    console.error('Failed to refresh questions after locale change', error);
  });

  renderQuestionList();
  renderHistory();
  updateStats();
  updateNarrationControls();
  if (elements.questionMode) {
    elements.questionMode.textContent = t(currentModeKey);
  }
  if (!currentQuestion && currentQuestionTextKey && elements.questionText) {
    elements.questionText.textContent = t(currentQuestionTextKey);
  }
}

function updateLanguageToggle() {
  if (!elements.languageToggle) {
    return;
  }
  elements.languageToggle.textContent = t('language.toggleLabel');
  elements.languageToggle.setAttribute('aria-label', t('language.toggleAria'));
}

function applyTranslations() {
  if (typeof document === 'undefined') {
    return;
  }
  const datasetLabel = getDatasetLabel(currentDatasetId, currentLocale);
  document.title = `${t('documentTitle')} — ${datasetLabel}`;
  document.documentElement.lang = currentLocale === 'zh' ? 'zh-CN' : 'en';

  const nodes = document.querySelectorAll('[data-i18n]');
  nodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (!key) {
      return;
    }
    if (elements.questionMode && node === elements.questionMode) {
      node.textContent = t(currentModeKey);
      return;
    }
    if (elements.questionText && node === elements.questionText && currentQuestionTextKey === null) {
      return;
    }
    node.textContent = t(key);
  });

  if (elements.answerInput) {
    elements.answerInput.placeholder = t('form.answerPlaceholder');
  }
  if (currentQuestionTextKey && elements.questionText) {
    elements.questionText.textContent = t(currentQuestionTextKey);
  }
  if (currentBrowserEmptyKey && elements.questionList) {
    const empty = elements.questionList.querySelector('.browser__empty');
    if (empty) {
      empty.textContent = t(currentBrowserEmptyKey);
    }
  }
  if (elements.pageIndicator && !questionsReady) {
    elements.pageIndicator.textContent = t('pagination.empty');
  }
  if (elements.mobileBrowserToggle) {
    elements.mobileBrowserToggle.setAttribute('aria-label', t('action.browseQuestions'));
  }
  if (elements.scoreboard) {
    elements.scoreboard.setAttribute('aria-label', t('scoreboard.ariaLabel'));
  }
  if (elements.browserPanel) {
    elements.browserPanel.setAttribute('aria-label', t('browser.ariaLabel'));
  }
  if (elements.historySection) {
    elements.historySection.setAttribute('aria-label', t('history.ariaLabel'));
  }
  if (elements.mobileBrowserClose) {
    elements.mobileBrowserClose.setAttribute('aria-label', t('action.closeBrowser'));
  }
  updateDatasetUI();

  updateLanguageToggle();
  updateNarrationControls();
}

async function changeDataset(datasetId, options = {}) {
  const normalized = normalizeDatasetId(datasetId) || DEFAULT_DATASET_ID;
  if (!options.force && normalized === currentDatasetId) {
    return;
  }
  currentDatasetId = normalized;
  state.datasetId = normalized;
  persistState();

  setDatasetMenuOpen(false);
  updateDatasetUI();

  QUESTIONS = [];
  QUESTION_MAP = new Map();
  questionsReady = false;
  currentQuestion = null;
  hamsterShownForRun = false;
  recentlyAsked.length = 0;
  currentModeKey = 'mode.loading';
  currentQuestionTextKey = 'question.loading';

  applyTranslations();

  if (!options.skipTelemetry) {
    captureEvent('dataset_changed', { dataset: normalized, trigger: options.trigger || 'user', locale: currentLocale });
  }

  await ensureQuestionsReady();
  renderHistory();
  renderQuestionList();
  updateStats();
  updateNarrationControls();
  loadNextQuestion(true);
}

function getVoicePreference(locale) {
  if (locale === 'zh') {
    return {
      languages: ['zh-cn', 'zh-hk', 'zh-tw', 'zh', 'cmn', 'yue'],
      keywords: ['mandarin', 'chinese', 'zh', 'xia', 'yating', 'bing', 'huihui', 'xiao', 'liang', 'yunjian', 'yunjie'],
    };
  }
  return {
    languages: ['en-us', 'en-gb', 'en-au', 'en-ca', 'en'],
    keywords: ['natural', 'neural', 'wavenet', 'premium', 'google us english', 'google uk english', 'microsoft aria', 'microsoft guy', 'microsoft jenny'],
  };
}

const state = loadState();
const narration = createNarrationState();
let currentQuestion = null;
const recentlyAsked = [];
const browserState = { page: 1, pageSize: 8 };
let audioController = null;
let consecutiveCorrect = 0;
let hamsterShownForRun = false;
let listenersRegistered = false;
let datasetMenuOpen = false;
let datasetMenuListenersRegistered = false;

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
  elements.hintButton = document.getElementById('hint-button');
  elements.checkButton = document.getElementById('check-button');
  elements.skipButton = document.getElementById('skip-button');
  elements.optionsContainer = document.getElementById('options-container');
  elements.feedback = document.getElementById('feedback');
  elements.speakButton = document.getElementById('speak-toggle-button');
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
  elements.scoreboard = document.querySelector('.scoreboard');
  elements.confettiLayer = document.getElementById('confetti-layer');
  elements.mobileBrowserToggle = document.getElementById('mobile-browser-toggle');
  elements.mobileBrowserClose = document.getElementById('mobile-browser-close');
  elements.mobileBrowserScrim = document.getElementById('mobile-browser-scrim');
  elements.languageToggle = document.getElementById('language-toggle');
  elements.datasetToggle = document.getElementById('dataset-toggle');
  elements.datasetMenu = document.getElementById('dataset-menu');
  elements.browserPanel = document.querySelector('.browser');
  elements.historySection = document.querySelector('.history');

  if (!elements.answerForm || !elements.questionText) {
    // DOM did not load correctly; bail early.
    console.error('Math Quest failed to find required DOM nodes.');
    return;
  }

  currentModeKey = 'mode.loading';
  currentQuestionTextKey = 'question.loading';
  currentBrowserEmptyKey = 'browser.loading';

  if (elements.prevPage && elements.nextPage) {
    elements.prevPage.addEventListener('click', () => {
      changeBrowserPage(-1);
      captureEvent('pagination_previous', { page: browserState.page });
    });
    elements.nextPage.addEventListener('click', () => {
      changeBrowserPage(1);
      captureEvent('pagination_next', { page: browserState.page });
    });
  }
  if (elements.questionList) {
    elements.questionList.innerHTML = `<li class="browser__empty">${t(currentBrowserEmptyKey)}</li>`;
  }
  if (elements.languageToggle) {
    elements.languageToggle.addEventListener('click', () => {
      const nextLocale = currentLocale === 'en' ? 'zh' : 'en';
      captureEvent('language_toggle_clicked', { nextLocale });
      setLocale(nextLocale);
    });
  }

  if (elements.datasetToggle) {
    elements.datasetToggle.addEventListener('click', () => {
      setDatasetMenuOpen(!datasetMenuOpen);
    });
  }
  buildDatasetMenu();
  ensureDatasetMenuListeners();

  const queryDataset = getDatasetFromQuery();
  const storedDataset = normalizeDatasetId(state.datasetId);
  currentDatasetId = queryDataset || storedDataset || DEFAULT_DATASET_ID;
  state.datasetId = currentDatasetId;
  updateDatasetUI();

  applyTranslations();
  initTelemetry();
  if (elements.questionMode) {
    elements.questionMode.textContent = t(currentModeKey);
  }

  if (isIphoneExperience) {
    if (elements.mobileBrowserToggle) {
      elements.mobileBrowserToggle.addEventListener('click', () => {
        const shouldOpen = !rootElement.classList.contains('browser-open');
        setMobileBrowserOpen(shouldOpen);
        captureEvent('browser_toggle_clicked', { open: shouldOpen });
      });
      elements.mobileBrowserToggle.setAttribute('aria-expanded', 'false');
    }
    if (elements.mobileBrowserClose) {
      elements.mobileBrowserClose.addEventListener('click', () => {
        captureEvent('browser_panel_closed', { reason: 'button' });
        setMobileBrowserOpen(false);
      });
    }
    if (elements.mobileBrowserScrim) {
      elements.mobileBrowserScrim.addEventListener('click', () => {
        captureEvent('browser_panel_closed', { reason: 'scrim' });
        setMobileBrowserOpen(false);
      });
      elements.mobileBrowserScrim.hidden = true;
    }
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMobileBrowserOpen(false);
      }
    });
  }

  await ensureQuestionsReady();
  if (!QUESTIONS.length) {
    currentQuestionTextKey = 'question.failedLoad';
    currentModeKey = 'mode.unavailable';
    if (elements.questionMode) {
      elements.questionMode.textContent = t(currentModeKey);
    }
    elements.questionText.textContent = t(currentQuestionTextKey);
    if (elements.questionList) {
      currentBrowserEmptyKey = 'browser.error';
      elements.questionList.innerHTML = `<li class="browser__empty">${t(currentBrowserEmptyKey)}</li>`;
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
      elements.pageIndicator.textContent = t('pagination.empty');
    }
    return;
  }
  questionsReady = true;

  renderHistory();
  renderQuestionList();
  updateStats();
  updateNarrationControls();
  loadNextQuestion();

  persistState();
  captureEvent('app_ready', { questionCount: QUESTIONS.length, dataset: currentDatasetId, locale: currentLocale });
}

function onSubmit(event) {
  event.preventDefault();
  if (!currentQuestion) {
    return;
  }

  const userInput = elements.answerInput.value.trim();
  if (!userInput) {
    elements.feedback.textContent = t('feedback.enterAnswer');
    elements.feedback.className = 'feedback feedback--error';
    return;
  }

  const userNumeric = parseNumeric(userInput);
  const normalizedUser = normalizeAnswer(userInput);

  const correctNumeric = typeof currentQuestion.answerNumeric === 'number' ? currentQuestion.answerNumeric : null;
  const targetAnswer = typeof currentQuestion.answerValue === 'string' && currentQuestion.answerValue
    ? currentQuestion.answerValue
    : currentQuestion.answer ?? '';
  const normalizedTarget = normalizeAnswer(targetAnswer);

  const numericMatch = correctNumeric !== null && userNumeric !== null
    ? areNumbersEqual(userNumeric, correctNumeric)
    : false;
  const stringMatch = normalizedUser === normalizedTarget;
  const aliasMatch = Array.isArray(currentQuestion.answerAliases)
    ? currentQuestion.answerAliases.map((alias) => normalizeAnswer(String(alias))).includes(normalizedUser)
    : false;
  const isCorrect = numericMatch || stringMatch || aliasMatch;

  captureEvent('answer_submitted', {
    questionId: currentQuestion.id,
    correct: isCorrect,
  });

  const { revealAnswer } = registerAttempt(currentQuestion, userInput, isCorrect);
  provideFeedback(isCorrect, targetAnswer, revealAnswer);

  if (isCorrect) {
    spawnConfetti();
    playCelebrationSound().catch((error) => {
      console.warn('Celebration audio failed', error);
    });
    // track consecutive correct answers
    consecutiveCorrect += 1;
    // show hamster starting at 4 correct answers, growing 10% larger with each additional correct
    showHamster(consecutiveCorrect);
    window.setTimeout(() => loadNextQuestion(), 550);
  } else {
    elements.answerInput.select();
    // reset streak-on-success counter when incorrect
    consecutiveCorrect = 0;
    hamsterShownForRun = false;
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
    questionId: question.id,
    question: question.question,
    userAnswer: userInput,
    correctAnswer: question.answerValue ?? question.answer,
    correct: isCorrect,
    attempts: 1,
    timestamp: Date.now(),
    revealAnswer,
  };

  const existingIndex = state.history.findIndex((entry) => entry.questionId === question.id);
  if (existingIndex >= 0) {
    const existing = state.history.splice(existingIndex, 1)[0];
    historyEntry.attempts = (existing.attempts ?? 1) + 1;
    historyEntry.timestamp = Date.now();
    historyEntry.revealAnswer = revealAnswer;
    historyEntry.correct = isCorrect;
    historyEntry.userAnswer = userInput;
    historyEntry.correctAnswer = question.answerValue ?? question.answer;
    historyEntry.id = existing.id ?? question.id;
  } else {
    historyEntry.id = question.id;
  }

  state.history.unshift(historyEntry);
  // keep only the most recent 15 entries
  if (state.history.length > 15) {
    state.history.length = 15;
  }

  persistState();
  updateStats();
  renderHistory();
  renderQuestionList();
  return { progress, revealAnswer };
}

function provideFeedback(isCorrect, correctAnswer, revealAnswer = false) {
  if (isCorrect) {
    elements.feedback.textContent = t('feedback.correct');
    elements.feedback.className = 'feedback feedback--success';
    // play success sound (handled elsewhere) -- keep synth call in onSubmit
  } else {
    elements.feedback.textContent = revealAnswer
      ? t('feedback.reveal', { answer: correctAnswer })
      : t('feedback.incorrect');
    elements.feedback.className = 'feedback feedback--error';
    // play a failure sound to indicate incorrect answer
    playFailSound().catch((err) => {
      // ignore playback errors
    });
  }
}

function loadNextQuestion(force = false) {
  if (!force && elements.answerInput.value.trim() && !elements.feedback.textContent) {
    return;
  }

  if (!QUESTIONS.length) {
    currentQuestionTextKey = 'question.noQuestions';
    currentModeKey = 'mode.unavailable';
    elements.questionText.textContent = t(currentQuestionTextKey);
    elements.questionMode.textContent = t(currentModeKey);
    elements.answerInput.disabled = true;
    elements.checkButton.disabled = true;
    elements.skipButton.disabled = true;
    stopNarration();
    updateNarrationControls();
    return;
  }

  const nextQuestion = pickQuestion();
  if (!nextQuestion) {
    currentQuestionTextKey = 'question.masteredAll';
    currentModeKey = 'mode.allDone';
    elements.questionText.textContent = t(currentQuestionTextKey);
    elements.answerInput.disabled = true;
    elements.checkButton.disabled = true;
    elements.skipButton.disabled = true;
    elements.questionMode.textContent = t(currentModeKey);
    elements.optionsContainer.hidden = true;
    stopNarration();
    updateNarrationControls();
    return;
  }

  setQuestion(nextQuestion, 'auto');
}

// show a temporary hamster overlay with growing size
function showHamster(consecutiveCount = 1) {
  const layer = document.getElementById('hamster-layer');
  const emoji = document.getElementById('hamster-emoji');
  if (!layer || !emoji) return;
  
  // remove any existing size classes
  emoji.className = 'hamster-emoji';
  
  // Only show hamster after 4 consecutive correct answers
  if (consecutiveCount >= 4) {
    if (!hamsterShownForRun) {
      hamsterShownForRun = true;
      captureEvent('hamster_shown', { streak: consecutiveCount });
    }
    // Calculate size class (starts at 1 for 30%, increases by 1 for each additional correct answer)
    // Cap at size-7 (90% window)
    const sizeClass = Math.min(consecutiveCount - 3, 7);
    emoji.classList.add(`hamster-emoji--size-${sizeClass}`);
    
    layer.classList.add('show');
    // remove after 2s so it remains large long enough
    setTimeout(() => layer.classList.remove('show'), 2000);
  }
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
    const datasetDefinition = DATASETS[normalizeDatasetId(currentDatasetId) || DEFAULT_DATASET_ID];
    const datasetLocale = datasetDefinition?.data?.[currentLocale] ? currentLocale : 'en';
    const datasetCollection = getDatasetCollection(currentDatasetId, datasetLocale);
    const rawDataset = Array.isArray(datasetCollection) ? datasetCollection : [];
    if (!Array.isArray(rawDataset) || !rawDataset.length) {
      throw new Error('Dataset is empty or malformed.');
    }
    QUESTIONS = normalizeQuestions(rawDataset);
    QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]));
    browserState.page = 1;
    questionsReady = true;
    captureEvent('dataset_ready', { dataset: currentDatasetId, datasetLocale, totalQuestions: QUESTIONS.length });
    if (!listenersRegistered) {
      if (elements.reviewToggle) {
        elements.reviewToggle.checked = state.focusReview;
        elements.reviewToggle.addEventListener('change', () => {
          state.focusReview = elements.reviewToggle.checked;
          persistState();
          captureEvent('focus_review_toggled', { enabled: state.focusReview });
          loadNextQuestion(true);
        });
      }

      elements.clearHistoryButton = document.getElementById('clear-history-button');
      if (elements.clearHistoryButton) {
        elements.clearHistoryButton.addEventListener('click', () => {
          if (confirm(t('confirm.clearHistory'))) {
            clearHistory();
          }
        });
      }

      elements.answerForm.addEventListener('submit', onSubmit);
      elements.skipButton.addEventListener('click', () => {
        consecutiveCorrect = 0;
        hamsterShownForRun = false;
        captureEvent('question_skipped', { questionId: currentQuestion ? currentQuestion.id : null });
        loadNextQuestion(true);
      });

      if (elements.speakButton) {
        if (narration.supported) {
          elements.speakButton.addEventListener('click', onNarrationToggle);
        } else {
          elements.speakButton.disabled = true;
        }
      }

      if (elements.hintButton) {
        elements.hintButton.addEventListener('click', () => {
          if (!currentQuestion) return;
          captureEvent('hint_requested', { questionId: currentQuestion.id });
          const full = String(currentQuestion.answer ?? '');
          const cleaned = full.replace(/\n?####\s*[-+]?\d+(?:\.\d+)?\s*$/, '').trim();
          const escapeHtml = (str) => str.replace(/[&<>"']/g, (ch) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          }[ch]));
          const rendered = escapeHtml(cleaned).replace(/\n/g, '<br>');
          elements.feedback.innerHTML = `${t('feedback.hintPrefix')} <span class="hint-body">${rendered}</span>`;
          elements.feedback.className = 'feedback feedback--hint';
          setTimeout(() => {
            elements.feedback.textContent = '';
            elements.feedback.className = 'feedback';
          }, 5000);
        });
      }

      elements.answerInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          elements.answerForm.requestSubmit();
        }
      });

      listenersRegistered = true;
    } else if (elements.reviewToggle) {
      elements.reviewToggle.checked = state.focusReview;
    }
    return;
  } catch (error) {
    console.error('Dataset initialization failed', error);
    captureEvent('dataset_load_failed', { dataset: currentDatasetId, locale: currentLocale, message: String(error) });
  }

  QUESTIONS = [];
  QUESTION_MAP = new Map();
  questionsReady = false;
}

function changeBrowserPage(delta) {
  if (!QUESTIONS.length) {
    return;
  }
  const totalPages = Math.max(1, Math.ceil(QUESTIONS.length / browserState.pageSize));
  browserState.page = Math.min(Math.max(browserState.page + delta, 1), totalPages);
  captureEvent('pagination_changed', { page: browserState.page, totalPages });
  renderQuestionList();
}

function renderQuestionList() {
  if (!elements.questionList) {
    return;
  }

  if (!QUESTIONS.length) {
    currentBrowserEmptyKey = questionsReady ? 'browser.emptyAll' : currentBrowserEmptyKey || 'browser.loading';
    elements.questionList.innerHTML = `<li class="browser__empty">${t(currentBrowserEmptyKey)}</li>`;
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
    currentBrowserEmptyKey = 'browser.emptyPage';
    empty.textContent = t(currentBrowserEmptyKey);
    elements.questionList.appendChild(empty);
    return;
  }
  currentBrowserEmptyKey = null;

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
    const statusKey = progress?.correct
      ? 'statusLabel.mastered'
      : state.incorrect.has(question.id)
        ? 'statusLabel.needsReview'
        : 'statusLabel.fresh';
    meta.textContent = t('browser.itemMeta', { number: ordinal, status: t(statusKey) });

    button.append(title, meta);
    button.addEventListener('click', () => {
      captureEvent('browser_item_clicked', { questionId: question.id, page: browserState.page });
      setQuestion(question, 'manual');
    });

    item.appendChild(button);
    elements.questionList.appendChild(item);
  });
}

function updatePagination(page, totalPages) {
  if (elements.pageIndicator) {
    elements.pageIndicator.textContent = totalPages > 0
      ? t('pagination.page', { page, total: totalPages })
      : t('pagination.empty');
  }
  if (elements.prevPage) {
    elements.prevPage.disabled = page <= 1;
  }
  if (elements.nextPage) {
    elements.nextPage.disabled = totalPages === 0 || page >= totalPages;
  }
}

function setQuestion(question, source) {
  stopNarration({ silent: true });
  currentQuestion = question;
  rememberQuestion(question.id);

  const questionIndex = QUESTIONS.findIndex((entry) => entry.id === question.id);
  if (questionIndex >= 0) {
    const targetPage = Math.floor(questionIndex / browserState.pageSize) + 1;
    if (targetPage !== browserState.page) {
      browserState.page = targetPage;
    }
  }

  currentQuestionTextKey = null;
  elements.questionText.textContent = question.question;
  elements.answerInput.value = '';
  elements.answerInput.disabled = false;
  elements.checkButton.disabled = false;
  elements.skipButton.disabled = false;
  elements.answerInput.focus();
  elements.feedback.textContent = '';
  elements.feedback.className = 'feedback';

  let modeKey = 'mode.newChallenge';
  if (source === 'manual') {
    modeKey = 'mode.pickedByYou';
  } else if (state.incorrect.has(question.id)) {
    modeKey = 'mode.reviewRound';
  }
  currentModeKey = modeKey;
  elements.questionMode.textContent = t(currentModeKey);
  if (isIphoneExperience && source === 'manual') {
    setMobileBrowserOpen(false);
  }

  renderChoices(question);
  renderQuestionList();
  updateNarrationControls();
  captureEvent('question_viewed', {
    questionId: question.id,
    source,
    numericAnswer: typeof question.answerNumeric === 'number',
  });
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
  return compact || t('question.untitled');
}

function onNarrationToggle() {
  if (!narration.supported) {
    return;
  }
  if (!currentQuestion || !currentQuestion.question) {
    return;
  }
  if (!narration.playing) {
    startNarration(currentQuestion.question);
    captureEvent('narration_started', { questionId: currentQuestion.id, locale: currentLocale });
    return;
  }
  if (narration.paused) {
    resumeNarration();
    captureEvent('narration_resumed', { questionId: currentQuestion.id, locale: currentLocale });
  } else {
    pauseNarration();
    captureEvent('narration_paused', { questionId: currentQuestion.id, locale: currentLocale });
  }
}

function startNarration(text) {
  if (!narration.supported || !text) {
    return;
  }
  updateNarrationVoiceForLocale(currentLocale);
  if (!narration.voice) {
    try {
      const synth = window.speechSynthesis;
      const pollVoices = () => {
        const voices = synth.getVoices();
        if (voices && voices.length) {
          const chosen = selectPreferredVoice(voices, currentLocale);
          if (chosen) {
            narration.voice = chosen;
          }
          proceed();
        } else {
          setTimeout(pollVoices, 120);
        }
      };
      const proceed = () => {
        continueNarration(text);
      };
      pollVoices();
      return;
    } catch (error) {
      console.warn('Narration voice polling failed', error);
    }
  }
  continueNarration(text);
}

function continueNarration(text) {
  if (!narration.supported || !text) {
    return;
  }
  stopNarration({ silent: true });
  const utterance = new SpeechSynthesisUtterance(text);
  const fallbackLang = currentLocale === 'zh' ? 'zh-CN' : 'en-US';
  if (narration.voice) {
    utterance.voice = narration.voice;
    utterance.lang = narration.voice.lang || fallbackLang;
  } else {
    utterance.lang = fallbackLang;
  }
  utterance.rate = 0.95;
  utterance.pitch = 1.02;
  utterance.volume = 1;
  const handleComplete = () => {
    if (narration.utterance !== utterance) {
      return;
    }
    narration.playing = false;
    narration.paused = false;
    narration.utterance = null;
    updateNarrationControls();
  };
  utterance.onend = handleComplete;
  utterance.onerror = handleComplete;
  narration.utterance = utterance;
  narration.playing = true;
  narration.paused = false;
  try {
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    narration.playing = false;
    narration.utterance = null;
    console.warn('Narration failed to start', error);
  }
  updateNarrationControls();
}

function pauseNarration() {
  if (!narration.supported || !narration.playing || narration.paused) {
    return;
  }
  try {
    window.speechSynthesis.pause();
    narration.paused = true;
  } catch (error) {
    console.warn('Narration pause failed', error);
  }
  updateNarrationControls();
}

function resumeNarration() {
  if (!narration.supported || !narration.playing || !narration.paused) {
    return;
  }
  try {
    window.speechSynthesis.resume();
    narration.paused = false;
  } catch (error) {
    console.warn('Narration resume failed', error);
  }
  updateNarrationControls();
}

function stopNarration(options = {}) {
  if (!narration.supported) {
    return;
  }
  if (narration.playing || narration.paused) {
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      console.warn('Narration cancel failed', error);
    }
    if (!options.silent && currentQuestion) {
      captureEvent('narration_stopped', { questionId: currentQuestion.id, locale: currentLocale });
    }
  }
  narration.playing = false;
  narration.paused = false;
  narration.utterance = null;
  if (!options.silent) {
    updateNarrationControls();
  }
}

function updateNarrationControls() {
  const speakButton = elements.speakButton;
  if (!speakButton) {
    return;
  }

  if (!narration.supported) {
    speakButton.disabled = true;
    speakButton.innerHTML = `<span class="button__icon" aria-hidden="true">🔇</span><span class="button__text">${t('action.readAloudUnavailable')}</span>`;
    speakButton.setAttribute('aria-pressed', 'false');
    return;
  }

  const hasQuestion = Boolean(currentQuestion && currentQuestion.question);
  const isPlaying = narration.playing && !narration.paused;
  const isPaused = narration.playing && narration.paused;

  speakButton.disabled = !hasQuestion;
  let speakLabelKey = 'action.readAloud';
  let speakIcon = '🔊';
  if (isPlaying) {
    speakLabelKey = 'action.readAloudPause';
    speakIcon = '⏸️';
  } else if (isPaused) {
    speakLabelKey = 'action.readAloudResume';
    speakIcon = '▶️';
  }
  speakButton.innerHTML = `<span class="button__icon" aria-hidden="true">${speakIcon}</span><span class="button__text">${t(speakLabelKey)}</span>`;
  speakButton.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
}


function renderChoices(question) {
  const container = elements.optionsContainer;
  container.innerHTML = '';

  const providedChoices = Array.isArray(question.choices) ? question.choices : [];
  const hasProvidedChoices = providedChoices.length > 0;

  if (hasProvidedChoices) {
    container.hidden = false;
    container.classList.add('answer-form__options--provided');
    providedChoices.forEach((choice) => {
      const label = String(choice.label ?? '').trim();
      const text = String(choice.text ?? '').trim();
      const value = label || text;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      const display = label && text ? `${label}. ${text}` : text || label;
      button.textContent = display;
      if ((display || '').length > 48) {
        button.classList.add('choice--wide');
      }
      button.addEventListener('click', () => {
        Array.from(container.querySelectorAll('.choice')).forEach((el) => el.classList.remove('choice--selected'));
        button.classList.add('choice--selected');
        elements.answerInput.value = value;
        elements.checkButton.focus();
        captureEvent('choice_selected', {
          questionId: currentQuestion ? currentQuestion.id : null,
          value,
        });
      });
      container.appendChild(button);
    });
    return;
  }

  container.classList.remove('answer-form__options--provided');

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
    if ((option || '').length > 18) {
      button.classList.add('choice--wide');
    }
    button.addEventListener('click', () => {
      // clear selected state on other choices
      Array.from(container.querySelectorAll('.choice')).forEach((el) => el.classList.remove('choice--selected'));
      button.classList.add('choice--selected');
      elements.answerInput.value = option;
      // move focus to Check button for quick keyboard use
      elements.checkButton.focus();
      captureEvent('choice_selected', {
        questionId: currentQuestion ? currentQuestion.id : null,
        value: option,
      });
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
    emptyItem.textContent = t('history.empty');
    list.appendChild(emptyItem);
    return;
  }

  // render most recent first (state.history is already newest-first)
  state.history.forEach((entry) => {
    const item = document.createElement('li');
    const attemptCount = Math.max(1, entry.attempts ?? 1);
    const wasRetry = entry.correct && attemptCount > 1;
    let itemClass = 'history__item';
    if (entry.correct) {
      itemClass = wasRetry ? 'history__item history__item--warn' : 'history__item';
    } else {
      itemClass = 'history__item history__item--error';
    }
    item.className = itemClass;

    const question = document.createElement('p');
    question.className = 'history__question';
    question.textContent = entry.question;

    const result = document.createElement('span');
    result.className = 'history__result';
    const showAnswer = entry.correct || entry.revealAnswer === true || !('revealAnswer' in entry);
    const attemptNote = attemptCount > 1 ? t('history.attempt', { count: attemptCount }) : '';
    let message;
    if (entry.correct) {
      const key = wasRetry ? 'history.answeredRetry' : 'history.answered';
      message = t(key, { answer: entry.userAnswer, attempt: attemptNote });
    } else if (showAnswer) {
      message = t('history.incorrectReveal', {
        answer: entry.userAnswer,
        attempt: attemptNote,
        correct: entry.correctAnswer,
      });
    } else {
      message = t('history.incorrectKeep', { answer: entry.userAnswer, attempt: attemptNote });
    }
    result.textContent = message;

    item.append(question, result);
    list.appendChild(item);
  });
}

function clearHistory() {
  // Reset everything: stats, progress, incorrect set and history
  state.history = [];
  state.progress = {};
  state.incorrect = new Set();
  state.stats = { solved: 0, attempts: 0, streak: 0, best: 0 };
  state.focusReview = false;
  persistState();
  if (elements.reviewToggle) {
    elements.reviewToggle.checked = false;
  }
  renderHistory();
  renderQuestionList();
  updateStats();
  captureEvent('history_cleared');
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
  // Prefer playing a bundled success.mp3 if present (easier to control, can be replaced by the user)
  try {
    // quick HEAD to check presence
    const resp = await fetch('./data/success.mp3', { method: 'HEAD', cache: 'no-store' });
    if (resp.ok) {
      const a = new Audio('./data/success.mp3');
      a.volume = 0.9;
      await a.play();
      return;
    }
  } catch (err) {
    // ignore and fall back to synth
  }

  // fallback to synth chord
  audioController.playChord([523.25, 659.25, 783.99]);
}

async function playFailSound() {
  // prefer fail.mp3 if present, otherwise synth a short dissonant sting
  try {
    const resp = await fetch('./data/fail.mp3', { method: 'HEAD', cache: 'no-store' });
    if (resp.ok) {
      const a = new Audio('./data/fail.mp3');
      a.volume = 0.9;
      await a.play();
      return;
    }
  } catch (err) {
    // fall back
  }

  // short dissonant synth
  if (!audioController) {
    audioController = createAudioController();
  }
  await audioController.resume();
  // play a quick minor-second cluster
  const base = 220.0;
  audioController.playChord([base, base * Math.pow(2, 1 / 12)]);
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
    const duration = 0.5; // celebration duration (0.5 seconds)
    const attack = 0.02;
    const sustainLevel = 0.22;
    const release = 0.08;

    // master nodes
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(1, now);
    const lowpass = context.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(7000, now);
    lowpass.Q.setValueAtTime(0.7, now);

    masterGain.connect(lowpass).connect(context.destination);

    // For each frequency, create two slightly detuned voices (sine + saw)
    frequencies.forEach((frequency, index) => {
      const detuneCents = index % 2 === 0 ? 8 : -8; // alternate detune
      const pan = (index - (frequencies.length - 1) / 2) / (frequencies.length); // spread across stereo

      const voiceGain = context.createGain();
      const panner = context.createStereoPanner();
      panner.pan.setValueAtTime(pan, now);
      voiceGain.connect(panner).connect(masterGain);

      // Sine voice (clean)
      const osc1 = context.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, now);
      osc1.detune.setValueAtTime(detuneCents, now);

      // Saw voice (body)
      const osc2 = context.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(frequency, now);
      osc2.detune.setValueAtTime(-detuneCents, now);

      // per-voice gain envelope
      const g = context.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(sustainLevel, now + attack);
      g.gain.setValueAtTime(sustainLevel, now + duration - release);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.01);

      osc1.connect(g);
      osc2.connect(g);
      g.connect(voiceGain);

      osc1.start(now);
      osc2.start(now + 0.005 * Math.random()); // slight phasing
      osc1.stop(now + duration + 0.02);
      osc2.stop(now + duration + 0.02);
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
  const defaults = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaults;
    }
    const parsed = JSON.parse(raw);
    parsed.incorrect = new Set(parsed.incorrect ?? []);
    parsed.progress = parsed.progress ?? {};
    parsed.stats = { ...defaults.stats, ...parsed.stats };
    parsed.history = parsed.history ?? [];
    parsed.focusReview = Boolean(parsed.focusReview);
    if (parsed.settings) {
      delete parsed.settings;
    }
    parsed.datasetId = normalizeDatasetId(parsed.datasetId) || DEFAULT_DATASET_ID;
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
    return defaults;
  }
}

function persistState() {
  const toPersist = {
    ...state,
    incorrect: Array.from(state.incorrect),
  };
  delete toPersist.settings;
  // ensure we don't persist more than 20 recent history entries
  if (Array.isArray(toPersist.history) && toPersist.history.length > 20) {
    toPersist.history = toPersist.history.slice(0, 20);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
}

function createNarrationState() {
  const hasWindow = typeof window !== 'undefined';
  const supported = hasWindow
    && 'speechSynthesis' in window
    && typeof window.SpeechSynthesisUtterance === 'function';
  const state = {
    supported,
    playing: false,
    paused: false,
    utterance: null,
    voice: null,
  };

  if (!supported) {
    return state;
  }

  const synth = window.speechSynthesis;
  const refreshVoice = () => {
    const available = synth.getVoices();
    if (!available.length) {
      return;
    }
    const chosen = selectPreferredVoice(available, currentLocale);
    if (chosen) {
      state.voice = chosen;
    }
  };

  refreshVoice();
  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', refreshVoice);
  } else {
    const existingHandler = synth.onvoiceschanged;
    synth.onvoiceschanged = (...args) => {
      refreshVoice();
      if (typeof existingHandler === 'function') {
        existingHandler.apply(synth, args);
      }
    };
  }

  return state;
}

function updateNarrationVoiceForLocale(locale) {
  if (!narration.supported) {
    return;
  }
  try {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const chosen = selectPreferredVoice(voices, locale);
    if (chosen) {
      narration.voice = chosen;
    }
  } catch (error) {
    // ignore voice selection errors
  }
}

function selectPreferredVoice(voices, locale = DEFAULT_LOCALE) {
  if (!Array.isArray(voices) || !voices.length) {
    return null;
  }

  const { languages: languagePriority, keywords: namePriority } = getVoicePreference(locale);

  let bestVoice = null;
  let bestScore = -Infinity;

  voices.forEach((voice) => {
    if (!voice) return;
    const lang = (voice.lang || '').toLowerCase();
    const name = (voice.name || '').toLowerCase();
    let score = 0;

    languagePriority.forEach((prefix, index) => {
      if (lang.startsWith(prefix)) {
        score += (languagePriority.length - index) * 20;
      }
    });

    namePriority.forEach((keyword, index) => {
      if (name.includes(keyword)) {
        score += (namePriority.length - index) * 5;
      }
    });

    if (voice.default) {
      score += 5;
    }

    if (!bestVoice || score > bestScore) {
      bestVoice = voice;
      bestScore = score;
    }
  });

  return bestVoice || voices[0] || null;
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
    datasetId: DEFAULT_DATASET_ID,
  };
}

function normalizeQuestions(collection) {
  return collection
    .filter((item) => item && item.question && (item.answer || item.answerValue))
    .map((item, index) => {
      const questionText = typeof item.question === 'string'
        ? item.question.trim()
        : String(item.question ?? '');

      const rawFullAnswer = typeof item.answer === 'string'
        ? item.answer
        : typeof item.answerValue === 'string'
          ? item.answerValue
          : '';
      const fullAnswer = rawFullAnswer ? rawFullAnswer.trim() : '';

      let finalAnswer;
      if (typeof item.answerValue === 'string' && item.answerValue.trim()) {
        finalAnswer = item.answerValue.trim();
      } else if (fullAnswer.includes('####')) {
        finalAnswer = fullAnswer.split('####').pop().trim();
      } else if (fullAnswer) {
        const lines = fullAnswer.split('\n');
        finalAnswer = lines[lines.length - 1].trim();
      } else {
        finalAnswer = '';
      }

      const answerNumeric = typeof item.answerNumeric === 'number'
        ? item.answerNumeric
        : parseNumeric(finalAnswer);

      return {
        ...item,
        id: item.id ?? item.question_id ?? `q${index}`,
        question: questionText,
        answer: fullAnswer,
        answerValue: finalAnswer,
        position: typeof item.position === 'number' ? item.position : index + 1,
        answerNumeric,
      };
    });
}
