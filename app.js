/* ═══════════════════════════════════════════════
    Unfold— app.js
   ═══════════════════════════════════════════════ */

// Import Supabase client for authentication and the demo-only local auth path.
import {
  supabase,
  getCurrentUser,
  LOCAL_DEMO_ACCOUNTS,
  signInDemo,
  signOutDemo,
  isDemoSessionActive
} from './supabase.js';

/* ─── DATA: THEMES ─── */
const THEMES = {
  light: {
    name: "Light",
    icon: "☀️",
    description: "Clean and minimal"
  },
  dark: {
    name: "Dark",
    icon: "🌙",
    description: "Easy on the eyes"
  },
  forest: {
    name: "Forest",
    icon: "🌲",
    description: "Natural and grounding"
  },
  lavender: {
    name: "Lavender",
    icon: "💜",
    description: "Calm and serene"
  },
  midnight: {
    name: "Midnight",
    icon: "🌌",
    description: "Deep and peaceful"
  },
  sunset: {
    name: "Sunset",
    icon: "🌅",
    description: "Warm and cozy"
  }
};

/* ─── DATA: QUOTES ─── */
const DAILY_QUOTES = [
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "The mind is everything. What you think, you become.", author: "Buddha" },
  { text: "Do not indulge in dreams of having what you have not, but count up the chief of the blessings you do possess.", author: "Epictetus" },
  { text: "The soul that sees beauty may sometimes walk alone.", author: "Goethe" },
  { text: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi" },
  { text: "Within you there is a stillness and sanctuary to which you can retreat at any time.", author: "Hermann Hesse" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Emerson" },
  { text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh" },
  { text: "Tat tvam asi — Thou art that.", author: "Chandogya Upanishad" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
];

/* ─── DATA: JOURNAL PROMPTS ─── */
const JOURNAL_PROMPTS = [
  { text: "What would you do today if you knew you could not fail?", source: "Positive Psychology" },
  { text: "Describe a moment this week where you felt fully alive. What made it so?", source: "ACT" },
  { text: "What is one thing you are resisting right now? What would happen if you let it be?", source: "Stoicism" },
  { text: "Write a letter to your future self, one year from now.", source: "CBT" },
  { text: "What are three things your body did for you today that you take for granted?", source: "Gratitude" },
  { text: "If your current struggles were a teacher, what lesson are they trying to give you?", source: "Vedanta" },
  { text: "What belief about yourself is holding you back the most? Is it actually true?", source: "CBT" },
  { text: "Recall someone who showed you kindness. How did it change you?", source: "Positive Psychology" },
  { text: "The Bhagavad Gita says: act without attachment to results. Where in your life can you practice this?", source: "Vedanta" },
  { text: "What would Stoic Marcus Aurelius say to you about your biggest worry right now?", source: "Stoicism" },
  { text: "List 5 small things that brought you joy this week, however trivial.", source: "Gratitude" },
  { text: "Where in your life are you being too hard on yourself? How would you speak to a friend in the same situation?", source: "Self-compassion" },
  { text: "What does your ideal day look like — not the productive one, the joyful one?", source: "Positive Psychology" },
  { text: "Write about a version of yourself you are slowly becoming.", source: "Growth" },
];

/* ─── DATA: AFFIRMATIONS ─── */
const AFFIRMATIONS = [
  { text: "I am enough, exactly as I am, right now in this moment.", cat: "confidence" },
  { text: "I release what I cannot control and trust the unfolding of my life.", cat: "peace" },
  { text: "Every challenge I face is an invitation to grow stronger.", cat: "growth" },
  { text: "I am the observer of my thoughts, not their prisoner.", cat: "peace" },
  { text: "My purpose is unfolding with every step I take.", cat: "purpose" },
  { text: "Aham Brahmasmi — I am the infinite consciousness.", cat: "vedic" },
  { text: "I have survived every difficult day so far. I will survive this one too.", cat: "confidence" },
  { text: "I choose progress over perfection, always.", cat: "growth" },
  { text: "The obstacle is the way. Resistance is my teacher.", cat: "stoic" },
  { text: "I am rooted like a tree — flexible in the storm, firm in my ground.", cat: "peace" },
  { text: "My presence is my power. I do not need to prove myself.", cat: "confidence" },
  { text: "Soham — I am that. I am whole, I am complete.", cat: "vedic" },
  { text: "What is within my control, I act on. What is not, I release.", cat: "stoic" },
  { text: "I am worthy of love, success, and deep inner peace.", cat: "confidence" },
  { text: "I grow a little more every single day, even when I cannot see it.", cat: "growth" },
  { text: "My life has meaning and I am contributing something real to this world.", cat: "purpose" },
  { text: "The universe is not punishing me. It is redirecting me.", cat: "peace" },
  { text: "I am the author of my story. I can rewrite any chapter.", cat: "growth" },
  { text: "Virtue is its own reward. I act rightly because it is right.", cat: "stoic" },
  { text: "Sat-Chit-Ananda — I am existence, consciousness, and bliss.", cat: "vedic" },
];

/* ─── DATA: REFLECTION PROMPTS ─── */
const REFLECTION_PROMPTS = {
  gratitude: [
    "What made today feel meaningful?",
    "Who or what are you quietly grateful for right now?",
    "What's a small joy you almost missed today?",
    "What comfort did you experience this week that you took for granted?",
    "What's something beautiful you noticed today?",
    "Who showed up for you when you needed them?",
    "What part of your daily routine brings you unexpected peace?",
    "What's a gift from your past self that you're enjoying now?",
    "What kindness did you witness today?",
    "What's something about your body that worked well today?",
  ],
  growth: [
    "What are you carrying that no longer needs your energy?",
    "What would your future self thank you for today?",
    "What's something you quietly overcame this week?",
    "What version of yourself are you slowly becoming?",
    "What did you learn about yourself this month?",
    "What old pattern are you ready to release?",
    "What's a fear you've outgrown without noticing?",
    "What's something you used to struggle with that now feels easier?",
    "What boundary did you set or wish you had set?",
    "What's a skill you're building that matters to you?",
  ],
  self_awareness: [
    "What emotion stayed with you the longest today?",
    "What are you avoiding thinking about right now?",
    "What's true about you today that wasn't true a year ago?",
    "What does your body need that you're not giving it?",
    "What's something you're not saying that needs to be heard?",
    "What part of yourself do you hide from others?",
    "What's a belief you hold that might not be true?",
    "What's something you judge in others that reflects something in you?",
    "What would you do if you weren't afraid of being judged?",
    "What's something you need to forgive yourself for?",
  ],
  resilience: [
    "What gave you hope recently?",
    "What's something difficult you handled well this week?",
    "What helped you keep going when you wanted to stop?",
    "What's a challenge that revealed your strength?",
    "What's something you survived that you're proud of?",
    "What resource do you turn to when things feel heavy?",
    "What's a setback that led to something better?",
    "What's something you've rebuilt in your life?",
    "What's a hard conversation you're glad you had?",
    "What's something you've learned to sit with instead of fixing?",
  ],
  relationships: [
    "Who in your life makes you feel seen?",
    "What's something you wish you could say to someone?",
    "What relationship needs more of your attention?",
    "What's something you appreciate about someone you see often?",
    "Who do you miss and why?",
    "What's a connection that surprised you this year?",
    "What's something you need to ask for in your relationships?",
    "What boundary would improve your relationships?",
    "Who brings out the best in you?",
    "What's something you want to thank someone for?",
  ],
  purpose: [
    "What feels like time well spent to you?",
    "What's something you'd do even if no one saw it?",
    "What contribution do you want to make that feels authentic?",
    "What's a dream you've been postponing?",
    "What matters to you that didn't use to?",
    "What's something you want to be remembered for?",
    "What's a problem you care about solving?",
    "What's something you're building that will outlast you?",
    "What's a value you're not willing to compromise?",
    "What's something you want to create this year?",
  ],
  creativity: [
    "What's something you want to create but haven't started?",
    "What idea has been visiting you lately?",
    "What's something you made that you're proud of?",
    "What would you create if you didn't need it to be perfect?",
    "What's something you want to express that you haven't?",
    "What creative practice do you miss?",
    "What's something beautiful you want to bring into the world?",
    "What's a project you're excited about?",
    "What would you do with a free afternoon?",
    "What's something you want to learn to make?",
  ],
  emotions: [
    "What surprised you today?",
    "What are you looking forward to that you haven't admitted?",
    "What's something that made you laugh recently?",
    "What's something that made you feel proud?",
    "What's an emotion you're learning to welcome?",
    "What's something that made you feel peaceful?",
    "What's something that made you feel alive?",
    "What's an emotion you've been avoiding?",
    "What's something that made you feel connected?",
    "What's something that made you feel hopeful?",
  ],
  rest: [
    "What does rest look like for you right now?",
    "What's something you can put down for today?",
    "What would feel like a real break?",
    "What's something you're doing that can wait?",
    "What's a way you can be kind to yourself today?",
    "What's something you need to stop carrying?",
    "What would your ideal morning of rest feel like?",
    "What's something you can delegate or let go of?",
    "What's a small luxury you can give yourself today?",
    "What would doing nothing look like for you?",
  ],
  mindfulness: [
    "What's happening right now in your body?",
    "What did you notice today that usually goes unnoticed?",
    "What's something you can fully be present for?",
    "What's a sound you can hear right now?",
    "What's something you can see with fresh eyes?",
    "What's a sensation you're feeling that you usually ignore?",
    "What's something you can taste or smell right now?",
    "What's a thought you can observe without following?",
    "What's one thing you can do with full attention?",
    "What's something you can appreciate in this moment?",
  ],
};

/* ─── DATA: CBT TIPS ─── */
const CBT_TIPS = {
  "all-or-nothing": "Try to find the grey area. Ask yourself: is there any evidence this is not completely true?",
  "overgeneralizing": "One event doesn't define a pattern. What would you tell a friend in this situation?",
  "catastrophizing": "Ask: what is the most realistic outcome? What is the actual probability of the worst case?",
  "mind-reading": "You cannot know what others think. Stick to observable facts rather than interpretations.",
  "should-statements": "Replace 'should' with 'could' or 'I would like to'. Be gentler with yourself.",
  "self-blame": "You are responsible for your actions, not for everything that happens. Separate yourself from outcomes.",
  "filtering": "Deliberately list three positive things alongside the negative. A full picture is more accurate.",
  "none": "Excellent self-awareness. Keep noticing your thoughts with curiosity, not judgment.",
};

/* ─── DATA: GREETINGS ─── */
const TIME_BASED_GREETINGS = {
  morning: [
    { text: "Good morning", emoji: "☀️" },
    { text: "Good morning", emoji: "🌤" },
  ],
  afternoon: [
    { text: "Good afternoon", emoji: "🌤" },
    { text: "Good afternoon", emoji: "☕" },
  ],
  evening: [
    { text: "Good evening", emoji: "🌙" },
    { text: "Good evening", emoji: "🌆" },
  ],
  night: [
    { text: "Good night", emoji: "🌌" },
    { text: "Good night", emoji: "✨" },
  ],
};

const CONTEXTUAL_GREETINGS = {
  // First visit / no history
  firstVisit: [
    "Welcome to Unfold.",
    "It's nice to meet you.",
    "Begin wherever you are.",
  ],

  // Returning after absence
  returningAfterAbsence: [
    "Welcome back.",
    "It's been a while.",
    "Good to see you again.",
  ],

  // Consistent check-ins (streak >= 3)
  consistentCheckin: [
    "You've been checking in consistently.",
    "Your dedication shows.",
    "Small moments add up.",
  ],

  // Strong streak (streak >= 7)
  strongStreak: [
    "Your streak is growing strong.",
    "You're building something meaningful.",
    "Consistency is beautiful.",
  ],

  // Yesterday was low mood
  yesterdayLow: [
    "Yesterday seemed a little heavy.",
    "I hope today gives you more breathing room.",
    "Be gentle with yourself today.",
  ],

  // Yesterday was high mood
  yesterdayHigh: [
    "Yesterday was a good day.",
    "Carry that warmth forward.",
    "You're doing wonderfully.",
  ],

  // Multiple journal entries
  journalActive: [
    "Your reflections are accumulating.",
    "Your inner world is rich.",
    "Keep writing your truth.",
  ],

  // Ritual completed
  ritualComplete: [
    "You completed your ritual today.",
    "Sacred moments matter.",
    "You honored your practice.",
  ],

  // Quiet check-ins (low energy consistently)
  quietCheckins: [
    "Three quiet check-ins in a row.",
    "Rest is also progress.",
    "Honor your need for stillness.",
  ],

  // General return
  generalReturn: [
    "Welcome back.",
    "It's nice to see you again.",
    "Take today one gentle step at a time.",
  ],
};

/* ─── STATE ─── */
let state = {
  currentPage: "home",
  checkin: { mood: null, energy: 5, distortions: [] },
  currentPromptIndex: 0,
  currentAffirmIndex: 0,
  currentAffirmCat: "all",
  breathPattern: { in: 4, hold: 7, out: 8 },
  breathRunning: false,
  breathCycles: 0,
  breathTimer: null,
  currentReflection: null,
  reflectionHistory: [],
};

/* ─── STORAGE HELPERS ─── */
function save(key, val) {
  try { localStorage.setItem("mindroot_" + key, JSON.stringify(val)); } catch(e) {}
}
function load(key, fallback) {
  try {
    const v = localStorage.getItem("mindroot_" + key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch(e) { return fallback; }
}

/* ─── INIT ─── */
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize authentication first
  setupAuthListeners();
  checkSession();
  
  // Initialize app components
  setDate();
  setDailyQuote();
  initNav();
  initTheme();
  initHome();
  initCheckin();
  await initJournal(); // Journal is now async (uses Supabase)
  initBreathwork();
  initRitual();
  initAffirmations();
  initTrends();
  initSettings();
  initMobileMenu();
  initReflection();
});

/* ─── DATE ─── */
function setDate() {
  const now = new Date();
  const opts = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const str = now.toLocaleDateString("en-IN", opts);
  const el = document.getElementById("todayDate");
  const ed = document.getElementById("editorDate");
  if (el) el.textContent = str;
  if (ed) ed.textContent = str;
}

/* ─── DAILY QUOTE ─── */
function setDailyQuote() {
  const idx = new Date().getDate() % DAILY_QUOTES.length;
  const q = DAILY_QUOTES[idx];
  const el = document.getElementById("dailyQuote");
  if (el) el.querySelector(".quote-text").textContent = `"${q.text}" — ${q.author}`;
}

/* ─── NAVIGATION ─── */
function initNav() {
  document.querySelectorAll(".nav-item, .mobile-nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (page) navigateTo(page);
    });
  });

  // Dashboard card shortcuts
  document.getElementById("openCheckin")?.addEventListener("click", () => navigateTo("checkin"));
  document.getElementById("openJournal")?.addEventListener("click", () => navigateTo("journal"));
  document.getElementById("openBreath")?.addEventListener("click", () => navigateTo("breathwork"));
  document.getElementById("openRitual")?.addEventListener("click", () => navigateTo("ritual"));
}

