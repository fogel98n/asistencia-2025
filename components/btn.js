import { BASE_URL } from "../config.js";

export function agregar_alumnos(clase, contenido) {
    const contenedor = document.createElement("div");
    contenedor.className = "contenedor-boton";

    const boton = document.createElement("button");
    boton.className = clase;
    boton.textContent = contenido;

    contenedor.appendChild(boton);
    return contenedor;
}

export function marcar_completado(alumnosFiltrados) {
    const contenedor_botones = document.createElement("div");
    contenedor_botones.className = "contenedor-botonescompletados";

    const btn_asistencia = document.createElement("button");
    btn_asistencia.className = "btn-asistencia sin-borde";
    
    btn_asistencia.addEventListener("click", async () => {
        btn_asistencia.style.backgroundColor = "#4CAF50";
        await marcarEstadoMasivo(alumnosFiltrados, "presente");
    });

    btn_asistencia.addEventListener("dblclick", async () => {
        btn_asistencia.style.backgroundColor = "#F44336";
        await marcarEstadoMasivo(alumnosFiltrados, "ausente");
    });

    const btn_gmail = document.createElement("button");
    btn_gmail.className = "btn-msj";

    const imgMsj = document.createElement("img");
    imgMsj.src = "./media/iconmsj.png";
    imgMsj.alt = "Mensaje";
    imgMsj.className = "btn-msj-icon";

    btn_gmail.appendChild(imgMsj);

    btn_gmail.addEventListener("click", () => {
        const correos = alumnosFiltrados.map(a => a.email).filter(Boolean);
        const to = correos.join(",");
        const subject = "Asistencia Escolar";
        const body = "Hola, este mensaje es para notificar el estado de asistencia del día.";

        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    });

    contenedor_botones.appendChild(btn_gmail);
    contenedor_botones.appendChild(btn_asistencia);

    return contenedor_botones;
}

async function marcarEstadoMasivo(alumnos, estado) {
    const fecha = new Date().toISOString().slice(0, 10);

    const datos = alumnos.map(a => ({
        id_alumno: a.id_alumno,
        fecha,
        estado
    }));

    try {
        const res = await fetch(`${BASE_URL}/asistencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert("Error al marcar asistencia: " + (errorData.error || res.statusText));
        } else {
            alert(`Todos marcados como ${estado.toUpperCase()}`);
        }
    } catch (error) {
        alert("Error de conexión al marcar asistencia masiva");
        console.error(error);
    }
}
