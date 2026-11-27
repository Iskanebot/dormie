// Uses globals from catalog.js, pet.js, and state.js (classic scripts).

const app = document.querySelector("#app");
let clockTimer = 0;

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

const STATUS_COPY = {
  RADIANT: ["Radiant", "Sparkles, backflips, and a full coin purse."],
  SLEEPY: ["Sleepy", "Coffee in paw, pajamas on. Still showing up."],
  EXHAUSTED: ["Exhausted", "Pillow acquired. Tomorrow can be kinder."],
  FAINTED: ["In the clinic", "No disappearing act. Two solid nights bring them back."],
};

function nav(active) {
  const items = [
    ["home", "Home"],
    ["shop", "Shop"],
    ["closet", "Closet"],
    ["stats", "Stats"],
  ];
  return `<nav class="nav">${items
    .map(([id, label]) => `<button data-action="screen" data-screen="${id}" class="${active === id ? "active" : ""}">${label}</button>`)
    .join("")}</nav>`;
}

function scene(state) {
  const deco = {
    neon: `<i class="neon"></i>`,
    plant: `<i class="plant"></i>`,
    gaming: `<i class="monitor"></i>`,
    coffee: `<i class="maker"></i>`,
  }[state.room] || "";
  return `
    <div class="scene ${state.session ? "night" : ""}">
      <div class="window"></div>
      <div class="room-deco">${deco}</div>
      <div class="pet-wrap ${state.status.toLowerCase()}">${petSvg(state.petType, state.status, state.outfit)}</div>
    </div>
  `;
}

function resultCard(result) {
  if (!result) return "";
  const revived = result.revived ? " They left the clinic." : "";
  return `
    <section class="card result">
      <strong>Sleep score ${result.score}</strong>
      <p class="note">${result.hours} hours logged. +${result.coins} coins. Pet is ${result.status.toLowerCase()}.${revived}</p>
    </section>
  `;
}

function home(state) {
  const [title, blurb] = STATUS_COPY[state.status];
  const recovery = state.status === "FAINTED" ? `<p class="note">Recovery nights: ${state.recovery} / 2</p>` : "";
  return `
    <section class="screen">
      <header class="top">
        <div>
          <p class="eyebrow">Dormie</p>
          <h1>${esc(state.petName)}</h1>
        </div>
        <div class="pills">
          <span class="pill">${state.coins} coins</span>
          <span class="pill">${state.streak} streak</span>
        </div>
      </header>
      ${scene(state)}
      <div class="status-copy">
        <strong>${title}</strong>
        <p>${blurb}</p>
        <p class="note">Aim for ${state.targetHours} hours, ${formatTimeLabel(state.bedtime)} to ${formatTimeLabel(state.wake)}.</p>
        ${recovery}
      </div>
      ${resultCard(state.lastResult)}
      <button class="primary" data-action="start">Start Sleep</button>
    </section>
    ${nav("home")}
  `;
}

function onboarding(state) {
  const step = state.onboardStep;
  let body = "";
  if (step === 1) {
    body = `
      <div class="range-row"><label for="hours">Sleep target</label><strong data-hours>${state.targetHours} hours</strong></div>
      <input id="hours" data-field="targetHours" type="range" min="5" max="10" step="0.5" value="${state.targetHours}" />
      <p class="note">Most students land near 7.5. You can change this later.</p>
    `;
  } else if (step === 2) {
    body = `
      <label for="bed">Target bedtime</label>
      <input id="bed" data-field="bedtime" type="time" value="${state.bedtime}" />
      <label for="wake">Target wake-up</label>
      <input id="wake" data-field="wake" type="time" value="${state.wake}" />
    `;
  } else {
    body = `
      <div class="choices">
        ${PETS.map((pet) => `
          <button class="pet-pick ${state.petType === pet.id ? "selected" : ""}" data-action="pet" data-pet="${pet.id}">
            ${petSvg(pet.id, "RADIANT", null)}
            <span>${pet.label}</span>
          </button>
        `).join("")}
      </div>
      <label for="name">Pet name</label>
      <input id="name" data-field="petName" type="text" maxlength="16" placeholder="Mochi" value="${esc(state.petName)}" />
    `;
  }
  const next = step < 3
    ? `<button class="primary" data-action="next">Continue</button>`
    : `<button class="primary" data-action="finish" ${state.petName.trim() ? "" : "disabled"}>Meet your pet</button>`;
  return `
    <section class="screen wizard">
      <p class="steps">Step ${step} of 3</p>
      <h1>${step === 1 ? "How long do you want to sleep?" : step === 2 ? "When does the night start?" : "Choose a roommate"}</h1>
      ${body}
      ${next}
      ${step > 1 ? `<button class="ghost" data-action="back">Back</button>` : ""}
    </section>
  `;
}

