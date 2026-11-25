# Dormie

A mobile web app for student sleep check-ins. Your pet's mood follows last night's sleep score. Coins buy dorm outfits and room items.

Data stays in this browser (`localStorage`). There is no account server.

## Run

```powershell
py -3 -m http.server 5173
```

Open http://localhost:5173 on your phone-sized browser window.

## What's here

- `index.html` — the app shell
- `js/state.js` — onboarding, sleep score, coins, streak, shop
- `js/pet.js` — the pet drawing
- `js/catalog.js` — pets, moods, and shop items
- `css/app.css` — layout and theme
- `schema.sql` — the database sketch from the spec, not wired up yet

## Sleep score

`min(100, (hours slept / target hours) * 70 + mood multiplier * 30)`

Mood multipliers: exhausted 0.6, okay 0.85, energized 1. Scores of 85, 60, and 30 move the pet through Radiant, Sleepy, Exhausted, and Fainted. A fainted pet needs two nights scored 60 or higher to get up. It does not disappear.
