import { BASE_URL } from "../config.js";

export async function gestionarAlumnos(usuario) {
    const contenedor = document.createElement("div");
    contenedor.className = "gestionar-contenedor";

    try {
        const res = await fetch(`${BASE_URL}/grados/id/${usuario.id_grado}`);
        if (!res.ok) throw new Error("No se pudo obtener el grado");

        const grado = await res.json();

        const resAlumnos = await fetch(`${BASE_URL}/alumnos`);
        if (!resAlumnos.ok) throw new Error("No se pudo obtener los alumnos");

        const alumnos = await resAlumnos.json();
        const filtrados = alumnos.filter(a => String(a.id_grado) === String(grado.id_grado));

        if (filtrados.length === 0) {
            contenedor.textContent = "No hay alumnos para este grado.";
        } else {
            filtrados.forEach(alumno => {
                const div = document.createElement("div");
                div.className = "alumno-item pequeño";
                div.textContent = alumno.nombre;

                const btnEliminar = document.createElement("button");
                btnEliminar.textContent = "X";
                btnEliminar.className = "btn-eliminar";

                btnEliminar.addEventListener("click", () => {
                    mostrarPanelConfirmacion("Ingrese la contraseña para eliminar al alumno:", async (passwordIngresada) => {
                        try {
                            const validar = await fetch(`${BASE_URL}/login_asistencia`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    email: usuario.email,
                                    password: passwordIngresada
                                })
                            });

                            if (!validar.ok) {
                                alert("Contraseña incorrecta.");
                                return;
                            }

                            const eliminar = await fetch(`${BASE_URL}/alumnos/${alumno.id_alumno}`, {
                                method: "DELETE"
                            });

                            if (eliminar.ok) {
                                alert(`Alumno ${alumno.nombre} eliminado.`);
                                div.remove();
                            } else {
                                const errorData = await eliminar.json();
                                alert("Error al eliminar: " + (errorData.error || eliminar.statusText));
                            }
                        } catch (error) {
                            alert("Error al intentar validar o eliminar al alumno.");
                            console.error(error);
                        }
                    });
                });

                div.appendChild(btnEliminar);
                contenedor.appendChild(div);
            });
        }
    } catch (error) {
        contenedor.textContent = "Error al cargar alumnos.";
        console.error(error);
    }

    return contenedor;
}

function mostrarPanelConfirmacion(mensaje, callbackConfirmar) {
    const panelEmergente = document.createElement("div");
    panelEmergente.className = "panel-emergente";

    const texto = document.createElement("p");
    texto.textContent = mensaje;

    const inputPass = document.createElement("input");
    inputPass.type = "password";
    inputPass.placeholder = "Contraseña";
    inputPass.className = "input-texto";

    const btnConfirmar = document.createElement("button");
    btnConfirmar.textContent = "Confirmar";
    btnConfirmar.className = "cerrar-btn";

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.className = "cerrar-btn";

    btnConfirmar.addEventListener("click", () => {
        const pass = inputPass.value.trim();
        if (!pass) {
            alert("Por favor ingrese la contraseña.");
            return;
        }
        callbackConfirmar(pass);
        panelEmergente.remove();
    });

    btnCancelar.addEventListener("click", () => {
        panelEmergente.remove();
    });

    panelEmergente.appendChild(texto);
    panelEmergente.appendChild(inputPass);
    panelEmergente.appendChild(btnConfirmar);
    panelEmergente.appendChild(btnCancelar);

    document.body.appendChild(panelEmergente);
}
