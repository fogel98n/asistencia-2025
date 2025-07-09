import { agregar_alumnos, marcar_completado } from "./btn.js";
import { header } from "./header.js";
import { BASE_URL } from "../config.js";

export async function mostrarAlumnos(idGrado, usuario, claseExtra = "", mostrarBotones = true) {
    const contenedorAlumnos = document.createElement("div");
    contenedorAlumnos.className = "alumnos-listado";

    if (claseExtra) {
        contenedorAlumnos.classList.add(claseExtra);
    }

    contenedorAlumnos.appendChild(header(usuario));

    try {
        const res = await fetch(`${BASE_URL}/alumnos`);
        if (!res.ok) throw new Error("Error al cargar alumnos");

        const alumnos = await res.json();
        const filtrados = alumnos.filter(a => String(a.id_grado) === String(idGrado));

        let asistenciasMap = new Map();
        if (!mostrarBotones) {
            const resAsist = await fetch(`${BASE_URL}/asistencia`);
            if (!resAsist.ok) throw new Error("Error al cargar asistencias");

            const asistencias = await resAsist.json();
            asistencias.forEach(asist => {
                if (!asistenciasMap.has(asist.id_alumno)) {
                    asistenciasMap.set(asist.id_alumno, []);
                }
                asistenciasMap.get(asist.id_alumno).push(asist);
            });
        }

        if (filtrados.length === 0) {
            contenedorAlumnos.textContent = "No hay alumnos para este grado.";
        } else {
            if (mostrarBotones) {
                contenedorAlumnos.appendChild(marcar_completado(filtrados));
            }

            filtrados.forEach(alumno => {
                const div = document.createElement("div");
                div.className = "alumno-item";

                const nombreSpan = document.createElement("span");
                nombreSpan.textContent = alumno.nombre;
                div.appendChild(nombreSpan);

                if (mostrarBotones) {
                    // Aquí paso el id y el nombre a btn
                    div.appendChild(btn(alumno.id_alumno, alumno.nombre));
                } else {
                    const estadisticas = asistenciasMap.get(alumno.id_alumno) || [];
                    const total = estadisticas.length;
                    const presentes = estadisticas.filter(a => a.estado === "presente").length;
                    const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;

                    const barraContenedor = document.createElement("div");
                    barraContenedor.className = "barra-contenedor";

                    const barra = document.createElement("div");
                    barra.classList.add("barra-asistencia-simple");

                    if (total === 0) {
                        barra.classList.add("sin-datos");
                    } else if (porcentaje < 50) {
                        barra.classList.add("baja-asistencia");
                        barra.style.width = `${porcentaje}%`;
                    } else if (porcentaje < 80) {
                        barra.classList.add("media-asistencia");
                        barra.style.width = `${porcentaje}%`;
                    } else {
                        barra.classList.add("alta-asistencia");
                        barra.style.width = `${porcentaje}%`;
                    }

                    barra.title = `Asistencia: ${porcentaje}% (${presentes}/${total})`;

                    barraContenedor.appendChild(barra);
                    div.appendChild(barraContenedor);
                }

                contenedorAlumnos.appendChild(div);
            });
        }
    } catch (error) {
        contenedorAlumnos.textContent = "Error al cargar alumnos: " + error.message;
        contenedorAlumnos.style.color = "red";
    }

    if (mostrarBotones) {
        const btnAgregarAlumno = agregar_alumnos("btn-alumno", "Agregar Alumno");
        btnAgregarAlumno.addEventListener("click", () => {
            mostrarPanelAgregarAlumno(idGrado, usuario.id_nivel);
        });

        contenedorAlumnos.appendChild(btnAgregarAlumno);
    }

    return contenedorAlumnos;
}

// Cambié para que reciba también el nombre
export function btn(idAlumno, alumnoNombre) {
    const contenedorBotones = document.createElement("div");
    contenedorBotones.className = "botones-contenedor";

    const btnAsistencia = document.createElement("button");
    btnAsistencia.className = "btn-asistencia sin-borde";
    let estado = "presente";
    btnAsistencia.style.backgroundColor = "#4CAF50";

    btnAsistencia.addEventListener("click", async () => {
        estado = estado === "presente" ? "ausente" : "presente";
        btnAsistencia.style.backgroundColor = estado === "presente" ? "#4CAF50" : "#F44336";

        try {
            const res = await fetch(`${BASE_URL}/asistencia`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([
                    {
                        id_alumno: idAlumno,
                        fecha: new Date().toISOString().slice(0, 10),
                        estado: estado
                    }
                ])
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert("Error al enviar asistencia: " + (errorData.error || res.statusText));
            } else {
                console.log(`Asistencia enviada para alumno ${idAlumno}: ${estado}`);
            }
        } catch (error) {
            alert("Error de conexión al enviar asistencia");
            console.error(error);
        }
    });

    const btnUniforme = document.createElement("button");
    btnUniforme.className = "btn-uniforme";
    // Aquí paso el nombre en vez del id
    btnUniforme.addEventListener("click", () => mostrarPanelUniforme(alumnoNombre));

    const btnMsj = document.createElement("button");
    btnMsj.className = "btn-msj";
    const imgMsj = document.createElement("img");
    imgMsj.src = "./media/iconmsj.png";
    imgMsj.alt = "Mensaje";
    imgMsj.className = "btn-msj-icon";
    btnMsj.appendChild(imgMsj);
    btnMsj.addEventListener("click", () => {
        const email = "";
        const subject = "Asunto del correo";
        const body = "Cuerpo del mensaje";
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    });

    contenedorBotones.appendChild(btnAsistencia);
    contenedorBotones.appendChild(btnUniforme);
    contenedorBotones.appendChild(btnMsj);

    return contenedorBotones;
}

