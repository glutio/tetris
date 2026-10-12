// renders the PNG app icons into public/ from icon.svg / icon-maskable.svg (made by make-icons.py)
const { chromium } = require("playwright-core");
const fs = require("fs");
process.chdir(__dirname);
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  for (const [size, name, src] of [[180, "apple-touch-icon.png", "icon.svg"], [192, "icon-192.png", "icon.svg"], [512, "icon-512.png", "icon.svg"], [512, "icon-maskable-512.png", "icon-maskable.svg"]]) {
    const svg = fs.readFileSync(src, "utf8");
    const q = await b.newPage({ viewport: { width: size, height: size } });
    await q.setContent(`<body style="margin:0">${svg.replace("<svg ", `<svg width="${size}" height="${size}" style="display:block" `)}</body>`);
    await q.screenshot({ path: "../../public/" + name });
    await q.close();
  }
  await b.close();
})();
