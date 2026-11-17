/* Zips Barbershop — small, dependency-free interactions. */

// EDIT HERE: update these links when either barber's booking page changes.
const ZANE_BOOKING_URL = "https://squareup.com/appointments/book/LYZS0TGF51GWX";
const ISAAC_BOOKING_URL = "https://book.squareup.com/appointments/7y0a3xr014av8o/location/AB8HA30RYFWVM/services?utm_source=ig&utm_medium=social&utm_content=link_in_bio";
const FORMSPREE_ENDPOINT = "FORMSPREE_ENDPOINT";

// EDIT HERE: one centralized Google Maps destination used by every directions link.
const GOOGLE_MAPS_URL = "https://www.google.com/maps/dir/?api=1&destination=885+Cox+Creek+Pkwy%2C+Florence%2C+AL+35630";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector("#site-menu");
const bookingFeedback = document.querySelector("#booking-feedback");
const setupDialog = document.querySelector("#setup-dialog");
const setupDialogCopy = document.querySelector("#setup-dialog-copy");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

document.querySelectorAll("[data-directions]").forEach((link) => {
  link.href = GOOGLE_MAPS_URL;
});

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  siteMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle.addEventListener("click", () => {
  const isOpen = siteMenu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteMenu.querySelectorAll("a, button").forEach((item) => {
  item.addEventListener("click", () => {
    if (item.classList.contains("booking-trigger")) return;
    closeMenu();
  });
});

const bookingUrls = {
  zane: ZANE_BOOKING_URL,
  isaac: ISAAC_BOOKING_URL,
};

const showBookingSetupMessage = (barber) => {
  const name = barber === "zane" ? "Zane's" : barber === "isaac" ? "Isaac's" : "the barber's";
  setupDialogCopy.textContent = `Replace ${name} booking URL placeholder in script.js with the Square Appointments link. This button will then open it in a new tab.`;
  if (typeof setupDialog.showModal === "function") {
    setupDialog.showModal();
  } else {
    bookingFeedback.textContent = "Booking is being set up. Please call the shop to reserve a chair.";
  }
};

document.querySelectorAll("[data-barber]").forEach((control) => {
  const barber = control.dataset.barber;
  const bookingUrl = bookingUrls[barber];
  const hasBookingUrl = bookingUrl && !bookingUrl.includes("GOOGLE_BOOKING_URL");

  if (control instanceof HTMLAnchorElement) {
    control.href = hasBookingUrl ? bookingUrl : "#";
    if (hasBookingUrl) {
      control.target = "_blank";
      control.rel = "noopener noreferrer";
    }
  }

  control.addEventListener("click", (event) => {
    if (barber === "both") {
      document.querySelector("#barbers").scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
      return;
    }
    const url = bookingUrls[barber];
    if (!url || url.includes("GOOGLE_BOOKING_URL")) {
      event.preventDefault();
      showBookingSetupMessage(barber);
      return;
    }
    if (!(control instanceof HTMLAnchorElement)) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });
});

document.querySelectorAll("[data-dialog-close]").forEach((button) => {
  button.addEventListener("click", () => setupDialog.close());
});

setupDialog.addEventListener("click", (event) => {
  if (event.target === setupDialog) setupDialog.close();
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const experienceBaseline = new Date(2026, 10, 12);
const barberExperience = {
  zane: { years: 7 },
  isaac: { years: 10 },
};
const now = new Date();
let completedAnniversaries = now.getFullYear() - experienceBaseline.getFullYear();
const thisYearsAnniversary = new Date(
  now.getFullYear(),
  experienceBaseline.getMonth(),
  experienceBaseline.getDate(),
);
if (now < thisYearsAnniversary) completedAnniversaries -= 1;

document.querySelectorAll(".barber-card[data-barber]").forEach((card) => {
  const barber = barberExperience[card.dataset.barber];
  const experienceLabel = card.querySelector(".barber-pill span");
  if (!barber || !experienceLabel) return;
  experienceLabel.textContent = `${barber.years + Math.max(0, completedAnniversaries)}+ years\nbehind the chair`;
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.className = "form-status";
  if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT === "FORMSPREE_ENDPOINT") {
    formStatus.classList.add("error");
    formStatus.textContent = "The form is ready, but the Formspree endpoint still needs to be added in script.js.";
    return;
  }

  const submitButton = contactForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.firstChild.textContent = "Sending ";
  formStatus.textContent = "Sending your note…";

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Form submission failed");
    contactForm.reset();
    formStatus.classList.add("success");
    formStatus.textContent = "Thanks — your note is on its way. We will be in touch soon.";
  } catch (error) {
    formStatus.classList.add("error");
    formStatus.textContent = "Something went wrong. Please try again or email zanegarrett@zipsbarbershop.com.";
  } finally {
    submitButton.disabled = false;
    submitButton.firstChild.textContent = "Send message ";
  }
});