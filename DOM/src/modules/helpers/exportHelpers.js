export function exportToJSON(data, filename = 'tareas.json') {
    if (!data || data.length === 0) {
        throw new Error("No hay datos para exportar.");
    }

    // 1. Convertimos el arreglo de tareas a un texto JSON ordenado
    const jsonString = JSON.stringify(data, null, 2);
    
    // 2. Creamos el enlace con los datos codificados directamente (Data URI)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);
    
    // 3. Creamos un elemento <a> invisible para forzar la descarga
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = filename;
    
    // 4. Simulamos el clic y lo eliminamos
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}