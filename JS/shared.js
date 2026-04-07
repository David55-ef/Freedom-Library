// ================================================================
// shared.js — Freedom Library · Shared Components & Utilities
// Included on every page (book, videos, courses, past questions)
// ================================================================

const API = "http://localhost:5000/api";

// ── Auth helpers ──────────────────────────────────────────────
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

function logout() {
  localStorage.removeItem("fl_token");
  localStorage.removeItem("fl_user");
  updateAuthUI();
  showToast("You have been logged out.", "info");
}

function updateAuthUI() {
  const user = getUser();
  const authBtns = document.getElementById("auth-buttons");
  const greeting = document.getElementById("user-greeting");
  const name = document.getElementById("greeting-name");
  if (!authBtns || !greeting) return;
  authBtns.classList.toggle("hidden", !!user);
  greeting.classList.toggle("show", !!user);
  if (user && name)
    name.textContent = user.full_name?.split(" ")[0] || "Student";
}

// ── Mobile nav ────────────────────────────────────────────────
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

// ── Modal helpers ─────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  const al = m.querySelector(".alert");
  if (al) {
    al.className = "alert";
    al.textContent = "";
  }
  m.classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => m.querySelector("input")?.focus(), 100);
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove("open");
  document.body.style.overflow = "";
}
function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}
function switchModal(a, b) {
  closeModal(a);
  setTimeout(() => openModal(b), 150);
}

// ── Alert ─────────────────────────────────────────────────────
function showAlert(id, msg, type = "error") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(message, type = "success") {
  document.querySelector(".fl-toast")?.remove();
  const icons = {
    success: "fa-check-circle",
    error: "fa-times-circle",
    info: "fa-info-circle",
  };
  const t = document.createElement("div");
  t.className = `fl-toast fl-toast-${type}`;
  t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 400);
  }, 3200);
}

// ── Auth form handlers ────────────────────────────────────────
function setLoading(btn, on, label) {
  if (!btn) return;
  btn.disabled = on;
  btn.innerHTML = on
    ? `<i class="fas fa-spinner fa-spin"></i> ${label}`
    : btn.dataset.orig || label;
  if (!on && btn.dataset.orig) btn.innerHTML = btn.dataset.orig;
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById("login-btn");
  if (!btn.dataset.orig) btn.dataset.orig = btn.innerHTML;
  setLoading(btn, true, "Logging in...");
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    localStorage.setItem("fl_token", data.token);
    localStorage.setItem("fl_user", JSON.stringify(data.user));
    showAlert(
      "login-alert",
      `Welcome back, ${data.user.full_name?.split(" ")[0]}! 👋`,
      "success",
    );
    setTimeout(() => {
      closeModal("login-modal");
      updateAuthUI();
      if (data.user.role === "admin")
        window.location.href = "./pages/admin.html";
    }, 1000);
  } catch (err) {
    showAlert("login-alert", err.message);
  } finally {
    setLoading(btn, false);
    btn.innerHTML = btn.dataset.orig;
    btn.disabled = false;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById("register-btn");
  if (!btn.dataset.orig) btn.dataset.orig = btn.innerHTML;
  const full_name = document.getElementById("reg-name")?.value?.trim();
  const email = document.getElementById("reg-email")?.value?.trim();
  const password = document.getElementById("reg-password")?.value;
  const role = document.getElementById("reg-role")?.value;
  if (!full_name || !email || !password) {
    showAlert("register-alert", "Please fill in all fields.");
    return;
  }
  if (password.length < 8) {
    showAlert("register-alert", "Password must be at least 8 characters.");
    return;
  }
  setLoading(btn, true, "Creating account...");
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    showAlert(
      "register-alert",
      "🎉 Account created! You can now log in.",
      "success",
    );
    document.getElementById("register-form")?.reset();
    setTimeout(() => switchModal("register-modal", "login-modal"), 1600);
  } catch (err) {
    showAlert("register-alert", err.message);
  } finally {
    btn.innerHTML = btn.dataset.orig;
    btn.disabled = false;
  }
}

// ── Scroll header shadow ──────────────────────────────────────
function initScrollShadow() {
  const h = document.querySelector("header");
  if (!h) return;
  window.addEventListener(
    "scroll",
    () => {
      h.style.boxShadow =
        window.scrollY > 10
          ? "0 4px 20px rgba(0,0,0,0.18)"
          : "0 2px 10px rgba(0,0,0,0.1)";
    },
    { passive: true },
  );
}

// ── Escape key closes modals ──────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal("login-modal");
    closeModal("register-modal");
  }
});

// ── Init on every page ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  initScrollShadow();
  // close mobile nav on link click
  document
    .querySelectorAll("#main-nav a")
    .forEach((a) =>
      a.addEventListener("click", () =>
        document.getElementById("main-nav")?.classList.remove("open"),
      ),
    );
});
