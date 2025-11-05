// ======================================================
// 1️⃣ BERLIN LOCAL TIME
// ======================================================
function updateBerlinTime() {
  const berlinTime = new Date().toLocaleTimeString("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
  });
  const clock = document.getElementById("berlin-time");
  if (clock) clock.textContent = berlinTime;
}
updateBerlinTime();
setInterval(updateBerlinTime, 60000);

// ======================================================
// 2️⃣ MAIN APP LOGIC (safe inside DOMContentLoaded)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded");

// ---------- CONTACT FORM ----------
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill out all fields before submitting!");
      return;
    }

    alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon.`);
    contactForm.reset();
  });
}

  // ---------- SCROLL REVEAL ----------
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach((s) => observer.observe(s));

  const yearBlocks = document.querySelectorAll(".year-block");
  const observerHistory = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.2 }
);
yearBlocks.forEach((block) => observerHistory.observe(block));

  // ======================================================
  // 3️⃣ RECORDS (Dynamic + Filter)
  // ======================================================
  let allRecords = [];
  async function loadRecords() {
    try {
      const res = await fetch("data/records.json");
      allRecords = await res.json();
      renderRecords(allRecords);
    } catch (err) {
      console.error("Error loading records:", err);
    }
  }

  function renderRecords(records) {
    const list = document.getElementById("record-list");
    if (!list) return;
    list.innerHTML = "";
    records.forEach((r) => {
      const card = document.createElement("div");
      card.classList.add("record-card");
      card.innerHTML = `
        <img src="${r.image}" alt="${r.title}">
        <h3>${r.title}</h3>
        <p class="tag ${r.genre.toLowerCase()}">${r.genre}</p>
        <p class="price">€${r.price}</p>
      `;
      list.appendChild(card);
    });
  }

  const genreFilter = document.getElementById("genre-filter");
  if (genreFilter) {
    genreFilter.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "all") renderRecords(allRecords);
      else renderRecords(allRecords.filter(r => r.genre.toLowerCase() === val.toLowerCase()));
    });
  }
  loadRecords();

  // ======================================================
  // 4️⃣ EVENTS (Dynamic Rendering)
  // ======================================================
  async function loadEvents() {
    try {
      const res = await fetch("data/events.json");
      const events = await res.json();
      const list = document.getElementById("event-list");
      if (!list) return;
      list.innerHTML = "";
      events.forEach((ev) => {
        const card = document.createElement("div");
        card.classList.add("event-card");
        card.innerHTML = `
          <img src="${ev.image}" alt="${ev.title}">
          <div class="event-info">
            <h3>${ev.title}</h3>
            <p class="artist">🎧 Artist: ${ev.artist}</p>
            <p class="date">📅 ${ev.date}</p>
            <p class="time">🕒 ${ev.time}</p>
            <button class="book-btn">Book Tickets</button>
          </div>`;
        list.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading events:", err);
    }
  }
  loadEvents();

  // ======================================================
  // 5️⃣ BOOKING MODAL
  // ======================================================
  const modal = document.getElementById("booking-modal");
  const closeModal = document.getElementById("close-modal");
  const bookingForm = document.getElementById("booking-form");

  // open modal
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("book-btn")) {
      const card = e.target.closest(".event-card");
      if (!card || !modal) return;
      document.getElementById("event-name").value = card.querySelector("h3").textContent;
      document.getElementById("artist-name").value = card.querySelector(".artist").textContent.replace("🎧 Artist: ", "");
      document.getElementById("event-date").value = card.querySelector(".date").textContent.replace("📅 ", "");
      document.getElementById("event-time").value = card.querySelector(".time").textContent.replace("🕒 ", "");
      modal.style.display = "flex";
    }
  });

  // close modal
  if (closeModal) closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (modal && e.target === modal) modal.style.display = "none";
  });

  // form submit
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const booking = {
        eventName: document.getElementById("event-name").value,
        artistName: document.getElementById("artist-name").value,
        eventDate: document.getElementById("event-date").value,
        eventTime: document.getElementById("event-time").value,
        userName: document.getElementById("user-name").value,
        userEmail: document.getElementById("user-email").value,
        createdAt: new Date().toISOString(),
      };
      // local save
      const saved = JSON.parse(localStorage.getItem("kbs_bookings") || "[]");
      saved.push(booking);
      localStorage.setItem("kbs_bookings", JSON.stringify(saved));

      alert(`✅ Booking Confirmed!\nEvent: ${booking.eventName}\nName: ${booking.userName}\nEmail: ${booking.userEmail}`);
      bookingForm.reset();
      modal.style.display = "none";
    });
  }

 // ======================================================
// 6️⃣ AUDIO PLAYER  (flattened, unified)
// ======================================================
const audioPlayer = document.getElementById("audio-player");
const playButtons = document.querySelectorAll(".play-btn");
const playToggle = document.getElementById("play-toggle");
const progressBar = document.getElementById("progress-bar");
const trackTitle = document.getElementById("track-title");

let currentAudio = null;
let currentTrack = null;

// Load and play new track
function loadTrack(src, title) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(src);
  currentTrack = src;
  trackTitle.textContent = title;
  if (audioPlayer) audioPlayer.style.display = "flex";

  currentAudio.addEventListener("timeupdate", updateProgress);
  currentAudio.addEventListener("ended", () => {
    playToggle.textContent = "▶️";
    progressBar.value = 0;
  });

  currentAudio.play().catch(err => {
    console.error("Playback failed:", err);
    alert("Audio file not found or blocked by browser.");
  });

  playToggle.textContent = "⏸️";
  setupVisualizer();     // <- ensures bars animate
}

// Update progress
function updateProgress() {
  if (currentAudio && currentAudio.duration)
    progressBar.value = (currentAudio.currentTime / currentAudio.duration) * 100;
}

// Toggle play/pause
function togglePlayPause() {
  if (!currentAudio) return;
  if (currentAudio.paused) { currentAudio.play(); playToggle.textContent = "⏸️"; }
  else { currentAudio.pause(); playToggle.textContent = "▶️"; }
}

// Button bindings
playButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const src = btn.dataset.src;
    const title = btn.parentElement.querySelector("h3")?.textContent || "Unknown Track";
    if (!src) { alert("Audio source missing."); return; }
    if (src !== currentTrack) loadTrack(src, title);
    else togglePlayPause();
  });
});

if (playToggle) playToggle.addEventListener("click", togglePlayPause);
if (progressBar) {
  progressBar.addEventListener("input", () => {
    if (currentAudio && currentAudio.duration)
      currentAudio.currentTime = (progressBar.value / 100) * currentAudio.duration;
  });
}

  // ---------- VISUALIZER ----------
  const visualizer = document.getElementById("visualizer");
  const bars = visualizer ? visualizer.querySelectorAll(".bar") : [];
  let audioContext, analyser, source, dataArray;

  function setupVisualizer() {
    if (!currentAudio || !visualizer) return;
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaElementSource(currentAudio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 32;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      animateBars();
    }
  }

  function animateBars() {
    requestAnimationFrame(animateBars);
    if (!analyser) return;
    analyser.getByteFrequencyData(dataArray);
    bars.forEach((bar, i) => {
      const h = (dataArray[i % dataArray.length] / 255) * 20;
      bar.style.height = `${h}px`;
    });
  }

  document.body.addEventListener("click", () => {
    if (audioContext && audioContext.state === "suspended") audioContext.resume();
  });
});

