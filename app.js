// ========= CONFIG =========
// Pon aquí tu backend (Fase 3). Por ahora puede quedar así.
const BACKEND_URL = "https://TU-BACKEND.com/ask";

// ========= UI ELEMENTS =========
const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");
const inputEl = document.getElementById("question");
const sendBtn = document.getElementById("send");

// ========= HELPERS =========
function log(msg) {
  logEl.textContent += `\n${msg}`;
  logEl.scrollTop = logEl.scrollHeight;
}

function isInsideTableau() {
  return typeof tableau !== "undefined" && tableau.extensions;
}

// ========= MAIN =========
async function init() {
  try {
    // Si abres la URL en el navegador normal, esto NO debe fallar.
    if (!isInsideTableau()) {
      statusEl.textContent =
        "Esta página solo funciona dentro de Tableau como Extension. Aquí estás viendo la versión web.";
      log(
        "Tip: para probarlo, inserta el archivo .trex en un dashboard como Extension (no se prueba abriendo la URL sola)."
      );

      // Aún así dejamos el chat usable para testear UI sin Tableau
      sendBtn.addEventListener("click", onSend);
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") onSend();
      });

      return;
    }

    // Inicializa la Extensions API cuando sí está dentro de Tableau
    await tableau.extensions.initializeAsync();

    statusEl.textContent = "Listo ✅ (Extension inicializada)";
    log("Extension inicializada. Ya puedes enviar preguntas.");

    // Listeners
    sendBtn.addEventListener("click", onSend);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onSend();
    });

  } catch (err) {
    statusEl.textContent = "No se pudo inicializar la Extensions API ❌";
    log("ERROR init: " + (err?.message || err));
  }
}

// ========= SEND =========
async function onSend() {
  const question = inputEl.value.trim();
  if (!question) return;

  inputEl.value = "";
  log(`Usuario: ${question}`);

  // Payload mínimo. Más adelante agregamos contexto del dashboard.
  const payload = {
    question,
    meta: {
      inside_tableau: isInsideTableau(),
      ts: new Date().toISOString(),
    },
  };

  // Si aún no tienes backend, puedes mockear la respuesta con este bloque:
  // const mock = { metric: "Sales", dimension: "Region", years: [2024, 2025], chart_type: "bar" };
  // log(`Backend(MOCK): ${JSON.stringify(mock, null, 2)}`);
  // statusEl.textContent = "Listo ✅";
  // return;

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
}

// ========= RUN =========
init();
