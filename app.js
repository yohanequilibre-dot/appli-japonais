(function(){
"use strict";

const UNITS_DATA = window.UNITS_DATA || [];
const KEY = "kotoba.v2";
const STEPS = [10*60*1000, 864e5, 2*864e5, 4*864e5, 8*864e5, 16*864e5, 32*864e5];
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const stripFuri = s => String(s || "").replace(/\[[^\]]*\]/g, "");
const JP = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;
const KANJI = /[\u3400-\u4dbf\u4e00-\u9fff]/;
const KANA = /^[\u3040-\u30ff\u30fc\s]+$/;

let PREFS = { furigana:true, romaji:true };
let db = { states:{}, custom:[], prefs:PREFS };
let ALL = [], UNITS = [], S = null;
const ui = { q:"", unit:"all", status:"all" };

function loadDB(){
  try{
    const raw = localStorage.getItem(KEY);
    const p = raw ? JSON.parse(raw) : null;
    if(p && typeof p === "object") db = Object.assign(db, p);
  }catch(e){}
  if(!db.states || typeof db.states !== "object") db.states = {};
  if(!Array.isArray(db.custom)) db.custom = [];
  if(db.prefs) Object.assign(PREFS, db.prefs);
  db.prefs = PREFS;
}
function save(){
  db.prefs = PREFS;
  try{ localStorage.setItem(KEY, JSON.stringify(db)); }catch(e){}
}

function mkWord(t, u){
  const kanji = String(t[0] || "").trim();
  return {
    id: kanji + "#" + String(t[3] || "").trim(),
    kanji, furi:String(t[1] || "").trim(), romaji:String(t[2] || "").trim(),
    fr:String(t[3] || "").trim(), exJa:String(t[4] || "").trim(),
    exFr:String(t[5] || "").trim(), hl:String(t[6] || "").trim() || kanji,
    unit:u.id, unitName:u.name, emoji:u.emoji
  };
}

function rebuild(){
  UNITS = UNITS_DATA.map(u => ({ id:u.id, name:u.name, emoji:u.emoji, words:[] }));
  const custom = { id:"custom", name:"Mes mots importés", emoji:"✨", words:[] };
  UNITS.push(custom);
  const by = {};
  UNITS.forEach(u => { by[u.id] = u; });
  const seen = new Set();
  ALL = [];
  UNITS_DATA.forEach(u => {
    u.words.forEach(t => {
      const w = mkWord(t, u);
      if(seen.has(w.id)) return;
      seen.add(w.id); by[u.id].words.push(w); ALL.push(w);
    });
  });
  db.custom.forEach(t => {
    const w = mkWord(t, custom);
    if(seen.has(w.id)) return;
    seen.add(w.id); custom.words.push(w); ALL.push(w);
  });
}

const stateOf = w => db.states[w.id] || null;
const isKnown = w => { const s = stateOf(w); return !!s && s.box >= 1; };
const isNew = w => { const s = stateOf(w); return !s || s.box === 0; };
const isDue = w => { const s = stateOf(w); return !!s && s.due <= Date.now(); };

function grade(w, ok){
  const s = stateOf(w) || { box:0, due:0, seen:0, ok:0, ko:0 };
  s.seen = (s.seen || 0) + 1;
  if(ok){
    s.ok = (s.ok || 0) + 1;
    s.box = Math.min((s.box || 0) + 1, STEPS.length - 1);
    s.due = Date.now() + STEPS[s.box];
  }else{
    s.ko = (s.ko || 0) + 1;
    s.box = 0;
    s.due = Date.now() + STEPS[0];
  }
  db.states[w.id] = s;
  save();
}

function shuffle(a){
  const r = a.slice();
  for(let i = r.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    const t = r[i]; r[i] = r[j]; r[j] = t;
  }
  return r;
}
function pl(n, one, many){ return n + " " + (n > 1 ? (many || one + "s") : one); }

function furiHTML(str){
  str = String(str || "");
  if(!PREFS.furigana) return esc(stripFuri(str));
  let out = "", last = 0, m;
  const re = /([^\s\[\]]+)\[([^\]]+)\]/g;
  while((m = re.exec(str))){
    out += esc(str.slice(last, m.index));
    out += "<ruby>" + esc(m[1]) + "<rt>" + esc(m[2]) + "</rt></ruby>";
    last = re.lastIndex;
  }
  out += esc(str.slice(last));
  return out;
}

