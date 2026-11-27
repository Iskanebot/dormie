const PETS = [
  { id: "bunny", label: "Dormie Bunny" },
  { id: "bear", label: "Dormie Bear" },
  { id: "cat", label: "Dormie Cat" },
];

const ITEMS = [
  { id: "gown", kind: "outfit", name: "Graduation Cap & Gown", price: 80 },
  { id: "hoodie", kind: "outfit", name: "Hoodie & Headphones", price: 60 },
  { id: "robe", kind: "outfit", name: "Cozy Robe", price: 40 },
  { id: "party", kind: "outfit", name: "Party Hat", price: 30 },
  { id: "neon", kind: "room", name: "Neon Lights", price: 50 },
  { id: "plant", kind: "room", name: "Desk Plant", price: 25 },
  { id: "gaming", kind: "room", name: "Gaming Setup", price: 90 },
  { id: "coffee", kind: "room", name: "Coffee Maker", price: 45 },
];

const MOODS = [
  { id: "exhausted", emoji: "😴", label: "Exhausted", hint: "Low energy", multiplier: 0.6 },
  { id: "okay", emoji: "😐", label: "Okay", hint: "Decent rest", multiplier: 0.85 },
  { id: "energized", emoji: "⚡", label: "Energized", hint: "Well-rested", multiplier: 1 },
];

function itemById(id) {
  return ITEMS.find((item) => item.id === id) || null;
}
