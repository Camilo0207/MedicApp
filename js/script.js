// ==========================================================================
// CONTROL DE AUTENTICACIÓN SIMULADA (LOGIN & REGISTRO GLOBAL)
// ==========================================================================

// Base de datos de usuarios en memoria (incluye un usuario de prueba para testear rápido)
let usuarioLogueado = null;

// Tu base de datos compartida (asegúrate de que tenga nombres base)
const BD_USUARIOS = [
    { correo: "test@medicapp.com", pass: "123456", nombreCompleto: "Emma" },
    { correo: "usuario@correo.com", pass: "password", nombreCompleto: "Carlos Gómez" }
];

// Función que procesa el formulario de Login de forma estricta
function ejecutarLogin(event) {
    event.preventDefault(); 
    
    const correoInput = document.getElementById('login-correo').value.trim().toLowerCase();
    const passInput = document.getElementById('login-pass').value;
    const contenedorError = document.getElementById('login-error-alert');

    contenedorError.classList.add('d-none');

    // Buscamos el usuario
    const usuarioValido = BD_USUARIOS.find(user => user.correo === correoInput && user.pass === passInput);

    if (usuarioValido) {
        // 1. Guardamos los datos del usuario en nuestra sesión global
        usuarioLogueado = usuarioValido;

        // 2. Antes de saltar, inyectamos su nombre en el saludo del Home
        // Si el usuario no ingresó nombre (por si acaso), usamos 'Invitado' por defecto
        const nombreAMostrar = usuarioLogueado.nombreCompleto || "Invitado";
        document.getElementById('home-saludo-usuario').innerText = nombreAMostrar;

        // Limpieza de inputs y cambio de pantalla
        document.getElementById('login-correo').value = "";
        document.getElementById('login-pass').value = "";
        cambiarPantalla('pantalla-home');
    } else {
        contenedorError.innerText = "❌ El correo electrónico o la contraseña son incorrectos.";
        contenedorError.classList.remove('d-none');
    }
}

// ==========================================================================
// FUNCIÓN DE REGISTRO CON VALIDACIÓN CRUZADA
// ==========================================================================

function ejecutarRegistro(event) {
    // Detener la recarga de página por defecto
    event.preventDefault();

    // Capturar los elementos del formulario
    const nombre = document.getElementById('reg-nombre').value.trim();
    const correo = document.getElementById('reg-correo').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    const passConfirm = document.getElementById('reg-pass-confirm').value;
    const alerta = document.getElementById('registro-alert');

    // Resetear visualmente la alerta en cada intento
    alerta.className = "alert d-none text-xs py-2 px-3 rounded-3 mb-3 text-start";
    alerta.innerText = "";

    // VALIDACIÓN 1: Comprobar si las contraseñas coinciden de forma estricta
    if (pass !== passConfirm) {
        alerta.innerText = "⚠️ Las contraseñas ingresadas no coinciden. Por favor, verifícalas.";
        alerta.classList.add('alert-danger');
        alerta.classList.remove('d-none');
        
        // Foco visual de alerta en los campos
        document.getElementById('reg-pass-confirm').focus();
        return;
    }

    // VALIDACIÓN 2: Comprobar si el correo ya existe registrado en MedicApp
    const usuarioDuplicado = BD_USUARIOS.find(user => user.correo === correo);
    if (usuarioDuplicado) {
        alerta.innerText = "❌ Este correo electrónico ya está registrado en nuestra base de datos.";
        alerta.classList.add('alert-danger');
        alerta.classList.remove('d-none');
        return;
    }

    // ACCIÓN: Insertar el nuevo perfil en nuestra base de datos temporal
    BD_USUARIOS.push({
        correo: correo,
        pass: pass,
        nombreCompleto: nombre // Guardado opcional para usarlo en el Home luego si deseas
    });

    // ÉXITO DE UX: Limpiar por completo los campos del formulario de registro
    document.getElementById('reg-nombre').value = "";
    document.getElementById('reg-correo').value = "";
    document.getElementById('reg-pass').value = "";
    document.getElementById('reg-pass-confirm').value = "";

    // Notificación elegante y redirección controlada al login para iniciar sesión
    alert("✨ ¡Cuenta creada con éxito!\nYa puedes ingresar usando tu correo y contraseña registrados.");
    cambiarPantalla('pantalla-login');
}