function exHTML(w){
  const s = w.exJa || "", needle = w.hl || w.kanji || "";
  if(!needle) return esc(s);
  const i = s.indexOf(needle);
  if(i < 0) return esc(s);
  return esc(s.slice(0, i)) + "<mark>" + esc(needle) + "</mark>" + esc(s.slice(i + needle.length));
}

let jaVoice = null;
function pickVoice(){
  if(!("speechSynthesis" in window)) return;
  const vs = window.speechSynthesis.getVoices() || [];
  jaVoice = vs.find(v => v.lang && v.lang.toLowerCase().indexOf("ja") === 0) || null;
}
function speak(text){
  if(!("speechSynthesis" in window)) return;
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = "ja-JP"; u.rate = 0.85;
    if(jaVoice) u.voice = jaVoice;
    window.speechSynthesis.speak(u);
  }catch(e){}
}

function setView(v){
  if(v !== "session") S = null;
  ["learn","review","all","session"].forEach(k => { $("view-" + k).hidden = (k !== v); });
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.getAttribute("data-view") === v));
  if(v === "learn") renderLearn();
  if(v === "review") renderReview();
  if(v === "all") renderAll();
  window.scrollTo(0, 0);
}

function refresh(){
  const due = ALL.filter(isDue).length;
  const b = $("dueBadge");
  b.textContent = due;
  b.hidden = due === 0;
}

function renderLearn(){
  const known = ALL.filter(isKnown).length;
  const fresh = ALL.filter(isNew).length;
  const due = ALL.filter(isDue).length;
  let h = `
  <div class="hero">
    <h1>Un mot japonais à la fois.</h1>
    <p class="sub">${known} / ${ALL.length} mots connus · ${fresh} à découvrir · ${due} à réviser</p>
    <div class="hero-actions">
      <button class="btn primary" data-act="mix" ${fresh ? "" : "disabled"}>Découvrir de nouveaux mots (${Math.min(fresh, 10)})</button>
      <button class="btn ghost" data-act="tab-review">Réviser (${due})</button>
    </div>
  </div>
  <div class="h2row"><h2 class="h2">Thèmes</h2><span class="sub">Kanji, furigana, romaji, phrase…</span></div>
  <div class="units">`;
  UNITS.forEach(u => {
    if(!u.words.length) return;
    const k = u.words.filter(isKnown).length;
    const nb = u.words.filter(isNew).length;
    const pct = Math.round(k / u.words.length * 100);
    const go = nb ? "Apprendre " + pl(Math.min(nb, 10), "mot") + " →"
                  : (k ? "Réviser ce thème →" : "Tout est à jour ✓");
    h += `<div class="unit${nb ? "" : " done"}">
      <button class="unit-hit" data-act="unit" data-unit="${u.id}">
        <div class="unit-top"><span class="unit-emoji">${u.emoji}</span><h3>${esc(u.name)}</h3></div>
        <div class="meta">${k} / ${u.words.length} mots connus</div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="go">${go}</div>
      </button>
    </div>`;
  });
  $("view-learn").innerHTML = h + `</div>`;
}

function startFromUnit(id){
  const u = UNITS.find(x => x.id === id);
  if(!u || !u.words.length) return;
  const fresh = u.words.filter(isNew);
  if(fresh.length) startSession(shuffle(fresh).slice(0, 10), u.name);
  else{
    const seen = u.words.filter(w => stateOf(w));
    if(seen.length) startSession(shuffle(seen).slice(0, 20), u.name);
  }
}

function dueList(n){
  return ALL.filter(isDue).sort((a, b) => stateOf(a).due - stateOf(b).due).slice(0, n || 20);
}

