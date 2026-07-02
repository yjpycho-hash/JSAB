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
- Local co-op support (plug in a second keyboard)
- Multiple hazard types: projectiles, beams, walls, pulsing rings, waves, chasers, sprinklers
- Progress saved automatically (completed levels, unlocked difficulties)
- Star indicator on beaten levels
- Keyboard shortcuts: `Escape` to pause/resume

## Difficulty System

Five difficulty modes to choose from. Easy, Normal, and Custom are always unlocked. Hard and Nightmare unlock as you progress.

| Mode | Speed | Spawns | Player HP | Color | Unlock |
|------|-------|--------|-----------|-------|--------|
| Easy | 50% | 45% | 7 | Green | Default |
| Normal | 70% | 65% | 5 | Cyan | Default |
| Hard | 100% | 100% | 3 | Orange | Beat Normal |
| Nightmare | 140% | 170% | 2 | Purple | Beat Hard |
| Custom | User-defined | User-defined | 1–20 | White | Always |

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
- Player HP (1–20, absolute)

All values are percentages where 100% = Hard difficulty default.

## Account System

The game includes a basic username system for display purposes. Full account persistence (Turso database) is planned but **not yet active** on the static site. Progress is saved locally in your browser using `localStorage`. For the full account experience, play on the hosted version — future updates will sync progress across devices.

## Levels

| ID | Name | Difficulty | Boss |
|----|------|-----------|------|
| level1 | Neon Gauntlet | ★★ | — |
| level2 | Synthwave Showdown | ★★★ | Wave Boss |

## How to Run Locally

Open `JustShapesAndBeats.html` in any modern web browser. No server or build tools required.

## Controls

| Action | Player 1 | Player 2 |
|--------|----------|----------|
| Move | WASD | Arrow Keys |
| Dash | Space | Enter |

## Credits

Built with:
- HTML5 Canvas
- Web Audio API
- Google Fonts (Press Start 2P)
- Turso (planned database integration)

## License

Fan project. All original IP belongs to the respective owners.
