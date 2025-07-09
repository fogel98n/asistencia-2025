// niveles.js
import { mostrarGrados } from "../components/grados.js";
import { header } from "./header.js";
import { BASE_URL } from "../config.js";

export async function gradospanel(usuario, modoEstadistica = false) {
  const contenedor = document.createElement("div");
  contenedor.className = "grados-contenedor";

  if (!["coordinador", "admin", "maestro"].includes(usuario.rol)) {
    const mensaje = document.createElement("p");
    mensaje.style.fontWeight = "bold";
    mensaje.style.textAlign = "center";
    mensaje.textContent = "No tiene permisos para ver los grados.";
    contenedor.appendChild(mensaje);
    return contenedor;
  }

  try {
    const headerElement = header(usuario);
    contenedor.appendChild(headerElement);

    if (usuario.rol === "admin") {
      const gradosContainer = await mostrarGrados(null, usuario, modoEstadistica);
      contenedor.appendChild(gradosContainer);
      return contenedor;
    }

    if (usuario.rol === "maestro") {
      if (!usuario.id_nivel) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No tiene un nivel educativo asignado.";
        contenedor.appendChild(mensaje);
        return contenedor;
      }
      const gradosContainer = await mostrarGrados(usuario.id_nivel, usuario, modoEstadistica);
      contenedor.appendChild(gradosContainer);
      return contenedor;
    }

    if (usuario.rol === "coordinador") {
      const res = await fetch(`${BASE_URL}/niveles_educativos`);
      if (!res.ok) throw new Error("Error al cargar niveles educativos");

      const niveles = await res.json();

      if (niveles.length) {
        niveles.forEach(nivel => {
          const nivelDiv = document.createElement("div");
          nivelDiv.className = "nivel-item";
          nivelDiv.textContent = nivel.nombre_nivel || "Nombre no definido";

          nivelDiv.addEventListener("click", async () => {
            contenedor.innerHTML = "";
            contenedor.appendChild(headerElement);
            const gradosContainer = await mostrarGrados(nivel.id_nivel, usuario, modoEstadistica);
            contenedor.appendChild(gradosContainer);
          });

          contenedor.appendChild(nivelDiv);
        });
      } else {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay niveles educativos disponibles.";
        contenedor.appendChild(mensaje);
      }
      return contenedor;
    }

  } catch (error) {
    const mensajeError = document.createElement("p");
    mensajeError.style.color = "red";
    mensajeError.textContent = `Error cargando niveles educativos: ${error.message}`;
    contenedor.appendChild(mensajeError);
    return contenedor;
  }
}