function renderReview(){
  const seen = ALL.filter(w => stateOf(w));
  const known = ALL.filter(isKnown);
  const due = ALL.filter(isDue);
  let h = `
  <div class="hero">
    <h1>Réviser</h1>
    <p class="sub">Chaque mot validé revient à intervalles espacés : 10 min, 1 jour, 2 jours, 4 jours, puis de plus en plus loin.</p>
  </div>
  <div class="review-grid">
    <div class="panel">
      <div class="panel-ico">⏰</div>
      <h3>À réviser maintenant</h3>
      <p class="sub">${due.length ? pl(due.length, "mot prêt", "mots prêts") : "Rien pour le moment."}</p>
      <button class="btn primary" data-act="review-due" ${due.length ? "" : "disabled"}>Réviser${due.length ? " (" + Math.min(due.length, 20) + ")" : ""}</button>
    </div>
    <div class="panel">
      <div class="panel-ico">🔁</div>
      <h3>Tout revoir</h3>
      <p class="sub">${known.length ? pl(known.length, "mot connu", "mots connus") + ", dans un ordre aléatoire." : "Aucun mot connu pour l'instant."}</p>
      <button class="btn ghost" data-act="review-all" ${known.length ? "" : "disabled"}>Lancer la révision</button>
    </div>
  </div>`;
  if(seen.length){
    h += `<h2 class="h2">Par thème</h2><div class="word-list" style="margin-top:12px">`;
    UNITS.forEach(u => {
      const ws = u.words.filter(w => stateOf(w));
      if(!ws.length) return;
      h += `<div class="row">
        <div class="row-jp" style="max-width:36px">${u.emoji}</div>
        <div class="row-info"><div class="row-fr">${esc(u.name)}</div><div class="row-sub">${ws.length} mot(s) vu(s)</div></div>
        <button class="btn mini" data-act="unit-review" data-unit="${u.id}">Réviser</button>
      </div>`;
    });
    h += `</div>`;
  }
  $("view-review").innerHTML = h;
}

function startSession(list, title){
  if(!list || !list.length) return;
  S = { queue:list.slice(), total:list.length, done:0, ok:0, ko:0, title:title || "", retries:{} };
  $("sessionBox").hidden = false;
  $("card").hidden = false;
  $("hint").hidden = false;
  $("sActions").hidden = false;
  $("summary").hidden = true;
  setView("session");
  renderCard();
}

function renderCard(){
  if(!S) return;
  const w = S.queue[0];
  if(!w){ $("sFill").style.width = "100%"; endSession(); return; }
  const pct = S.total ? Math.round(S.done / S.total * 100) : 0;
  $("sFill").style.width = Math.max(4, pct) + "%";
  $("sCount").textContent = Math.min(S.done + 1, S.total) + "/" + S.total;
  $("cTag").textContent = (w.emoji ? w.emoji + " " : "") + w.unitName;
  $("cJp").className = "jp" + ((w.kanji || "").length > 9 ? " long" : "");
  $("cJp").innerHTML = furiHTML(w.furi || w.kanji);
  $("cRomaji").textContent = w.romaji;
  $("cRomaji").hidden = !(PREFS.romaji && w.romaji);
  $("cFr").textContent = w.fr;
  $("cEx").innerHTML = exHTML(w);
  $("cExFr").textContent = w.exFr;
  const hasEx = !!(w.exJa || w.exFr);
  $("cardSide").hidden = !hasEx;
  $("card").classList.toggle("noex", !hasEx);
}

function answer(ok){
  if(!S) return;
  const w = S.queue.shift();
  if(!w) return;
  grade(w, ok);
  if(ok){ S.done++; S.ok++; }
  else{
    S.ko++;
    const n = S.retries[w.id] || 0;
    S.retries[w.id] = n + 1;
    if(n < 2) S.queue.splice(Math.min(2, S.queue.length), 0, w);
  }
  refresh();
  renderCard();
}

function endSession(){
  const s = S; S = null;
  $("sFill").style.width = "100%";
  $("card").hidden = true;
  $("hint").hidden = true;
  $("sActions").hidden = true;
  const knownTotal = ALL.filter(isKnown).length;
  const dueNow = ALL.filter(isDue).length;
  const sum = $("summary");
  sum.hidden = false;
  sum.innerHTML = `<div class="sum-card">
    <div class="sum-emoji">${s && s.ko === 0 ? "🏆" : "🎉"}</div>
    <h2>Session terminée !</h2>
    <p class="sub">${s ? s.ok : 0} mot(s) validé(s)${s && s.ko ? " · " + s.ko + " encore fragile(s)" : " · sans faute"}<br>
    ${knownTotal} mot(s) connu(s) au total · ${dueNow} à réviser</p>
    <button class="btn primary" data-act="home">Retour à l'accueil</button>
  </div>`;
  refresh();
}

