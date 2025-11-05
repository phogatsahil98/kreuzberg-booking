/*
// ========== 1. Berlin Local Time (Real-time Clock) ==========
function updateBerlinTime() {
  const berlinTime = new Date().toLocaleTimeString("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("berlin-time").textContent = berlinTime;
}
updateBerlinTime();
setInterval(updateBerlinTime, 60000);

// --When Things Goes Wrong--
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM fully loaded and parsed");

  // Get your form safely
  const bookingForm = document.getElementById("booking-form");

  // Defensive check
  if (!bookingForm) {
    console.warn("⚠️ Booking form not found! Check your HTML id.");
    return;
  }

  // --- all your booking logic inside this block ---
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted safely!");
    // your existing form handling code here...
  });

  // other existing event listeners...
});

// ========== 2️. Contact Form Submission ==========
const form = document.getElementById("contact-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = form.querySelector("input[placeholder='Your Name']").value.trim();
  const email = form.querySelector("input[placeholder='Your Email']").value.trim();
  const message = form.querySelector("textarea").value.trim();

  if (!name || !email || !message) {
    alert("Please fill out all fields before submitting!");
    return;
  }

  // Simulate sending (this could later connect to backend / email API)
  alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon.`);

  // Reset form
  form.reset();
});

// ========== 3️. DJ Booking Buttons (Future Integration) ==========
const bookButtons = document.querySelectorAll(".book-btn");
bookButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const djName = btn.parentElement.querySelector("h3").textContent;
    alert(`🎧 Booking request for ${djName} has been sent!`);
  });
});

// ========== 4️. Scroll Animations (Subtle Reveal Effect) ==========
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);
sections.forEach((section) => observer.observe(section));

// ========== RECORD STORE (Dynamic + Filterable) ==========
let allRecords = [];

async function loadRecords() {
  try {
    const response = await fetch("data/records.json");
    allRecords = await response.json();
    renderRecords(allRecords);
  } catch (error) {
    console.error("Error loading records:", error);
  }
}

// Render Records Dynamically
function renderRecords(records) {
  const recordList = document.getElementById("record-list");
  recordList.innerHTML = ""; // clear existing

  records.forEach((record) => {
    const card = document.createElement("div");
    card.classList.add("record-card");

    card.innerHTML = `
      <img src="${record.image}" alt="${record.title}">
      <h3>${record.title}</h3>
      <p class="tag ${record.genre.toLowerCase()}">${record.genre}</p>
      <p class="price">€${record.price}</p>
    `;

    recordList.appendChild(card);
  });
}

// Filter Logic
document.getElementById("genre-filter").addEventListener("change", (e) => {
  const selectedGenre = e.target.value;
  if (selectedGenre === "all") {
    renderRecords(allRecords);
  } else {
    const filtered = allRecords.filter(
      (rec) => rec.genre.toLowerCase() === selectedGenre.toLowerCase()
    );
    renderRecords(filtered);
  }
});
loadRecords();

// ========== LIVE EVENTS (Dynamic Rendering) ==========
async function loadEvents() {
  try {
    const response = await fetch("data/events.json");
    const events = await response.json();
    const eventList = document.getElementById("event-list");

    events.forEach((event) => {
      const card = document.createElement("div");
      card.classList.add("event-card");

      card.innerHTML = `
        <img src="${event.image}" alt="${event.title}">
        <div class="event-info">
          <h3>${event.title}</h3>
          <p class="artist">🎧 Artist: ${event.artist}</p>
          <p class="date">📅 ${event.date}</p>
          <p class="time">🕒 ${event.time}</p>
          <button class="book-btn">Book Tickets</button>
        </div>
      `;

      eventList.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading events:", error);
  }
}
loadEvents();

// ========== BOOKING MODAL LOGIC ==========
const modal = document.getElementById("booking-modal");
const closeModal = document.getElementById("close-modal");

document.addEventListener("DOMContentLoaded", function() {
  const bookingForm = document.getElementById("booking-form");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // your booking logic here
      console.log("Booking form submitted!");
    });
  } else {
    console.warn("Booking form not found in DOM!");
  }
});

// Open Modal on "Book Tickets" click
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("book-btn")) {
    const card = e.target.closest(".event-card");
    const eventName = card.querySelector("h3").textContent;
    const artist = card.querySelector(".artist").textContent.replace("🎧 Artist: ", "");
    const date = card.querySelector(".date").textContent.replace("📅 ", "");
    const time = card.querySelector(".time").textContent.replace("🕒 ", "");

    document.getElementById("event-name").value = eventName;
    document.getElementById("artist-name").value = artist;
    document.getElementById("event-date").value = date;
    document.getElementById("event-time").value = time;

    modal.style.display = "flex";
  }
});

// Close Modal
closeModal.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Form Submission
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  const eventName = document.getElementById("event-name").value;

  alert(`✅ Booking Confirmed!\n\nEvent: ${eventName}\nName: ${user}\nEmail: ${email}`);

  bookingForm.reset();
  modal.style.display = "none";
});

// ========== AUDIO PLAYER LOGIC ==========
const audioPlayer = document.getElementById("audio-player");
const playButtons = document.querySelectorAll(".play-btn");
const playToggle = document.getElementById("play-toggle");
const progressBar = document.getElementById("progress-bar");
const trackTitle = document.getElementById("track-title");

// ========== AUDIO PLAYER CONTROLLER ==========
let currentAudio = null;
let currentTrack = null;

// Function to initialize a new track
function loadTrack(src, title) {
  // Stop old track
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  // Create new audio element
  currentAudio = new Audio(src);
  currentTrack = src;
  trackTitle.textContent = title;
  audioPlayer.style.display = "flex";

  // Attach listeners only once
  currentAudio.addEventListener("timeupdate", updateProgress);
  currentAudio.addEventListener("play", () => audioPlayer.classList.add("playing"));
  currentAudio.addEventListener("pause", () => audioPlayer.classList.remove("playing"));
  currentAudio.addEventListener("ended", () => {
    playToggle.textContent = "▶️";
    progressBar.value = 0;
  });

  currentAudio.play();
  playToggle.textContent = "⏸️";
}

// Update progress bar
function updateProgress() {
  if (currentAudio && currentAudio.duration) {
    progressBar.value = (currentAudio.currentTime / currentAudio.duration) * 100;
  }
}

// ========= Play Button Click on Tape Cards =========
playButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.dataset.src;
    const title = btn.parentElement.querySelector("h3").textContent;

    if (currentTrack !== src) {
      loadTrack(src, title);
    } else {
      togglePlayPause();
    }
  });
});

// ========= Mini Player Toggle =========
function togglePlayPause() {
  if (!currentAudio) return;
  if (currentAudio.paused) {
    currentAudio.play();
    playToggle.textContent = "⏸️";
  } else {
    currentAudio.pause();
    playToggle.textContent = "▶️";
  }
}

playToggle.addEventListener("click", togglePlayPause);

// ========= Scrubbing (Seek) =========
progressBar.addEventListener("input", () => {
  if (currentAudio && currentAudio.duration) {
    currentAudio.currentTime = (progressBar.value / 100) * currentAudio.duration;
  }
});

// ========== AUDIO VISUALIZER ANIMATION ==========
const visualizer = document.getElementById("visualizer");
const bars = visualizer.querySelectorAll(".bar");

let audioContext, analyser, source, dataArray;

function setupVisualizer() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(currentAudio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 32;

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    animateBars();
  }
}

function animateBars() {
  requestAnimationFrame(animateBars);
  analyser.getByteFrequencyData(dataArray);

  bars.forEach((bar, index) => {
    const height = (dataArray[index % dataArray.length] / 255) * 20;
    bar.style.height = `${height}px`;
  });
}

// When a new track starts
playButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setupVisualizer();
  });
});

// Resume context if paused (browser policies)
document.body.addEventListener("click", () => {
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }
});

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const booking = {
    eventName: document.getElementById("event-name").value,
    artistName: document.getElementById("artist-name").value,
    eventDate: document.getElementById("event-date").value,
    eventTime: document.getElementById("event-time").value,
    userName: document.getElementById("user-name").value,
    userEmail: document.getElementById("user-email").value,
    createdAt: new Date().toISOString()
  };

  
  // Save locally
  const saved = JSON.parse(localStorage.getItem("kbs_bookings") || "[]");
  saved.push(booking);
  localStorage.setItem("kbs_bookings", JSON.stringify(saved));
  
  // Submit form to Netlify
  bookingForm.submit();

  alert(`✅ Booking Confirmed! We'll email you soon.`);
  bookingForm.reset();
  modal.style.display = "none";
});
*/
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
  // 6️⃣ AUDIO PLAYER
  // ======================================================
  const audioPlayer = document.getElementById("audio-player");
  const playButtons = document.querySelectorAll(".play-btn");
  const playToggle = document.getElementById("play-toggle");
  const progressBar = document.getElementById("progress-bar");
  const trackTitle = document.getElementById("track-title");

  let currentAudio = null, currentTrack = null;

  function loadTrack(src, title) {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    currentAudio = new Audio(src);
    currentTrack = src;
    trackTitle.textContent = title;
    audioPlayer.style.display = "flex";

    currentAudio.addEventListener("timeupdate", updateProgress);
    currentAudio.addEventListener("play", () => audioPlayer.classList.add("playing"));
    currentAudio.addEventListener("pause", () => audioPlayer.classList.remove("playing"));
    currentAudio.addEventListener("ended", () => { playToggle.textContent = "▶️"; progressBar.value = 0; });

    currentAudio.play();
    playToggle.textContent = "⏸️";
  }

  function updateProgress() {
    if (currentAudio && currentAudio.duration)
      progressBar.value = (currentAudio.currentTime / currentAudio.duration) * 100;
  }

  playButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.src;
      const title = btn.parentElement.querySelector("h3").textContent;
      if (currentTrack !== src) loadTrack(src, title);
      else togglePlayPause();
      setupVisualizer();
    });
  });

  function togglePlayPause() {
    if (!currentAudio) return;
    if (currentAudio.paused) { currentAudio.play(); playToggle.textContent = "⏸️"; }
    else { currentAudio.pause(); playToggle.textContent = "▶️"; }
  }

  if (playToggle) playToggle.addEventListener("click", togglePlayPause);
  if (progressBar) progressBar.addEventListener("input", () => {
    if (currentAudio && currentAudio.duration)
      currentAudio.currentTime = (progressBar.value / 100) * currentAudio.duration;
  });

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
