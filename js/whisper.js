/* Kotoba — enregistrement micro et transcription Whisper locale (sans clé API). */
(function (root) {
'use strict';
var worker = null;
var active = null;
var stream = null;
var recorder = null;
var chunks = [];
var timer = 0;
var requestId = 0;
function supported() {
return !!(root.navigator && root.navigator.mediaDevices && root.MediaRecorder &&
(root.AudioContext || root.webkitAudioContext) &&
(root.OfflineAudioContext || root.webkitOfflineAudioContext) && root.Worker);
}
function emit(status, message) {
if (active && active.onStatus) active.onStatus(status, message);
}
function stopTracks() {
if (stream) {
try { stream.getTracks().forEach(function (track) { track.stop(); }); } catch (e) { /* ignore */ }
stream = null;
}
}
function clearTimer() {
if (timer) { clearTimeout(timer); timer = 0; }
}
function stopTracksAndRecorder() {
clearTimer();
if (recorder && recorder.state !== 'inactive') {
try { recorder.stop(); } catch (e) { /* ignore */ }
}
recorder = null;
stopTracks();
}
function closeWorker() {
if (worker) {
try { worker.terminate(); } catch (e) { /* ignore */ }
worker = null;
}
}
function fail(message) {
var a = active;
active = null;
stopTracksAndRecorder();
closeWorker();
if (a && !a.settled) { a.settled = true; a.reject(new Error(message)); }
}
function settle(text) {
var a = active;
active = null;
stopTracksAndRecorder();
if (a && !a.settled) { a.settled = true; a.resolve(text); }
}
function ensureWorker() {
if (worker) return worker;
worker = new root.Worker('js/whisper-worker.js', { type: 'module' });
worker.onmessage = function (event) {
var data = event.data || {};
if (!active || data.id !== active.requestId) return;
if (data.type === 'progress') {
if (active.onProgress) active.onProgress(Math.max(0, Math.min(100, Number(data.progress) || 0)), data.message || 'Chargement du modèle…');
emit('loading', data.message || 'Chargement du modèle…');
} else if (data.type === 'result') {
settle(String(data.text || '').trim());
} else if (data.type === 'error') {
fail(data.message || 'Whisper n’a pas pu transcrire l’audio.');
}
};
worker.onerror = function () {
fail('Le moteur IA n’a pas pu démarrer. Vérifie ta connexion et réessaie.');
};
return worker;
}
function prepare(blob) {
return blob.arrayBuffer().then(function (buffer) {
var Ctx = root.AudioContext || root.webkitAudioContext;
var ctx = new Ctx();
return ctx.decodeAudioData(buffer).then(function (audio) {
var Offline = root.OfflineAudioContext || root.webkitOfflineAudioContext;
var length = Math.max(1, Math.ceil(audio.duration * 16000));
var offline = new Offline(1, length, 16000);
var source = offline.createBufferSource();
source.buffer = audio;
source.connect(offline.destination);
source.start();
return offline.startRendering().then(function (result) {
var data = result.getChannelData(0);
var copy = new Float32Array(data.length);
copy.set(data);
try { ctx.close(); } catch (e) { /* ignore */ }
return copy;
});
});
});
}
function processAudio() {
var a = active;
if (!a) return;
var type = (recorder && recorder.mimeType) || 'audio/webm';
var blob = new Blob(chunks, { type: type });
chunks = [];
recorder = null;
stopTracks();
emit('transcribing', 'Transcription en cours…');
prepare(blob).then(function (audio) {
if (!active) return;
try {
ensureWorker();
a.requestId = ++requestId;
active.requestId = a.requestId;
worker.postMessage({ type: 'transcribe', id: a.requestId, audio: audio.buffer }, [audio.buffer]);
} catch (err) {
fail('Impossible de démarrer le moteur IA.');
}
}).catch(function () {
fail('Impossible de lire l’enregistrement audio.');
});
}
function stop() {
clearTimer();
if (recorder && recorder.state !== 'inactive') {
try { recorder.stop(); } catch (e) { /* ignore */ }
}
}
function abort() {
clearTimer();
var a = active;
active = null;
stopTracksAndRecorder();
closeWorker();
if (a && !a.settled) { a.settled = true; a.reject(new Error('Reconnaissance annulée.')); }
}
function listen(options) {
var opts = options || {};
if (!supported()) return Promise.reject(new Error('La reconnaissance IA locale n’est pas disponible dans ce navigateur.'));
abort();
return new Promise(function (resolve, reject) {
active = {
resolve: resolve,
reject: reject,
onStatus: opts.onStatus,
onProgress: opts.onProgress,
maxMs: Math.max(3000, Math.min(15000, Number(opts.maxMs) || 8000)),
requestId: 0,
settled: false
};
root.navigator.mediaDevices.getUserMedia({ audio: true }).then(function (mediaStream) {
if (!active) { stopTracks(mediaStream); return; }
stream = mediaStream;
var mime = '';
if (root.MediaRecorder.isTypeSupported) {
if (root.MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mime = 'audio/webm;codecs=opus';
else if (root.MediaRecorder.isTypeSupported('audio/webm')) mime = 'audio/webm';
else if (root.MediaRecorder.isTypeSupported('audio/mp4')) mime = 'audio/mp4';
}
try {
recorder = mime ? new root.MediaRecorder(mediaStream, { mimeType: mime }) : new root.MediaRecorder(mediaStream);
} catch (err) {
fail('Impossible de démarrer l’enregistrement audio.');
return;
}
chunks = [];
recorder.ondataavailable = function (event) { if (event.data && event.data.size) chunks.push(event.data); };
recorder.onstop = function () { if (active) processAudio(); };
try {
recorder.start();
emit('recording', 'Parle maintenant…');
timer = setTimeout(stop, active.maxMs);
} catch (err) {
fail('Impossible de démarrer l’enregistrement audio.');
}
}).catch(function () {
fail('Micro inaccessible. Autorise le microphone puis réessaie.');
});
});
}
root.Kotoba = root.Kotoba || {};
root.Kotoba.Whisper = {
supported: supported,
listen: listen,
stop: stop,
abort: abort
};
})(typeof window !== 'undefined' ? window : globalThis);