function renderAll(){
  let opts = `<option value="all">Tous les thèmes</option>`;
  UNITS.forEach(u => {
    if(u.words.length) opts += `<option value="${u.id}"${ui.unit === u.id ? " selected" : ""}>${esc(u.name)}</option>`;
  });
  const h = `
  <div class="hero" style="padding-bottom:0">
    <h1>Mes mots</h1>
    <p class="sub">${ALL.length} mots dans ta bibliothèque · cherche, écoute, importe.</p>
  </div>
  <div class="tools">
    <input id="q" type="search" placeholder="Chercher un mot, un kanji, une traduction…" value="${esc(ui.q)}" autocomplete="off">
    <select id="unitSel">${opts}</select>
    <select id="statusSel">
      <option value="all"${ui.status === "all" ? " selected" : ""}>Tous</option>
      <option value="new"${ui.status === "new" ? " selected" : ""}>À apprendre</option>
      <option value="due"${ui.status === "due" ? " selected" : ""}>À réviser</option>
      <option value="known"${ui.status === "known" ? " selected" : ""}>Connus</option>
    </select>
  </div>
  <div class="optrow">
    <label class="chk"><input type="checkbox" id="prefFuri"${PREFS.furigana ? " checked" : ""}> Furigana au-dessus des kanji</label>
    <label class="chk"><input type="checkbox" id="prefRoma"${PREFS.romaji ? " checked" : ""}> Romaji</label>
  </div>
  <div class="word-count" id="wordCount"></div>
  <div class="word-list" id="wordList"></div>

  <details class="importer" id="importer">
    <summary>＋ Importer des mots ou des phrases</summary>
    <p><b>Colle n'importe quoi</b>, une entrée par ligne. Séparateurs acceptés : <code>|</code>, tabulation, <code>;</code>, <code> - </code>, <code> = </code>, ou simplement un espace entre le japonais et le français. Formats : <code>日本語 | français</code>, <code>漢字 | kana | romaji | français</code>, <code>kanji | furigana | romaji | français | phrase | traduction</code>, ou le japonais et sa traduction sur deux lignes. Les phrases complètes sont acceptées.</p>
    <div class="drop" id="dropZone">
      <textarea id="importArea" placeholder="水 | mizu | eau&#10;こんにちは | bonjour&#10;食べる | たべる | taberu | manger | ご飯を食べる。 | Je mange du riz."></textarea>
      <div class="dropbar">
        <label class="shot-btn">📷 Captures d'écran<input type="file" id="shotInput" accept="image/*" multiple hidden></label>
        <span class="ocr" id="ocrStatus">Dépose ou colle une capture (Ctrl+V). L'OCR se charge au premier usage (connexion requise).</span>
      </div>
      <div class="count" id="importCount"></div>
    </div>
    <button class="btn primary" data-act="import" style="margin-top:12px">Importer</button>
    <div class="msg" id="importMsg"></div>
  </details>`;
  $("view-all").innerHTML = h;

  $("q").addEventListener("input", e => { ui.q = e.target.value; renderList(); });
  $("unitSel").addEventListener("change", e => { ui.unit = e.target.value; renderList(); });
  $("statusSel").addEventListener("change", e => { ui.status = e.target.value; renderList(); });
  $("prefFuri").addEventListener("change", e => { PREFS.furigana = e.target.checked; save(); renderList(); });
  $("prefRoma").addEventListener("change", e => { PREFS.romaji = e.target.checked; save(); renderList(); });
  $("importArea").addEventListener("input", updateCount);
  $("shotInput").addEventListener("change", e => { ocrFiles(e.target.files); e.target.value = ""; });
  bindDrop();
  renderList();
}