async function navigateTo(page) {
  state.currentPage = page;

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = document.getElementById("page-" + page);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item, .mobile-nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.page === page);
  });

  // Close mobile sidebar if open
  closeMobileSidebar();

  // Refresh home data when going home (now async)
  if (page === "home") await refreshHome();
  if (page === "trends") renderTrends();
  if (page === "settings") renderThemeGrid();
}

/* ─── THEME ─── */
function initTheme() {
  const saved = load("theme", "light");
  applyTheme(saved);

  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("themeToggleMobile")?.addEventListener("click", toggleTheme);
}

function toggleTheme() {
  const current = document.body.dataset.theme;
  const themeKeys = Object.keys(THEMES);
  const currentIndex = themeKeys.indexOf(current);
  const nextIndex = (currentIndex + 1) % themeKeys.length;
  const nextTheme = themeKeys[nextIndex];
  applyTheme(nextTheme);
  save("theme", nextTheme);
}

function applyTheme(theme) {
  if (!THEMES[theme]) theme = "light";
  document.body.dataset.theme = theme;
  const themeData = THEMES[theme];
  const icon = themeData.icon;
  const label = themeData.name + " mode";
  document.querySelectorAll(".theme-icon").forEach(el => el.textContent = icon);
  document.querySelectorAll(".theme-label").forEach(el => el.textContent = label);
  document.querySelectorAll(".theme-toggle-mobile").forEach(el => el.textContent = icon);
}

