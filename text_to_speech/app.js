const textInput = document.getElementById("text-input");
const voiceSelect = document.getElementById("voice-select");
const speedSlider = document.getElementById("speed-slider");
const pitchSlider = document.getElementById("pitch-slider");
const speedValue = document.getElementById("speed-value");
const pitchValue = document.getElementById("pitch-value");
const speakBtn = document.getElementById("speak-btn");
const stopBtn = document.getElementById("stop-btn");
const charCount = document.getElementById("char-count");
const status = document.getElementById("status");
const statusText = document.getElementById("status-text");

const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
  voices = synth.getVoices();

  if (voices.length === 0) {
    return;
  }

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  console.log(`Loaded ${voices.length} voices`);
}

function updateCharCount() {
  const count = textInput.value.length;
  charCount.textContent = count;
}

function updateSliderValues() {
  speedValue.textContent = speedSlider.value;
  pitchValue.textContent = pitchSlider.value;
}

function speak() {
  if (synth.speaking) {
    synth.cancel();
  }

  const text = textInput.value.trim();

  if (!text) {
    alert("Please enter some text to speak");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  const selectedVoiceIndex = voiceSelect.value;
  if (selectedVoiceIndex !== "") {
    utterance.voice = voices[selectedVoiceIndex];
  }

  utterance.rate = parseFloat(speedSlider.value);
  utterance.pitch = parseFloat(pitchSlider.value);
  utterance.volume = 1.0;

  utterance.onstart = () => {
    status.classList.add("speaking");
    statusText.textContent = "Speaking...";
    speakBtn.disabled = true;
    stopBtn.disabled = false;
  };

  utterance.onend = () => {
    status.classList.remove("speaking");
    statusText.textContent = "Ready";
    speakBtn.disabled = false;
    stopBtn.disabled = true;
  };

  utterance.onerror = (event) => {
    console.error("Speech synthesis error:", event);
    status.classList.remove("speaking");
    statusText.textContent = "Error occurred";
    speakBtn.disabled = false;
    stopBtn.disabled = true;
  };

  synth.speak(utterance);

  console.log("Speaking:", text.substring(0, 50) + "...");
}

function stop() {
  synth.cancel();
  status.classList.remove("speaking");
  statusText.textContent = "Stopped";
  speakBtn.disabled = false;
  stopBtn.disabled = true;
}

function init() {
  console.log("Text-to-Speech App initialized");

  loadVoices();

  synth.addEventListener("voiceschanged", loadVoices);

  textInput.addEventListener("input", updateCharCount);
  speedSlider.addEventListener("input", updateSliderValues);
  pitchSlider.addEventListener("input", updateSliderValues);

  speakBtn.addEventListener("click", speak);
  stopBtn.addEventListener("click", stop);

  updateCharCount();
  updateSliderValues();

  stopBtn.disabled = true;
}

document.addEventListener("DOMContentLoaded", init);
