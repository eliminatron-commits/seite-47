# -*- coding: utf-8 -*-
"""Erzeugt die Papiertexturen in css/style.css neu.

Die sechs Werte --textur / --textur-blatt (hell, dunkel System, dunkel
ausdruecklich) sind SVG-Rauschen als Daten-URI. Von Hand sind sie weder
lesbar noch sicher zu escapen; dieses Skript ist die einzige Stelle, an der
sie gestimmt werden. Aufruf aus dem Projektordner:

    python .claude/baue_textur.py

Drei Ebenen wie echtes Papier:
  Wolke  - ungleichmaessige Dichte (Formation), niedrige Frequenz
  Faser  - kurze, leicht waagerecht gestreckte Striche, nur die Spitzen
  Korn   - feine Punkte

Gestimmt in drei Runden, jede am Bild geprueft:
  1. Wolke .007, Deckkraft .55 - Rauchflecken, Marmor. Fasern .015/.5 -
     lange regelmaessige Striche, gebuerstetes Metall. Kleiner Text litt.
  2. Wolke .022, Fasern .05/.28 spaerlich - dunkel richtig, hell fleckig
     wie Tarnmuster.
  3. Hell eigene, deutlich schwaechere Werte und feinere Wolke (.04).
     Dunkle Spuren auf hellem Grund fallen viel staerker auf als helle auf
     dunklem - gleiche Werte fuer beide Modi gehen deshalb nicht.
  4. Nutzer: deutlich abschwaechen, besonders dunkel. Hell etwa halbiert,
     dunkel auf rund ein Drittel. Die Textur soll man spueren, nicht sehen.

Blatt und Seite haben verschiedene Zufallswerte (saat), sonst verschmilzt
die Karte mit dem Grund und wirkt aufgemalt statt aufgelegt.
"""
import io, os, re
from urllib.parse import quote

HIER = os.path.dirname(os.path.abspath(__file__))
CSS = os.path.join(HIER, '..', 'css', 'style.css')


def textur(farbe, wolke, faser, korn, saat, wolkenfrequenz):
    """farbe 0 = dunkle Spuren (heller Modus), 1 = helle Spuren (dunkler)."""
    svg = (
        "<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'>"
        "<filter id='w' x='0' y='0' width='100%' height='100%'>"
        "<feTurbulence type='fractalNoise' baseFrequency='{wf}' numOctaves='3' seed='{s1}' stitchTiles='stitch'/>"
        "<feColorMatrix values='0 0 0 0 {f} 0 0 0 0 {f} 0 0 0 0 {f} 1 0 0 0 -.38'/></filter>"
        "<filter id='v' x='0' y='0' width='100%' height='100%'>"
        "<feTurbulence type='fractalNoise' baseFrequency='.05 .28' numOctaves='2' seed='{s2}' stitchTiles='stitch'/>"
        "<feColorMatrix values='0 0 0 0 {f} 0 0 0 0 {f} 0 0 0 0 {f} 3.2 0 0 0 -2'/></filter>"
        "<filter id='k' x='0' y='0' width='100%' height='100%'>"
        "<feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='{s3}' stitchTiles='stitch'/>"
        "<feColorMatrix values='0 0 0 0 {f} 0 0 0 0 {f} 0 0 0 0 {f} 1.7 0 0 0 -.76'/></filter>"
        "<rect width='100%' height='100%' filter='url(#w)' opacity='{a1}'/>"
        "<rect width='100%' height='100%' filter='url(#v)' opacity='{a2}'/>"
        "<rect width='100%' height='100%' filter='url(#k)' opacity='{a3}'/>"
        "</svg>"
    ).format(f=farbe, a1=wolke, a2=faser, a3=korn, s1=saat, s2=saat + 4,
             s3=saat + 9, wf=wolkenfrequenz)
    return 'url("data:image/svg+xml,' + quote(svg, safe="=:/ ,.'()") + '")'


# Reihenfolge = Reihenfolge der Vorkommen in style.css:
# hell (Seite, Blatt), dunkel System (Seite, Blatt), dunkel ausdruecklich.
DUNKEL_SEITE = textur(1, .08, .06, .11, 2, .022)
DUNKEL_BLATT = textur(1, .05, .045, .08, 5, .022)
WERTE = [
    textur(0, .07, .08, .22, 2, .04), textur(0, .045, .06, .16, 5, .04),
    DUNKEL_SEITE, DUNKEL_BLATT,
    DUNKEL_SEITE, DUNKEL_BLATT,
]


def main():
    s = io.open(CSS, encoding='utf-8').read()
    muster = re.compile(r'(--textur(?:-blatt)?: )url\("data:image/svg\+xml,[^"]*"\);')
    treffer = list(muster.finditer(s))
    if len(treffer) != 6:
        raise SystemExit('Erwartet 6 Texturwerte in style.css, gefunden %d' % len(treffer))
    teile, pos = [], 0
    for m, neu in zip(treffer, WERTE):
        teile.append(s[pos:m.start()])
        teile.append(m.group(1) + neu + ';')
        pos = m.end()
    teile.append(s[pos:])
    neu = ''.join(teile)
    if neu == s:
        print('Texturen unveraendert.')
        return
    io.open(CSS, 'w', encoding='utf-8').write(neu)
    print('Texturen neu geschrieben.')


if __name__ == '__main__':
    main()