function renderList(){
  const q = ui.q.trim().toLowerCase();
  const list = ALL.filter(w => {
    if(ui.unit !== "all" && w.unit !== ui.unit) return false;
    if(ui.status === "new" && !isNew(w)) return false;
    if(ui.status === "due" && !isDue(w)) return false;
    if(ui.status === "known" && !isKnown(w)) return false;
    if(!q) return true;
    const hay = (w.kanji + " " + stripFuri(w.furi) + " " + w.romaji + " " + w.fr + " " + w.exFr + " " + w.unitName).toLowerCase();
    return hay.indexOf(q) !== -1;
  });
  $("wordCount").textContent = `${list.length} mot${list.length > 1 ? "s" : ""}`;
  if(!list.length){
    $("wordList").innerHTML = `<div class="empty">Aucun mot ne correspond.</div>`;
    return;
  }
  $("wordList").innerHTML = list.map(w => {
    const cls = isDue(w) ? "due" : (isKnown(w) ? "known" : "new");
    const title = cls === "due" ? "À réviser" : (cls === "known" ? "Connu" : "Nouveau");
    return `<div class="row">
      <div class="row-jp">${furiHTML(w.furi || w.kanji)}</div>
      <div class="row-info">
        <div class="row-fr">${esc(w.fr)}</div>
        <div class="row-sub">${esc(w.romaji)} · ${esc(w.unitName)}</div>
      </div>
      <span class="dot ${cls}" title="${title}"></span>
      <button class="icon-btn" data-speak="${esc(w.kanji)}" aria-label="Écouter">🔊</button>
    </div>`;
  }).join("");
}

const FRWORDS = "le la les un une des du de je tu il elle nous vous ils elles etre avoir faire aller manger boire bonjour bonsoir merci salut oui non et en au aux ce cette ces mon ma mes ton ta tes son sa ses pour avec sans dans sur sous tres bien mal plus moins chat chien eau pain maison temps jour nuit matin soir ami amie famille ecole travail livre film musique photo voyage argent train voiture pluie fleur chanson jeu femme homme enfant etudiant etudiante professeur cafe riz viande poisson oeuf oeufs legume fruit pomme fille garcon pere mere frere soeur mari epouse";
const FRRE = new RegExp(" (" + FRWORDS + ") ");

