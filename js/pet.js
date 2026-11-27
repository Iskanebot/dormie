const FUR = { bunny: "#f4c2d7", bear: "#e4b98a", cat: "#f6d36b" };

function ears(type) {
  if (type === "bear") {
    return `
      <circle cx="58" cy="78" r="22" fill="${FUR.bear}" stroke="#2a2144" stroke-width="3"/>
      <circle cx="142" cy="78" r="22" fill="${FUR.bear}" stroke="#2a2144" stroke-width="3"/>
      <circle cx="58" cy="78" r="10" fill="#c4847a"/>
      <circle cx="142" cy="78" r="10" fill="#c4847a"/>
    `;
  }
  if (type === "cat") {
    return `
      <polygon points="62,96 48,48 86,78" fill="${FUR.cat}" stroke="#2a2144" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="138,96 152,48 114,78" fill="${FUR.cat}" stroke="#2a2144" stroke-width="3" stroke-linejoin="round"/>
    `;
  }
  return `
    <ellipse cx="62" cy="70" rx="16" ry="36" fill="${FUR.bunny}" stroke="#2a2144" stroke-width="3"/>
    <ellipse cx="138" cy="70" rx="16" ry="36" fill="${FUR.bunny}" stroke="#2a2144" stroke-width="3"/>
    <ellipse cx="62" cy="74" rx="8" ry="22" fill="#f7a8c4"/>
    <ellipse cx="138" cy="74" rx="8" ry="22" fill="#f7a8c4"/>
  `;
}

function face(status) {
  if (status === "FAINTED") {
    return `
      <path d="M78 132 l8 8 l-8 8 M114 132 l8 8 l-8 8" fill="none" stroke="#2a2144" stroke-width="3" stroke-linecap="round"/>
      <path d="M90 156 q10 8 20 0" fill="none" stroke="#2a2144" stroke-width="3" stroke-linecap="round"/>
    `;
  }
  if (status === "EXHAUSTED") {
    return `
      <path d="M74 128 q8 6 16 0" fill="none" stroke="#2a2144" stroke-width="3" stroke-linecap="round"/>
      <path d="M110 128 q8 6 16 0" fill="none" stroke="#2a2144" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="82" cy="140" rx="10" ry="5" fill="#c4b5fd" opacity="0.85"/>
      <ellipse cx="118" cy="140" rx="10" ry="5" fill="#c4b5fd" opacity="0.85"/>
      <path d="M92 158 q8 4 16 0" fill="none" stroke="#2a2144" stroke-width="3" stroke-linecap="round"/>
    `;
  }
  if (status === "SLEEPY") {
    return `
      <path d="M74 130 q8 8 16 0" fill="none" stroke="#2a2144" stroke-width="3" stroke-linecap="round"/>
      <path d="M110 130 q8 8 16 0" fill="none" stroke="#2a2144" stroke-width="3" stroke-linecap="round"/>
      <path d="M92 156 q8 6 16 0" fill="none" stroke="#2a2144" stroke-width="3" stroke-linecap="round"/>
    `;
  }
  return `
    <circle cx="82" cy="132" r="4" fill="#2a2144"/>
    <circle cx="118" cy="132" r="4" fill="#2a2144"/>
    <path d="M90 152 q10 12 20 0" fill="none" stroke="#2a2144" stroke-width="3" stroke-linecap="round"/>
  `;
}

function outfit(id, fur) {
  if (id === "gown") {
    return `
      <path d="M70 168 q30 18 60 0 l10 42 h-80 z" fill="#3b2f63" stroke="#2a2144" stroke-width="3"/>
      <rect x="78" y="92" width="44" height="14" rx="3" fill="#2a2144"/>
      <rect x="96" y="78" width="8" height="16" fill="#2a2144"/>
    `;
  }
  if (id === "hoodie") {
    return `
      <path d="M64 160 q36 28 72 0 v46 h-72 z" fill="#355c7d" stroke="#2a2144" stroke-width="3"/>
      <path d="M78 150 q22 -18 44 0" fill="none" stroke="#2a2144" stroke-width="4"/>
      <circle cx="52" cy="118" r="12" fill="#355c7d" stroke="#2a2144" stroke-width="3"/>
      <circle cx="148" cy="118" r="12" fill="#355c7d" stroke="#2a2144" stroke-width="3"/>
      <path d="M52 118 h96" fill="none" stroke="#2a2144" stroke-width="3"/>
    `;
  }
  if (id === "robe") {
    return `
      <path d="M62 158 q38 36 76 0 l14 52 h-104 z" fill="#f3d2b3" stroke="#2a2144" stroke-width="3"/>
      <path d="M100 162 v48" stroke="#e7b089" stroke-width="4"/>
    `;
  }
  if (id === "party") {
    return `
      <polygon points="100,48 82,96 118,96" fill="#fbbf24" stroke="#2a2144" stroke-width="3"/>
      <circle cx="100" cy="46" r="5" fill="#fb7185"/>
    `;
  }
  return "";
}

function prop(status) {
  if (status === "SLEEPY") {
    return `
      <rect x="138" y="168" width="18" height="16" rx="3" fill="#f8fafc" stroke="#2a2144" stroke-width="3"/>
      <path d="M142 168 q6 -10 12 0" fill="none" stroke="#94a3b8" stroke-width="2"/>
      <rect x="142" y="174" width="10" height="6" fill="#6b4f3a"/>
    `;
  }
  if (status === "EXHAUSTED") {
    return `
      <ellipse cx="100" cy="206" rx="46" ry="12" fill="#dbe4ff" stroke="#2a2144" stroke-width="3"/>
    `;
  }
  if (status === "FAINTED") {
    return `
      <ellipse cx="100" cy="58" rx="16" ry="6" fill="none" stroke="#fde68a" stroke-width="3"/>
      <ellipse cx="100" cy="210" rx="54" ry="10" fill="#cbd5e1" stroke="#2a2144" stroke-width="3"/>
    `;
  }
  return `
    <circle class="spark" cx="46" cy="110" r="3" fill="#fde68a"/>
    <circle class="spark" cx="158" cy="96" r="2.5" fill="#a7f3d0"/>
    <circle class="spark" cx="150" cy="150" r="2" fill="#fbcfe8"/>
  `;
}

function petSvg(type, status, outfitId) {
  const fur = FUR[type] || FUR.bunny;
  const tail = type === "cat"
    ? `<path d="M150 176 q28 8 18 28" fill="none" stroke="${fur}" stroke-width="8" stroke-linecap="round"/>`
    : "";
  return `
    <svg class="pet-svg" viewBox="0 0 200 230" role="img" aria-label="${type} pet">
      ${ears(type)}
      ${tail}
      <ellipse cx="100" cy="150" rx="52" ry="46" fill="${fur}" stroke="#2a2144" stroke-width="3"/>
      <ellipse cx="100" cy="162" rx="22" ry="16" fill="#fff7" />
      ${face(status)}
      ${outfit(outfitId, fur)}
      ${prop(status)}
    </svg>
  `;
}