/* ─── MOBILE MENU ─── */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);

  hamburger?.addEventListener("click", () => {
    sidebar.classList.toggle("mobile-open");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", closeMobileSidebar);
}

function closeMobileSidebar() {
  document.getElementById("sidebar")?.classList.remove("mobile-open");
  document.querySelector(".sidebar-overlay")?.classList.remove("active");
}

/* ─── GREETING SYSTEM ─── */
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function analyzeUserContext() {
  const checkins = load("checkins", []);
  const ritualSteps = load("ritualSteps", []);
  const today = todayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split("T")[0];

  // ═══════════════════════════════════════════════════════════════
  //   DATABASE: Check journal entries from Supabase for context analysis
  //   Fallback to localStorage if not authenticated
  // ═══════════════════════════════════════════════════════════════
  let journalEntries = [];
  const user = await getCurrentUser();
  if (user) {
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('id')
      .eq('user_id', user.id);
    if (!error && entries) {
      journalEntries = entries;
    }
  } else {
    // Fallback to localStorage for non-authenticated users
    journalEntries = load("journalEntries", []);
  }

  const streak = calcStreak(checkins);
  const hasHistory = checkins.length > 0 || journalEntries.length > 0;

  if (!hasHistory) return "firstVisit";

  // Check for absence (last check-in was more than 3 days ago)
  if (checkins.length > 0) {
    const lastCheckin = new Date(checkins[0].date);
    const daysSinceLast = Math.floor((new Date() - lastCheckin) / (1000 * 60 * 60 * 24));
    if (daysSinceLast > 3) return "returningAfterAbsence";
  }

  // Check yesterday's mood
  const yesterdayCheckin = checkins.find(c => c.date === yesterdayKey);
  if (yesterdayCheckin) {
    if (yesterdayCheckin.mood <= 2) return "yesterdayLow";
    if (yesterdayCheckin.mood >= 4) return "yesterdayHigh";
  }

  // Check ritual completion today
  const ritualDone = ritualSteps.length > 0 && ritualSteps.every(s => s.done);
  if (ritualDone) return "ritualComplete";

  // Check streak strength
  if (streak >= 7) return "strongStreak";
  if (streak >= 3) return "consistentCheckin";

  // Check journal activity
  if (journalEntries.length >= 5) return "journalActive";

  // Check for quiet check-ins (low energy)
  const recentCheckins = checkins.slice(0, 3);
  if (recentCheckins.length >= 3 && recentCheckins.every(c => c.energy <= 4)) {
    return "quietCheckins";
  }

  return "generalReturn";
}

async function generateGreeting() {
  const timeOfDay = getTimeOfDay();
  const context = await analyzeUserContext();
  
  const timeGreeting = getRandomItem(TIME_BASED_GREETINGS[timeOfDay]);
  const contextualMessages = CONTEXTUAL_GREETINGS[context] || CONTEXTUAL_GREETINGS.generalReturn;
  const contextualMessage = getRandomItem(contextualMessages);

  return {
    timeGreeting: timeGreeting.text,
    emoji: timeGreeting.emoji,
    contextual: contextualMessage,
  };
}

async function updateGreeting() {
  const greeting = await generateGreeting();
  const titleEl = document.querySelector(".page-title");
  if (titleEl) {
    titleEl.innerHTML = `${greeting.timeGreeting}. <br><em>${greeting.contextual}</em>`;
  }
}

/* ─── HOME ─── */
function initHome() {
  refreshHome();
  document.getElementById("refreshAffirmation")?.addEventListener("click", () => {
    const affirmations = getFilteredAffirmations("all");
    const idx = Math.floor(Math.random() * affirmations.length);
    const el = document.getElementById("homeAffirmation");
    if (el) el.textContent = `"${affirmations[idx].text}"`;
  });
}

async function refreshHome() {
  // Update greeting (now async - uses Supabase for journal context)
  await updateGreeting();

  // Mood
  const checkins = load("checkins", []);
  const today = todayKey();
  const todayCheckin = checkins.find(c => c.date === today);
  const moodEmoji = document.getElementById("homeMoodEmoji");
  const moodText = document.getElementById("homeMoodText");
  if (todayCheckin && moodEmoji && moodText) {
    moodEmoji.textContent = todayCheckin.moodEmoji;
    moodText.textContent = todayCheckin.moodLabel;
  }

  // Streak
  updateStreakDisplay(checkins);

  // Journal prompt preview
  const prompt = JOURNAL_PROMPTS[new Date().getDate() % JOURNAL_PROMPTS.length];
  const preview = document.getElementById("homePromptPreview");
  if (preview) preview.textContent = `"${prompt.text}"`;

  // Affirmation
  const affirmations = getFilteredAffirmations("all");
  const affirmEl = document.getElementById("homeAffirmation");
  if (affirmEl) {
    const idx = new Date().getDate() % affirmations.length;
    affirmEl.textContent = `"${affirmations[idx].text}"`;
  }

  // Ritual progress
  const steps = load("ritualSteps", []);
  const done = steps.filter(s => s.done).length;
  const total = steps.length;
  const fill = document.getElementById("ritualProgressFill");
  const text = document.getElementById("ritualProgressText");
  if (fill) fill.style.width = total ? `${(done / total) * 100}%` : "0%";
  if (text) text.textContent = `${done} / ${total} done`;
}

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function updateStreakDisplay(checkins) {
  const streak = calcStreak(checkins);
  document.querySelectorAll("#streakNumber, #sidebarStreak").forEach(el => {
    if (el) el.textContent = streak;
  });
  const msg = document.getElementById("streakMsg");
  if (msg) {
    if (streak === 0) msg.textContent = "Start your streak today!";
    else if (streak === 1) msg.textContent = "Great start! Come back tomorrow.";
    else if (streak < 7) msg.textContent = `${streak} days strong. Keep going!`;
    else msg.textContent = `🔥 On fire! ${streak} days straight.`;
  }
}

function calcStreak(checkins) {
  if (!checkins.length) return 0;
  const dates = [...new Set(checkins.map(c => c.date))].sort().reverse();
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i]);
    const diff = Math.round((cursor - d) / 86400000);
    if (diff === 0 || diff === 1) { streak++; cursor = d; }
    else break;
  }
  return streak;
}

