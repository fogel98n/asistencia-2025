import { Login } from "./components/login.js";
import { header } from "./components/header.js";
import { mostrarGrados } from "./components/grados.js";
import { gradospanel } from "./components/niveles.js";

const root = document.getElementById("root");

function mostrarLogin() {
  root.innerHTML = "";

  root.appendChild(
    Login(async (usuario) => {
      root.innerHTML = "";
      root.appendChild(header(usuario));

      if (usuario.rol === "maestro") {
        const grados = await mostrarGrados(null, usuario); 
        root.appendChild(grados);
      } else if (usuario.rol === "coordinador") {
        const niveles = await gradospanel(usuario);
        root.appendChild(niveles);
      } else {
        root.textContent = "Rol no reconocido.";
      }
    })
  );
}

mostrarLogin();
