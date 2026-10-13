# Makes public/favicon.svg and the app icon SVGs here; then run: node render-icons.js (needs playwright-core + Edge)
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
# gotetris icons, from the original favicon (pink L, green S, orange T)
# big layout: 16px grid, 2px blocks (x,y = top-left px), pieces nudged together a little
pieces = [
  ("p", [(2,3),(2,5),(2,7),(4,7)],      "#ff4fa3", "#e0157a", "#b30d60", "#f0318c", "#ff6fb4"),
  ("g", [(10,1),(8,3),(10,3),(8,5)],    "#3ddc97", "#12a86b", "#0b7f50", "#1fbf7e", "#5fe6ad"),
  ("o", [(7,9),(9,9),(11,9),(9,11)],    "#ffc93c", "#f59e0b", "#c77a00", "#fbb11c", "#ffd766"),
]
# tab layout: 5x5 blocks of 3px (16px) / 6px (32px), a 1px / 2px gap after column 1 and row 2
compact = {"p": [(0,0),(0,1),(0,2),(1,2)], "g": [(4,0),(3,1),(4,1),(3,2)], "o": [(2,3),(3,3),(4,3),(3,4)]}
def blocks():
    o = ['<defs>']
    for n, cells, top, bot, edge, flat, light in pieces:
        o.append(f'<linearGradient id="{n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bot}"/></linearGradient>')
    o.append('</defs>')
    for n, cells, top, bot, edge, flat, light in pieces:
        o.append(f'<g class="b" fill="url(#{n})">')
        o += [f'<rect x="{x*4+.4}" y="{y*4+.4}" width="7.2" height="7.2" rx="1.4"/>' for x, y in cells]
        o.append(f'</g><g class="b" fill="{edge}" fill-opacity=".5">')
        o += [f'<rect x="{x*4+1.2}" y="{y*4+6.2}" width="5.6" height=".9" rx=".45"/>' for x, y in cells]
        o.append('</g><g class="b" fill="#fff" fill-opacity=".45">')
        o += [f'<rect x="{x*4+1.2}" y="{y*4+1}" width="5.6" height=".9" rx=".45"/>' for x, y in cells]
        o.append('</g>')
    return "".join(o)
def tab(px, block, gap):  # px = units per pixel (64 units = 16px or 32px)
    o = []
    for n, cells, top, bot, edge, flat, light in pieces:
        for x, y in compact[n]:
            X = (x*block + (gap if x >= 2 else 0) - (gap if n == "g" else 0)) * px;  # S a pixel left, off the T's center
            Y = (y*block + (gap if y >= 3 else 0)) * px; B = block*px; P = px
            o.append(f'<rect x="{X}" y="{Y}" width="{B}" height="{B}" fill="{flat}"/><rect x="{X}" y="{Y}" width="{B}" height="{P}" fill="{light}"/>')
            if block > 3: o.append(f'<rect x="{X+B-P}" y="{Y+P}" width="{P}" height="{B-P}" fill="{edge}" fill-opacity=".3"/>')
            o.append(f'<rect x="{X}" y="{Y+B-P}" width="{B}" height="{P}" fill="{edge}" fill-opacity=".55"/>')
    return "".join(o)
css = ('<style>.t16,.t32{display:none}@media (max-width:48px){.b{display:none}}'
       '@media (max-width:24px){.t16{display:inline}}@media (min-width:25px) and (max-width:48px){.t32{display:inline}}</style>')
open("../../public/favicon.svg", "w").write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' + css +
    f'<g transform="translate(32 32) scale({60/48}) translate(-30 -28)">{blocks()}</g>' +  # pieces' 44x48 bbox centered at (30,28) -> fill 60 of 64
    f'<g class="t16">{tab(4, 3, 1)}</g><g class="t32">{tab(2, 6, 2)}</g></svg>')
# app icons: full-bleed pink tile; pieces (64-unit bbox x 8..52, y 4..52) take `fill` of the side
def icon(fill):
    side = 48 / fill; x0, y0 = 30 - side/2, 28 - side/2
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.2f} {y0:.2f} {side:.2f} {side:.2f}">'
            '<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6ec"/><stop offset="1" stop-color="#ffd0db"/></linearGradient>'
            '<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#8a2a4a" flood-opacity=".22"/></filter></defs>'
            f'<rect x="{x0-1:.2f}" y="{y0-1:.2f}" width="{side+2:.2f}" height="{side+2:.2f}" fill="url(#bg)"/>'
            f'<g filter="url(#sh)">{blocks()}</g></svg>')
open("icon.svg", "w").write(icon(.80))
open("icon-maskable.svg", "w").write(icon(.66))
