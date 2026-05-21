let usuarioLogueado = null;

const BD_USUARIOS = [
    { correo: "test@medicapp.com", pass: "123456", nombreCompleto: "Emma" },
    { correo: "usuario@correo.com", pass: "password", nombreCompleto: "Carlos Gómez" }
];

function ejecutarLogin(event) {
    event.preventDefault(); 
    
    const correoInput = document.getElementById('login-correo').value.trim().toLowerCase();
    const passInput = document.getElementById('login-pass').value;
    const contenedorError = document.getElementById('login-error-alert');

    contenedorError.classList.add('d-none');

    const usuarioValido = BD_USUARIOS.find(user => user.correo === correoInput && user.pass === passInput);

    if (usuarioValido) {
        usuarioLogueado = usuarioValido;

        const nombreAMostrar = usuarioLogueado.nombreCompleto || "Invitado";
        document.getElementById('home-saludo-usuario').innerText = nombreAMostrar;

        document.getElementById('login-correo').value = "";
        document.getElementById('login-pass').value = "";
        cambiarPantalla('pantalla-home');
    } else {
        contenedorError.innerText = "❌ El correo electrónico o la contraseña son incorrectos.";
        contenedorError.classList.remove('d-none');
    }
}

function ejecutarRegistro(event) {
    event.preventDefault();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const correo = document.getElementById('reg-correo').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    const passConfirm = document.getElementById('reg-pass-confirm').value;
    const alerta = document.getElementById('registro-alert');

    alerta.className = "alert d-none text-xs py-2 px-3 rounded-3 mb-3 text-start";
    alerta.innerText = "";

    if (pass !== passConfirm) {
        alerta.innerText = "⚠️ Las contraseñas ingresadas no coinciden. Por favor, verifícalas.";
        alerta.classList.add('alert-danger');
        alerta.classList.remove('d-none');
        
        document.getElementById('reg-pass-confirm').focus();
        return;
    }

    const usuarioDuplicado = BD_USUARIOS.find(user => user.correo === correo);
    if (usuarioDuplicado) {
        alerta.innerText = "❌ Este correo electrónico ya está registrado en nuestra base de datos.";
        alerta.classList.add('alert-danger');
        alerta.classList.remove('d-none');
        return;
    }

    BD_USUARIOS.push({
        correo: correo,
        pass: pass,
        nombreCompleto: nombre
    });

    document.getElementById('reg-nombre').value = "";
    document.getElementById('reg-correo').value = "";
    document.getElementById('reg-pass').value = "";
    document.getElementById('reg-pass-confirm').value = "";

    alert("✨ ¡Cuenta creada con éxito!\nYa puedes ingresar usando tu correo y contraseña registrados.");
    cambiarPantalla('pantalla-login');
}

