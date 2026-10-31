from pathlib import Path

path = Path('js/app.js')
source = path.read_text(encoding='utf-8')

replacements = [
    ("Kotoba n a pas pu", r"Kotoba n\'a pas pu"),
    ("Impossible d enregistrer", r"Impossible d\'enregistrer"),
    ("n est pas disponible", r"n\'est pas disponible"),
    ("l audio", r"l\'audio"),
    ("d abord", r"d\'abord"),
    ("n est dû", r"n\'est dû"),
    ("carte t attend", r"carte t\'attend"),
    ("cartes t attendent", r"cartes t\'attendent"),
    ("qu ils", r"qu\'ils"),
    ("jusqu à", r"jusqu\'à"),
    ("s ils", r"s\'ils"),
    ("J ai prononcé", r"J\'ai prononcé"),
    ("l accueil", r"l\'accueil"),
    ("l export", r"l\'export"),
    ("d un", r"d\'un"),
    ("l autre", r"l\'autre"),
    ("d écran", r"d\'écran"),
    ("d importer", r"d\'importer"),
    ("l instant", r"l\'instant"),
    ("l OCR", r"l\'OCR"),
    ("d entrées", r"d\'entrées"),
    ("l après-midi", r"l\'après-midi"),
    ("d une", r"d\'une"),
    ("d autres", r"d\'autres"),
    ("d accord", r"d\'accord"),
    ("l objectif", r"l\'objectif"),
    ("aujourd hui", r"aujourd\'hui")
]

for old, new in replacements:
    source = source.replace(old, new)

needle = "state.entries[e.id] = e; keys.add(entryKey(e)); added++;"
if "state.progress[e.id] = { level: 0, reps: 0, lapses: 0, due:" not in source:
    addition = needle + "\n    state.progress[e.id] = { level: 0, reps: 0, lapses: 0, due: Date.now() - 1, last: Date.now() - 1 };"
    source = source.replace(needle, addition, 1)

path.write_text(source, encoding='utf-8')
print('Corrections appliquées.')
