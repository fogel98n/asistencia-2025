import { BASE_URL } from "../config.js";

export async function gestionarMaestros(usuario) {
    const contenedor = document.createElement("div");
    contenedor.className = "contenedor-maestros";

    try {
        const res = await fetch(`${BASE_URL}/maestros`);
        if (!res.ok) throw new Error("No se pudo obtener la lista de maestros");

        const maestros = await res.json();

        if (maestros.length === 0) {
            contenedor.textContent = "No hay maestros registrados.";
        } else {
            // Contenedor con scroll
            const lista = document.createElement("div");
            lista.className = "lista-maestros";

            maestros.forEach(maestro => {
                const div = document.createElement("div");
                div.className = "maestro-item pequeño";

                // Contenedor info
                const info = document.createElement("div");
                info.className = "maestro-info";

                const nombre = document.createElement("span");
                nombre.className = "maestro-nombre";
                nombre.textContent = maestro.nombre;

                const grado = document.createElement("span");
                grado.className = "maestro-grado";
                grado.textContent = `Grado: ${maestro.nombre_grado || "No asignado"}`;

                info.appendChild(nombre);
                info.appendChild(grado);

                const btnEliminar = document.createElement("button");
                btnEliminar.textContent = "X";
                btnEliminar.className = "btn-eliminar";

                btnEliminar.addEventListener("click", () => {
                    mostrarPanelConfirmacion("Ingrese su contraseña para eliminar al maestro:", async (passwordIngresada) => {
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

                            const eliminar = await fetch(`${BASE_URL}/maestros/${maestro.id_maestro}`, {
                                method: "DELETE"
                            });

                            if (eliminar.ok) {
                                alert(`Maestro ${maestro.nombre} eliminado.`);
                                div.remove();
                            } else {
                                const errorData = await eliminar.json();
                                alert("Error al eliminar: " + (errorData.error || eliminar.statusText));
                            }
                        } catch (error) {
                            alert("Error al validar o eliminar al maestro.");
                            console.error(error);
                        }
                    });
                });

                div.appendChild(info);
                div.appendChild(btnEliminar);
                lista.appendChild(div);
            });

            contenedor.appendChild(lista);
        }
    } catch (error) {
        contenedor.textContent = "Error al cargar los maestros.";
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

