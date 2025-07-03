import { menu_hamburgesa } from "./menu_hamburgesa.js";

export function header(usuario = {}) {
    const contenedor = document.createElement("header");
    contenedor.className = "header-contenedor";
  
    const encabezado = document.createElement("div");
    encabezado.className = "usuario-header";
  
    const usuarioImagen = document.createElement("img");
    usuarioImagen.src = usuario.imagen || "./media/user.png";
    usuarioImagen.alt = "Usuario";
    usuarioImagen.className = "usuario-imagen";
  
    const nombre = document.createElement("span");
    nombre.textContent = usuario.nombre || usuario.email || "Usuario";
    nombre.className = "usuario-nombre";
  
    encabezado.appendChild(usuarioImagen);
    encabezado.appendChild(nombre);

    // ✅ Pasar el usuario al menú hamburguesa
    const menu = menu_hamburgesa(usuario);
    encabezado.appendChild(menu);

    contenedor.appendChild(encabezado);
  
    return contenedor;
}
