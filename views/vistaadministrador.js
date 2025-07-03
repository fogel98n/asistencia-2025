import { gradospanel } from "../components/niveles.js";
import { header } from "../components/header.js";

export async function adminview(usuario) {
    const contenedor = document.createElement("section");
    contenedor.className = "contenedor-admin";

    const headerElement = header(usuario);
    const gradosNivel = await gradospanel(usuario);

    contenedor.appendChild(headerElement);
    contenedor.appendChild(gradosNivel);

    return contenedor;
}
