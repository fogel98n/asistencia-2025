import { BASE_URL } from "../config.js";
import { recuperarContraseña } from "./recuperarcontraseña.js";

export function Login(onSuccess) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-login";

  const imagen = document.createElement("img");
  imagen.src = "./media/user.png";
  imagen.alt = "Logo";
  imagen.className = "login-imagen";

  const form = document.createElement("form");

  function crearInput({ id, type, labelText, placeholder, required = false }) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    if (placeholder) input.placeholder = placeholder;
    if (required) input.required = true;

    return { label, input };
  }

  const { label: labelEmail, input: inputEmail } = crearInput({
    id: "email",
    type: "email",
    labelText: "Correo:",
    placeholder: "ejemplo@correo.com",
    required: true,
  });

  const { label: labelPassword, input: inputPassword } = crearInput({
    id: "password",
    type: "password",
    labelText: "Contraseña:",
    placeholder: "********",
    required: true,
  });

  
  const linkRecuperar = document.createElement("a");
  linkRecuperar.href = "#";
  linkRecuperar.textContent = "¿Recuperar contraseña?";
  linkRecuperar.className = "link-recuperar";
  

  linkRecuperar.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.innerHTML = "";
    const contenedorRecuperar = recuperarContraseña();
    document.body.appendChild(contenedorRecuperar);
  });

  const boton = document.createElement("button");
  boton.type = "submit";
  boton.textContent = "Entrar";

  const messageBox = document.createElement("div");
  messageBox.className = "message";
  messageBox.style.display = "none";

  // Agregamos el enlace justo antes del botón
  form.append(
    labelEmail,
    inputEmail,
    labelPassword,
    inputPassword,
    linkRecuperar,
    boton,
    messageBox
  );

  contenedor.append(imagen, form);

  function mostrarMensaje(text, tipo = "error") {
    messageBox.textContent = text;
    messageBox.className = `message ${tipo}`;
    messageBox.style.display = "block";
  }

  function ocultarMensaje() {
    messageBox.style.display = "none";
  }

  function decodeJWT(token) {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensaje();

    if (inputPassword.value.length < 5) {
      mostrarMensaje("La contraseña debe tener al menos 5 caracteres.");
      return;
    }

    const data = {
      email: inputEmail.value.trim(),
      password: inputPassword.value,
    };

    boton.disabled = true;
    boton.textContent = "Cargando...";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${BASE_URL}/login_asistencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error al iniciar sesión");

      const userData = decodeJWT(result.token);

      mostrarMensaje("Inicio de sesión exitoso.", "success");
      if (typeof onSuccess === "function") onSuccess(userData);
    } catch (err) {
      if (err.name === "AbortError") {
        mostrarMensaje("Tiempo de espera agotado, intenta más tarde.");
      } else {
        mostrarMensaje("Error al iniciar sesión: " + err.message);
      }
    } finally {
      boton.disabled = false;
      boton.textContent = "Entrar";
    }
  });

  return contenedor;
}
