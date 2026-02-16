// ==============================
// app.js (HÍBRIDO)
// - Funciona como Web Page (Tableau Public) ✅
// - Si algún día lo usas como Extension real, también ✅
// ==============================

const BACKEND_URL = "https://TU-BACKEND.com/ask"; // Fase 3

const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");
const inputEl = document.getElementById("question");
const sendBtn = document.getElementById("send");

function log(msg) {
  logEl.textContent += `\n${msg}`;
  logEl.scrollTop = logEl.scrollHeight;
}

function isInsideTableauExtension() {
  return typeof tableau !== "undefined" && tableau.extensions;
}

// ---------- INIT ----------
async function init() {
  // Listeners siempre (en Web Page y en Extension)
  sendBtn.addEventListener("click", onSend);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onSend();
  });

  // Si NO está dentro de Tableau Extension, estamos en modo Web Page
  if (!isInsideTableauExtension()) {
    statusEl.textContent = "Chat listo ✅ (modo Web Page / Tableau Public)";
    log("Nota: estás en modo Web Page (no Extension). Esto está bien para Tableau Public.");
    return;
  }

  // Si SÍ está dentro de Tableau Extension
  try {
    await tableau.extensions.initializeAsync();
    statusEl.textContent = "Listo ✅ (Extension inicializada)";
    log("Extension inicializada.");
  } catch (err) {
    statusEl.textContent = "No se pudo inicializar Extensions API ❌";
    log("ERROR init Extension: " + (err?.message || err));
  }
}

// ---------- SEND ----------
async function onSend() {
  const question = inputEl.value.trim();
  if (!question) return;

  inputEl.value = "";
  log(`Usuario: ${question}`);

  // Payload mínimo (más adelante meteremos parámetros, etc.)
  const payload = {
    question,
    meta: {
      inside_extension: isInsideTableauExtension(),
      ts: new Date().toISOString(),
    },
  };

  // ✅ Por ahora: MOCK para confirmar que el chat funciona
  const mock = {
    metric: "Sales",
    dimension: "Region",
    years: [2024, 2025],
    chart_type: "bar",
  };
  log(`Backend(MOCK): ${JSON.stringify(mock, null, 2)}`);
  statusEl.textContent = "Listo ✅ (mock)";
  return;

  // Cuando tengas backend, borras el bloque MOCK de arriba y descomentas esto:
  /*
  try {
    statusEl.textContent = "Consultando…";

    const resp = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status} ${text}`);
    }

    const data = await resp.json();
    log(`Backend: ${JSON.stringify(data, null, 2)}`);

    statusEl.textContent = "Listo ✅";
  } catch (err) {
    statusEl.textContent = "Error consultando backend ❌";
    log("ERROR backend: " + (err?.message || err));
  }
  */
}

init();