/* ─── CHECK-IN ─── */
function initCheckin() {
  let currentStep = 1;

  // Step 1: Mood
  document.querySelectorAll(".mood-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.checkin.mood = parseInt(btn.dataset.mood);
      state.checkin.moodEmoji = btn.dataset.emoji;
      state.checkin.moodLabel = btn.dataset.label;
      document.getElementById("step1Next").disabled = false;
    });
  });

  document.getElementById("step1Next")?.addEventListener("click", () => goStep(2));

  // Step 2: Energy
  const slider = document.getElementById("energySlider");
  const energyVal = document.getElementById("energyValue");
  slider?.addEventListener("input", () => {
    state.checkin.energy = parseInt(slider.value);
    if (energyVal) energyVal.textContent = slider.value;
  });

  document.getElementById("step2Next")?.addEventListener("click", () => goStep(3));

  // Step 3: Distortions
  document.querySelectorAll(".distortion-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const d = btn.dataset.distortion;
      if (d === "none") {
        document.querySelectorAll(".distortion-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.checkin.distortions = ["none"];
      } else {
        document.querySelector('[data-distortion="none"]')?.classList.remove("selected");
        btn.classList.toggle("selected");
        const idx = state.checkin.distortions.indexOf(d);
        if (idx > -1) state.checkin.distortions.splice(idx, 1);
        else state.checkin.distortions.push(d);
        if (!state.checkin.distortions.length) state.checkin.distortions = [];
      }
    });
  });

  document.getElementById("step3Next")?.addEventListener("click", () => {
    saveCheckin();
    goStep(4);
    showCheckinDone();
  });

  document.getElementById("checkinAgain")?.addEventListener("click", () => {
    state.checkin = { mood: null, energy: 5, distortions: [] };
    document.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("selected"));
    document.querySelectorAll(".distortion-btn").forEach(b => b.classList.remove("selected"));
    document.getElementById("step1Next").disabled = true;
    if (document.getElementById("energySlider")) document.getElementById("energySlider").value = 5;
    if (document.getElementById("energyValue")) document.getElementById("energyValue").textContent = "5";
    goStep(1);
  });

  function goStep(n) {
    document.querySelectorAll(".checkin-step").forEach(s => s.classList.remove("active"));
    document.getElementById("step" + n)?.classList.add("active");
    currentStep = n;
  }
}

function saveCheckin() {
  const checkins = load("checkins", []);
  checkins.push({
    date: todayKey(),
    timestamp: Date.now(),
    mood: state.checkin.mood,
    moodEmoji: state.checkin.moodEmoji,
    moodLabel: state.checkin.moodLabel,
    energy: state.checkin.energy,
    distortions: [...state.checkin.distortions],
  });
  save("checkins", checkins);
}

function showCheckinDone() {
  const summary = document.getElementById("checkinSummary");
  const tip = document.getElementById("cbtTip");
  if (summary) {
    const labels = ["", "rough", "low", "okay", "good", "great"];
    summary.textContent = `Mood: ${state.checkin.moodEmoji} ${state.checkin.moodLabel} · Energy: ${state.checkin.energy}/10`;
  }
  if (tip && state.checkin.distortions.length) {
    const d = state.checkin.distortions[0];
    const tipText = CBT_TIPS[d];
    if (tipText) {
      tip.style.display = "block";
      tip.textContent = `💡 CBT tip: ${tipText}`;
    }
  } else if (tip) {
    tip.style.display = "none";
  }
}

/* ─── JOURNAL ─── */
async function initJournal() {
  setCurrentPrompt();

  document.getElementById("newPrompt")?.addEventListener("click", () => {
    state.currentPromptIndex = (state.currentPromptIndex + 1) % JOURNAL_PROMPTS.length;
    setCurrentPrompt();
  });

  // Word count
  const textarea = document.getElementById("journalTextarea");
  const wordCount = document.getElementById("wordCount");
  textarea?.addEventListener("input", () => {
    const words = textarea.value.trim().split(/\s+/).filter(w => w).length;
    if (wordCount) wordCount.textContent = `${words} word${words !== 1 ? "s" : ""}`;
    save("journalDraft", textarea.value);
  });

  // Load draft (still using localStorage for draft - temporary workspace)
  // ═══════════════════════════════════════════════════════════════
  //   NOTE: Draft remains in localStorage as a temporary workspace
  //   Only saved entries go to Supabase
  // ═══════════════════════════════════════════════════════════════
  const draft = load("journalDraft", "");
  if (textarea && draft) textarea.value = draft;

  // Save entry (now async - uses Supabase)
  document.getElementById("saveEntry")?.addEventListener("click", saveJournalEntry);

  // Load past entries (now async - uses Supabase)
  await renderEntries();
}

function setCurrentPrompt() {
  const prompt = JOURNAL_PROMPTS[state.currentPromptIndex];
  const el = document.getElementById("journalPrompt");
  const src = document.getElementById("promptSource");
  if (el) el.textContent = prompt.text;
  if (src) src.textContent = prompt.source;
}

async function saveJournalEntry() {
  console.log('saveJournalEntry() called');
  
  const textarea = document.getElementById("journalTextarea");
  if (!textarea || !textarea.value.trim()) {
    console.log('saveJournalEntry() aborted: no textarea or empty content');
    return;
  }

  console.log('Textarea has content, checking authentication...');

  // ═══════════════════════════════════════════════════════════════
  //   DATABASE: Check authentication before saving to Supabase
  //   Use getCurrentUser() as the single source of truth
  // ═══════════════════════════════════════════════════════════════
  const user = await getCurrentUser();
  
  console.log('User check result:', { user: !!user });
  
  if (!user) {
    console.log('User not authenticated, showing sign in message');
    // User is not authenticated - show friendly message
    const btn = document.getElementById("saveEntry");
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "Please sign in to save";
      setTimeout(() => btn.textContent = orig, 2000);
    }
    return;
  }

  console.log('User authenticated, preparing to save to Supabase');
  console.log('User ID:', user.id);
  console.log('Entry data:', {
    user_id: user.id,
    date: todayKey(),
    text_length: textarea.value.trim().length,
    prompt: JOURNAL_PROMPTS[state.currentPromptIndex].text,
    prompt_source: JOURNAL_PROMPTS[state.currentPromptIndex].source
  });

  // ═══════════════════════════════════════════════════════════════
  //   DATABASE: Save journal entry to Supabase journal_entries table
  // ═══════════════════════════════════════════════════════════════
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: user.id,
      date: todayKey(),
      text: textarea.value.trim(),
      prompt: JOURNAL_PROMPTS[state.currentPromptIndex].text,
      prompt_source: JOURNAL_PROMPTS[state.currentPromptIndex].source,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving journal entry:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    const btn = document.getElementById("saveEntry");
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "Save failed";
      setTimeout(() => btn.textContent = orig, 2000);
    }
    return;
  }

  console.log('Journal entry saved successfully:', data);

  // Clear draft and textarea
  // ═══════════════════════════════════════════════════════════════
  //   NOTE: Draft is cleared from localStorage after successful save
  // ═══════════════════════════════════════════════════════════════
  save("journalDraft", "");
  textarea.value = "";
  const wc = document.getElementById("wordCount");
  if (wc) wc.textContent = "0 words";
  
  console.log('Calling renderEntries() to refresh list...');
  // Refresh entries list from database
  renderEntries();

  // Visual feedback
  const btn = document.getElementById("saveEntry");
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = "Saved! ✓";
    setTimeout(() => btn.textContent = orig, 1500);
  }
}