function isFrench(s){
  s = String(s || "");
  if(/[àâäçéèêëîïôöùûüÿœ]/i.test(s)) return true;
  const t = " " + s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z ]/g, " ") + " ";
  return FRRE.test(t);
}
function isRomaji(s){
  s = String(s || "");
  if(!/^[A-Za-zāīūēōĀĪŪĒŌ\s'\-]+$/.test(s)) return false;
  if(/[A-ZĀĪŪĒŌ]/.test(s)) return false;
  return !isFrench(s);
}
function isKanaOnly(s){
  return KANA.test(s) && /[\u3040-\u30ff]/.test(s);
}

function splitCells(line){
  let parts;
  if(line.indexOf("|") !== -1) parts = line.split("|");
  else if(line.indexOf("\t") !== -1) parts = line.split("\t");
  else if(line.indexOf(";") !== -1) parts = line.split(";");
  else if(/\s+[–—]\s+/.test(line)) parts = line.split(/\s+[–—]\s+/);
  else if(/\s+-\s+/.test(line)) parts = line.split(/\s+-\s+/);
  else if(/\s+=\s+/.test(line)) parts = line.split(/\s+=\s+/);
  else if(line.indexOf("\u3000") !== -1) parts = line.split(/\u3000+/);
  else if(/\s{2,}/.test(line)) parts = line.split(/\s{2,}/);
  else parts = [line];
  return parts.map(s => s.trim()).filter(Boolean);
}

function splitNoSep(line){
  const firstLatin = line.search(/[A-Za-zÀ-ÿ]/);
  const firstJp = line.search(JP);
  if(firstLatin > -1 && firstJp > -1 && firstJp > firstLatin){
    return [line.slice(0, firstJp).trim(), line.slice(firstJp).trim()].filter(Boolean);
  }
  if(firstLatin > -1 && firstJp > -1 && firstLatin > firstJp){
    const jpPart = line.slice(firstJp, firstLatin).trim();
    const latPart = line.slice(firstLatin).trim();
    const tokens = jpPart.split(/\s+/).filter(Boolean);
    return (tokens.length > 1 ? tokens : [jpPart]).concat([latPart]);
  }
  return [line];
}

function toRomaji(kana){
  let s = String(kana || "").replace(/[。、！？\s]/g, "");
  if(/^こんにちは$/.test(s)) return "konnichiwa";
  if(/^こんばんは$/.test(s)) return "konbanwa";
  s = s.replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
  const dig = {
    "きゃ":"kya","きゅ":"kyu","きょ":"kyo","しゃ":"sha","しゅ":"shu","しょ":"sho",
    "ちゃ":"cha","ちゅ":"chu","ちょ":"cho","にゃ":"nya","にゅ":"nyu","にょ":"nyo",
    "ひゃ":"hya","ひゅ":"hyu","ひょ":"hyo","みゃ":"mya","みゅ":"myu","みょ":"myo",
    "りゃ":"rya","りゅ":"ryu","りょ":"ryo","ぎゃ":"gya","ぎゅ":"gyu","ぎょ":"gyo",
    "じゃ":"ja","じゅ":"ju","じょ":"jo","びゃ":"bya","びゅ":"byu","びょ":"byo",
    "ぴゃ":"pya","ぴゅ":"pyu","ぴょ":"pyo"
  };
  const one = {
    "あ":"a","い":"i","う":"u","え":"e","お":"o","か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
    "さ":"sa","し":"shi","す":"su","せ":"se","そ":"so","た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to",
    "な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no","は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho",
    "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo","や":"ya","ゆ":"yu","よ":"yo","ら":"ra","り":"ri",
    "る":"ru","れ":"re","ろ":"ro","わ":"wa","を":"o","ん":"n","が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge",
    "ご":"go","ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo","だ":"da","ぢ":"ji","づ":"zu","で":"de",
    "ど":"do","ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo","ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe",
    "ぽ":"po","ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o","ゔ":"vu"
  };
  let out = "", i = 0;
  while(i < s.length){
    const two = s.slice(i, i + 2);
    if(dig[two]){ out += dig[two]; i += 2; continue; }
    const ch = s[i];
    if(ch === "っ"){
      const nx = s.slice(i + 1, i + 3);
      const r = dig[nx] || one[s[i + 1]] || "";
      if(r) out += r[0];
      i++; continue;
    }
    if(ch === "ー"){
      const m = out.match(/[aeiou]/g);
      if(m) out += m[m.length - 1];
      i++; continue;
    }
    out += (one[ch] === undefined ? ch : one[ch]);
    i++;
  }
  return out;
}

function makeEntry(cells){
  cells = cells.map(c => String(c == null ? "" : c).trim()).filter(Boolean);
  if(cells.length < 2) return null;
  const bracketed = cells.find(c => JP.test(c) && /\[[^\]]+\]/.test(c));
  const plainJp = cells.filter(c => JP.test(c) && !/\[[^\]]+\]/.test(c));
  const latin = cells.filter(c => !JP.test(c));
  if(!latin.length) return null;

  let word = plainJp[0] || (bracketed ? stripFuri(bracketed) : "");
  if(!word) return null;

  let reading = "", exJa = "";
  const rest = plainJp.slice(1);
  if(rest.length && isKanaOnly(rest[0]) && !/[。！？]/.test(rest[0]) && rest[0].length <= word.length + 4){
    reading = rest.shift().replace(/\s+/g, "");
  }
  rest.forEach(c => {
    if(!exJa && (KANJI.test(c) || /[。！？]/.test(c) || c.length > 6)) exJa = c;
  });

  let romaji = "", fr = "", exFr = "";
  if(latin.length === 1){
    const parts = latin[0].split(/\s+/);
    if(parts.length > 1 && isRomaji(parts[0]) && !isFrench(parts[0]) && isFrench(parts.slice(1).join(" "))){
      romaji = parts[0];
      fr = parts.slice(1).join(" ");
    }else{
      fr = latin[0];
    }
  }else if(isRomaji(latin[0]) && !isFrench(latin[0])){
    romaji = latin[0];
    fr = latin[1] || "";
    exFr = latin[2] || "";
  }else{
    fr = latin[0];
    if(latin[1] && isRomaji(latin[1])){ romaji = latin[1]; exFr = latin[2] || ""; }
    else exFr = latin[1] || "";
  }
  if(!fr) fr = latin[latin.length - 1];

  let furi = bracketed || word;
  if(!bracketed && reading && KANJI.test(word)) furi = word + "[" + reading + "]";
  if(!romaji){
    const k = reading || (isKanaOnly(word) ? word : "");
    if(k) romaji = toRomaji(k);
  }

  word = word.slice(0, 100);
  fr = fr.slice(0, 200);
  exJa = exJa.slice(0, 200);
  exFr = exFr.slice(0, 200);
  if(!word || !fr) return null;
  return [word, furi, romaji, fr, exJa, exFr, ""];
}

