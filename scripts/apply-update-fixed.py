from pathlib import Path

src_path = Path('scripts/apply-update.py')
src = src_path.read_text(encoding='utf-8')
q = chr(39)
pos = src.index('filter-reviewed')
start_marker = 'rep(' + q + 'js/app.js' + q + ','
start = src.rfind(start_marker, 0, pos)
end_marker = q + ')'
end = src.index(end_marker, pos) + len(end_marker)
replacement = r'''lines = read('js/app.js').splitlines()
needle = 'ui.filter === ' + chr(39) + 'new' + chr(39)
idx = [i for i, line in enumerate(lines) if needle in line]
if len(idx) != 1:
    raise SystemExit('js/app.js / filter-reviewed : ' + str(len(idx)) + ' occurrence(s)')
new_line = 'else if (ui.filter === ' + chr(39) + 'reviewed' + chr(39) + ') list = list.filter(function (e) { const p = state.progress[e.id]; return p && p.last && ((p.reps || 0) + (p.lapses || 0)) > 0; });'
lines.insert(idx[0] + 1, new_line)
write('js/app.js', chr(10).join(lines) + chr(10))
'''
if start < 0:
    raise SystemExit('bloc filter-reviewed introuvable')
src = src[:start] + replacement + src[end:]
exec(compile(src, 'scripts/apply-update.py', 'exec'), {'__name__': '__main__', '__file__': 'scripts/apply-update.py'})