// 💡 TIP DE INTEGRACIÓN CON TU PANTALLA DE REGISTRO:
// Cuando crees la función para guardar usuarios nuevos en 'pantalla-registro', 
// solo debes capturar los campos y guardarlos así:
//
// function registrarNuevoUsuario(nuevoCorreo, nuevaContraseña) {
//     BD_USUARIOS.push({ correo: nuevoCorreo.toLowerCase(), pass: nuevaContraseña });
//     alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
//     cambiarPantalla('pantalla-login');
// }

// ==========================================================================
// FUNCIÓN GLOBAL: Cambiar de Pantalla
// ==========================================================================
function cambiarPantalla(idPantallaDestino) {
    const pantallas = document.querySelectorAll('.contenedor-movil > section');
    pantallas.forEach(pantalla => {
        pantalla.classList.add('d-none');
    });
    
    const pantallaDestino = document.getElementById(idPantallaDestino);
    if (pantallaDestino) {
        pantallaDestino.classList.remove('d-none');
        
        // Cada vez que entres a esta pantalla, recalculamos la selección inicial
        if(idPantallaDestino === 'pantalla-agregar-med') {
            const columnas = document.querySelectorAll('.wheel-col');
            columnas.forEach(col => actualizarSeleccionRueda(col));
        }
    }
}

// ==========================================================================
// DETECTOR TÁCTIL Y SCROLL PARA LA RUEDA DE DOSIFICACIÓN
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const columnas = document.querySelectorAll('.wheel-col');
    
    columnas.forEach(col => {
        // Escucha el scroll en cada columna de forma independiente
        col.addEventListener('scroll', () => {
            actualizarSeleccionRueda(col);
        });
    });
});

