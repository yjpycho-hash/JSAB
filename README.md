# JSAB - Just Shapes & Beats

A **fan game** inspired by *Just Shapes & Beats*. Built with vanilla HTML5 Canvas and JavaScript. Not affiliated with or endorsed by the original creators.

**Play it here: [jsab.onrender.com](https://jsab.onrender.com)**

## How to Play

- **WASD** or **Arrow Keys** to move
- **Space** to dash through hazards
- Survive until the end of each level

## Features

- 2 levels with unique boss fights
- 5 difficulty modes: Easy, Normal, Hard, Nightmare, Custom
- Custom difficulty: fine-tune every game parameter as percentages
- Procedurally generated music based on BPM and melody
- Local co-op: P1 (blue) + P2 (orange) share the screen with separate controls
- Multiple hazard types: projectiles, beams, walls, pulsing rings, waves, chasers, sprinklers
- Progress saved automatically (completed levels, unlocked difficulties)
- Star indicator on beaten levels
- Keyboard shortcuts: `Escape` to pause/resume

## Difficulty System

Five difficulty modes to choose from. Easy, Normal, and Custom are always unlocked. Hard and Nightmare unlock as you progress.

| Mode | Speed | Spawns | Player HP | Dash Dist | Color | Unlock |
|------|-------|--------|-----------|-----------|-------|--------|
| Easy | 70% | 70% | 7 | 130% | Green | Default |
| Normal | 100% | 100% | 5 | 100% | Cyan | Default |
| Hard | 140% | 150% | 3 | 85% | Orange | Beat Normal |
| Nightmare | 200% | 260% | 2 | 70% | Purple | Beat Hard |
| Custom | User-defined | User-defined | 1–20 | User-defined | White | Always |

### Custom Difficulty

Select Custom to open a settings panel where you can independently tune:

- Player Speed (50–500%)
- Projectile Speed (10–500%)
- Projectile Count (10–500%)
- Enemy Speed (10–500%)
- Projectile Size (10–500%)
- Boss HP (10–500%)
- Boss Attack Rate (10–500%)
- Boss Projectile Count (10–500%)
- Sprinkler Spray Rate (10–500%)
- Sprinkler Rotation Speed (10–500%)
- Dash Distance (10–250%)
- Player HP (1–20, absolute)

All values are percentages where 100% = Normal difficulty default.

## Account System

**Best played on the website** — the server is already running there, and your progress syncs automatically. Running the server locally is finicky and even if you do, your data won't sync with the website (they use separate databases).

- **On the website** ([jsab.onrender.com](https://jsab.onrender.com)): fully functional — sign up, log in, and your progress syncs across devices automatically.
- **Running locally**: auth **only works if you start the server** (`node server.js` from the `JSAB/` directory). Opening the HTML file directly will use localStorage only (no cloud sync).

## Levels

| ID | Name | Difficulty | Boss |
|----|------|-----------|------|
| level1 | The Gatekeeper | ★★ | — |
| level2 | Cascade | ★★★ | Wave Boss |
| level3 | The Pursuit | ★★★★ | Chaser Gauntlet |

## How to Run Locally

**Option 1 — HTML only (no server/offline)**  
Open `JustShapesAndBeats.html` in any browser. Progress saves to localStorage. Account login will **not** work.

**Option 2 — Full server (auth + cloud sync)**  
```bash
cd JSAB
npm install
node server.js
```
Then open `http://localhost:3000`. Requires Node.js.

## Controls

| Action | Player 1 (blue) | Player 2 (orange) |
|--------|-----------------|-------------------|
| Move | WASD | Arrow Keys |
| Dash | Space | Enter |

### Local 2-Player
Both players share the screen simultaneously. P1 is blue, P2 is orange. Each player has their own health bar and score. The level ends when either player dies. Plug in a second keyboard to play together.

## Credits

Built with:
- HTML5 Canvas
- Web Audio API
- Google Fonts (Press Start 2P)
- Turso (database)
- Express + @libsql/client (server)

## License

Fan project. All original IP belongs to the respective owners.
