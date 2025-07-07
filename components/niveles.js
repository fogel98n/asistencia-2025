import { mostrarGrados } from "./grados.js";
import { BASE_URL } from "../config.js";
import { header } from "./header.js";

export async function gradospanel(usuario, modoEstadistica = false) {
  const contenedor = document.createElement("div");
  contenedor.className = "grados-contenedor";

  // Si no es ni coordinador ni admin, no tiene permisos
  if (usuario.rol !== "coordinador" && usuario.rol !== "admin") {
    const mensaje = document.createElement("p");
    mensaje.style.fontWeight = "bold";
    mensaje.style.textAlign = "center";
    mensaje.textContent = "No tiene permisos para ver los grados.";
    contenedor.appendChild(mensaje);
    return contenedor;
  }

  try {
    // Si es administrador, mostrar todos los grados directamente
    if (usuario.rol === "admin") {
      const root = document.getElementById("root");
      root.innerHTML = "";
      const headerElement = header(usuario);

      // Pasamos null o 0 como id_nivel si queremos todos los grados
      const gradosContainer = await mostrarGrados(null, usuario, modoEstadistica);

      root.appendChild(headerElement);
      root.appendChild(gradosContainer);
      return contenedor; // aunque ya manipulamos el DOM directamente
    }

    // Si es coordinador, mostrar por niveles
    const res = await fetch(`${BASE_URL}/niveles_educativos`);
    if (!res.ok) throw new Error("Error al cargar niveles educativos");

    const niveles = await res.json();

    if (niveles.length) {
      niveles.forEach(nivel => {
        const nivelDiv = document.createElement("div");
        nivelDiv.className = "nivel-item";
        nivelDiv.textContent = nivel.nombre_nivel || "Nombre no definido";

        nivelDiv.addEventListener("click", async () => {
          const root = document.getElementById("root");
          root.innerHTML = "";

          const headerElement = header(usuario);
          const gradosContainer = await mostrarGrados(nivel.id_nivel, usuario, modoEstadistica);

          root.appendChild(headerElement);
          root.appendChild(gradosContainer);
        });

        contenedor.appendChild(nivelDiv);
      });
    } else {
      const mensaje = document.createElement("p");
      mensaje.textContent = "No hay niveles educativos disponibles.";
      contenedor.appendChild(mensaje);
    }
  } catch (error) {
    const mensajeError = document.createElement("p");
    mensajeError.style.color = "red";
    mensajeError.textContent = `Error cargando niveles educativos: ${error.message}`;
    contenedor.appendChild(mensajeError);
  }

  return contenedor;
}