function sleeping(state) {
  const start = new Date(state.session.start);
  const elapsed = formatDuration(Date.now() - start.getTime());
  if (state.session.phase === "mood") {
    return `
      <section class="sleep">
        <p class="eyebrow">Good morning</p>
        <h1>How do you feel?</h1>
        <p class="note">Three seconds. This sets the last 30 points of today's score.</p>
        <div class="mood-grid">
          ${MOODS.map((mood) => `<button class="mood" data-action="mood" data-mood="${mood.id}">${mood.emoji} ${mood.label}<br><span class="note">${mood.hint}</span></button>`).join("")}
        </div>
      </section>
    `;
  }
  return `
    <section class="sleep">
      <p class="eyebrow">Lights out</p>
      <h1>${esc(state.petName)} is asleep</h1>
      <p class="clock" id="clock">${formatClock()}</p>
      <p class="asleep" id="elapsed">Asleep for ${elapsed}</p>
      <div class="pet-wrap sleepy">${petSvg(state.petType, "SLEEPY", state.outfit)}</div>
      <button class="primary" data-action="wake">Stop Sleep</button>
      <button class="ghost" data-action="cancel">Cancel Sleep</button>
    </section>
  `;
}

function shop(state) {
  const list = ITEMS.filter((item) => item.kind === state.shopTab);
  return `
    <section class="screen">
      <p class="eyebrow">Shop</p>
      <h1>${state.coins} coins</h1>
      <div class="tabs">
        <button data-action="tab" data-tab="outfit" class="${state.shopTab === "outfit" ? "active" : ""}">Outfits</button>
        <button data-action="tab" data-tab="room" class="${state.shopTab === "room" ? "active" : ""}">Dorm room</button>
      </div>
      <div class="card">
        ${list.map((item) => {
          const owned = state.owned.includes(item.id);
          return `
            <div class="item">
              <div><strong>${item.name}</strong><p>${item.price} coins</p></div>
              <button class="small" data-action="buy" data-item="${item.id}" ${owned || state.coins < item.price ? "disabled" : ""}>${owned ? "Owned" : "Buy"}</button>
            </div>
          `;
        }).join("")}
      </div>
    </section>
    ${nav("shop")}
  `;
}

function closet(state) {
  const owned = ITEMS.filter((item) => state.owned.includes(item.id));
  const rows = owned.length
    ? owned.map((item) => {
        const on = state.outfit === item.id || state.room === item.id;
        return `
          <div class="item">
            <div><strong>${item.name}</strong><p>${item.kind === "outfit" ? "Outfit" : "Room"}</p></div>
            <button class="small" data-action="equip" data-item="${item.id}">${on ? "Unequip" : "Equip"}</button>
          </div>
        `;
      }).join("")
    : `<p class="note">The closet is empty. The plant is the cheapest thing in the shop.</p>`;
  return `
    <section class="screen">
      <p class="eyebrow">Closet</p>
      <h1>What ${esc(state.petName)} is wearing</h1>
      ${scene(state)}
      <div class="card">${rows}</div>
    </section>
    ${nav("closet")}
  `;
}

function stats(state) {
  const recent = state.logs.slice(-7);
  const bars = recent.length
    ? `<div class="bars">${recent.map((log) => `<div class="bar" style="height:${Math.max(8, log.score)}%"><span>${log.score}</span></div>`).join("")}</div>`
    : `<p class="note">Your first morning check-in will show up here.</p>`;
  return `
    <section class="screen">
      <p class="eyebrow">Stats</p>
      <h1>${state.streak}-night streak</h1>
      <div class="card">
        <strong>Recent scores</strong>
        ${bars}
        <p class="note">Score = (hours / target) × 70 + mood × 30, capped at 100.</p>
      </div>
      <form class="card" id="settings">
        <label for="set-hours">Target hours (${state.targetHours})</label>
        <input id="set-hours" name="targetHours" type="range" min="5" max="10" step="0.5" value="${state.targetHours}" />
        <label for="set-bed">Bedtime</label>
        <input id="set-bed" name="bedtime" type="time" value="${state.bedtime}" />
        <label for="set-wake">Wake-up</label>
        <input id="set-wake" name="wake" type="time" value="${state.wake}" />
        <label for="set-name">Pet name</label>
        <input id="set-name" name="petName" type="text" maxlength="16" value="${esc(state.petName)}" />
        <button class="primary" type="submit">Save settings</button>
      </form>
      <button class="ghost" data-action="reset">Erase this browser's Dormie data</button>
    </section>
    ${nav("stats")}
  `;
}

