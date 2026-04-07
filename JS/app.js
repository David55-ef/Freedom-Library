// ================================================================
// app.js — Freedom Library · Complete JavaScript Functionality
// ================================================================

// ── API base URL (change this when you deploy) ────────────────
const API = "http://localhost:5000/api";

// ── Sample resource data (replaced by API call once backend runs)
const RESOURCES = [
  {
    id: 1,
    type: "book",
    title: "Advanced Calculus",
    author: "Dr. Helen Johnson",
    subject: "Mathematics",
    year: "2023",
    icon: "fa-book",
  },
  {
    id: 2,
    type: "video",
    title: "Quantum Physics Explained",
    author: "Dr. Wilson",
    subject: "Physics",
    duration: "60 min",
    icon: "fa-video",
  },
  {
    id: 3,
    type: "course",
    title: "Data Structures & Algorithms",
    author: "CSC 201",
    subject: "Computer Science",
    credits: "3 credits",
    icon: "fa-file-alt",
  },
  {
    id: 4,
    type: "past",
    title: "Mathematics Final Exam 2023",
    author: "MATH 301",
    subject: "Mathematics",
    year: "2023",
    icon: "fa-question-circle",
  },
  {
    id: 5,
    type: "book",
    title: "Organic Chemistry Fundamentals",
    author: "Dr. Roberts",
    subject: "Chemistry",
    year: "2022",
    icon: "fa-book",
  },
  {
    id: 6,
    type: "video",
    title: "Introduction to Programming",
    author: "Prof. Adeyemi",
    subject: "Computer Science",
    duration: "45 min",
    icon: "fa-video",
  },
  {
    id: 7,
    type: "past",
    title: "Physics Mid-Semester Exam",
    author: "PHY 201",
    subject: "Physics",
    year: "2022",
    icon: "fa-question-circle",
  },
  {
    id: 8,
    type: "course",
    title: "Organic Chemistry Outline",
    author: "CHM 301",
    subject: "Chemistry",
    credits: "2 credits",
    icon: "fa-file-alt",
  },
  {
    id: 9,
    type: "book",
    title: "Introduction to Biology",
    author: "Dr. Okafor",
    subject: "Biology",
    year: "2023",
    icon: "fa-book",
  },
  {
    id: 10,
    type: "past",
    title: "Computer Science Past Questions",
    author: "CSC 301",
    subject: "Computer Science",
    year: "2023",
    icon: "fa-question-circle",
  },
  {
    id: 11,
    type: "video",
    title: "Organic Chemistry Reactions",
    author: "Dr. Adebayo",
    subject: "Chemistry",
    duration: "50 min",
    icon: "fa-video",
  },
  {
    id: 12,
    type: "course",
    title: "Introduction to Physics",
    author: "PHY 101",
    subject: "Physics",
    credits: "4 credits",
    icon: "fa-file-alt",
  },
];

// ── State ─────────────────────────────────────────────────────
let currentType = "all";
let currentSearch = "";
let currentSubject = "all";

// ════════════════════════════════════════════════════════════
// RESOURCE CARDS
// ════════════════════════════════════════════════════════════

const TYPE_LABEL = {
  book: "Book",
  video: "Video",
  course: "Course",
  past: "Past Questions",
};
const BADGE_CLASS = {
  book: "badge-book",
  video: "badge-video",
  course: "badge-course",
  past: "badge-past",
};
const PAGE_LINK = {
  book: "./book.html",
  video: "./videos.html",
  course: "./Courses.html",
  past: "./past-questions.html",
};
const BTN_TEXT = {
  book: "View Book",
  video: "Watch Video",
  course: "View Outline",
  past: "View Questions",
};

