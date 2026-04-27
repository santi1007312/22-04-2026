/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * ============================================
 * 
 * Autor: [Eileen Mendoza]
 * Fecha: [26-04-2026]
 * ============================================
 */

// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================

/**
 * Seleccionamos los elementos del DOM que necesitamos manipular.
 * Usamos getElementById para obtener referencias a los elementos únicos.
 */

const userForm = document.getElementById('userForm');
const userDocInput = document.getElementById('userDoc');
const userDocError = document.getElementById('userDocError');

import { getUsers } from "../modules/users/index.js";

// ============================================
// 2. FUNCIONES AUXILIARES
// ============================================

function showError(errorElement, message) {
    errorElement.textContent = message;
}

function clearError(errorElement, inputElement) {
    errorElement.textContent = '';
    inputElement.classList.remove('error');
}

function isValidInput(input, message, errorElement){
    if (!input.value.trim()) {
        showError(errorElement, message);
        input.classList.add('error');
        return false;
    }else{
        clearError(errorElement, input);
        return true;
    }
}

userDocInput.addEventListener('input', () => {
    if (userDocInput.value.trim().length > 0) {
        clearError(userDocError, userDocInput);
    }
});
// ============================================
// 4. MANEJO DE EVENTOS (Lógica de las funciones)
// ============================================

/**
 * Lógica para limpiar el error mientras se escribe
 */
function handleInputChange() {
    if (userDocInput.value.trim().length > 0) {
        clearError(userDocError, userDocInput);
    }
}

/**
 * Función principal para el envío del formulario
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const isFieldValid = isValidInput(
        userDocInput, 
        'El documento del usuario es obligatorio', 
        userDocError
    );

    if (!isFieldValid) return;

    try {
        const value = userDocInput.value.trim();
        const users = await getUsers();
        const user = users.find(u => u.document === value);

        if (!user) {
            const msgNoExiste = 'Usuario no encontrado';
            showError(userDocError, msgNoExiste);
            alert(msgNoExiste); 
            return;
        }

        if (!user.active) {
            const msgInactivo = 'El usuario existe pero está inactivo';
            showError(userDocError, msgInactivo);
            alert(msgInactivo); 
            return;
        }

        clearError(userDocError, userDocInput);
        alert(`¡Usuario encontrado con éxito!\nBienvenido/a: ${user.name}`);
        console.log('Usuario validado:', user);

    } catch (error) {
        console.error('Error:', error);
        showError(userDocError, 'Error al conectar con el servidor');
    }
}
// ============================================
// 5. REGISTRO DE EVENTOS
// ============================================

userForm.addEventListener('submit', handleFormSubmit);
userDocInput.addEventListener('input', handleInputChange);

// ============================================
// 6. REFLEXIÓN Y DOCUMENTACIÓN
// ============================================
/**
 * PREGUNTAS DE REFLEXIÓN:
 * 
 * 1. ¿Qué elemento del DOM estás seleccionando?
 *    R: 
 * 
 * 2. ¿Qué evento provoca el cambio en la página?
 *    R: 
 * 
 * 3. ¿Qué nuevo elemento se crea?
 *    R: 
 * 
 * 4. ¿Dónde se inserta ese elemento dentro del DOM?
 *    R: 
 * 
 * 5. ¿Qué ocurre en la página cada vez que repites la acción?
 *    R: 
 */


// ============================================
// 7. INICIALIZACIÓN (OPCIONAL)
// ============================================

/**
 * Esta función se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicación de registro de mensajes iniciada');
    
    // Aquí puedes agregar cualquier inicialización adicional
    // Por ejemplo, cargar mensajes guardados del localStorage
});


// ============================================
// 8. FUNCIONALIDADES ADICIONALES (BONUS)
// ============================================

/**
 * RETOS ADICIONALES OPCIONALES:
 * 
 * 1. Agregar un botón para eliminar mensajes individuales
 * 2. Implementar localStorage para persistir los mensajes
 * 3. Agregar un contador de caracteres en el textarea
 * 4. Implementar un botón para limpiar todos los mensajes
 * 5. Agregar diferentes colores de avatar según el nombre del usuario
 * 6. Permitir editar mensajes existentes
 * 7. Agregar emojis o reacciones a los mensajes
 * 8. Implementar búsqueda/filtrado de mensajes
 */
