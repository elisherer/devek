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
    utterance.onerror = error => {
      if (error.error === "interrupted") {
        return resolve();
      }
      return reject();
    };
    utterance.voice = request.voice;
    utterance.pitch = request.pitch ?? 1; // 0 - 2
    utterance.rate = request.rate ?? 1; // 0.5 - 2

    synth.speak(utterance);
  });
};

export const recordSpeech = async (request, mimeType = "audio/webm") => {
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioOutput = devices.find(device => device.kind === "audiooutput");
  stream.getTracks().forEach(track => track.stop());
  if (audioOutput) {
    const constraints = {
      deviceId: {
        exact: audioOutput.deviceId
      }
    };
    stream = await navigator.mediaDevices.getUserMedia({
      audio: constraints
    });
  }

  const track = stream.getAudioTracks()[0];
  const mediaStream = new MediaStream();
  const mediaRecorder = new MediaRecorder(mediaStream, {
    mimeType,
    bitsPerSecond: 256 * 8 * 1024
  });

  mediaStream.addTrack(track);

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(request.input);

    const chunks = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    mediaRecorder.onstop = () => {
      track.stop();
      mediaStream.getAudioTracks()[0].stop();
      mediaStream.removeTrack(track);

      const blob = new Blob(chunks, {
        type: mimeType
      });
      resolve(URL.createObjectURL(blob));
    };
    mediaRecorder.start();

    utterance.onend = () => {
      mediaRecorder.stop();
    };
    utterance.onerror = error => {
      if (error.error === "interrupted") {
        return resolve();
      }
      return reject();
    };
    utterance.voice = request.voice;
    utterance.pitch = request.pitch ?? 1; // 0 - 2
    utterance.rate = request.rate ?? 1; // 0.5 - 2

    synth.speak(utterance);
  });
};