// Calcula cuál elemento está en el centro de la franja menta
function actualizarSeleccionRueda(columna) {
    const items = columna.querySelectorAll('.wheel-item');
    const containerRect = columna.getBoundingClientRect();
    const containerCenter = containerRect.top + (containerRect.height / 2);

    items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + (itemRect.height / 2);
        
        // Si el elemento está alineado con el centro del contenedor, se selecciona
        if (Math.abs(containerCenter - itemCenter) < 22) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// ==========================================================================
// ACCIÓN: Agregar Medicamento Dinámico a la Lista
// ==========================================================================
function agregarMedicamentoDinamico() {
    // 1. Capturamos el nombre del medicamento
    const inputMed = document.getElementById('med-nombre');
    const nombre = inputMed.value.trim();
    
    if (nombre === "") {
        alert("Por favor, ingrese el nombre del medicamento antes de agregarlo.");
        return;
    }

    // 2. Capturamos los elementos que tengan la clase .selected en este instante
    const cantSelected = document.querySelector('#col-cantidad .wheel-item.selected');
    const tipoSelected = document.querySelector('#col-tipo .wheel-item.selected');
    const frecSelected = document.querySelector('#col-frecuencia .wheel-item.selected');

    // 3. Extraemos su texto dinámico (Si está en movimiento usa un valor base seguro)
    const cantidad = cantSelected ? cantSelected.innerText : '1';
    const tipo = tipoSelected ? tipoSelected.innerText : 'pildora';
    const frecuencia = frecSelected ? frecSelected.innerText : 'diario';

    // 4. Armamos la frase de dosificación exacta
    const dosificacionCompleta = `${cantidad} ${tipo}, ${frecuencia}`;

    // 5. Obtenemos el contenedor de la lista objetivo
    const lista = document.getElementById('lista-medicamentos-dinamica');
    
    // 6. Creamos la tarjeta idéntica a tu estructura HTML
    const nuevoItem = document.createElement('div');
    nuevoItem.className = "d-flex align-items-center justify-content-between py-2 mb-2 item-med";
    nuevoItem.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="img/pills-color.png" alt="pill" class="me-3" style="width: 36px; height: auto;" onerror="this.src='https://placehold.co/36x36?text=💊'">
            <div class="text-start">
                <p class="mb-0 fw-bold text-dark text-sm">${nombre}</p>
                <small class="text-muted text-xs">${dosificacionCompleta}</small>
            </div>
        </div>
        <button class="btn btn-link text-dark fw-semibold text-sm p-0 text-decoration-none">Editar</button>
    `;
    
    // 7. Lo inyectamos arriba de todo en la lista
    lista.insertBefore(nuevoItem, lista.firstChild);
    
    // 8. Limpiamos el formulario
    inputMed.value = "";
}

// Limpiar inputs
function limpiarFormularioMed() {
    document.getElementById('med-nombre').value = "";
}

// ==========================================================================
// PANTALLA: FARMACIAS - DATA Y LÓGICA DINÁMICA
// ==========================================================================

// Base de datos simulada de farmacias con distancias y catálogo clave para búsqueda
const BD_FARMACIAS = [
    {
        id: 1,
        nombre: "Farmatodo",
        horario: "Hora Cierre 10pm",
        distanciaKm: 0.4,
        medicamentos: ["acetaminofen", "ibuprofeno", "metformina", "loratadina"]
    },
    {
        id: 2,
        nombre: "Drogueria San Jorge",
        horario: "Hora Apertura 9am",
        distanciaKm: 1.2,
        medicamentos: ["metformina", "insulina", "amoxicilina", "acetaminofen"]
    },
    {
        id: 3,
        nombre: "Cruz Verde",
        horario: "Hora Cierre 11pm",
        distanciaKm: 0.8,
        medicamentos: ["losartan", "aspirina", "acetaminofen", "omeprazol"]
    }
];

// Variables de estado del filtro activo
let filtroActual = 'distancia'; // Valores posibles: 'distancia' o 'medicamento'

// Cargar las farmacias automáticamente cuando el documento esté listo
document.addEventListener("DOMContentLoaded", () => {
    // Si la pantalla de farmacias arranca visible por defecto, renderiza de una vez
    renderizarFarmacias(BD_FARMACIAS);
});

// Modificamos sutilmente tu función cambiarPantalla para que refresque la lista al entrar
const cambiarPantallaOriginal = cambiarPantalla; 
cambiarPantalla = function(idPantallaDestino) {
    cambiarPantallaOriginal(idPantallaDestino);
    if(idPantallaDestino === 'pantalla-farmacias') {
        document.getElementById('buscar-farmacia').value = ""; // Limpia búsquedas previas
        ejecutarFiltroYBusqueda();
    }
}

// Función encargada de dibujar los elementos en el HTML
function renderizarFarmacias(lista) {
    const contenedor = document.getElementById('lista-farmacias-dinamica');
    if (!contenedor) return;
    
    contenedor.innerHTML = ""; // Limpiar contenido anterior

    if(lista.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-4 text-muted text-sm">
                <p class="mb-0">❌ No se encontraron farmacias coincidentes.</p>
            </div>
        `;
        return;
    }

    lista.forEach(farmacia => {
        const item = document.createElement('div');
        item.className = "d-flex align-items-center justify-content-between py-2 mb-2 border-bottom";
        item.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="icon-farmacia me-3">
                    💊
                </div>
                <div class="text-start">
                    <p class="mb-0 fw-bold text-dark text-sm">${farmacia.nombre}</p>
                    <small class="text-muted text-xs d-block">${farmacia.horario}</small>
                    <small class="text-primary text-xs fw-semibold">📍 A ${farmacia.distanciaKm} km de ti</small>
                </div>
            </div>
            <button class="btn btn-navegar" onclick="alert('Iniciando ruta hacia ${farmacia.nombre}...')">Navegar</button>
        `;
        contenedor.appendChild(item);
    });
}

// Controla los botones de filtro inferiores
function alternarFiltro(tipoFiltro) {
    filtroActual = tipoFiltro;
    
    const btnDistancia = document.getElementById('btn-filtro-distancia');
    const btnMedicamento = document.getElementById('btn-filtro-medicamento');

    if(tipoFiltro === 'distancia') {
        btnDistancia.classList.add('active-filter');
        btnDistancia.classList.remove('text-muted');
        btnMedicamento.classList.remove('active-filter');
        btnMedicamento.classList.add('text-muted');
    } else {
        btnMedicamento.classList.add('active-filter');
        btnMedicamento.classList.remove('text-muted');
        btnDistancia.classList.remove('active-filter');
        btnDistancia.classList.add('text-muted');
    }

    ejecutarFiltroYBusqueda();
}

// Filtra en tiempo real al escribir en el input
function filtrarFarmacias() {
    ejecutarFiltroYBusqueda();
}

// Procesa tanto el texto de búsqueda como el ordenamiento/filtrado seleccionado
function ejecutarFiltroYBusqueda() {
    const textoBusqueda = document.getElementById('buscar-farmacia').value.toLowerCase().trim();
    
    // 1. Filtrar los datos por texto (nombre de farmacia o catálogo de medicamentos)
    let farmaciasFiltradas = BD_FARMACIAS.filter(farmacia => {
        const coincideNombre = farmacia.nombre.toLowerCase().includes(textoBusqueda);
        const coincideMedicamento = farmacia.medicamentos.some(med => med.includes(textoBusqueda));
        return coincideNombre || coincideMedicamento;
    });

    // 2. Aplicar la lógica del filtro seleccionado
    if (filtroActual === 'distancia') {
        // Ordena de menor a mayor distancia (la más cercana primero)
        farmaciasFiltradas.sort((a, b) => a.distanciaKm - b.distanciaKm);
    } else if (filtroActual === 'medicamento' && textoBusqueda !== "") {
        // Da prioridad en el orden a las farmacias que tengan el medicamento exacto escrito en el buscador
        farmaciasFiltradas.sort((a, b) => {
            const tieneA = a.medicamentos.includes(textoBusqueda) ? 1 : 0;
            const tieneB = b.medicamentos.includes(textoBusqueda) ? 1 : 0;
            return tieneB - tieneA;
        });
    }

    // 3. Renderizar los resultados procesados
    renderizarFarmacias(farmaciasFiltradas);
}

// ==========================================================================
// PANTALLA: HISTORIAL - DATA EXTENSA CON SCROLL INTERNO CONTROLADO
// ==========================================================================

// Base de datos robusta con 10 registros para simular historial denso
const BD_HISTORIAL = [
    { fecha: "Ene 25, 2026", estado: "Recibido", tipoIcono: "check", meds: "Metformina, Acetaminofen, Loratadina" },
    { fecha: "Ene 10, 2026", estado: "Pendiente", tipoIcono: "clock", meds: "Metformina, Insulina" },
    { fecha: "Dic 29, 2025", estado: "Recibido", tipoIcono: "check", meds: "Insulina" },
    { fecha: "Dic 15, 2025", estado: "Recibido", tipoIcono: "check", meds: "Xanax, Adderall" },
    { fecha: "Dic 08, 2025", estado: "Recibido", tipoIcono: "check", meds: "Adderall" },
    { fecha: "Nov 25, 2025", estado: "Recibido", tipoIcono: "check", meds: "Insulina" },
    { fecha: "Nov 10, 2025", estado: "Pendiente", tipoIcono: "clock", meds: "Ibuprofeno, Omeprazol" },
    { fecha: "Oct 05, 2025", estado: "Recibido", tipoIcono: "check", meds: "Loratadina, Aspirina" },
    { fecha: "Sep 20, 2025", estado: "Recibido", tipoIcono: "check", meds: "Losartán, Amoxicilina" },
    { fecha: "Ago 14, 2025", estado: "Recibido", tipoIcono: "check", meds: "Acetaminofén 500mg" }
];

// Estado de la pantalla: false = recortado a los primeros 3, true = ver todo el historial
let historialViendoTodo = false;

// Reiniciar el estado de la pantalla cada vez que el usuario entre al Historial
const cambiarPantallaHistorialCompleto = cambiarPantalla;
cambiarPantalla = function(idPantallaDestino) {
    cambiarPantallaHistorialCompleto(idPantallaDestino);
    if(idPantallaDestino === 'pantalla-historial') {
        historialViendoTodo = false; // Forzar estado inicial recortado
        
        // Dejar el contenedor superior limpio y sin scroll al inicio
        const wrapper = document.getElementById('wrapper-scroll-historial');
        if(wrapper) {
            wrapper.style.overflowY = "hidden"; // Oculta el scroll al principio
            wrapper.scrollTop = 0; // Regresa arriba de todo
        }
        
        const btnVerMas = document.getElementById('btn-historial-ver-mas');
        if(btnVerMas) {
            btnVerMas.innerText = "Ver Más";
            btnVerMas.classList.remove('d-none');
        }
        
        renderizarHistorialDinamico();
    }
}

// Renderiza los elementos basándose en si está expandido o recortado
function renderizarHistorialDinamico() {
    const contenedor = document.getElementById('lista-historial-dinamica');
    if (!contenedor) return;

    contenedor.innerHTML = "";
    
    // Si viendoTodo es false muestra los primeros 3, si es true clona y muestra los 10
    const listaAMostrar = historialViendoTodo ? BD_HISTORIAL : BD_HISTORIAL.slice(0, 3);

    listaAMostrar.forEach(item => {
        const svgIcono = item.tipoIcono === "check" 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1A1C1E" class="bi bi-check-circle" viewBox="0 0 16 16">
                 <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                 <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
               </svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1A1C1E" class="bi bi-clock" viewBox="0 0 16 16">
                 <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                 <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
               </svg>`;

        const divCard = document.createElement('div');
        divCard.className = "d-flex align-items-start py-3 card-historial-item";
        divCard.innerHTML = `
            <div class="icon-estado-wrapper me-3 flex-shrink-0">
                ${svgIcono}
            </div>
            <div class="text-start">
                <p class="mb-0 text-fecha-historial">${item.fecha}</p>
                <small class="text-estado-sub d-block mb-1">Estado: ${item.estado}</small>
                <p class="mb-0 text-medicamentos-lista">${item.meds}</p>
            </div>
        `;
        contenedor.appendChild(divCard);
    });
}