async function renderEntries() {
  console.log('renderEntries() called');
  
  const list = document.getElementById("entriesList");
  if (!list) {
    console.log('renderEntries() aborted: entriesList element not found');
    return;
  }

  // ═══════════════════════════════════════════════════════════════
  //   DATABASE: Check authentication before loading from Supabase
  //   Use getCurrentUser() as the single source of truth
  // ═══════════════════════════════════════════════════════════════
  const user = await getCurrentUser();
  
  console.log('renderEntries() user check:', { user: !!user });
  
  if (!user) {
    console.log('User not authenticated, showing sign in message');
    // User is not authenticated - show empty state
    list.innerHTML = '<p class="empty-state">Sign in to view your journal entries.</p>';
    return;
  }

  console.log('User authenticated, loading entries from Supabase');
  console.log('User ID:', user.id);

  // ═══════════════════════════════════════════════════════════════
  //   DATABASE: Load journal entries from Supabase journal_entries table
  //   Order by created_at descending to show newest first
  // ═══════════════════════════════════════════════════════════════
  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('Supabase query result:', { entries, error });

  if (error) {
    console.error('Error loading journal entries:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    list.innerHTML = '<p class="empty-state">Failed to load entries. Please try again.</p>';
    return;
  }

  if (!entries || entries.length === 0) {
    console.log('No entries found for user');
    list.innerHTML = '<p class="empty-state">Your story begins with a single page.</p>';
    return;
  }

  console.log(`Found ${entries.length} entries, rendering...`);

  // Render entries
  list.innerHTML = entries.map(e => `
    <div class="entry-item" onclick="loadEntry('${e.id}')">
      <div class="entry-date">${formatDate(e.date)}</div>
      <div class="entry-preview">${e.text.substring(0, 80)}${e.text.length > 80 ? "..." : ""}</div>
    </div>
  `).join("");
}

async function loadEntry(id) {
  console.log('loadEntry() called with id:', id);
  
  // ═══════════════════════════════════════════════════════════════
  //   DATABASE: Check authentication before loading from Supabase
  //   Use getCurrentUser() as the single source of truth
  // ═══════════════════════════════════════════════════════════════
  const user = await getCurrentUser();
  
  console.log('loadEntry() user check:', { user: !!user });
  
  if (!user) {
    console.error('User not authenticated');
    return;
  }

  console.log('User authenticated, loading entry from Supabase');
  console.log('User ID:', user.id);

  // ═══════════════════════════════════════════════════════════════
  //   DATABASE: Load specific journal entry from Supabase by UUID
  // ═══════════════════════════════════════════════════════════════
  const { data: entry, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  console.log('Supabase entry query result:', { entry, error });

  if (error || !entry) {
    console.error('Error loading journal entry:', error);
    return;
  }

  const textarea = document.getElementById("journalTextarea");
  if (textarea) textarea.value = entry.text;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── BREATHWORK ─── */
function initBreathwork() {
  document.querySelectorAll(".pattern-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (state.breathRunning) stopBreath();
      document.querySelectorAll(".pattern-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.breathPattern = {
        in: parseInt(btn.dataset.in),
        hold: parseInt(btn.dataset.hold),
        out: parseInt(btn.dataset.out),
      };
      updatePatternDetail();
    });
  });

  document.getElementById("breathStart")?.addEventListener("click", startBreath);
  document.getElementById("breathStop")?.addEventListener("click", stopBreath);
  updatePatternDetail();
}

function updatePatternDetail() {
  const el = document.getElementById("breathPatternDetail");
  if (!el) return;
  const { in: i, hold: h, out: o } = state.breathPattern;
  let parts = [`Breathe in ${i}s`];
  if (h) parts.push(`Hold ${h}s`);
  parts.push(`Breathe out ${o}s`);
  el.textContent = parts.join(" · ");
}

function startBreath() {
  state.breathRunning = true;
  state.breathCycles = 0;
  document.getElementById("breathStart").style.display = "none";
  document.getElementById("breathStop").style.display = "inline-flex";
  runBreathCycle();
}

function runBreathCycle() {
  if (!state.breathRunning) return;
  const orb = document.getElementById("breathOrb");
  const instruction = document.getElementById("breathInstruction");
  const countEl = document.getElementById("breathCount");
  const phaseLabel = document.getElementById("breathPhaseLabel");
  const cyclesEl = document.getElementById("breathCycles");
  const { in: inhale, hold, out: exhale } = state.breathPattern;

  // Inhale
  setBreathPhase(orb, instruction, countEl, phaseLabel, "inhale", inhale, () => {
    if (!state.breathRunning) return;
    // Hold
    if (hold > 0) {
      setBreathPhase(orb, instruction, countEl, phaseLabel, "hold", hold, () => {
        if (!state.breathRunning) return;
        doExhale();
      });
    } else {
      doExhale();
    }
  });

  function doExhale() {
    setBreathPhase(orb, instruction, countEl, phaseLabel, "exhale", exhale, () => {
      if (!state.breathRunning) return;
      state.breathCycles++;
      if (cyclesEl) cyclesEl.textContent = `Cycles: ${state.breathCycles}`;
      runBreathCycle();
    });
  }
}

function setBreathPhase(orb, instruction, countEl, phaseLabel, phase, duration, callback) {
  if (!state.breathRunning) return;

  const labels = { inhale: "Breathe In", hold: "Hold", exhale: "Breathe Out" };
  const phaseLabels = { inhale: "Inhaling...", hold: "Holding...", exhale: "Exhaling..." };

  if (instruction) instruction.textContent = labels[phase];
  if (phaseLabel) phaseLabel.textContent = phaseLabels[phase];

  // Orb animation
  if (orb) {
    orb.classList.remove("inhale", "hold", "exhale");
    orb.style.animation = "none";
    orb.offsetHeight; // reflow
    if (phase === "inhale") {
      orb.style.animation = `orbInhale ${duration}s linear forwards`;
    } else if (phase === "exhale") {
      orb.style.animation = `orbExhale ${duration}s linear forwards`;
    }
    orb.classList.add(phase);
  }

  // Countdown
  let remaining = duration;
  if (countEl) countEl.textContent = remaining;
  const interval = setInterval(() => {
    if (!state.breathRunning) { clearInterval(interval); return; }
    remaining--;
    if (countEl) countEl.textContent = remaining > 0 ? remaining : "";
    if (remaining <= 0) {
      clearInterval(interval);
      callback();
    }
  }, 1000);

  state.breathTimer = interval;
}

function stopBreath() {
  state.breathRunning = false;
  if (state.breathTimer) clearInterval(state.breathTimer);
  const orb = document.getElementById("breathOrb");
  if (orb) {
    orb.style.animation = "none";
    orb.className = "breath-orb";
  }
  const instruction = document.getElementById("breathInstruction");
  const countEl = document.getElementById("breathCount");
  const phaseLabel = document.getElementById("breathPhaseLabel");
  if (instruction) instruction.textContent = "Press Start";
  if (countEl) countEl.textContent = "";
  if (phaseLabel) phaseLabel.textContent = "Ready";
  document.getElementById("breathStart").style.display = "inline-flex";
  document.getElementById("breathStop").style.display = "none";
}

