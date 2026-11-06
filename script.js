const opening = document.getElementById("opening");
const openButton = document.getElementById("open-invitation");
const invitation = document.getElementById("invitation");
const weddingMusic = document.getElementById("wedding-music");
const musicToggle = document.getElementById("music-toggle");
const musicLabel = document.getElementById("music-label");
const musicStatus = document.getElementById("music-status");

document.body.classList.add("is-opening");

const guestName = new URLSearchParams(window.location.search).get("to");
if (guestName) {
  document.getElementById("guest-name").textContent = guestName.slice(0, 80);
}

openButton.addEventListener("click", () => {
  if (opening.classList.contains("is-open")) {
    return;
  }

  openButton.disabled = true;
  startWeddingMusic();
  opening.classList.add("is-open");
  invitation.setAttribute("aria-hidden", "false");
  invitation.classList.add("is-visible");
  document.body.classList.add("motion-ready");
  startPageMotion();
  window.setTimeout(() => {
    opening.hidden = true;
    document.body.classList.remove("is-opening");
  }, 1700);
});

function updateMusicButton(isPlaying) {
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Jeda musik undangan" : "Putar musik undangan");
  musicLabel.textContent = isPlaying ? "Jeda musik" : "Putar musik";
}

function startWeddingMusic() {
  weddingMusic.play().then(() => {
    updateMusicButton(true);
    musicStatus.textContent = "";
  }).catch(() => {
    updateMusicButton(false);
    musicStatus.textContent = "Browser memblokir putar otomatis. Tekan “Buka Undangan” agar musik mulai.";
  });
}

musicToggle.addEventListener("click", () => {
  if (weddingMusic.paused) {
    startWeddingMusic();
    return;
  }

  weddingMusic.pause();
  updateMusicButton(false);
  musicStatus.textContent = "";
});

