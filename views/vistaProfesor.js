import { mostrarGrados } from "../components/grados.js";
import { header } from "../components/header.js";


export async function maestroview(usuario, sinBotones = true) {
  const contenedor = document.createElement("section");
  contenedor.className = "contenedor-maestro";

  const headerElement = header(usuario);
  const gradosContainer = await mostrarGrados(null, usuario, sinBotones);

  contenedor.appendChild(headerElement);
  contenedor.appendChild(gradosContainer);

  return contenedor;
}