function mostrarPanelAgregarAlumno(idGrado, idNivel) {
    const panelEmergente = document.createElement("div");
    panelEmergente.className = "panel-emergente";

    const titulo = document.createElement("h3");
    titulo.textContent = "Agregar Alumno";

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.placeholder = "Nombre";
    inputNombre.className = "input-texto";

    const inputApellido = document.createElement("input");
    inputApellido.type = "text";
    inputApellido.placeholder = "Apellido";
    inputApellido.className = "input-texto";

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.placeholder = "Correo electrónico";
    inputEmail.className = "input-texto";

    const inputTelefono = document.createElement("input");
    inputTelefono.type = "text";
    inputTelefono.placeholder = "Teléfono";
    inputTelefono.className = "input-texto";

    const agregarBtn = document.createElement("button");
    agregarBtn.textContent = "Agregar";
    agregarBtn.className = "cerrar-btn";

    agregarBtn.addEventListener("click", async () => {
        const nombre = inputNombre.value.trim();
        const apellido = inputApellido.value.trim();
        const email = inputEmail.value.trim();
        const telefono = inputTelefono.value.trim();

        if (!nombre || !apellido || !email || !telefono) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const alumno = {
            nombre: `${nombre} ${apellido}`,
            email,
            telefono,
            id_grado: idGrado,
        };

        try {
            const res = await fetch(`${BASE_URL}/alumnosRegistro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(alumno)
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert("Error al agregar alumno: " + (errorData.error || res.statusText));
                return;
            }

            alert("Alumno agregado correctamente.");
            panelEmergente.remove();
            location.reload();
        } catch (error) {
            alert("Error de conexión al agregar alumno");
            console.error(error);
        }
    });

    const cerrarBtn = document.createElement("button");
    cerrarBtn.textContent = "Cerrar";
    cerrarBtn.className = "cerrar-btn";
    cerrarBtn.addEventListener("click", () => panelEmergente.remove());

    panelEmergente.appendChild(titulo);
    panelEmergente.appendChild(inputNombre);
    panelEmergente.appendChild(inputApellido);
    panelEmergente.appendChild(inputEmail);
    panelEmergente.appendChild(inputTelefono);
    panelEmergente.appendChild(agregarBtn);
    panelEmergente.appendChild(cerrarBtn);

    document.body.appendChild(panelEmergente);
}

function mostrarPanelUniforme(nombreAlumno) {
    const panelEmergente = document.createElement("div");
    panelEmergente.className = "panel-emergente";

    const mensaje = document.createElement("h3");
    mensaje.textContent = "Reporte por falta de uniforme";

    const inputTexto = document.createElement("input");
    inputTexto.type = "text";
    inputTexto.placeholder = "Describe qué parte del uniforme falta...";
    inputTexto.className = "input-texto";

    const inputCorreo = document.createElement("input");
    inputCorreo.type = "email";
    inputCorreo.placeholder = "Correo del destinatario ";
    inputCorreo.className = "input-texto";

    const contenedorImagenes = document.createElement("div");
    contenedorImagenes.className = "contenedor-imagenes";

    const partesUniforme = [
        { nombre: "camisa", texto: "No trajo la camisa" },
        { nombre: "pantalon", texto: "No trajo el pantalón" },
        { nombre: "zapatos", texto: "No trajo los zapatos" }
    ];

    partesUniforme.forEach(({ nombre, texto }) => {
        const img = document.createElement("img");
        img.src = `./media/${nombre}.png`;
        img.alt = `Uniforme ${nombre}`;
        img.className = "imagen-uniforme";
        img.style.cursor = "pointer";

        img.addEventListener("click", () => {
            inputTexto.value = texto;
        });

        contenedorImagenes.appendChild(img);
    });

    const enviarBtn = document.createElement("button");
    enviarBtn.textContent = "Enviar";
    enviarBtn.className = "cerrar-btn";

    enviarBtn.addEventListener("click", () => {
        const descripcion = inputTexto.value.trim();
        const correoDestino = inputCorreo.value.trim();

        if (!descripcion || !correoDestino) {
            alert("Completa la descripción y el correo destinatario.");
            return;
        }

        const subject = encodeURIComponent("Reporte de uniforme");
        const body = encodeURIComponent(`Alumno: ${nombreAlumno}\nDescripción: ${descripcion}`);
        const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${correoDestino}&su=${subject}&body=${body}`;
        window.open(url, "_blank");
    });

    const cerrarBtn = document.createElement("button");
    cerrarBtn.textContent = "Cerrar";
    cerrarBtn.className = "cerrar-btn";
    cerrarBtn.addEventListener("click", () => panelEmergente.remove());

    panelEmergente.appendChild(mensaje);
    panelEmergente.appendChild(inputTexto);
    panelEmergente.appendChild(inputCorreo);
    panelEmergente.appendChild(contenedorImagenes);
    panelEmergente.appendChild(enviarBtn);
    panelEmergente.appendChild(cerrarBtn);

    document.body.appendChild(panelEmergente);
}
