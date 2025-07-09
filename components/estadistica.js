// estadistica.js
import { gradospanel } from "./niveles.js";

export async function estadística(usuario = {}) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-estadistica";

  // Solo mostramos el panel de grados sin gráfica
  const panelgrado = await gradospanel(usuario, true);

  contenedor.appendChild(panelgrado);

  return contenedor;
}
