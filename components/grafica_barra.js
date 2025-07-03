
export function grafica() {
    const contenedorGrafica = document.createElement("div");
    contenedorGrafica.className = "grafica-contenedor";

    const etiquetas = ["Enero", "Febrero", "Marzo", "Abril"]; 

    etiquetas.forEach(etiqueta => {
        const barra = document.createElement("div");
        barra.className = "grafica-barra";
        barra.title = etiqueta; 

        const etiquetaSpan = document.createElement("span");
        etiquetaSpan.className = "grafica-etiqueta";
        etiquetaSpan.textContent = etiqueta;

        barra.appendChild(etiquetaSpan);
        contenedorGrafica.appendChild(barra);
    });

    return contenedorGrafica;
}