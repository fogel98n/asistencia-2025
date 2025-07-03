import { BASE_URL } from "../config.js";
import { Login } from "./login.js";

export function recuperarContraseña() {
  const contenedor = document.createElement("section");
  contenedor.className = "recuperar-contenedor";

  let emailGuardado = null;

  function crearInput({ id, type, labelText, placeholder, required = false }) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;

    const input = document.createElement("input");
    input.id = id;
    input.type = type;
    input.placeholder = placeholder;
    if (required) input.required = true;

    return { label, input };
  }

  function pasoSolicitarCodigo() {
    contenedor.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = "Recuperar contraseña";

    const { label: labelEmail, input: inputEmail } = crearInput({
      id: "email",
      type: "email",
      labelText: "Correo electrónico:",
      placeholder: "Ingrese su correo",
      required: true,
    });

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-recuperar";

    const btnEnviar = document.createElement("button");
    btnEnviar.textContent = "Enviar código";

    const btnVolver = document.createElement("button");
    btnVolver.textContent = "Volver al login";

    btnEnviar.addEventListener("click", async () => {
      const email = inputEmail.value.trim();
      if (!email || !email.includes("@")) {
        mensaje.textContent = "Correo inválido.";
        mensaje.style.color = "red";
        return;
      }

      mensaje.textContent = "Enviando...";
      mensaje.style.color = "black";

      try {
        const res = await fetch(`${BASE_URL}/recuperacion/codigo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        mensaje.textContent = data.message || "Código enviado al correo.";
        mensaje.style.color = "green";

        emailGuardado = email;
        pasoVerificarCodigo();
      } catch (err) {
        mensaje.textContent = err.message || "Error al enviar código.";
        mensaje.style.color = "red";
      }
    });

    btnVolver.addEventListener("click", () => {
      document.body.innerHTML = "";
      document.body.appendChild(Login());
    });

    contenedor.append(titulo, labelEmail, inputEmail, btnEnviar, btnVolver, mensaje);
  }

  function pasoVerificarCodigo() {
    contenedor.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = "Verificar código";

    const { label: labelCodigo, input: inputCodigo } = crearInput({
      id: "codigo",
      type: "text",
      labelText: "Código recibido:",
      placeholder: "Ingrese el código enviado",
      required: true,
    });

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-recuperar";

    const btnVerificar = document.createElement("button");
    btnVerificar.textContent = "Verificar código";

    const btnVolver = document.createElement("button");
    btnVolver.textContent = "Volver";

    btnVerificar.addEventListener("click", async () => {
      const codigo = inputCodigo.value.trim();
      if (!codigo || codigo.length !== 6) {
        mensaje.textContent = "Código inválido.";
        mensaje.style.color = "red";
        return;
      }

      mensaje.textContent = "Verificando...";
      mensaje.style.color = "black";

      try {
        const res = await fetch(`${BASE_URL}/recuperacion/verificar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailGuardado, codigo }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        mensaje.textContent = data.message || "Código verificado correctamente.";
        mensaje.style.color = "green";

        pasoCambiarPassword(codigo);
      } catch (err) {
        mensaje.textContent = err.message || "Código incorrecto.";
        mensaje.style.color = "red";
      }
    });

    btnVolver.addEventListener("click", () => {
      pasoSolicitarCodigo();
    });

    contenedor.append(titulo, labelCodigo, inputCodigo, btnVerificar, btnVolver, mensaje);
  }

  function pasoCambiarPassword(codigo) {
    contenedor.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = "Cambiar contraseña";

    const { label: labelPassword, input: inputPassword } = crearInput({
      id: "nueva-password",
      type: "password",
      labelText: "Nueva contraseña:",
      placeholder: "Ingrese nueva contraseña",
      required: true,
    });

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-recuperar";

    const btnCambiar = document.createElement("button");
    btnCambiar.textContent = "Cambiar contraseña";

    const btnVolver = document.createElement("button");
    btnVolver.textContent = "Volver";

    btnCambiar.addEventListener("click", async () => {
      const nuevaPassword = inputPassword.value.trim();
      if (nuevaPassword.length < 5) {
        mensaje.textContent = "La contraseña debe tener al menos 5 caracteres.";
        mensaje.style.color = "red";
        return;
      }

      mensaje.textContent = "Cambiando contraseña...";
      mensaje.style.color = "black";

      try {
        const res = await fetch(`${BASE_URL}/recuperacion/nueva`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailGuardado,
            codigo,
            nuevaPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        mensaje.textContent = data.message || "Contraseña cambiada correctamente.";
        mensaje.style.color = "green";

        setTimeout(() => {
          document.body.innerHTML = "";
          document.body.appendChild(Login());
        }, 2000);
      } catch (err) {
        mensaje.textContent = err.message || "Error al cambiar contraseña.";
        mensaje.style.color = "red";
      }
    });

    btnVolver.addEventListener("click", () => {
      pasoVerificarCodigo();
    });

    contenedor.append(titulo, labelPassword, inputPassword, btnCambiar, btnVolver, mensaje);
  }

  pasoSolicitarCodigo();

  return contenedor;
}