function parseText(txt){
  const out = [];
  let pending = [];
  String(txt || "").split(/\r?\n/).forEach(raw => {
    let line = raw.trim();
    if(!line){ pending = []; return; }
    line = line.replace(/^[\s•·*]+/, "").replace(/^\d+[.)]\s*/, "").trim();
    if(!line || line.charAt(0) === "#" || line.charAt(0) === "/") return;

    let cells = splitCells(line);
    if(cells.length === 1) cells = splitNoSep(line);
    const entry = makeEntry(cells);
    if(entry){
      out.push(entry);
      pending = [];
      return;
    }
    if(JP.test(line) && !/[A-Za-zÀ-ÿ]/.test(line)){
      pending.push(line);
      if(pending.length > 4) pending.shift();
      return;
    }
    if(pending.length && !JP.test(line) && /[A-Za-zÀ-ÿ]/.test(line)){
      const e2 = makeEntry(pending.concat([line]));
      if(e2) out.push(e2);
      pending = [];
      return;
    }
    pending = [];
  });
  return out;
}

function updateCount(){
  const ta = $("importArea");
  if(!ta) return;
  const el = $("importCount");
  if(!el) return;
  const n = parseText(ta.value).length;
  el.textContent = n ? n + " entrée(s) détectée(s)" : (ta.value.trim() ? "Rien de reconnu pour l'instant — vérifie le format." : "");
}

function doImport(){
  const ta = $("importArea");
  if(!ta) return;
  const entries = parseText(ta.value);
  const msg = $("importMsg");
  if(!entries.length){
    if(msg){ msg.style.color = "#ff4b4b"; msg.textContent = "Rien de reconnu. Essaie : 日本語 | français, ou une ligne japonais puis une ligne français."; }
    return;
  }
  const seen = new Set(ALL.map(w => w.id));
  let added = 0, dup = 0;
  entries.forEach(t => {
    const id = t[0] + "#" + t[3];
    if(seen.has(id)){ dup++; return; }
    seen.add(id);
    db.custom.push(t);
    added++;
  });
  if(!added){
    if(msg){ msg.style.color = "#ff9600"; msg.textContent = "Ces " + entries.length + " entrée(s) sont déjà dans ta bibliothèque."; }
    return;
  }
  save();
  rebuild();
  refresh();
  renderAll();
  const m2 = $("importMsg");
  if(m2){
    m2.style.color = "";
    m2.textContent = pl(added, "entrée ajoutée", "entrées ajoutées") + (dup ? " · " + dup + " doublon(s) ignoré(s)" : "") + ". Tu les trouveras dans « Mes mots importés ».";
  }
  const imp = $("importer");
  if(imp) imp.open = true;
}

let tReady = null;
function loadTesseract(){
  if(window.Tesseract) return Promise.resolve(window.Tesseract);
  if(tReady) return tReady;
  tReady = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    s.async = true;
    s.onload = () => window.Tesseract ? resolve(window.Tesseract) : reject(new Error("OCR indisponible"));
    s.onerror = () => { tReady = null; reject(new Error("Impossible de charger l'OCR (connexion ?)")); };
    document.head.appendChild(s);
  });
  return tReady;
}