/* ─── MORNING RITUAL ─── */
function initRitual() {
  renderRitual();

  document.getElementById("addStep")?.addEventListener("click", () => {
    const nameEl = document.getElementById("stepName");
    const durEl = document.getElementById("stepDuration");
    const catEl = document.getElementById("stepCategory");
    const name = nameEl?.value.trim();
    if (!name) { nameEl?.focus(); return; }
    const steps = load("ritualSteps", []);
    const catEmojis = { mind: "🧠", body: "💪", soul: "🙏", focus: "🎯" };
    steps.push({
      id: Date.now(),
      name,
      duration: parseInt(durEl?.value || 10),
      category: catEl?.value || "mind",
      categoryEmoji: catEmojis[catEl?.value] || "🧠",
      done: false,
    });
    save("ritualSteps", steps);
    if (nameEl) nameEl.value = "";
    renderRitual();
  });

  document.getElementById("resetRitual")?.addEventListener("click", () => {
    const steps = load("ritualSteps", []);
    steps.forEach(s => s.done = false);
    save("ritualSteps", steps);
    renderRitual();
  });
}

function renderRitual() {
  const steps = load("ritualSteps", []);
  const list = document.getElementById("ritualList");
  if (!list) return;

  if (!steps.length) {
    list.innerHTML = '<p class="empty-state ritual-empty">No steps yet. Add your first one ←</p>';
    updateRitualProgress(0, 0);
    return;
  }

  list.innerHTML = steps.map(s => `
    <div class="ritual-step-item ${s.done ? "done" : ""}" data-id="${s.id}">
      <div class="step-checkbox ${s.done ? "checked" : ""}" onclick="toggleStep(${s.id})">
        ${s.done ? "✓" : ""}
      </div>
      <div class="step-info">
        <div class="step-name">${s.categoryEmoji} ${s.name}</div>
        <div class="step-meta">${s.duration} min</div>
      </div>
      <button class="step-delete" onclick="deleteStep(${s.id})">×</button>
    </div>
  `).join("");

  const done = steps.filter(s => s.done).length;
  updateRitualProgress(done, steps.length);
}

function toggleStep(id) {
  const steps = load("ritualSteps", []);
  const step = steps.find(s => s.id === id);
  if (step) step.done = !step.done;
  save("ritualSteps", steps);
  renderRitual();
}

function deleteStep(id) {
  const steps = load("ritualSteps", []).filter(s => s.id !== id);
  save("ritualSteps", steps);
  renderRitual();
}

function updateRitualProgress(done, total) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const circumference = 326.7;
  const offset = circumference - (pct / 100) * circumference;
  const ring = document.getElementById("ritualRingFill");
  const pctEl = document.getElementById("ritualPct");
  const enc = document.getElementById("ritualEncouragement");
  if (ring) ring.style.strokeDashoffset = offset;
  if (pctEl) pctEl.textContent = pct + "%";
  if (enc) {
    if (total === 0) enc.textContent = "Add your first ritual step!";
    else if (pct === 0) enc.textContent = "Ready to begin your ritual?";
    else if (pct < 50) enc.textContent = "You've started. Keep going!";
    else if (pct < 100) enc.textContent = "More than halfway there! 💪";
    else enc.textContent = "Ritual complete! 🌿 Beautiful work.";
  }
}

/* ─── AFFIRMATIONS ─── */
function initAffirmations() {
  renderAffirmation();
  renderSaved();

  document.getElementById("affirmNext")?.addEventListener("click", () => {
    const list = getFilteredAffirmations(state.currentAffirmCat);
    state.currentAffirmIndex = (state.currentAffirmIndex + 1) % list.length;
    renderAffirmation();
  });

  document.getElementById("affirmPrev")?.addEventListener("click", () => {
    const list = getFilteredAffirmations(state.currentAffirmCat);
    state.currentAffirmIndex = (state.currentAffirmIndex - 1 + list.length) % list.length;
    renderAffirmation();
  });

  document.getElementById("saveAffirmation")?.addEventListener("click", () => {
    const list = getFilteredAffirmations(state.currentAffirmCat);
    const current = list[state.currentAffirmIndex % list.length];
    if (!current) return;
    const saved = load("savedAffirmations", []);
    if (!saved.find(s => s.text === current.text)) {
      saved.push(current);
      save("savedAffirmations", saved);
      renderSaved();
      const btn = document.getElementById("saveAffirmation");
      const orig = btn.textContent;
      btn.textContent = "♥ Saved!";
      setTimeout(() => btn.textContent = orig, 1500);
    }
  });

  document.querySelectorAll(".affirm-cat").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".affirm-cat").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentAffirmCat = btn.dataset.cat;
      state.currentAffirmIndex = 0;
      renderAffirmation();
    });
  });
}

function getFilteredAffirmations(cat) {
  return cat === "all" ? AFFIRMATIONS : AFFIRMATIONS.filter(a => a.cat === cat);
}

