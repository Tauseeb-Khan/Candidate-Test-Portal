/**
 * Scholars' Group of Institutions - Candidate Test Portal
 *
 * What this file does:
 *   1. Holds the Google Form links (the only thing you normally need to edit).
 *   2. Opens a popup when a test card is clicked.
 *   3. Opens the selected Google Form in a new tab when the popup button is clicked.
 *   4. Adds small visual effects (bubbles, header shadow, scroll reveal).
 */
"use strict";

/* ==========================================================================
   1. CONFIGURATION
   Keys must match the data-type attribute of the cards in index.html.
   ========================================================================== */
const FORMS = {
  teaching: {
    title: "Teaching Staff Test",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSfIYVvuVOCT6c23o1S5pG5LvPZk2mAioksnDZZ3LIAR4kSVkg/viewform?usp=publish-editor"
  },
  nonteaching: {
    title: "Non-Teaching Staff Test",
    url: "https://docs.google.com/forms/d/e/1FAIpQLScjtplbDRbDLAmoYGT2tgzn8q_jsogs506pd5XykEmzsHCfPg/viewform?usp=publish-editor"
  }
};

const POPUP_DELAY_MS = 380;      // popup appears while the click ripple is still expanding
const BUTTON_FEEDBACK_MS = 800;  // length of the "opening" animation on the popup button

/* ==========================================================================
   2. ELEMENT REFERENCES
   ========================================================================== */
const modal         = document.getElementById("modal");
const popupTitle    = document.getElementById("popup-title");
const closeButton   = document.getElementById("popup-close");
const openButton    = document.getElementById("open-test-btn");
const openLabel     = document.getElementById("open-test-label");
const fallbackLink  = document.getElementById("fallback-link");
const cards         = document.querySelectorAll(".card");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==========================================================================
   3. STATE
   ========================================================================== */
let activeForm = null;   // the FORMS entry of the card that was clicked
let lastCard = null;     // card to give focus back to when the popup closes

/* ==========================================================================
   4. POPUP
   ========================================================================== */

/** Expanding colour circle that starts at the click position. */
function playRipple(card, event) {
  const rect = card.getBoundingClientRect();
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;

  const ripple = document.createElement("div");
  ripple.className = "ripple";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.style.background = card.classList.contains("card--nonteaching") ? "#00602F" : "#142A8F";

  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 950);
}

/** Shows the popup for the clicked card. */
function openPopup(type, card, event) {
  activeForm = FORMS[type];
  lastCard = card;

  popupTitle.textContent = activeForm.title;
  modal.dataset.theme = type;               // lets CSS colour the popup per test type

  // reset the button in case the popup was used before
  openButton.className = "test-btn";
  openLabel.textContent = "Open test in new tab";
  fallbackLink.hidden = true;

  playRipple(card, event);
  setTimeout(() => {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";  // stop the page scrolling behind the popup
    openButton.focus({ preventScroll: true });
  }, POPUP_DELAY_MS);
}

/** Hides the popup and returns focus to the card. */
function closePopup() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
  if (lastCard) lastCard.focus({ preventScroll: true });
}

/**
 * Opens the Google Form in a new tab.
 * window.open must run directly inside the click handler,
 * otherwise browsers treat it as a pop-up and block it.
 */
function openTest() {
  if (!activeForm || !activeForm.url) return;
  if (openButton.classList.contains("is-busy")) return;

  const tab = window.open(activeForm.url, "_blank");
  if (tab) tab.opener = null;               // the form page gets no access to this page

  // small animation on the button while the new tab loads
  openButton.classList.add("is-busy");
  openLabel.textContent = "Opening your test...";

  setTimeout(() => {
    openButton.classList.remove("is-busy");
    openButton.classList.add("is-done");
    openLabel.textContent = tab ? "Test opened in a new tab" : "Use the link below to open the test";
    fallbackLink.href = activeForm.url;     // shown in case a pop-up blocker stopped the tab
    fallbackLink.hidden = false;
  }, BUTTON_FEEDBACK_MS);
}

/* ==========================================================================
   5. EVENT LISTENERS
   ========================================================================== */
cards.forEach((card) => {
  card.addEventListener("click", (event) => openPopup(card.dataset.type, card, event));

  // feeds the mouse position to the CSS spotlight effect
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", event.clientX - rect.left + "px");
    card.style.setProperty("--my", event.clientY - rect.top + "px");
  });
});

openButton.addEventListener("click", openTest);
closeButton.addEventListener("click", closePopup);
modal.addEventListener("click", (event) => { if (event.target === modal) closePopup(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closePopup();
});

/* ==========================================================================
   6. VISUAL EFFECTS
   ========================================================================== */

/** Floating bubbles in the hero (skipped when the user prefers reduced motion). */
function createBubbles(count) {
  const container = document.getElementById("bubbles");
  if (!container || prefersReducedMotion) return;

  for (let i = 0; i < count; i++) {
    const size = 8 + Math.random() * 28;
    const bubble = document.createElement("i");
    bubble.style.cssText =
      `left:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `--dx:${Math.random() * 80 - 40}px;` +
      `animation-duration:${12 + Math.random() * 14}s;` +
      `animation-delay:-${Math.random() * 20}s`;
    container.appendChild(bubble);
  }
}

/** Adds a shadow under the header once the page is scrolled. */
function watchHeaderShadow() {
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }, { passive: true });
}

/** Fades elements in one after another when they scroll into view. */
function revealOnScroll() {
  const items = document.querySelectorAll(".tip-item, .branches h3, .chips span");

  items.forEach((item) => {
    const position = Array.prototype.indexOf.call(item.parentNode.children, item);
    item.classList.add("reveal");
    item.style.setProperty("--delay", position * 0.09 + "s");
  });

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
}

createBubbles(7);
watchHeaderShadow();
revealOnScroll();