// Detonador del botón Ver Más
function cargarMasHistorial() {
    historialViendoTodo = true; // Cambiamos el estado a mostrar todo
    renderizarHistorialDinamico(); // Volvemos a dibujar las 10 tarjetas
    
    // Habilitamos el scroll interno para que el usuario pueda deslizar dentro de la caja controlada
    const wrapper = document.getElementById('wrapper-scroll-historial');
    if(wrapper) {
        wrapper.style.overflowY = "auto";
    }
    
    // Ocultamos el botón de forma limpia ya que no hay más registros que cargar
    document.getElementById('btn-historial-ver-mas').classList.add('d-none');
}

// Acción ilustrativa PDF
function simularDescargaPDF() {
    alert("📄 Generando reporte completo...\nSe han procesado los 10 registros de tu historial en un documento PDF.");
}

// ==========================================================================
// PANTALLA: FEEDBACK - CONTROL INTERACTIVO
// ==========================================================================

// Variables de estado del formulario de feedback
let respuestasFeedback = {
    entregaATiempo: null,
    facilidadUso: null,
    calificacionEstrellas: 0
};

// Reiniciar el formulario de feedback de forma limpia al entrar a la pantalla
const cambiarPantallaFeedbackOriginal = cambiarPantalla;
cambiarPantalla = function(idPantallaDestino) {
    cambiarPantallaFeedbackOriginal(idPantallaDestino);
    if(idPantallaDestino === 'pantalla-feedback') {
        respuestasFeedback = { entregaATiempo: null, facilidadUso: null, calificacionEstrellas: 0 };
        
        // Limpiar chips Sí/No
        document.querySelectorAll('.btn-chip-sino').forEach(btn => btn.classList.remove('selected-chip'));
        
        // Apagar estrellas
        document.querySelectorAll('.estrella-voto').forEach(star => star.classList.remove('active-star'));
        
        // Resetear caja de texto y contador
        const txtArea = document.getElementById('feedback-comentarios');
        if(txtArea) txtArea.value = "";
        
        const contador = document.getElementById('contador-caracteres');
        if(contador) contador.innerText = "0 / 250";
    }
}

