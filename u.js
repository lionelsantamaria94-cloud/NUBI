function saludar(intentos) {
  intentos = intentos || 0;
  var ai = window.AppInventor;
  var valor = ai && typeof ai.getWebViewString === "function" ? ai.getWebViewString() : "";
  if (typeof valor !== "string" || !valor.trim()) {
    if (ai && intentos < 10) setTimeout(function () { saludar(intentos + 1); }, 500);
    return;
  }
  var nombre = valor.trim().slice(0, 14);
  nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
  if (S.av.name === nombre) return;
  S.av.name = nombre;
  save();
  render();
}
window.addEventListener("load", function () { saludar(); });