import { mostrarAlumnos } from "./alumnos.js";
import { BASE_URL } from "../config.js";

export async function mostrarGrados(id, usuario, modoEstadistica = false) {
  const contenedorGrados = document.createElement("div");
  contenedorGrados.className = "grados-listado";

  // Para maestro: pedimos grados por nivel, no por id de grado
  if (usuario.rol === "maestro" && !id) {
    id = usuario.id_nivel;  // aquí el cambio importante
  }

  if (!id) {
    contenedorGrados.textContent = "No se puede determinar el grado o nivel asignado.";
    return contenedorGrados;
  }

  try {
    let grados = [];

    if (usuario.rol === "coordinador" || usuario.rol === "maestro") {
      // Tanto coordinador como maestro piden grados por nivel
      const res = await fetch(`${BASE_URL}/grados/nivel/${id}`);
      if (!res.ok) throw new Error("Error al cargar grados por nivel");
      grados = await res.json();
    } else {
      // Otros roles podrían pedir diferente o nada
      contenedorGrados.textContent = "No tiene permisos para ver los grados.";
      return contenedorGrados;
    }

    const resMaestros = await fetch(`${BASE_URL}/maestros`);
    if (!resMaestros.ok) throw new Error("Error al cargar maestros");
    const maestros = await resMaestros.json();

    if (grados.length === 0) {
      contenedorGrados.textContent = "No hay grados disponibles.";
    } else {
      grados.forEach(grado => {
        const div = document.createElement("div");
        div.className = "grado-item";

        const maestro = maestros.find(m => m.id_grado === grado.id_grado);
        const nombreMaestro = maestro ? maestro.nombre : "Sin asignar";

        const nombreGrado = document.createElement("strong");
        nombreGrado.textContent = grado.nombre_grado;

        const spanMaestro = document.createElement("span");
        spanMaestro.textContent = `Maestro: ${nombreMaestro}`;

        div.appendChild(nombreGrado);
        div.appendChild(spanMaestro);

        div.addEventListener("click", async () => {
          const root = document.getElementById("root");
          root.innerHTML = "";

          if (typeof mostrarAlumnos === "function") {
            const alumnosDiv = await mostrarAlumnos(
              grado.id_grado,
              usuario,
              "modo-estadistica",
              !modoEstadistica 
            );
            root.appendChild(alumnosDiv);
          }
        });

        contenedorGrados.appendChild(div);
      });
    }
  } catch (error) {
    contenedorGrados.textContent = "Error de red al cargar grados.";
    console.error(error);
  }

  return contenedorGrados;
}
