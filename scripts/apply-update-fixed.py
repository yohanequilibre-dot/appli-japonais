from pathlib import Path

src_path = Path('scripts/apply-update.py')
src = src_path.read_text(encoding='utf-8')
q = chr(39)
start_marker = 'rep(' + q + 'js/app.js' + q + ','


def replace_label(label, replacement):
    global src
    marker = q + label + q + ')'
    pos = src.index(marker)
    start = src.rfind(start_marker, 0, pos)
    if start < 0:
        raise SystemExit('bloc ' + label + ' introuvable')
    src = src[:start] + replacement + src[pos + len(marker):]


replace_label('filter-reviewed', r'''lines = read('js/app.js').splitlines()
needle = 'ui.filter === ' + chr(39) + 'new' + chr(39)
idx = [i for i, line in enumerate(lines) if needle in line]
if len(idx) != 1:
    raise SystemExit('js/app.js / filter-reviewed : ' + str(len(idx)) + ' occurrence(s)')
new_line = 'else if (ui.filter === ' + chr(39) + 'reviewed' + chr(39) + ') list = list.filter(function (e) { const p = state.progress[e.id]; return p && p.last && ((p.reps || 0) + (p.lapses || 0)) > 0; });'
lines.insert(idx[0] + 1, new_line)
write('js/app.js', chr(10).join(lines) + chr(10))
''')

replace_label('grade-said', r'''lines = read('js/app.js').splitlines()
needle = 'const prev = state.progress[e.id] || S.freshProgress(now);'
idx = [i for i, line in enumerate(lines) if needle in line]
if len(idx) != 1:
    raise SystemExit('js/app.js / grade-said : ' + str(len(idx)) + ' occurrence(s)')
lines[idx[0] + 1] = 'const next = S.schedule(prev, g, now);'
said = 'if (session.mode === ' + chr(39) + 'recall' + chr(39) + ' && g === ' + chr(39) + 'good' + chr(39) + ') next.said = (prev.said || 0) + 1;'
lines.insert(idx[0] + 2, said)
lines.insert(idx[0] + 3, 'state.progress[e.id] = next;')
write('js/app.js', chr(10).join(lines) + chr(10))
''')

replace_label('onClick-nav', r'''lines = read('js/app.js').splitlines()
idx = [i for i, line in enumerate(lines) if line.strip() == 'function onClick(event) {']
if len(idx) != 1:
    raise SystemExit('js/app.js / onClick-nav : ' + str(len(idx)) + ' occurrence(s)')
nav_lines = [
"const nav = event.target.closest ? event.target.closest('[data-nav]') : null;",
"if (nav) {",
"event.preventDefault();",
"const name = nav.getAttribute('data-nav');",
"const hashes = { learn: '#apprendre', review: '#reviser', library: '#mots', import: '#importer', grammar: '#grammaire' };",
"const hash = hashes[name];",
"if (hash) { try { history.replaceState(null, '', hash); } catch (err) { location.hash = hash.slice(1); } }",
"if (session) closeSession();",
"showView(name);",
"return;",
"}",
]
lines[idx[0] + 1:idx[0] + 1] = nav_lines
write('js/app.js', chr(10).join(lines) + chr(10))
''')

replace_label('review-one', r'''lines = read('js/app.js').splitlines()
needle = 'case ' + q + 'detail' + q + ': openDetail(id); break;'
idx = [i for i, line in enumerate(lines) if needle in line]
if len(idx) != 1:
    raise SystemExit('js/app.js / review-one : ' + str(len(idx)) + ' occurrence(s)')
lines.insert(idx[0] + 1, 'case ' + q + 'review-one' + q + ': startOne(id); break;')
write('js/app.js', chr(10).join(lines) + chr(10))
''')

exec(compile(src, 'scripts/apply-update.py', 'exec'), {'__name__': '__main__', '__file__': 'scripts/apply-update.py'})