function renderAffirmation() {
  const list = getFilteredAffirmations(state.currentAffirmCat);
  if (!list.length) return;
  const a = list[state.currentAffirmIndex % list.length];
  const textEl = document.getElementById("affirmText");
  const srcEl = document.getElementById("affirmSource");
  const card = document.getElementById("affirmMainCard");
  if (textEl) textEl.textContent = `"${a.text}"`;
  if (srcEl) srcEl.textContent = a.cat.charAt(0).toUpperCase() + a.cat.slice(1);
  if (card) {
    card.style.opacity = "0";
    card.style.transform = "translateY(8px)";
    setTimeout(() => {
      card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 50);
  }
}

function renderSaved() {
  const saved = load("savedAffirmations", []);
  const list = document.getElementById("savedList");
  if (!list) return;
  if (!saved.length) {
    list.innerHTML = '<p class="empty-state">None saved yet.</p>';
    return;
  }
  list.innerHTML = saved.map((a, i) => `
    <div class="saved-item">
      <span>"${a.text}"</span>
      <button class="unsave-btn" onclick="unsaveAffirmation(${i})">×</button>
    </div>
  `).join("");
}

function unsaveAffirmation(idx) {
  const saved = load("savedAffirmations", []);
  saved.splice(idx, 1);
  save("savedAffirmations", saved);
  renderSaved();
}

/* ─── SETTINGS ─── */
function initSettings() {
  renderThemeGrid();
}

function renderThemeGrid() {
  const grid = document.getElementById("themeGrid");
  if (!grid) return;

  const currentTheme = document.body.dataset.theme || "light";

  grid.innerHTML = Object.entries(THEMES).map(([key, theme]) => `
    <div class="theme-card ${key === currentTheme ? "active" : ""}" data-theme="${key}" onclick="selectTheme('${key}')">
      <div class="theme-card-check">✓</div>
      <div class="theme-card-preview">${theme.icon}</div>
      <div class="theme-card-info">
        <div class="theme-card-name">${theme.name}</div>
        <div class="theme-card-desc">${theme.description}</div>
      </div>
    </div>
  `).join("");
}

function selectTheme(themeKey) {
  if (!THEMES[themeKey]) return;
  applyTheme(themeKey);
  save("theme", themeKey);
  renderThemeGrid();
}

/* ─── TRENDS ─── */
function initTrends() {
  renderTrends();
}

function renderTrends() {
  const checkins = load("checkins", []);
  const totalEl = document.getElementById("totalCheckins");
  const avgMoodEl = document.getElementById("avgMood");
  const avgEnergyEl = document.getElementById("avgEnergy");
  const bestDayEl = document.getElementById("bestDay");
  const chartEmpty = document.getElementById("chartEmpty");

  if (totalEl) totalEl.textContent = checkins.length;

  if (!checkins.length) {
    if (chartEmpty) chartEmpty.style.display = "flex";
    renderDistortionBars([]);
    return;
  }

  if (chartEmpty) chartEmpty.style.display = "none";

  // Stats
  const avgMood = (checkins.reduce((s, c) => s + c.mood, 0) / checkins.length).toFixed(1);
  const avgEnergy = (checkins.reduce((s, c) => s + c.energy, 0) / checkins.length).toFixed(1);
  if (avgMoodEl) avgMoodEl.textContent = avgMood + "/5";
  if (avgEnergyEl) avgEnergyEl.textContent = avgEnergy + "/10";

  if (bestDayEl && checkins.length) {
    const best = checkins.reduce((a, b) => a.mood > b.mood ? a : b);
    bestDayEl.textContent = formatDate(best.date);
  }

  // Chart (last 14 days)
  drawChart(checkins);

  // Distortions
  const allDist = checkins.flatMap(c => c.distortions || []).filter(d => d !== "none");
  const distCounts = {};
  allDist.forEach(d => distCounts[d] = (distCounts[d] || 0) + 1);
  renderDistortionBars(distCounts);
}

function drawChart(checkins) {
  const canvas = document.getElementById("moodChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Get last 14 days
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  const isDark = document.body.dataset.theme === "dark";
  const gridColor = isDark ? "#333028" : "#E4DFD5";
  const textColor = isDark ? "#6A6560" : "#9C9890";
  const moodColor = "#3D6B4F";
  const energyColor = "#C49A3C";

  const padL = 36, padR = 16, padT = 16, padB = 36;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // Grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padT + (chartH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.font = "10px DM Mono, monospace";
    ctx.fillText(5 - i, padL - 20, y + 4);
  }

  // X labels
  ctx.fillStyle = textColor;
  ctx.font = "10px DM Mono, monospace";
  const labelStep = 2;
  days.forEach((d, i) => {
    if (i % labelStep !== 0) return;
    const x = padL + (i / (days.length - 1)) * chartW;
    const label = new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    ctx.fillText(label, x - 14, H - padB + 14);
  });

  // Mood line
  const moodPoints = days.map((d, i) => {
    const dayCheckins = checkins.filter(c => c.date === d);
    if (!dayCheckins.length) return null;
    const avg = dayCheckins.reduce((s, c) => s + c.mood, 0) / dayCheckins.length;
    return {
      x: padL + (i / (days.length - 1)) * chartW,
      y: padT + chartH - (avg / 5) * chartH,
    };
  });

  drawLine(ctx, moodPoints, moodColor, 2.5);

  // Energy line (scaled to /5)
  const energyPoints = days.map((d, i) => {
    const dayCheckins = checkins.filter(c => c.date === d);
    if (!dayCheckins.length) return null;
    const avg = dayCheckins.reduce((s, c) => s + c.energy, 0) / dayCheckins.length;
    return {
      x: padL + (i / (days.length - 1)) * chartW,
      y: padT + chartH - (avg / 10) * chartH,
    };
  });

  drawLine(ctx, energyPoints, energyColor, 2);
}

function drawLine(ctx, points, color, width) {
  const valid = points.filter(Boolean);
  if (valid.length < 2) {
    // Draw dots for single points
    valid.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
    return;
  }

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  let started = false;
  points.forEach((p, i) => {
    if (!p) return;
    if (!started) { ctx.moveTo(p.x, p.y); started = true; }
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // Dots
  valid.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = document.body.dataset.theme === "dark" ? "#1E1C19" : "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function renderDistortionBars(distCounts) {
  const container = document.getElementById("distortionBars");
  if (!container) return;
  const entries = Object.entries(distCounts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) {
    container.innerHTML = '<p class="empty-state">Complete check-ins to see patterns.</p>';
    return;
  }
  const max = entries[0][1];
  const labels = {
    "all-or-nothing": "All-or-nothing",
    "overgeneralizing": "Overgeneralizing",
    "catastrophizing": "Catastrophizing",
    "mind-reading": "Mind reading",
    "should-statements": "Should statements",
    "self-blame": "Self-blame",
    "filtering": "Mental filtering",
  };
  container.innerHTML = entries.map(([d, count]) => `
    <div class="distortion-bar-item">
      <div class="distortion-bar-label">
        <span>${labels[d] || d}</span>
        <span>${count}x</span>
      </div>
      <div class="distortion-bar-track">
        <div class="distortion-bar-fill" style="width: ${(count / max) * 100}%"></div>
      </div>
    </div>
  `).join("");
}

/* ─── REFLECTION OF THE DAY ─── */
function initReflection() {
  // Load today's reflection or generate a new one
  const today = todayKey();
  const savedReflection = load("dailyReflection", null);
  
  if (savedReflection && savedReflection.date === today) {
    state.currentReflection = savedReflection.prompt;
    state.reflectionHistory = savedReflection.history || [];
  } else {
    // New day, generate new reflection
    const prompt = getRandomReflectionPrompt();
    state.currentReflection = prompt;
    state.reflectionHistory = [prompt];
    saveDailyReflection(today, prompt, [prompt]);
  }
  
  // Display the reflection
  const promptEl = document.getElementById("reflectionPrompt");
  if (promptEl) promptEl.textContent = state.currentReflection;
  
  // Load today's writing
  const textarea = document.getElementById("reflectionTextarea");
  if (textarea) {
    const savedWriting = load("reflectionWriting_" + today, "");
    textarea.value = savedWriting;
    
    // Auto-save while typing
    textarea.addEventListener("input", () => {
      save("reflectionWriting_" + today, textarea.value);
    });
  }
  
  // Refresh button
  document.getElementById("refreshReflection")?.addEventListener("click", selectNewReflection);
}

function getRandomReflectionPrompt() {
  // Flatten all prompts into a single array
  const allPrompts = [];
  Object.values(REFLECTION_PROMPTS).forEach(categoryPrompts => {
    allPrompts.push(...categoryPrompts);
  });
  
  return allPrompts[Math.floor(Math.random() * allPrompts.length)];
}

function selectNewReflection() {
  const today = todayKey();
  let newPrompt;
  let attempts = 0;
  const maxAttempts = 10;
  
  // Try to find a prompt not in recent history
  do {
    newPrompt = getRandomReflectionPrompt();
    attempts++;
  } while (state.reflectionHistory.includes(newPrompt) && attempts < maxAttempts);
  
  // Update state
  state.currentReflection = newPrompt;
  state.reflectionHistory.push(newPrompt);
  
  // Keep history manageable (last 10)
  if (state.reflectionHistory.length > 10) {
    state.reflectionHistory = state.reflectionHistory.slice(-10);
  }
  
  // Save to localStorage
  saveDailyReflection(today, newPrompt, state.reflectionHistory);
  
  // Update UI
  const promptEl = document.getElementById("reflectionPrompt");
  if (promptEl) {
    promptEl.style.opacity = "0";
    setTimeout(() => {
      promptEl.textContent = newPrompt;
      promptEl.style.opacity = "1";
    }, 150);
  }
}

function saveDailyReflection(date, prompt, history) {
  save("dailyReflection", {
    date: date,
    prompt: prompt,
    history: history,
  });
}

/* ─── GLOBAL EXPOSE (for inline onclick handlers) ─── */
window.toggleStep = toggleStep;
window.deleteStep = deleteStep;
window.unsaveAffirmation = unsaveAffirmation;
window.selectTheme = selectTheme;
window.loadEntry = loadEntry;

/* ─── AUTHENTICATION ─── */

// DOM Elements for authentication
const authOverlay = document.getElementById('authOverlay');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const authError = document.getElementById('authError');
const signOutBtn = document.getElementById('signOutBtn');
const settingsSignOutBtn = document.getElementById('settingsSignOutBtn');

/**
 * Check for existing Supabase session on page load
 * If session exists, hide auth overlay and show app
 * If no session, show auth overlay
 * Uses getCurrentUser() as the single source of truth
 */
async function checkSession() {
  try {
    const user = await getCurrentUser();
    
    if (user) {
      // User is authenticated, hide overlay and show user info
      hideAuthOverlay();
      updateUserDisplay(user);
    } else {
      // No session, show auth overlay and hide user info
      showAuthOverlay();
      updateUserDisplay(null);
    }
  } catch (err) {
    console.error('Session check failed:', err);
    showAuthOverlay();
    updateUserDisplay(null);
  }
}

/**
 * Show the authentication overlay
 */
function showAuthOverlay() {
  if (authOverlay) {
    authOverlay.classList.add('active');
  }
}

/**
 * Hide the authentication overlay
 */
function hideAuthOverlay() {
  if (authOverlay) {
    authOverlay.classList.remove('active');
  }
}

/**
 * Display authentication error message
 */
function showAuthError(message) {
  if (authError) {
    authError.textContent = message;
    authError.style.display = 'block';
  }
}

/**
 * Hide authentication error message
 */
function hideAuthError() {
  if (authError) {
    authError.style.display = 'none';
  }
}

/**
 * Update user display in sidebar and settings
 */
function updateUserDisplay(user) {
  const sidebarUserInfo = document.getElementById('sidebarUserInfo');
  const sidebarUserEmail = document.getElementById('sidebarUserEmail');
  const sidebarCloudSync = document.getElementById('sidebarCloudSync');
  const sidebarSignOut = document.getElementById('signOutBtn');
  
  const accountCard = document.getElementById('accountCard');
  const noAccountCard = document.getElementById('noAccountCard');
  const settingsUserEmail = document.getElementById('settingsUserEmail');
  const settingsCloudSync = document.getElementById('settingsCloudSync');
  
  if (user && user.email) {
    // Show user info in sidebar
    if (sidebarUserInfo) {
      sidebarUserInfo.style.display = 'block';
      if (sidebarUserEmail) sidebarUserEmail.textContent = user.email;
      if (sidebarCloudSync) sidebarCloudSync.style.display = 'flex';
    }
    if (sidebarSignOut) {
      sidebarSignOut.style.display = 'block';
    }
    
    // Show user info in settings
    if (accountCard) {
      accountCard.style.display = 'block';
      if (settingsUserEmail) settingsUserEmail.textContent = user.email;
      if (settingsCloudSync) settingsCloudSync.style.display = 'flex';
    }
    if (noAccountCard) {
      noAccountCard.style.display = 'none';
    }
  } else {
    // Hide user info in sidebar
    if (sidebarUserInfo) {
      sidebarUserInfo.style.display = 'none';
    }
    if (sidebarSignOut) {
      sidebarSignOut.style.display = 'none';
    }
    
    // Hide user info in settings
    if (accountCard) {
      accountCard.style.display = 'none';
    }
    if (noAccountCard) {
      noAccountCard.style.display = 'block';
    }
  }
}

/**
 * Handle sign in with email and password.
 * Demo accounts are checked first so local development works without Supabase.
 */
async function handleSignIn() {
  const email = authEmail?.value.trim();
  const password = authPassword?.value;
  
  // Basic validation
  if (!email || !password) {
    showAuthError('Please enter both email and password');
    return;
  }
  
  // Disable buttons during request
  if (signInBtn) signInBtn.disabled = true;
  if (signUpBtn) signUpBtn.disabled = true;
  hideAuthError();

  const demoUser = signInDemo(email, password);
  if (demoUser) {
    hideAuthOverlay();
    updateUserDisplay(demoUser);
    if (signInBtn) signInBtn.disabled = false;
    if (signUpBtn) signUpBtn.disabled = false;
    return;
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      showAuthError(error.message || 'Sign in failed. Please check your credentials.');
    } else {
      // Sign in successful - auth state change listener will handle UI update
      // The onAuthStateChange listener will call getCurrentUser() and update UI
    }
  } catch (err) {
    console.error('Sign in error:', err);
    showAuthError('An unexpected error occurred. Please try again.');
  } finally {
    // Re-enable buttons
    if (signInBtn) signInBtn.disabled = false;
    if (signUpBtn) signUpBtn.disabled = false;
  }
}

/**
 * Handle sign up with email and password.
 * Demo credentials remain valid locally while the Supabase code stays available.
 */
async function handleSignUp() {
  const email = authEmail?.value.trim();
  const password = authPassword?.value;
  
  // Basic validation
  if (!email || !password) {
    showAuthError('Please enter both email and password');
    return;
  }
  
  const demoUser = signInDemo(email, password);
  if (demoUser) {
    hideAuthOverlay();
    updateUserDisplay(demoUser);
    return;
  }

  if (password.length < 6) {
    showAuthError('Password must be at least 6 characters long');
    return;
  }
  
  // Disable buttons during request
  if (signInBtn) signInBtn.disabled = true;
  if (signUpBtn) signUpBtn.disabled = true;
  hideAuthError();
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });
    
    if (error) {
      showAuthError(error.message || 'Sign up failed. Please try again.');
    } else {
      // Sign up successful
      hideAuthOverlay();
      updateUserDisplay(data.user);
    }
  } catch (err) {
    console.error('Sign up error:', err);
    showAuthError('An unexpected error occurred. Please try again.');
  } finally {
    // Re-enable buttons
    if (signInBtn) signInBtn.disabled = false;
    if (signUpBtn) signUpBtn.disabled = false;
  }
}

