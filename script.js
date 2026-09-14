const stage = document.querySelector("#stage");
const displayText = document.querySelector("#displayText");
const textInput = document.querySelector("#textInput");
const fullscreenBtn = document.querySelector("#fullscreenBtn");
const fontFamily = document.querySelector("#fontFamily");
const fontWeight = document.querySelector("#fontWeight");
const textStyle = document.querySelector("#textStyle");
const animationStyle = document.querySelector("#animationStyle");
const animationSpeed = document.querySelector("#animationSpeed");
const fontSize = document.querySelector("#fontSize");
const textColor = document.querySelector("#textColor");
const backgroundColor = document.querySelector("#backgroundColor");
const autoFit = document.querySelector("#autoFit");
const uppercase = document.querySelector("#uppercase");
const positionButtons = document.querySelectorAll("[data-position]");
const validAnimations = new Set([
  "none",
  "cinematic",
  "lower-third",
  "typewriter",
  "ticker",
  "neon",
  "spotlight",
  "drift",
  "beat",
]);
const validTextStyles = new Set([
  "clean",
  "shadow",
  "outline",
  "soft-glow",
  "neon-outline",
  "gradient",
  "caption-box",
  "highlight",
  "glass",
]);

const saved = JSON.parse(localStorage.getItem("fullScreenTextSettings") || "{}");
const animationAliases = {
  fade: "cinematic",
  slide: "lower-third",
  pulse: "beat",
  zoom: "cinematic",
  float: "drift",
};

if (saved.animationStyle) {
  saved.animationStyle = animationAliases[saved.animationStyle] || saved.animationStyle;
}

const settings = {
  text: "Your text goes here",
  fontFamily: "Inter, Arial, sans-serif",
  fontWeight: "700",
  textStyle: "clean",
  animationStyle: "none",
  animationSpeed: "slow",
  fontSize: "92",
  textColor: "#ffffff",
  backgroundColor: "#050505",
  position: "center",
  autoFit: true,
  uppercase: false,
  ...saved,
};

function saveSettings() {
  localStorage.setItem("fullScreenTextSettings", JSON.stringify(settings));
}

function fitText() {
  displayText.style.fontSize = `${settings.fontSize}px`;

  if (!settings.autoFit || settings.animationStyle === "ticker") {
    return;
  }

  const minSize = 24;
  let size = Number(settings.fontSize);
  const availableWidth = stage.clientWidth - 2;
  const availableHeight = stage.clientHeight - 2;

  while (
    size > minSize &&
    (displayText.scrollWidth > availableWidth || displayText.scrollHeight > availableHeight)
  ) {
    size -= 2;
    displayText.style.fontSize = `${size}px`;
  }
}

function applySettings() {
  const text = settings.text.trim() || "Your text goes here";

  displayText.textContent = settings.uppercase ? text.toUpperCase() : text;
  displayText.style.fontFamily = settings.fontFamily;
  displayText.style.fontWeight = settings.fontWeight;
  displayText.style.color = settings.textColor;
  displayText.style.setProperty("--animation-duration", getAnimationDuration());
  stage.style.backgroundColor = settings.backgroundColor;

  if (!validAnimations.has(settings.animationStyle)) {
    settings.animationStyle = "none";
  }

  if (!validTextStyles.has(settings.textStyle)) {
    settings.textStyle = "clean";
  }

  displayText.className = "display-text";
  if (settings.textStyle !== "clean") {
    displayText.classList.add(`style-${settings.textStyle}`);
  }

  if (settings.animationStyle !== "none") {
    displayText.classList.add(`animate-${settings.animationStyle}`);
  }

  stage.classList.toggle("position-top", settings.position === "top");
  stage.classList.toggle("position-bottom", settings.position === "bottom");

  textInput.value = settings.text;
  fontFamily.value = settings.fontFamily;
  fontWeight.value = settings.fontWeight;
  textStyle.value = settings.textStyle;
  animationStyle.value = settings.animationStyle;
  animationSpeed.value = settings.animationSpeed;
  fontSize.value = settings.fontSize;
  textColor.value = settings.textColor;
  backgroundColor.value = settings.backgroundColor;
  autoFit.checked = settings.autoFit;
  uppercase.checked = settings.uppercase;

  positionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.position === settings.position);
  });

  requestAnimationFrame(fitText);
  saveSettings();
}

function updateSetting(key, value) {
  settings[key] = value;
  applySettings();
}

function getAnimationDuration() {
  const durations = {
    cinematic: { slow: "8s", normal: "6s", fast: "4s" },
    "lower-third": { slow: "6s", normal: "4s", fast: "2.8s" },
    typewriter: { slow: "9s", normal: "6s", fast: "4s" },
    ticker: { slow: "22s", normal: "15s", fast: "9s" },
    neon: { slow: "5s", normal: "3.5s", fast: "2.2s" },
    spotlight: { slow: "7s", normal: "5s", fast: "3s" },
    drift: { slow: "8s", normal: "5.5s", fast: "3.5s" },
    beat: { slow: "3.5s", normal: "2.4s", fast: "1.4s" },
  };

  return durations[settings.animationStyle]?.[settings.animationSpeed] || "4s";
}

textInput.addEventListener("input", (event) => updateSetting("text", event.target.value));
fontFamily.addEventListener("change", (event) => updateSetting("fontFamily", event.target.value));
fontWeight.addEventListener("change", (event) => updateSetting("fontWeight", event.target.value));
textStyle.addEventListener("change", (event) => updateSetting("textStyle", event.target.value));
animationStyle.addEventListener("change", (event) => updateSetting("animationStyle", event.target.value));
animationSpeed.addEventListener("change", (event) => updateSetting("animationSpeed", event.target.value));
fontSize.addEventListener("input", (event) => updateSetting("fontSize", event.target.value));
textColor.addEventListener("input", (event) => updateSetting("textColor", event.target.value));
backgroundColor.addEventListener("input", (event) => updateSetting("backgroundColor", event.target.value));
autoFit.addEventListener("change", (event) => updateSetting("autoFit", event.target.checked));
uppercase.addEventListener("change", (event) => updateSetting("uppercase", event.target.checked));

positionButtons.forEach((button) => {
  button.addEventListener("click", () => updateSetting("position", button.dataset.position));
});

fullscreenBtn.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await stage.requestFullscreen();
    return;
  }

  await document.exitFullscreen();
});

document.addEventListener("fullscreenchange", () => {
  const isFullscreen = Boolean(document.fullscreenElement);
  fullscreenBtn.title = isFullscreen ? "Exit full screen" : "Enter full screen";
  fullscreenBtn.querySelector("span").textContent = isFullscreen ? "Exit" : "Full Screen";
  requestAnimationFrame(fitText);
});

window.addEventListener("resize", fitText);
applySettings();