function view(state) {
  if (!state.onboarded) return onboarding(state);
  if (state.session) return sleeping(state);
  if (state.screen === "shop") return shop(state);
  if (state.screen === "closet") return closet(state);
  if (state.screen === "stats") return stats(state);
  return home(state);
}

function burst() {
  const canvas = document.createElement("canvas");
  canvas.width = 430;
  canvas.height = 800;
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
  app.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const bits = Array.from({ length: 48 }, () => ({
    x: 215,
    y: 220,
    vx: (Math.random() - 0.5) * 8,
    vy: Math.random() * -7 - 2,
    color: ["#f0b45a", "#c4b5fd", "#8ddec4", "#f3a6c0"][Math.floor(Math.random() * 4)],
    life: 70,
  }));
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const bit of bits) {
      if (bit.life <= 0) continue;
      alive = true;
      bit.life -= 1;
      bit.x += bit.vx;
      bit.y += bit.vy;
      bit.vy += 0.15;
      ctx.fillStyle = bit.color;
      ctx.fillRect(bit.x, bit.y, 6, 8);
    }
    if (alive) requestAnimationFrame(frame);
    else canvas.remove();
  }
  frame();
}

function render() {
  window.clearInterval(clockTimer);
  const state = getState();
  app.innerHTML = view(state);
  if (state.lastResult && state.lastResult.score >= 85 && !state.lastResult.celebrated) {
    state.lastResult.celebrated = true;
    burst();
  }
  if (state.session && state.session.phase === "sleeping") {
    const start = new Date(state.session.start).getTime();
    clockTimer = window.setInterval(() => {
      const clock = document.querySelector("#clock");
      const elapsed = document.querySelector("#elapsed");
      if (clock) clock.textContent = formatClock();
      if (elapsed) elapsed.textContent = `Asleep for ${formatDuration(Date.now() - start)}`;
    }, 1000);
  }
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const state = getState();
  const action = target.dataset.action;
  if (action === "next") patchOnboarding({ onboardStep: Math.min(3, state.onboardStep + 1) });
  if (action === "back") patchOnboarding({ onboardStep: Math.max(1, state.onboardStep - 1) });
  if (action === "pet") patchOnboarding({ petType: target.dataset.pet });
  if (action === "finish") finishOnboarding();
  if (action === "start") startSleep();
  if (action === "cancel") cancelSleep();
  if (action === "wake") wakeUp();
  if (action === "mood") submitMood(target.dataset.mood);
  if (action === "screen") setScreen(target.dataset.screen);
  if (action === "tab") setShopTab(target.dataset.tab);
  if (action === "buy") {
    const item = ITEMS.find((entry) => entry.id === target.dataset.item);
    if (item) buy(item);
  }
  if (action === "equip") {
    const item = ITEMS.find((entry) => entry.id === target.dataset.item);
    if (item) equip(item);
  }
  if (action === "reset" && window.confirm("Erase Dormie data on this browser?")) resetAll();
});

app.addEventListener("input", (event) => {
  const field = event.target.dataset.field;
  if (field === "targetHours") {
    patchOnboarding({ targetHours: Number(event.target.value) }, { silent: true });
    const label = document.querySelector("[data-hours]");
    if (label) label.textContent = `${event.target.value} hours`;
  }
  if (field === "petName") {
    patchOnboarding({ petName: event.target.value }, { silent: true });
    const finish = document.querySelector("[data-action='finish']");
    if (finish) finish.disabled = !event.target.value.trim();
  }
});

app.addEventListener("change", (event) => {
  const field = event.target.dataset.field;
  if (field === "bedtime" || field === "wake") {
    patchOnboarding({ [field]: event.target.value });
  }
});

app.addEventListener("submit", (event) => {
  if (event.target.id !== "settings") return;
  event.preventDefault();
  const data = new FormData(event.target);
  saveSettings({
    targetHours: Number(data.get("targetHours")),
    bedtime: String(data.get("bedtime")),
    wake: String(data.get("wake")),
    petName: String(data.get("petName")),
  });
});

if ("serviceWorker" in navigator && (/^http:/i.test(location.href) || /^https:/i.test(location.href))) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

subscribe(render);
render();
