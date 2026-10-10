// Copies the Music class (synth + parser) from public/index.html into tools/song-test.html
// so the tester always sounds like the game. Run after changing Music: node tools/sync-song-test.js
const fs = require("fs");
const path = require("path");

const game = fs.readFileSync(path.join(__dirname, "../public/index.html"), "utf8");
const start = game.search(/^\/\/ folk and classical tunes/m);
const classEnd = game.indexOf("\n", game.indexOf("Music.gestures = ")) + 1;
const roots = /^Music\.roots = .*$/m.exec(game);
if (start < 0 || classEnd <= 0 || !roots) throw new Error("Music class not found in index.html");
const music = game.slice(start, classEnd) + roots[0] + "\n";

const file = path.join(__dirname, "song-test.html");
const tester = fs.readFileSync(file, "utf8");
const re = /(\/\* MUSIC START[^\n]*\n)[\s\S]*?(\/\* MUSIC END \*\/)/;
if (!re.test(tester)) throw new Error("MUSIC START/END markers not found in song-test.html");
fs.writeFileSync(file, tester.replace(re, (m, a, b) => a + music + b));
console.log("song-test.html updated");
