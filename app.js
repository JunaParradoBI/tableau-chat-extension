const BACKEND_URL = "https://TU-BACKEND.com/ask"; // lo cambias en Fase 3

const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");
const inputEl = document.getElementById("question");
const sendBtn = document.getElementById("send");

function log(msg) {
  logEl.textContent += `\n${msg}`;
  logEl.scrollTop = logEl.scrollHeight;
}

async function init() {
  try {
    await tableau.extensions.initializeAsync();
    statusEl.textContent = "Listo ✅ (Extension inicializada)";
    log("Extension inicializada.");

    sendBtn.addEventListener("click", onSend);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onSend();
    });

  } catch (err) {
    statusEl.textContent = "No se pudo inicializar la Extensions API ❌";
    log("ERROR init: " + (err?.message || err));
    // Si esto falla en Public, probablemente toca Plan B (Web Page object)
  }
}

async function onSend() {
  const question = inputEl.value.trim();
  if (!question) return;

  inputEl.value = "";
  log(`Usuario: ${question}`);

  // Contexto básico (opcional). En la fase 2 lo dejamos simple.
  // Si luego quieres: leer filtros/worksheets usando dashboard.
  const payload = {
    question,
    // puedes mandar info extra después (worksheet, filtros, etc.)
  };

  try {
    statusEl.textContent = "Consultando…";
    const resp = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    log(`Backend: ${JSON.stringify(data, null, 2)}`);
    statusEl.textContent = "Listo ✅";

  } catch (err) {
    statusEl.textContent = "Error consultando backend ❌";
    log("ERROR backend: " + (err?.message || err));
  }
}

init();
