const root = document.documentElement;
const body = document.body;
const gate = document.getElementById("gate");
const switchSide = document.getElementById("switchSide");
const progress = document.getElementById("progress");
const cursorLight = document.getElementById("cursorLight");

function setSide(side) {
  root.dataset.side = side;
}

function enter(side, target) {
  setSide(side);
  gate.classList.add("hide");
  body.classList.remove("locked");
  setTimeout(() => {
    const el = document.querySelector(target || (side === "black" ? "#black-dragon" : "#white-dragon"));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 260);
}

gate.querySelectorAll("[data-side]").forEach((btn) => {
  btn.addEventListener("click", () => enter(btn.dataset.side, btn.dataset.target));
});

const blackGate = gate.querySelector(".gate-black");
const whiteGate = gate.querySelector(".gate-white");

blackGate.addEventListener("mouseenter", () => {
  gate.classList.add("black-open");
  gate.classList.remove("white-open");
  gate.style.setProperty("--black-width", "66.666%");
});
whiteGate.addEventListener("mouseenter", () => {
  gate.classList.add("white-open");
  gate.classList.remove("black-open");
  gate.style.setProperty("--black-width", "33.333%");
});
gate.addEventListener("mouseleave", () => {
  gate.classList.remove("black-open", "white-open");
  gate.style.setProperty("--black-width", "50%");
});

switchSide.addEventListener("click", () => {
  const next = root.dataset.side === "black" ? "white" : "black";
  setSide(next);
  const el = document.querySelector(next === "black" ? "#black-dragon" : "#white-dragon");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll(".gallery-jump").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.gallery === "black" ? "#black-details" : "#white-details";
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.width = `${ratio * 100}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

window.addEventListener("pointermove", (event) => {
  cursorLight.style.left = `${event.clientX}px`;
  cursorLight.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const productObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const product = entry.target.dataset.product;
    if (product) setSide(product);
  });
}, { threshold: 0.36 });

document.querySelectorAll("[data-product]").forEach((el) => productObserver.observe(el));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !gate.classList.contains("hide")) {
    enter("black", "#black-dragon");
  }
});
