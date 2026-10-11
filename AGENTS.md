# Notes for coding agents

## Version number

The game version is in `public/index.html` (`<p id="version">vMAJOR.MINOR.BUILD</p>`, shown as fine print in the pause menu).
Bump it in the same commit as every change to the game:

- **BUILD** (2.0.0 → 2.0.1): small fixes – bugs, tweaks to layout, sizes, colors, timing.
- **MINOR** (2.0.1 → 2.1.0): small additions – a new option, song, piece or setting. Reset BUILD to 0.
- **MAJOR** (2.1.0 → 3.0.0): new features – new modes or big gameplay changes. Reset MINOR and BUILD to 0.

Changes that don't touch the game (README, tools, tests) don't need a bump.
