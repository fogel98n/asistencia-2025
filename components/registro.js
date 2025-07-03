
import { BASE_URL } from "../config.js";

export function registro() {
  const contenedor = document.createElement("section");
  contenedor.className = "registro";
  
  const titulo = document.createElement("h2");
  titulo.textContent = "Registro de maestro";
  contenedor.appendChild(titulo);


  const formulario = document.createElement("form");

  const inputNombre = document.createElement("input");
  inputNombre.type = "text";
  inputNombre.placeholder = "Nombre completo";
  inputNombre.required = true;
  inputNombre.className = "form-control";

  const inputTelefono = document.createElement("input");
  inputTelefono.type = "tel";
  inputTelefono.placeholder = "Número de celular";
  inputTelefono.required = true;
  inputTelefono.className = "form-control";

  const inputEmail = document.createElement("input");
  inputEmail.type = "email";
  inputEmail.placeholder = "Correo electrónico";
  inputEmail.required = true;
  inputEmail.className = "form-control";

  const inputPassword = document.createElement("input");
  inputPassword.type = "password";
  inputPassword.placeholder = "Contraseña";
  inputPassword.required = true;
  inputPassword.className = "form-control";

  const selectGrado = document.createElement("select");
  selectGrado.required = true;
  selectGrado.className = "form-control";

  const grados = [
    { id: "", nombre: "Selecciona un grado" },
    { id: 8, nombre: "Primero Básico" },
    { id: 9, nombre: "Segundo Básico" },
    { id: 10, nombre: "Tercero Básico" },
    { id: 11, nombre: "Cuarto Diversificado" },
    { id: 12, nombre: "Quinto Diversificado" },
    { id: 13, nombre: "Sexto Diversificado" }
  ];

  grados.forEach(({ id, nombre }, i) => {
    const option = document.createElement("option");
    option.value = id;
    option.disabled = i === 0;
    option.selected = i === 0;
    option.textContent = nombre;
    selectGrado.appendChild(option);
  });

  const boton = document.createElement("button");
  boton.type = "submit";
  boton.className = "btn-submit";
  boton.textContent = "Registrarse";

  
  formulario.append(
    inputNombre,
    inputTelefono,
    inputEmail,
    inputPassword,
    selectGrado,
    boton
  );

  
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!selectGrado.value) {
      alert("Selecciona un grado válido");
      return;
    }

    const datos = {
      nombre: inputNombre.value.trim(),
      telefono: inputTelefono.value.trim(),
      email: inputEmail.value.trim(),
      password: inputPassword.value.trim(),
      id_grado: selectGrado.value
    };

    try {
      const res = await fetch(`${BASE_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      const data = await res.json();

      if (res.ok) {
        alert("¡Registro exitoso!");
        formulario.reset();
      } else {
        alert(data.message || "Error en el registro");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
      console.error(error);
    }
  });

  
  contenedor.appendChild(formulario);
  return contenedor;
}