// Controla la selección exclusiva de los botones Sí / No
function seleccionarSino(boton, categoria, valor) {
    // Buscar los hermanos directos del botón seleccionado para removerles la marca previa
    const contenedorPadre = boton.parentElement;
    contenedorPadre.querySelectorAll('.btn-chip-sino').forEach(btn => btn.classList.remove('selected-chip'));
    
    // Marcar el botón presionado
    boton.classList.add('selected-chip');
    
    // Guardar en la estructura de datos
    if(categoria === 'entrega') respuestasFeedback.entregaATiempo = valor;
    if(categoria === 'facilidad') respuestasFeedback.facilidadUso = valor;
}

// Controla la acumulación interactiva de las estrellas
function calificarEstrellas(voto) {
    respuestasFeedback.calificacionEstrellas = voto;
    const estrellas = document.querySelectorAll('.estrella-voto');
    
    estrellas.forEach((estrella, indice) => {
        if(indice < voto) {
            estrella.classList.add('active-star'); // Enciende las estrellas hasta el número pulsado
        } else {
            estrella.classList.remove('active-star'); // Apaga el resto hacia la derecha
        }
    });
}

// Actualiza el medidor numérico del textarea
function actualizarContador() {
    const txtArea = document.getElementById('feedback-comentarios');
    const contador = document.getElementById('contador-caracteres');
    if(txtArea && contador) {
        contador.innerText = `${txtArea.value.length} / 250`;
    }
}