async function ocrFiles(files){
  const arr = Array.from(files || []).filter(f => f && f.type && f.type.indexOf("image/") === 0);
  if(!arr.length) return;
  const area = $("importArea"), st = $("ocrStatus");
  if(!area || !st) return;
  st.textContent = "Chargement de l'OCR…";
  try{
    const T = await loadTesseract();
    for(const f of arr){
      st.textContent = "Lecture de " + (f.name || "la capture") + "…";
      const res = await T.recognize(f, "jpn+fra", {
        logger: m => {
          if(m && m.status === "recognizing text" && st){
            st.textContent = "OCR " + Math.round((m.progress || 0) * 100) + "%…";
          }
        }
      });
      const txt = res && res.data && res.data.text ? res.data.text.trim() : "";
      if(txt) area.value = (area.value.trim() ? area.value.trim() + "\n" : "") + txt;
    }
    st.textContent = "Texte ajouté ci-dessus. Corrige si besoin, puis clique sur Importer.";
    updateCount();
  }catch(e){
    st.textContent = "OCR impossible : " + (e && e.message ? e.message : "erreur") + ". Tu peux coller le texte à la main.";
  }
}

function bindDrop(){
  const zone = $("dropZone");
  if(!zone) return;
  ["dragenter","dragover"].forEach(ev => zone.addEventListener(ev, e => {
    e.preventDefault(); zone.classList.add("drag");
  }));
  ["dragleave","drop"].forEach(ev => zone.addEventListener(ev, e => {
    e.preventDefault(); zone.classList.remove("drag");
  }));
  zone.addEventListener("drop", e => {
    const dt = e.dataTransfer;
    if(dt && dt.files && dt.files.length) ocrFiles(dt.files);
  });
}

document.addEventListener("click", function(e){
  if(!(e.target instanceof Element)) return;
  const sp = e.target.closest("[data-speak]");
  if(sp){ speak(sp.getAttribute("data-speak")); return; }
  const el = e.target.closest("[data-act]");
  if(!el || el.disabled) return;
  const act = el.getAttribute("data-act");
  if(act === "unit") startFromUnit(el.getAttribute("data-unit"));
  else if(act === "unit-review"){
    const u = UNITS.find(x => x.id === el.getAttribute("data-unit"));
    if(u) startSession(shuffle(u.words.filter(w => stateOf(w))).slice(0, 20), u.name);
  }
  else if(act === "mix") startSession(shuffle(ALL.filter(isNew)).slice(0, 10), "Tous les thèmes");
  else if(act === "review-due") startSession(dueList(20), "À réviser");
  else if(act === "review-all") startSession(shuffle(ALL.filter(isKnown)), "Tout revoir");
  else if(act === "tab-review") setView("review");
  else if(act === "home") setView("learn");
  else if(act === "import") doImport();
});

document.querySelectorAll(".tab").forEach(b => {
  b.addEventListener("click", () => setView(b.getAttribute("data-view")));
});

$("okBtn").addEventListener("click", () => answer(true));
$("againBtn").addEventListener("click", () => answer(false));
$("quitBtn").addEventListener("click", () => { S = null; setView("learn"); });
$("speakW").addEventListener("click", () => { if(S && S.queue[0]) speak(S.queue[0].kanji); });
$("speakS").addEventListener("click", () => { if(S && S.queue[0]) speak(stripFuri(S.queue[0].exJa)); });

document.addEventListener("keydown", e => {
  if(!S) return;
  const t = e.target;
  if(t && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName)) return;
  if(e.key === " " || e.key === "Enter"){ e.preventDefault(); answer(true); }
  else if(e.key === "s" || e.key === "S" || e.key === "ArrowLeft") answer(false);
  else if(e.key === "r" || e.key === "R"){ if(S && S.queue[0]) speak(S.queue[0].kanji); }
});

document.addEventListener("paste", e => {
  if($("view-all").hidden) return;
  const items = e.clipboardData && e.clipboardData.items;
  if(!items) return;
  const files = [];
  for(let i = 0; i < items.length; i++){
    if(items[i].type && items[i].type.indexOf("image/") === 0){
      const f = items[i].getAsFile();
      if(f) files.push(f);
    }
  }
  if(files.length){ e.preventDefault(); ocrFiles(files); }
});

if("speechSynthesis" in window){
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

loadDB();
rebuild();
refresh();
setView("learn");
})();