function startPageMotion() {
  const progressBar = document.getElementById("scroll-progress");
  let progressFrame = 0;
  const updateScrollProgress = () => {
    if (progressFrame) {
      return;
    }

    progressFrame = window.requestAnimationFrame(() => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      progressFrame = 0;
    });
  };
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);

  const revealTargets = document.querySelectorAll(
    ".section__inner > *, .couple__person, .couple__ampersand, .event__card article, .gallery__caption > *, .gift-card, .wishes__form > *, .footer > *"
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 5) * 90}ms`);
    if (element.matches(".couple__person, .gift-card") && index % 2 === 0) {
      element.classList.add("reveal--left");
    } else if (element.matches(".couple__person, .gift-card")) {
      element.classList.add("reveal--right");
    }
  });

  const hero = document.querySelector(".hero");
  const petals = document.createElement("div");
  petals.className = "hero__petals";
  petals.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 32; index += 1) {
    const petal = document.createElement("span");
    petal.style.setProperty("--left", `${(index * 37 + 9) % 100}%`);
    petal.style.setProperty("--size", `${7 + (index % 4) * 2}px`);
    petal.style.setProperty("--duration", `${11 + (index % 5) * 2}s`);
    petal.style.setProperty("--delay", `${-((index * 3) % 16)}s`);
    petal.style.setProperty("--sway", `${index % 2 === 0 ? "" : "-"}${16 + (index % 4) * 8}px`);
    petal.style.setProperty("--spin", `${index % 2 === 0 ? "" : "-"}${220 + index * 23}deg`);
    petals.append(petal);
  }
  hero.append(petals);

  const ambient = document.createElement("div");
  ambient.className = "ambient-motion";
  ambient.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 18; index += 1) {
    const petal = document.createElement("span");
    petal.className = "ambient-motion__petal";
    petal.style.setProperty("--left", `${(index * 29 + 7) % 100}%`);
    petal.style.setProperty("--size", `${8 + (index % 4) * 2}px`);
    petal.style.setProperty("--duration", `${13 + (index % 6) * 2}s`);
    petal.style.setProperty("--delay", `${-((index * 5) % 19)}s`);
    petal.style.setProperty("--sway", `${index % 2 === 0 ? "" : "-"}${18 + (index % 5) * 9}px`);
    petal.style.setProperty("--spin", `${index % 2 === 0 ? "" : "-"}${240 + index * 19}deg`);
    ambient.append(petal);
  }
  for (let index = 0; index < 18; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "ambient-motion__sparkle";
    sparkle.style.setProperty("--left", `${(index * 43 + 11) % 100}%`);
    sparkle.style.setProperty("--top", `${(index * 31 + 8) % 100}%`);
    sparkle.style.setProperty("--size", `${2 + (index % 3)}px`);
    sparkle.style.setProperty("--duration", `${2.4 + (index % 5) * 0.7}s`);
    sparkle.style.setProperty("--delay", `${-((index * 7) % 12)}s`);
    ambient.append(sparkle);
  }
  document.body.append(ambient);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((element) => element.classList.add("is-in-view"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-in-view"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  revealTargets.forEach((element) => observer.observe(element));
}

const weddingDate = new Date("2026-11-22T08:00:00+07:00").getTime();
const countdownFields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

function updateCountdown() {
  const remaining = weddingDate - Date.now();
  const secondsRemaining = Math.max(0, Math.floor(remaining / 1000));
  const values = {
    days: Math.floor(secondsRemaining / 86400),
    hours: Math.floor((secondsRemaining % 86400) / 3600),
    minutes: Math.floor((secondsRemaining % 3600) / 60),
    seconds: secondsRemaining % 60
  };

  Object.entries(values).forEach(([unit, value]) => {
    const field = countdownFields[unit];
    const nextValue = String(value).padStart(2, "0");
    if (field.textContent !== nextValue) {
      field.textContent = nextValue;
      field.classList.remove("is-ticking");
      void field.offsetWidth;
      field.classList.add("is-ticking");
    }
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const calendarButton = document.getElementById("calendar-button");
const calendarText = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Dita Imam//Undangan Pernikahan//ID",
  "CALSCALE:GREGORIAN",
  "BEGIN:VEVENT",
  "UID:dita-imam-20261122@undangan",
  "DTSTAMP:20261105T000000Z",
  "DTSTART:20261122T010000Z",
  "SUMMARY:Akad dan Resepsi Dita & Imam",
  "DESCRIPTION:Akad dan resepsi pernikahan Dita dan Imam. Pukul 08.00 WIB.",
  "LOCATION:Dusun Rimba Mulya, Desa Tambang Emas A1, Merangin, Jambi",
  "URL:https://www.google.com/maps/search/?api=1&query=Devan+jf%2C+Q9VF%2B8V6%2C+Tambang+Emas%2C+Kec.+Pamenang+Sel.%2C+Kabupaten+Merangin%2C+Jambi+37352",
  "END:VEVENT",
  "END:VCALENDAR"
].map((line) => line.match(/.{1,73}/g)?.join("\r\n ") || line).join("\r\n");
calendarButton.href = URL.createObjectURL(new Blob([calendarText], { type: "text/calendar;charset=utf-8" }));

document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      document.getElementById("copy-status").textContent = "Nomor berhasil disalin.";
    } catch (error) {
      document.getElementById("copy-status").textContent = "Nomor: " + button.dataset.copy;
    }
  });
});

const wishesForm = document.getElementById("wishes-form");
const wishesList = document.getElementById("wishes-list");
const wishesNotice = document.getElementById("wishes-notice");
const wishesStorageKey = "dwi-imam-wishes";

function loadWishes() {
  try {
    const savedWishes = JSON.parse(localStorage.getItem(wishesStorageKey) || "[]");
    if (!Array.isArray(savedWishes)) {
      throw new TypeError("Saved wishes must be an array.");
    }
    savedWishes.slice(-20).reverse().forEach(addWishCard);
  } catch (error) {
    wishesNotice.textContent = "Ucapan tersimpan di perangkat ini belum dapat dimuat.";
  }
}

function addWishCard(wish) {
  const card = document.createElement("article");
  card.className = "wish-card";
  const name = document.createElement("strong");
  name.textContent = wish.name;
  const message = document.createElement("p");
  message.textContent = wish.message;
  card.append(name, message);
  wishesList.append(card);
}

wishesForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(wishesForm);
  const wish = {
    name: String(formData.get("name")).trim(),
    message: String(formData.get("message")).trim()
  };
  if (!wish.name || !wish.message) {
    wishesNotice.textContent = "Mohon isi nama dan ucapan terlebih dahulu.";
    return;
  }

  try {
    const savedWishes = JSON.parse(localStorage.getItem(wishesStorageKey) || "[]");
    if (!Array.isArray(savedWishes)) {
      throw new TypeError("Saved wishes must be an array.");
    }
    savedWishes.push(wish);
    localStorage.setItem(wishesStorageKey, JSON.stringify(savedWishes.slice(-20)));
    addWishCard(wish);
    wishesForm.reset();
    wishesNotice.textContent = "Ucapan tersimpan di browser ini. Ucapan belum terkirim ke keluarga mempelai.";
  } catch (error) {
    wishesNotice.textContent = "Ucapan tidak dapat disimpan di perangkat ini. Silakan coba kembali.";
  }
});

loadWishes();
