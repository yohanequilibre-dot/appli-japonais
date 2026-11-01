/* Kotoba — capture micro propre et transcription Whisper locale (sans clé API). */
(function (root) {
'use strict';
var worker = null;
var active = null;
var requestId = 0;
var SAMPLE_RATE = 16000;
var DEFAULT_MAX_MS = 12000;
var DEFAULT_SILENCE_MS = 1200;

function supported() {
return !!(root.navigator && root.navigator.mediaDevices && root.navigator.mediaDevices.getUserMedia &&
root.MediaRecorder && (root.AudioContext || root.webkitAudioContext) &&
(root.OfflineAudioContext || root.webkitOfflineAudioContext) && root.Worker);
}
function emit(a, status, message) {
if (!a || !a.onStatus) return;
try { a.onStatus(status, message); } catch (e) { /* l’interface ne doit pas bloquer l’audio */ }
}
function clearTimers(a) {
if (!a) return;
if (a.timer) { clearTimeout(a.timer); a.timer = 0; }
if (a.ticker) { clearInterval(a.ticker); a.ticker = 0; }
}
function stopTracks(mediaStream) {
if (!mediaStream) return;
try { mediaStream.getTracks().forEach(function (track) { track.stop(); }); } catch (e) { /* ignore */ }
}
function closeAudio(a) {
if (!a) return;
if (a.source) { try { a.source.disconnect(); } catch (e) { /* ignore */ } a.source = null; }
if (a.analyser) { try { a.analyser.disconnect(); } catch (e) { /* ignore */ } a.analyser = null; }
if (a.gain) { try { a.gain.disconnect(); } catch (e) { /* ignore */ } a.gain = null; }
if (a.audioCtx) { try { a.audioCtx.close(); } catch (e) { /* ignore */ } a.audioCtx = null; }
}
function closeWorker() {
if (worker) {
try { worker.terminate(); } catch (e) { /* ignore */ }
worker = null;
}
}
function rejectActive(a, message) {
if (a && !a.settled) { a.settled = true; a.reject(new Error(message)); }
}
function fail(a, message, resetWorker) {
if (!a) return;
if (active === a) active = null;
clearTimers(a);
if (a.recorder && a.recorder.state !== 'inactive') {
try { a.recorder.stop(); } catch (e) { /* ignore */ }
}
a.recorder = null;
stopTracks(a.stream);
a.stream = null;
closeAudio(a);
if (resetWorker) closeWorker();
rejectActive(a, message);
}
function settle(a, text) {
if (!a) return;
if (active === a) active = null;
clearTimers(a);
a.recorder = null;
stopTracks(a.stream);
a.stream = null;
closeAudio(a);
if (!a.settled) { a.settled = true; a.resolve(text); }
}
function ensureWorker(a) {
if (worker) return worker;
worker = new root.Worker('js/whisper-worker.js', { type: 'module' });
worker.onmessage = function (event) {
var data = event.data || {};
if (!active || data.id !== active.requestId) return;
var current = active;
if (data.type === 'progress') {
var pct = Math.max(0, Math.min(100, Number(data.progress) || 0));
if (current.onProgress) {
try { current.onProgress(pct, data.message || 'Chargement du modèle…'); } catch (e) { /* ignore */ }
}
emit(current, 'loading', data.message || 'Chargement du modèle…');
} else if (data.type === 'result') {
settle(current, String(data.text || '').trim());
} else if (data.type === 'error') {
fail(current, data.message || 'Whisper n’a pas pu transcrire l’audio.', false);
}
};
worker.onerror = function () {
var current = active;
closeWorker();
fail(current, 'Le moteur IA n’a pas pu démarrer. Vérifie ta connexion et réessaie.', false);
};
return worker;
}
function chooseMime() {
try {
if (!root.MediaRecorder.isTypeSupported) return '';
var types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4;codecs=mp4a.40.2', 'audio/mp4'];
for (var i = 0; i < types.length; i++) {
if (root.MediaRecorder.isTypeSupported(types[i])) return types[i];
}
} catch (e) { /* certains navigateurs lèvent une erreur */ }
return '';
}
function recorderOptions(mime) {
var options = { audioBitsPerSecond: 128000 };
if (mime) options.mimeType = mime;
return options;
}
function startMeter(a) {
var Ctx = root.AudioContext || root.webkitAudioContext;
a.audioCtx = new Ctx();
a.source = a.audioCtx.createMediaStreamSource(a.stream);
a.analyser = a.audioCtx.createAnalyser();
a.analyser.fftSize = 1024;
a.analyser.smoothingTimeConstant = 0.55;
a.gain = a.audioCtx.createGain();
a.gain.gain.value = 0;
a.source.connect(a.analyser);
a.analyser.connect(a.gain);
a.gain.connect(a.audioCtx.destination);
a.buf = new Float32Array(a.analyser.fftSize);
if (a.audioCtx.resume) {
try { a.audioCtx.resume(); } catch (e) { /* ignore */ }
}
}
function startMonitor(a) {
if (!a.analyser) {
a.timer = setTimeout(function () { stopCapture(a); }, a.maxMs);
return;
}
a.noiseFloor = 0.004;
a.ticker = setInterval(function () {
if (active !== a) return;
var now = Date.now();
var elapsed = now - a.startedAt;
try { a.analyser.getFloatTimeDomainData(a.buf); } catch (e) { return; }
var sum = 0;
for (var i = 0; i < a.buf.length; i++) sum += a.buf[i] * a.buf[i];
var rms = Math.sqrt(sum / a.buf.length);
if (elapsed < 500) a.noiseFloor = a.noiseFloor * 0.85 + rms * 0.15;
var threshold = Math.max(0.008, a.noiseFloor * 2.8);
if (rms > threshold) {
a.speechStarted = true;
a.lastVoiceAt = now;
}
var level = Math.min(1, rms / 0.12);
if (a.onLevel) {
try { a.onLevel(level, { elapsed: elapsed, voiced: !!a.speechStarted && now - a.lastVoiceAt < 350, rms: rms }); } catch (e) { /* ignore */ }
}
if (a.speechStarted && now - a.lastVoiceAt >= a.silenceMs && elapsed >= 900) {
stopCapture(a);
return;
}
if (elapsed >= a.maxMs) stopCapture(a);
}, 80);
a.timer = setTimeout(function () { stopCapture(a); }, a.maxMs + 80);
}
function stopCapture(a) {
if (!a || active !== a || a.stopping) return;
a.stopping = true;
clearTimers(a);
if (a.recorder && a.recorder.state !== 'inactive') {
try { a.recorder.stop(); } catch (e) { processAudio(a); }
} else {
processAudio(a);
}
}
function decode(blob) {
return blob.arrayBuffer().then(function (buffer) {
var Ctx = root.AudioContext || root.webkitAudioContext;
var ctx = new Ctx();
return ctx.decodeAudioData(buffer).then(function (audio) {
try { ctx.close(); } catch (e) { /* ignore */ }
return audio;
}, function (err) {
try { ctx.close(); } catch (e) { /* ignore */ }
throw err;
});
});
}
function render16k(audio) {
var Offline = root.OfflineAudioContext || root.webkitOfflineAudioContext;
var length = Math.max(1, Math.ceil(audio.duration * SAMPLE_RATE));
var offline = new Offline(1, length, SAMPLE_RATE);
var source = offline.createBufferSource();
source.buffer = audio;
var highpass = offline.createBiquadFilter();
highpass.type = 'highpass';
highpass.frequency.value = 80;
highpass.Q.value = 0.7;
source.connect(highpass);
highpass.connect(offline.destination);
source.start();
return offline.startRendering().then(function (result) {
return result.getChannelData(0);
});
}
function clean(data) {
var n = data.length;
if (n < SAMPLE_RATE * 0.2) throw new Error('Enregistrement trop court. Parle un peu plus longtemps.');
var mean = 0;
var i;
for (i = 0; i < n; i++) mean += data[i];
mean /= n;
var peak = 0;
for (i = 0; i < n; i++) {
var value = Math.abs(data[i] - mean);
if (value > peak) peak = value;
}
if (peak < 0.004) throw new Error('Aucun son détecté. Rapproche-toi du micro et réessaie.');
var frame = Math.max(1, Math.round(SAMPLE_RATE * 0.02));
var gate = Math.max(0.0035, peak * 0.04);
var first = -1;
var last = -1;
for (i = 0; i < n; i += frame) {
var end = Math.min(n, i + frame);
var sum = 0;
var count = 0;
for (var j = i; j < end; j++) {
var sample = data[j] - mean;
sum += sample * sample;
count++;
}
var rms = Math.sqrt(sum / Math.max(1, count));
if (rms > gate) {
if (first < 0) first = i;
last = end;
}
}
if (first < 0) throw new Error('Aucun son détecté. Rapproche-toi du micro et réessaie.');
var pad = Math.round(SAMPLE_RATE * 0.12);
first = Math.max(0, first - pad);
last = Math.min(n, last + pad);
if (last - first < SAMPLE_RATE * 0.25) throw new Error('Enregistrement trop court. Parle un peu plus longtemps.');
var out = new Float32Array(last - first);
var peak2 = 0;
for (i = 0; i < out.length; i++) {
var cleaned = data[first + i] - mean;
out[i] = cleaned;
var absolute = Math.abs(cleaned);
if (absolute > peak2) peak2 = absolute;
}
var gain = peak2 > 0.0001 ? Math.min(8, 0.92 / peak2) : 1;
if (gain !== 1) {
for (i = 0; i < out.length; i++) out[i] *= gain;
}
return out;
}
function prepare(blob) {
return decode(blob).then(render16k).then(clean);
}
function processAudio(a) {
if (!a || active !== a || a.processing) return;
a.processing = true;
clearTimers(a);
var blob = new Blob(a.chunks, { type: a.mime || 'audio/webm' });
a.chunks = [];
a.recorder = null;
stopTracks(a.stream);
a.stream = null;
closeAudio(a);
if (!blob.size) {
fail(a, 'L’enregistrement est vide. Réessaie en parlant dès le début.', false);
return;
}
emit(a, 'transcribing', 'Transcription en cours…');
prepare(blob).then(function (audio) {
if (active !== a) return;
try {
ensureWorker(a);
a.requestId = ++requestId;
worker.postMessage({ type: 'transcribe', id: a.requestId, audio: audio.buffer }, [audio.buffer]);
} catch (err) {
fail(a, 'Impossible de démarrer le moteur IA.', true);
}
}).catch(function (err) {
fail(a, err && err.message ? err.message : 'Impossible de lire l’enregistrement audio.', false);
});
}
function stop() {
if (active) stopCapture(active);
}
function abort() {
var a = active;
if (!a) return;
active = null;
clearTimers(a);
if (a.recorder && a.recorder.state !== 'inactive') {
try { a.recorder.stop(); } catch (e) { /* ignore */ }
}
a.recorder = null;
stopTracks(a.stream);
a.stream = null;
closeAudio(a);
rejectActive(a, 'Reconnaissance annulée.');
}
function listen(options) {
var opts = options || {};
if (!supported()) return Promise.reject(new Error('La reconnaissance IA locale n’est pas disponible dans ce navigateur.'));
abort();
return new Promise(function (resolve, reject) {
var a = {
resolve: resolve,
reject: reject,
onStatus: opts.onStatus,
onProgress: opts.onProgress,
onLevel: opts.onLevel,
maxMs: Math.max(4000, Math.min(20000, Number(opts.maxMs) || DEFAULT_MAX_MS)),
silenceMs: Math.max(600, Math.min(3000, Number(opts.silenceMs) || DEFAULT_SILENCE_MS)),
requestId: 0,
settled: false,
speechStarted: false,
lastVoiceAt: 0,
noiseFloor: 0.004,
startedAt: 0,
chunks: [],
recorder: null,
stream: null,
audioCtx: null,
mime: '',
stopping: false,
processing: false
};
active = a;
root.navigator.mediaDevices.getUserMedia({
audio: {
channelCount: { ideal: 1 },
sampleRate: { ideal: SAMPLE_RATE },
echoCancellation: true,
noiseSuppression: true,
autoGainControl: true
},
video: false
}).then(function (mediaStream) {
if (active !== a) { stopTracks(mediaStream); return; }
a.stream = mediaStream;
try { startMeter(a); } catch (e) { closeAudio(a); }
var mime = chooseMime();
var recorder;
try {
recorder = new root.MediaRecorder(mediaStream, recorderOptions(mime));
} catch (e) {
try { recorder = new root.MediaRecorder(mediaStream); } catch (e2) {
fail(a, 'Impossible de démarrer l’enregistrement audio.', false);
return;
}
}
a.recorder = recorder;
a.mime = recorder.mimeType || mime || 'audio/webm';
recorder.ondataavailable = function (event) {
if (event.data && event.data.size) a.chunks.push(event.data);
};
recorder.onstop = function () { if (active === a) processAudio(a); };
recorder.onerror = function () { fail(a, 'L’enregistrement audio a été interrompu.', false); };
try {
recorder.start(250);
} catch (e) {
fail(a, 'Impossible de démarrer l’enregistrement audio.', false);
return;
}
a.startedAt = Date.now();
emit(a, 'recording', 'Parle maintenant…');
startMonitor(a);
}).catch(function (err) {
var name = err && err.name;
var message = name === 'NotAllowedError' || name === 'SecurityError'
? 'Micro refusé. Autorise le microphone puis réessaie.'
: (name === 'NotFoundError' ? 'Aucun micro détecté. Vérifie ton matériel.' : 'Micro inaccessible. Autorise le microphone puis réessaie.');
fail(a, message, false);
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