// Ejecuta la simulación de almacenamiento del feedback
function enviarFeedback() {
    // Validamos que por lo menos haya seleccionado la puntuación de estrellas
    if(respuestasFeedback.calificacionEstrellas === 0) {
        alert("⚠️ Por favor, selecciona una calificación con estrellas antes de enviar.");
        return;
    }

    alert(`✨ ¡Muchas gracias por tu opinión!\nCalificación: ${respuestasFeedback.calificacionEstrellas} estrellas.\nComentarios enviados con éxito.`);
    cambiarPantalla('pantalla-home'); // Lo regresa automáticamente al Home
}

// ==========================================================================
// PANTALLA: TELÉFONO - MÁQUINA DE MARCADO INTERACTIVA
// ==========================================================================

const NUMERO_PREDETERMINADO = "01-8000-MEDIC";
let numeroActual = NUMERO_PREDETERMINADO;
let estadoMute = false;
let estadoAltavoz = false;

// Interceptamos la navegación para configurar la pantalla cada vez que se llame
const cambiarPantallaTelefono = cambiarPantalla;
cambiarPantalla = function(idPantallaDestino) {
    cambiarPantallaTelefono(idPantallaDestino);
    
    if(idPantallaDestino === 'pantalla-telefono') {
        // Reiniciamos al número de soporte base y estados apagados
        numeroActual = NUMERO_PREDETERMINADO;
        estadoMute = false;
        estadoAltavoz = false;
        
        document.getElementById('pantalla-numero-digitado').innerText = numeroActual;
        document.getElementById('estado-llamada-texto').innerText = "CONECTANDO LÍNEA...";
        document.getElementById('estado-llamada-texto').style.color = "#1CE3B0"; // Verde activo

        document.getElementById('btn-util-mute').classList.remove('active-util');
        document.getElementById('btn-util-altavoz').classList.remove('active-util');
        
        // Simular sonido de llamada conectando a los 1.5 segundos
        setTimeout(() => {
            const txtEstado = document.getElementById('estado-llamada-texto');
            if(txtEstado && numeroActual === NUMERO_PREDETERMINADO) {
                txtEstado.innerText = "LLAMADA EN CURSO (0:01)";
            }
        }, 1500);
    }
}

// Evento al presionar cualquier número del teclado
function presionarTecla(numero) {
    // Si es la primera tecla que hunde y estaba el número de soporte base, lo limpiamos para escribir el nuevo
    if(numeroActual === NUMERO_PREDETERMINADO) {
        numeroActual = "";
        document.getElementById('estado-llamada-texto').innerText = "MARCANDO NÚMERO NUEVO...";
        document.getElementById('estado-llamada-texto').style.color = "#8A9499";
    }
    
    // Validar límite para que no se desborde la pantalla móvil del prototipo (máximo 12 dígitos)
    if(numeroActual.length < 14) {
        numeroActual += numero;
        document.getElementById('pantalla-numero-digitado').innerText = numeroActual;
    }
}

// Controla los toggles visuales de Silenciar y Altavoz
function alternarUtilidad(tipo) {
    if(tipo === 'mute') {
        estadoMute = !estadoMute;
        const btn = document.getElementById('btn-util-mute');
        estadoMute ? btn.classList.add('active-util') : btn.classList.remove('active-util');
    }
    if(tipo === 'altavoz') {
        estadoAltavoz = !estadoAltavoz;
        const btn = document.getElementById('btn-util-altavoz');
        estadoAltavoz ? btn.classList.add('active-util') : btn.classList.remove('active-util');
    }
}

// Cierra la llamada y te regresa automáticamente de donde venías (Home)
function colgarYRegresar() {
    document.getElementById('estado-llamada-texto').innerText = "LLAMADA FINALIZADA";
    document.getElementById('estado-llamada-texto').style.color = "#FF4A4A";
    
    setTimeout(() => {
        cambiarPantalla('pantalla-home');
    }, 400); // Pequeña pausa dramática de 400ms para simular que cuelga antes de cambiar la pantalla
}