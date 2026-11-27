const KEY = "dormie-v1";




function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shiftDay(key, delta) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return todayKey(date);
}

function sleepScore(hours, targetHours, mood) {
  const found = MOODS.find((item) => item.id === mood);
  const multiplier = found ? found.multiplier : 0.85;
  const raw = (hours / targetHours) * 70 + multiplier * 30;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function bandFor(score) {
  if (score >= 85) return { status: "RADIANT", coins: 50 };
  if (score >= 60) return { status: "SLEEPY", coins: 25 };
  if (score >= 30) return { status: "EXHAUSTED", coins: 5 };
  return { status: "FAINTED", coins: 0 };
}

function computeStreak(logs) {
  const byDay = new Map();
  for (const log of logs) byDay.set(log.date, log);
  const days = [...byDay.keys()].sort();
  if (!days.length) return 0;
  let cursor = days[days.length - 1];
  const today = todayKey();
  if (cursor !== today && cursor !== shiftDay(today, -1)) return 0;
  let streak = 0;
  while (byDay.has(cursor) && byDay.get(cursor).score >= 60) {
    streak += 1;
    cursor = shiftDay(cursor, -1);
  }
  return streak;
}

function fresh() {
  return {
    onboarded: false,
    onboardStep: 1,
    targetHours: 7.5,
    bedtime: "23:30",
    wake: "07:00",
    petName: "",
    petType: "bunny",
    status: "RADIANT",
    coins: 50,
    streak: 0,
    recovery: 0,
    owned: [],
    outfit: null,
    room: null,
    session: null,
    logs: [],
    screen: "home",
    shopTab: "outfit",
    lastResult: null,
  };
}

function applyMissedDay(state) {
  if (!state.onboarded || state.session || state.logs.length === 0) return state;
  const last = state.logs[state.logs.length - 1];
  const today = todayKey();
  if (last.date === today || last.date === shiftDay(today, -1)) return state;
  if (state.status === "FAINTED" && state.streak === 0) return state;
  return { ...state, status: "FAINTED", streak: 0, recovery: 0 };
}

function load() {
  // Always start from a fresh default state on load.
  return fresh();
}

let state = load();
localStorage.setItem(KEY, JSON.stringify(state));
const listeners = new Set();

function commit(next) {
  state = next;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn(state));
}

function getState() {
  return state;
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function setScreen(screen) {
  commit({ ...state, screen, lastResult: screen === "home" ? state.lastResult : null });
}

function setShopTab(shopTab) {
  commit({ ...state, shopTab });
}

function patchOnboarding(partial, options = {}) {
  state = { ...state, ...partial };
  localStorage.setItem(KEY, JSON.stringify(state));
  if (!options.silent) listeners.forEach((fn) => fn(state));
}

function finishOnboarding() {
  const name = state.petName.trim();
  if (!name) return;
  commit({
    ...state,
    onboarded: true,
    petName: name.slice(0, 16),
    screen: "home",
    status: "RADIANT",
  });
}

function startSleep() {
  commit({
    ...state,
    session: { start: new Date().toISOString(), phase: "sleeping" },
    lastResult: null,
  });
}

function cancelSleep() {
  commit({ ...state, session: null });
}

function wakeUp() {
  if (!state.session) return;
  commit({ ...state, session: { ...state.session, phase: "mood" } });
}

function submitMood(mood) {
  if (!state.session) return;
  const start = new Date(state.session.start);
  const end = new Date();
  const hours = Math.max(0, (end.getTime() - start.getTime()) / 36e5);
  const score = sleepScore(hours, state.targetHours, mood);
  const band = bandFor(score);
  let status = state.status;
  let recovery = state.recovery;
  let revived = false;

  if (state.status === "FAINTED") {
    if (score >= 60) {
      recovery += 1;
      if (recovery >= 2) {
        status = band.status;
        recovery = 0;
        revived = true;
      }
    } else {
      recovery = 0;
    }
  } else {
    status = band.status;
    recovery = status === "FAINTED" ? 0 : 0;
  }

  const date = todayKey(end);
  const logs = state.logs.filter((log) => log.date !== date);
  logs.push({
    date,
    start: start.toISOString(),
    end: end.toISOString(),
    hours: Math.round(hours * 10) / 10,
    mood,
    score,
    coins: band.coins,
  });

  commit({
    ...state,
    session: null,
    screen: "home",
    status,
    recovery,
    coins: state.coins + band.coins,
    streak: computeStreak(logs),
    logs,
    lastResult: { score, coins: band.coins, status, revived, hours: Math.round(hours * 10) / 10 },
  });
}

function buy(item) {
  if (state.owned.includes(item.id) || state.coins < item.price) return;
  commit({
    ...state,
    coins: state.coins - item.price,
    owned: [...state.owned, item.id],
  });
}

function equip(item) {
  if (!state.owned.includes(item.id)) return;
  if (item.kind === "outfit") {
    commit({ ...state, outfit: state.outfit === item.id ? null : item.id });
    return;
  }
  commit({ ...state, room: state.room === item.id ? null : item.id });
}

function saveSettings({ targetHours, bedtime, wake, petName }) {
  commit({
    ...state,
    targetHours,
    bedtime,
    wake,
    petName: petName.trim().slice(0, 16) || state.petName,
  });
}

function resetAll() {
  localStorage.removeItem(KEY);
  commit(fresh());
}

function formatClock(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function formatTimeLabel(value) {
  const [h, m] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
