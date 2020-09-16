export const synth = window.speechSynthesis;

/**
 * @returns SpeechSynthesisVoice[]
 */
export const getVoices = () => {
	return synth.getVoices().sort();
};

/**
 * @param {{ input, voice: SpeechSynthesisVoice, pitch, rate }} request
 * @returns Promise
 */
export const speak = request => {
	if (!request.input) return Promise.resolve(); // nothing to speak

	return new Promise((resolve, reject) => {
		const utterance = new SpeechSynthesisUtterance(request.input);
		utterance.onend = resolve;
		utterance.onerror = reject;
		utterance.voice = request.voice;
		utterance.pitch = request.pitch ?? 1; // 0 - 2
		utterance.rate = request.rate ?? 1; // 0.5 - 2

		synth.speak(utterance);
	});
};