function cambiarPantalla(idPantallaDestino) {
    const pantallas = document.querySelectorAll('.contenedor-movil > section');
    pantallas.forEach(pantalla => {
        pantalla.classList.add('d-none');
    });
    
    const pantallaDestino = document.getElementById(idPantallaDestino);
    if (pantallaDestino) {
        pantallaDestino.classList.remove('d-none');
        
        if(idPantallaDestino === 'pantalla-agregar-med') {
            const columnas = document.querySelectorAll('.wheel-col');
            columnas.forEach(col => actualizarSeleccionRueda(col));
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const columnas = document.querySelectorAll('.wheel-col');
    
    columnas.forEach(col => {
        col.addEventListener('scroll', () => {
            actualizarSeleccionRueda(col);
        });
    });
});

function actualizarSeleccionRueda(columna) {
    const items = columna.querySelectorAll('.wheel-item');
    const containerRect = columna.getBoundingClientRect();
    const containerCenter = containerRect.top + (containerRect.height / 2);

    items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + (itemRect.height / 2);
        
        if (Math.abs(containerCenter - itemCenter) < 22) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function agregarMedicamentoDinamico() {
    const inputMed = document.getElementById('med-nombre');
    const nombre = inputMed.value.trim();
    
    if (nombre === "") {
        alert("Por favor, ingrese el nombre del medicamento antes de agregarlo.");
        return;
    }

    const cantSelected = document.querySelector('#col-cantidad .wheel-item.selected');
    const tipoSelected = document.querySelector('#col-tipo .wheel-item.selected');
    const frecSelected = document.querySelector('#col-frecuencia .wheel-item.selected');

    const cantidad = cantSelected ? cantSelected.innerText : '1';
    const tipo = tipoSelected ? tipoSelected.innerText : 'pildora';
    const frecuencia = frecSelected ? frecSelected.innerText : 'diario';

    const dosificacionCompleta = `${cantidad} ${tipo}, ${frecuencia}`;

    const lista = document.getElementById('lista-medicamentos-dinamica');
    
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
    
    lista.insertBefore(nuevoItem, lista.firstChild);
    
    inputMed.value = "";
}

function limpiarFormularioMed() {
    document.getElementById('med-nombre').value = "";
}

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

let filtroActual = 'distancia';

document.addEventListener("DOMContentLoaded", () => {
    renderizarFarmacias(BD_FARMACIAS);
});

const cambiarPantallaOriginal = cambiarPantalla; 
cambiarPantalla = function(idPantallaDestino) {
    cambiarPantallaOriginal(idPantallaDestino);
    if(idPantallaDestino === 'pantalla-farmacias') {
        document.getElementById('buscar-farmacia').value = "";
        ejecutarFiltroYBusqueda();
    }
}

function renderizarFarmacias(lista) {
    const contenedor = document.getElementById('lista-farmacias-dinamica');
    if (!contenedor) return;
    
    contenedor.innerHTML = "";

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

function filtrarFarmacias() {
    ejecutarFiltroYBusqueda();
}

function ejecutarFiltroYBusqueda() {
    const textoBusqueda = document.getElementById('buscar-farmacia').value.toLowerCase().trim();
    
    let farmaciasFiltradas = BD_FARMACIAS.filter(farmacia => {
        const coincideNombre = farmacia.nombre.toLowerCase().includes(textoBusqueda);
        const coincideMedicamento = farmacia.medicamentos.some(med => med.includes(textoBusqueda));
        return coincideNombre || coincideMedicamento;
    });

    if (filtroActual === 'distancia') {
        farmaciasFiltradas.sort((a, b) => a.distanciaKm - b.distanciaKm);
    } else if (filtroActual === 'medicamento' && textoBusqueda !== "") {
        farmaciasFiltradas.sort((a, b) => {
            const tieneA = a.medicamentos.includes(textoBusqueda) ? 1 : 0;
            const tieneB = b.medicamentos.includes(textoBusqueda) ? 1 : 0;
            return tieneB - tieneA;
        });
    }

    renderizarFarmacias(farmaciasFiltradas);
}

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

let historialViendoTodo = false;

const cambiarPantallaHistorialCompleto = cambiarPantalla;
cambiarPantalla = function(idPantallaDestino) {
    cambiarPantallaHistorialCompleto(idPantallaDestino);
    if(idPantallaDestino === 'pantalla-historial') {
        historialViendoTodo = false; 
        
        const wrapper = document.getElementById('wrapper-scroll-historial');
        if(wrapper) {
            wrapper.style.overflowY = "hidden"; 
            wrapper.scrollTop = 0; 
        }
        
        const btnVerMas = document.getElementById('btn-historial-ver-mas');
        if(btnVerMas) {
            btnVerMas.innerText = "Ver Más";
            btnVerMas.classList.remove('d-none');
        }
        
        renderizarHistorialDinamico();
    }
}

function renderizarHistorialDinamico() {
    const contenedor = document.getElementById('lista-historial-dinamica');
    if (!contenedor) return;

    contenedor.innerHTML = "";
    
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

function cargarMasHistorial() {
    historialViendoTodo = true; 
    renderizarHistorialDinamico(); 
    
    const wrapper = document.getElementById('wrapper-scroll-historial');
    if(wrapper) {
        wrapper.style.overflowY = "auto";
    }
    
    document.getElementById('btn-historial-ver-mas').classList.add('d-none');
}

function simularDescargaPDF() {
    alert("📄 Generando reporte completo...\nSe han procesado los 10 registros de tu historial en un documento PDF.");
}

let respuestasFeedback = {
    entregaATiempo: null,
    facilidadUso: null,
    calificacionEstrellas: 0
};

const cambiarPantallaFeedbackOriginal = cambiarPantalla;
cambiarPantalla = function(idPantallaDestino) {
    cambiarPantallaFeedbackOriginal(idPantallaDestino);
    if(idPantallaDestino === 'pantalla-feedback') {
        respuestasFeedback = { entregaATiempo: null, facilidadUso: null, calificacionEstrellas: 0 };
        
        document.querySelectorAll('.btn-chip-sino').forEach(btn => btn.classList.remove('selected-chip'));
        
        document.querySelectorAll('.estrella-voto').forEach(star => star.classList.remove('active-star'));
        
        const txtArea = document.getElementById('feedback-comentarios');
        if(txtArea) txtArea.value = "";
        
        const contador = document.getElementById('contador-caracteres');
        if(contador) contador.innerText = "0 / 250";
    }
}

function seleccionarSino(boton, categoria, valor) {
    const contenedorPadre = boton.parentElement;
    contenedorPadre.querySelectorAll('.btn-chip-sino').forEach(btn => btn.classList.remove('selected-chip'));
    
    boton.classList.add('selected-chip');
    
    if(categoria === 'entrega') respuestasFeedback.entregaATiempo = valor;
    if(categoria === 'facilidad') respuestasFeedback.facilidadUso = valor;
}

function calificarEstrellas(voto) {
    respuestasFeedback.calificacionEstrellas = voto;
    const estrellas = document.querySelectorAll('.estrella-voto');
    
    estrellas.forEach((estrella, indice) => {
        if(indice < voto) {
            estrella.classList.add('active-star'); 
        } else {
            estrella.classList.remove('active-star'); 
        }
    });
}

function actualizarContador() {
    const txtArea = document.getElementById('feedback-comentarios');
    const contador = document.getElementById('contador-caracteres');
    if(txtArea && contador) {
        contador.innerText = `${txtArea.value.length} / 250`;
    }
}

function enviarFeedback() {
    if(respuestasFeedback.calificacionEstrellas === 0) {
        alert("⚠️ Por favor, selecciona una calificación con estrellas antes de enviar.");
        return;
    }

    alert(`✨ ¡Muchas gracias por tu opinión!\nCalificación: ${respuestasFeedback.calificacionEstrellas} estrellas.\nComentarios enviados con éxito.`);
    cambiarPantalla('pantalla-home'); 
}

const NUMERO_PREDETERMINADO = "01-8000-MEDIC";
let numeroActual = NUMERO_PREDETERMINADO;
let estadoMute = false;
let estadoAltavoz = false;

const cambiarPantallaTelefono = cambiarPantalla;
cambiarPantalla = function(idPantallaDestino) {
    cambiarPantallaTelefono(idPantallaDestino);
    
    if(idPantallaDestino === 'pantalla-telefono') {
        numeroActual = NUMERO_PREDETERMINADO;
        estadoMute = false;
        estadoAltavoz = false;
        
        document.getElementById('pantalla-numero-digitado').innerText = numeroActual;
        document.getElementById('estado-llamada-texto').innerText = "CONECTANDO LÍNEA...";
        document.getElementById('estado-llamada-texto').style.color = "#1CE3B0"; 

        document.getElementById('btn-util-mute').classList.remove('active-util');
        document.getElementById('btn-util-altavoz').classList.remove('active-util');
        
        setTimeout(() => {
            const txtEstado = document.getElementById('estado-llamada-texto');
            if(txtEstado && numeroActual === NUMERO_PREDETERMINADO) {
                txtEstado.innerText = "LLAMADA EN CURSO (0:01)";
            }
        }, 1500);
    }
}

function presionarTecla(numero) {
    if(numeroActual === NUMERO_PREDETERMINADO) {
        numeroActual = "";
        document.getElementById('estado-llamada-texto').innerText = "MARCANDO NÚMERO NUEVO...";
        document.getElementById('estado-llamada-texto').style.color = "#8A9499";
    }
    
    if(numeroActual.length < 14) {
        numeroActual += numero;
        document.getElementById('pantalla-numero-digitado').innerText = numeroActual;
    }
}

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

function colgarYRegresar() {
    document.getElementById('estado-llamada-texto').innerText = "LLAMADA FINALIZADA";
    document.getElementById('estado-llamada-texto').style.color = "#FF4A4A";
    
    setTimeout(() => {
        cambiarPantalla('pantalla-home');
    }, 400); 
}