/**
 * Handle sign out.
 */
async function handleSignOut() {
  try {
    if (isDemoSessionActive()) {
      await signOutDemo();
      showAuthOverlay();
      updateUserDisplay(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
    } else {
      // Sign out successful - auth state change listener will handle UI update
      updateUserDisplay(null);
    }
  } catch (err) {
    console.error('Sign out error:', err);
  }
}

/**
 * Set up authentication event listeners
 */
function setupAuthListeners() {
  // Sign in button click
  if (signInBtn) {
    signInBtn.addEventListener('click', handleSignIn);
  }
  
  // Sign up button click
  if (signUpBtn) {
    signUpBtn.addEventListener('click', handleSignUp);
  }
  
  // Sign out button clicks
  if (signOutBtn) {
    signOutBtn.addEventListener('click', handleSignOut);
  }
  
  if (settingsSignOutBtn) {
    settingsSignOutBtn.addEventListener('click', handleSignOut);
  }
  
  // Allow Enter key to submit
  if (authPassword) {
    authPassword.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSignIn();
      }
    });
  }
  
  if (authEmail) {
    authEmail.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        authPassword?.focus();
      }
    });
  }
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      hideAuthOverlay();
      updateUserDisplay(session.user);
    } else if (event === 'SIGNED_OUT') {
      showAuthOverlay();
      updateUserDisplay(null);
    }
  });
}