//cursor
const words = [
  "M",
  "a",
  "j",
  "o",
  "r",
  "T",
  "h",
  "e",
  "o",
  "r",
  "y",
  "3",
  "1",

];

const style = {
  fontFamily: "'Apple Chancery', sans-serif", // any font you've loaded (see note below)
  fontSize: "30px",
  color: "#f3008f",
  fontWeight: "400",
};



const distance = 80; // pixels the mouse must move before a new word appears
// --------------------

let index = 0;
let lastX = 0;
let lastY = 0;

window.addEventListener("mousemove", (e) => {
  if (Math.hypot(e.clientX - lastX, e.clientY - lastY) < distance) return;

  lastX = e.clientX;
  lastY = e.clientY;

  const el = document.createElement("span");
  el.textContent = words[index];
  el.className = "trail-img"; // reuses your existing CSS animation
  el.style.fontFamily = style.fontFamily;
  el.style.fontSize = style.fontSize;
  el.style.color = style.color;
  el.style.fontWeight = style.fontWeight;
  el.style.setProperty("--x", e.clientX + "px");
  el.style.setProperty("--y", e.clientY + "px");
  el.style.setProperty("--r", (Math.random() * 6 - 3) + "deg");
  el.addEventListener("animationend", () => el.remove());
  document.body.appendChild(el);

  index = (index + 1) % words.length;
});





//dropdown

const dropdown = document.querySelector(".dropdown");
const menu = document.getElementById("menu");

menu.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("open");
});

// close when clicking anywhere else
document.addEventListener("click", () => {
  dropdown.classList.remove("open");
});




//class narratives: scroll to the text + swap between classes

const narrative = document.getElementById("narrative");
const entries = document.querySelectorAll(".entry");
const classLinks = document.querySelectorAll(".dropdown-content a[data-class]");

function showClass(n) {
  const target = document.getElementById("class-" + n);
  if (!target) return;

  entries.forEach((entry) => entry.classList.toggle("active", entry === target));

  // smooth scroll down to the text block (does nothing if already there)
  narrative.scrollIntoView({ behavior: "smooth", block: "start" });
}

classLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const n = link.dataset.class;
    showClass(n);
    history.replaceState(null, "", "#class-" + n);
  });
});

// opening index.html#class-3 directly
const match = location.hash.match(/^#class-(\d+)$/);
if (match) {
  window.addEventListener("load", () => showClass(match[1]));
}




//pixel heart 



const img = document.getElementById('napkin');
const wrap = img.parentElement;

const MAX_BLOCK = 10;  
const EASE = 0.04;     

const canvas = document.createElement('canvas');
canvas.className = 'pixel-canvas';
wrap.appendChild(canvas);
const ctx = canvas.getContext('2d');

const small = document.createElement('canvas'); 
const sctx = small.getContext('2d');

let block = 1;
let target = 1;
let raf;

function render() {
  const w = Math.max(1, Math.round(canvas.width / block));
  const h = Math.max(1, Math.round(canvas.height / block));

  small.width = w;
  small.height = h;
  sctx.drawImage(img, 0, 0, w, h);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
}

function tick() {
  block += (target - block) * EASE;
  if (Math.abs(target - block) < 0.05) block = target;

  render();

  if (block !== target) {
    raf = requestAnimationFrame(tick);
  } else if (target === 1) {
    wrap.classList.remove('is-pixelated'); 
  }
}

function start(newTarget) {
  target = newTarget;
  if (target > 1) wrap.classList.add('is-pixelated');
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
}

function init() {
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  wrap.addEventListener('mouseenter', () => start(MAX_BLOCK));
  wrap.addEventListener('mouseleave', () => start(1));
}

if (img.complete) init();
else img.addEventListener('load', init);