function renderCards(resources) {
  const grid = document.getElementById("resource-grid");
  if (!grid) return;

  if (!resources.length) {
    grid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>No resources found.</p>
        <span>Try a different filter or search term.</span>
      </div>`;
    return;
  }

  grid.innerHTML = resources
    .map(
      (r) => `
    <div class="resource-card" data-type="${r.type}" data-subject="${r.subject}">
      <div class="resource-img ${r.type}">
        <i class="fas ${r.icon}"></i>
      </div>
      <div class="resource-info">
        <span class="type-badge ${BADGE_CLASS[r.type]}">${TYPE_LABEL[r.type]}</span>
        <h3>${r.title}</h3>
        <p class="resource-author">${r.author}</p>
        <div class="resource-meta">
          <span><i class="fas fa-tag"></i> ${r.subject}</span>
          <span>${
            r.year
              ? `<i class="fas fa-calendar"></i> ${r.year}`
              : r.duration
                ? `<i class="fas fa-clock"></i> ${r.duration}`
                : `<i class="fas fa-star"></i> ${r.credits}`
          }</span>
        </div>
        <a href="${PAGE_LINK[r.type]}" class="btn-small">
          ${BTN_TEXT[r.type]} <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `,
    )
    .join("");

  // Animate cards in
  grid.querySelectorAll(".resource-card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
      card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, i * 60);
  });
}

function applyFilters() {
  const filtered = RESOURCES.filter((r) => {
    const matchType = currentType === "all" || r.type === currentType;
    const matchSubject =
      currentSubject === "all" || r.subject === currentSubject;
    const matchSearch =
      !currentSearch ||
      r.title.toLowerCase().includes(currentSearch) ||
      r.subject.toLowerCase().includes(currentSearch) ||
      r.author.toLowerCase().includes(currentSearch);
    return matchType && matchSubject && matchSearch;
  });
  renderCards(filtered);
}

// Tab filter
function filterByType(type, btn) {
  currentType = type;
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  applyFilters();
}

// Search
function doSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;
  currentSearch = input.value.trim().toLowerCase();
  applyFilters();
  const resourcesSection = document.querySelector(".resources");
  if (resourcesSection) resourcesSection.scrollIntoView({ behavior: "smooth" });
}

// Subject radio filter
function initSubjectFilters() {
  document.querySelectorAll('input[name="filter"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      currentSubject = radio.value;
      applyFilters();
    });
  });
}

// Search on Enter
function initSearchInput() {
  const input = document.getElementById("search-input");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSearch();
    });
  }
}

// ════════════════════════════════════════════════════════════
// MODALS
// ════════════════════════════════════════════════════════════

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  // Clear previous alerts
  const alert = modal.querySelector(".alert");
  if (alert) {
    alert.className = "alert";
    alert.textContent = "";
  }
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}

function switchModal(closeId, openId) {
  closeModal(closeId);
  setTimeout(() => openModal(openId), 150);
}

function initModalEscapeKey() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal("login-modal");
      closeModal("register-modal");
    }
  });
}

// ════════════════════════════════════════════════════════════
// ALERTS
// ════════════════════════════════════════════════════════════

function showAlert(id, msg, type = "error") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.className = "alert";
}

// ════════════════════════════════════════════════════════════
// AUTHENTICATION
// ════════════════════════════════════════════════════════════

function getToken() {
  return localStorage.getItem("fl_token");
}
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("fl_user"));
  } catch {
    return null;
  }
}
function isLoggedIn() {
  return !!getToken() && !!getUser();
}

// Update nav based on login state
function updateAuthUI() {
  const user = getUser();
  const authBtns = document.getElementById("auth-buttons");
  const userGreeting = document.getElementById("user-greeting");
  const greetingName = document.getElementById("greeting-name");

  if (user && authBtns && userGreeting) {
    authBtns.classList.add("hidden");
    userGreeting.classList.add("show");
    if (greetingName) {
      greetingName.textContent = user.full_name
        ? user.full_name.split(" ")[0]
        : "Student";
    }
  } else if (authBtns && userGreeting) {
    authBtns.classList.remove("hidden");
    userGreeting.classList.remove("show");
  }
}

function logout() {
  localStorage.removeItem("fl_token");
  localStorage.removeItem("fl_user");
  updateAuthUI();
  showToast("You have been logged out.", "info");
}

// Login
async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById("login-btn");
  const email = document.getElementById("login-email")?.value;
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    showAlert("login-alert", "Please fill in all fields.");
    return;
  }

  setButtonLoading(btn, true, "Logging in...");
  hideAlert("login-alert");

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.message || "Login failed. Please check your credentials.",
      );

    localStorage.setItem("fl_token", data.token);
    localStorage.setItem("fl_user", JSON.stringify(data.user));

    showAlert(
      "login-alert",
      `Welcome back, ${data.user.full_name?.split(" ")[0] || "Student"}! 👋`,
      "success",
    );

    setTimeout(() => {
      closeModal("login-modal");
      updateAuthUI();
      // Redirect admin to admin panel
      if (data.user.role === "admin") {
        window.location.href = "./pages/admin.html";
      }
    }, 1000);
  } catch (err) {
    showAlert("login-alert", err.message);
  } finally {
    setButtonLoading(btn, false, '<i class="fas fa-sign-in-alt"></i> Login');
  }
}

// Register
async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById("register-btn");
  const full_name = document.getElementById("reg-name")?.value?.trim();
  const email = document.getElementById("reg-email")?.value?.trim();
  const password = document.getElementById("reg-password")?.value;
  const role = document.getElementById("reg-role")?.value;

  // Client-side validation
  if (!full_name || !email || !password) {
    showAlert("register-alert", "Please fill in all fields.");
    return;
  }
  if (password.length < 8) {
    showAlert("register-alert", "Password must be at least 8 characters long.");
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    showAlert("register-alert", "Please enter a valid email address.");
    return;
  }

  setButtonLoading(btn, true, "Creating account...");
  hideAlert("register-alert");

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Registration failed. Please try again.");

    showAlert(
      "register-alert",
      "🎉 Account created successfully! You can now log in.",
      "success",
    );
    document.getElementById("register-form")?.reset();
    setTimeout(() => switchModal("register-modal", "login-modal"), 1800);
  } catch (err) {
    showAlert("register-alert", err.message);
  } finally {
    setButtonLoading(
      btn,
      false,
      '<i class="fas fa-user-plus"></i> Create Account',
    );
  }
}

// ════════════════════════════════════════════════════════════
// MOBILE NAV
// ════════════════════════════════════════════════════════════

function toggleMenu() {
  const nav = document.getElementById("main-nav");
  const icon = document.querySelector(".menu-toggle i");
  if (!nav) return;
  nav.classList.toggle("open");
  if (icon)
    icon.className = nav.classList.contains("open")
      ? "fas fa-times"
      : "fas fa-bars";
}

// Close nav when a link is clicked on mobile
function initMobileNavClose() {
  document.querySelectorAll("#main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("main-nav")?.classList.remove("open");
    });
  });
}

// ════════════════════════════════════════════════════════════
// STATS COUNTER ANIMATION
// ════════════════════════════════════════════════════════════

function animateCounter(el, target, suffix = "") {
  let start = 0;
  const duration = 1800;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = start.toLocaleString() + suffix;
    }
  }, 16);
}

function initStatsAnimation() {
  const stats = document.querySelectorAll(".stat-num[data-count]");
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          animateCounter(el, target, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((el) => observer.observe(el));
}

// ════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ════════════════════════════════════════════════════════════

function showToast(message, type = "success") {
  // Remove existing toast
  document.querySelector(".fl-toast")?.remove();

  const toast = document.createElement("div");
  toast.className = `fl-toast fl-toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-times-circle" : "fa-info-circle"}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// ════════════════════════════════════════════════════════════
// SCROLL EFFECTS
// ════════════════════════════════════════════════════════════

// Sticky header shadow on scroll
function initScrollEffects() {
  const header = document.querySelector("header");
  if (!header) return;
  window.addEventListener(
    "scroll",
    () => {
      header.style.boxShadow =
        window.scrollY > 10
          ? "0 4px 20px rgba(0,0,0,0.15)"
          : "0 2px 10px rgba(0,0,0,0.1)";
    },
    { passive: true },
  );
}

// Fade-in sections on scroll
function initScrollReveal() {
  const sections = document.querySelectorAll(
    ".features, .resources, .testimonials, .stats-bar",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  sections.forEach((s) => observer.observe(s));
}

// ════════════════════════════════════════════════════════════
// UTILITY HELPERS
// ════════════════════════════════════════════════════════════

function setButtonLoading(btn, loading, label) {
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${label}`;
  } else {
    btn.innerHTML = label || btn.dataset.original || label;
  }
}

// Active nav link highlighting
function setActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach((a) => {
    const href = a.getAttribute("href")?.split("/").pop();
    a.classList.toggle("active", href === page);
  });
}

// ════════════════════════════════════════════════════════════
// LOAD RESOURCES FROM BACKEND (when server is running)
// ════════════════════════════════════════════════════════════

async function loadResourcesFromAPI() {
  try {
    const res = await fetch(`${API}/resources?limit=8`);
    if (!res.ok) throw new Error("API not available");
    const data = await res.json();

    if (data.data && data.data.length > 0) {
      // Map API response to our card format
      const mapped = data.data.map((r) => ({
        id: r.resource_id,
        type: r.file_type === "mp4" ? "video" : r.category || "book",
        title: r.title,
        author: r.uploader_name,
        subject: r.department_name || "General",
        year: r.academic_year,
        icon: "fa-book",
      }));
      renderCards(mapped);

      // Update stats if we have real numbers
      if (data.pagination) {
        const totalEl = document.querySelector('[data-count="200"]');
        if (totalEl) totalEl.dataset.count = data.pagination.total;
      }
    }
  } catch {
    // API not running — use sample data silently
    renderCards(RESOURCES);
  }
}

// ════════════════════════════════════════════════════════════
// INIT — runs when page loads
// ════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  // Auth
  updateAuthUI();

  // Nav
  setActiveNav();
  initMobileNavClose();
  initModalEscapeKey();

  // Resources
  loadResourcesFromAPI(); // tries API first, falls back to sample data

  // Filters & Search
  initSubjectFilters();
  initSearchInput();

  // Animations
  initScrollEffects();
  initScrollReveal();
  initStatsAnimation();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  console.log("✅ Freedom Library JS loaded successfully");
});
