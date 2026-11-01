/* Kotoba — worker Whisper local via Transformers.js. */
var currentId = 0;
var transformers = null;
var transcriber = null;
function progressMessage(data) {
var pct = Math.max(0, Math.min(100, Math.round(Number(data && data.progress) || 0)));
var file = data && data.file ? String(data.file).split('/').pop() : '';
self.postMessage({
type: 'progress',
id: currentId,
progress: pct,
message: file ? ('Modèle IA : ' + file + ' (' + pct + ' %)') : 'Chargement du modèle IA…'
});
}
async function getTranscriber() {
if (!transformers) transformers = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
if (!transcriber) {
transformers.env.allowLocalModels = false;
transformers.env.useBrowserCache = true;
transcriber = await transformers.pipeline('automatic-speech-recognition', 'onnx-community/whisper-base', {
dtype: 'q8',
progress_callback: progressMessage
});
}
return transcriber;
}
self.onmessage = async function (event) {
var data = event.data || {};
if (data.type !== 'transcribe') return;
currentId = data.id;
try {
var pipe = await getTranscriber();
self.postMessage({ type: 'progress', id: currentId, progress: 100, message: 'Transcription…' });
var output = await pipe(new Float32Array(data.audio), {
language: 'japanese',
task: 'transcribe',
chunk_length_s: 30,
stride_length_s: 5,
num_beams: 3,
no_repeat_ngram_size: 3,
return_timestamps: false
});
var text = output && typeof output.text === 'string' ? output.text : (Array.isArray(output) && output[0] ? output[0].text : '');
self.postMessage({ type: 'result', id: currentId, text: text || '' });
} catch (err) {
self.postMessage({ type: 'error', id: currentId, message: 'Whisper n’a pas pu transcrire : ' + (err && err.message ? err.message : 'erreur inconnue') });
}
};
