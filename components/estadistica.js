import { grafica } from "./grafica_barra.js";
import { gradospanel } from "./niveles.js";

export async function estadística(usuario = {}) {
    const contenedor = document.createElement("div");
    contenedor.className = "contenedor-estadistica";

    const datos = [
        { nombre: "Enero", valor: 120 },
        { nombre: "Febrero", valor: 80 },
        { nombre: "Marzo", valor: 150 },
        { nombre: "Abril", valor: 100 }
    ];
    
    const graficaElemento = grafica(datos);
    const panelgrado = await gradospanel(usuario, true); 

    contenedor.appendChild(graficaElemento);
    contenedor.appendChild(panelgrado);

    return contenedor;
}
