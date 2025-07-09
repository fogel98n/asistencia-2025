import { gestionarAlumnos } from "../components/gestionarAlumnos.js"; 
import { gradospanel } from "./niveles.js";
import { mostrarGrados } from "../components/grados.js";
import { estadística } from "./estadistica.js"; 
import { registro } from "./registro.js";
import { Login } from "./login.js";
import { maestroview } from "../views/vistaProfesor.js";
import { header } from "./header.js";
import { gestionarMaestros } from "./gestorMaestros.js";

export function menu_hamburgesa(usuario) {
  const menu = document.createElement('div');
  menu.classList.add('menu-hamburgesa');

  ["line1", "line2", "line3"].forEach(() => {
    const line = document.createElement('div');
    line.classList.add('menu-hamburgesa__line');
    menu.appendChild(line);
  });

  const pantallaEmergente = document.createElement('div');
  pantallaEmergente.classList.add('pantalla-emergente');

  const botonInicio = document.createElement('button');
  botonInicio.classList.add('pantalla-boton');
  botonInicio.textContent = 'Inicio';

  const botonEstadistica = document.createElement('button');
  botonEstadistica.classList.add('pantalla-boton');
  botonEstadistica.textContent = 'Estadística';

  const boton_registro = document.createElement("button");
  boton_registro.classList.add('pantalla-boton');
  boton_registro.textContent = "Registro";

  const boton_cerrarSesion = document.createElement("button");
  boton_cerrarSesion.classList.add('pantalla-boton');
  boton_cerrarSesion.textContent = "Cerrar sesión";

  const boton_gestorAlumnos = document.createElement("button");
  boton_gestorAlumnos.classList.add('pantalla-boton');
  boton_gestorAlumnos.textContent = "Gestionar Alumnos";

  const boton_gestorMaestros = document.createElement("button");
  boton_gestorMaestros.classList.add('pantalla-boton');
  boton_gestorMaestros.textContent = "Gestionar Maestros";

  pantallaEmergente.appendChild(botonInicio);
  pantallaEmergente.appendChild(botonEstadistica);

  if (usuario.rol === "coordinador") {
    pantallaEmergente.appendChild(boton_gestorMaestros);
    pantallaEmergente.appendChild(boton_registro);
  }
  if (usuario.rol === "maestro") {
    pantallaEmergente.appendChild(boton_gestorAlumnos);
  }

  pantallaEmergente.appendChild(boton_cerrarSesion);

  document.body.appendChild(pantallaEmergente);

  menu.addEventListener('click', () => {
    pantallaEmergente.classList.toggle('pantalla-emergente--visible');
  });

  botonInicio.addEventListener('click', async () => {
    pantallaEmergente.classList.remove('pantalla-emergente--visible');
    const root = document.getElementById("root");
    root.innerHTML = "";

    root.appendChild(header(usuario));

    if (usuario.rol === "maestro") {
      if (!usuario.id_nivel) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No tiene un nivel educativo asignado.";
        root.appendChild(mensaje);
        return;
      }
      const grados = await mostrarGrados(usuario.id_nivel, usuario, false);
      root.appendChild(grados);
    } else if (usuario.rol === "coordinador") {
      const niveles = await gradospanel(usuario, false);
      root.appendChild(niveles);
    } else {
      const mensaje = document.createElement("p");
      mensaje.textContent = "Rol no soportado para esta vista.";
      root.appendChild(mensaje);
    }
  });

  botonEstadistica.addEventListener('click', async () => {
    pantallaEmergente.classList.remove('pantalla-emergente--visible');
    const root = document.getElementById("root");
    root.innerHTML = "";

    const panel = await estadística(usuario);
    root.appendChild(panel);
  });

  boton_registro.addEventListener("click", async () => {
    pantallaEmergente.classList.remove('pantalla-emergente--visible');
    const root = document.getElementById("root");
    root.innerHTML = "";

    root.appendChild(header(usuario));

    const panel = await registro(usuario);
    root.appendChild(panel);
  });

  boton_cerrarSesion.addEventListener("click", () => {
    pantallaEmergente.classList.remove('pantalla-emergente--visible');
    const root = document.getElementById("root");
    root.innerHTML = "";

    const loginPanel = Login(async (userData) => {
      root.innerHTML = "";
      const nuevaVista = await maestroview(userData);
      root.appendChild(nuevaVista);
    });

    root.appendChild(loginPanel);
  });

  boton_gestorAlumnos.addEventListener("click", async () => {
    pantallaEmergente.classList.remove('pantalla-emergente--visible');
    const root = document.getElementById("root");
    root.innerHTML = "";

    const vistaGestion = await gestionarAlumnos(usuario);
    root.appendChild(header(usuario));
    root.appendChild(vistaGestion);
  });

  boton_gestorMaestros.addEventListener("click", async () => {
    pantallaEmergente.classList.remove('pantalla-emergente--visible');
    const root = document.getElementById("root");
    root.innerHTML = "";

    const vistaGestionMaestros = await gestionarMaestros(usuario);
    root.appendChild(header(usuario));
    root.appendChild(vistaGestionMaestros);
  });

  return menu;
}
