console.log("CookieLab iniciado");

function setCookie(nombre, valor, maxAgeSegundos) {
    document.cookie = `${nombre}=${valor}; max-age=${maxAgeSegundos}; path=/`;
}

function getCookie(nombre) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [clave, valor] = cookie.split("=");
        if (clave === nombre) {
            return valor;
        }
    }
    return null;
}

function deleteCookie(nombre) {
    document.cookie = `${nombre}=; max-age=0; path=/`;
}

function borrarTodasCookies() {
    deleteCookie("usuario");
    deleteCookie("tema");
    deleteCookie("idioma");
    deleteCookie("visitas");
    deleteCookie("ultima_visita");
    deleteCookie("prueba_corta");
}

const TREINTA_DIAS = 30 * 24 * 60 * 60;
const UN_MINUTO = 60;

const saludoElem = document.getElementById("saludo");
const temaSelect = document.getElementById("tema-select");
const idiomaSelect = document.getElementById("idioma-select");
const contadorVisitasElem = document.getElementById("contador-visitas");
const ultimaVisitaElem = document.getElementById("ultima-visita");
const cambiarNombreBtn = document.getElementById("cambiar-nombre");
const olvidarmeBtn = document.getElementById("olvidarme");
const pruebaCortaElem = document.getElementById("prueba-corta");

function pedirNombre() {
    const nombre = prompt("¿Cómo te llamas?");
    if (nombre && nombre.trim() !== "") {
        setCookie("usuario", nombre.trim(), TREINTA_DIAS);
        return nombre.trim();
    }
    return null;
}

function obtenerSaludo(nombre, idioma) {
    if (idioma === "en") {
        return `Hello again, ${nombre}! 👋`;
    }
    return `¡Hola de nuevo, ${nombre}! 👋`;
}

function obtenerBienvenida(nombre, idioma) {
    if (idioma === "en") {
        return `Welcome, ${nombre}! 👋`;
    }
    return `¡Bienvenido, ${nombre}! 👋`;
}

function aplicarTema(tema) {
    document.body.classList.remove("tema-claro", "tema-oscuro");
    document.body.classList.add(`tema-${tema}`);
    temaSelect.value = tema;
}

function gestionarUsuario() {
    const usuarioCookie = getCookie("usuario");
    const idioma = getCookie("idioma") || "es";

    if (!usuarioCookie) {
        const nombre = pedirNombre();
        if (nombre) {
            const mensaje = obtenerBienvenida(nombre, idioma);
            alert(mensaje);
            saludoElem.textContent = mensaje;
        }
    } else {
        saludoElem.textContent = obtenerSaludo(usuarioCookie, idioma);
    }
}

function gestionarPreferencias() {
    const temaGuardado = getCookie("tema") || "claro";
    const idiomaGuardado = getCookie("idioma") || "es";

    aplicarTema(temaGuardado);
    idiomaSelect.value = idiomaGuardado;

    temaSelect.addEventListener("change", (e) => {
        const nuevoTema = e.target.value;
        setCookie("tema", nuevoTema, TREINTA_DIAS);
        aplicarTema(nuevoTema);
    });

    idiomaSelect.addEventListener("change", (e) => {
        const nuevoIdioma = e.target.value;
        setCookie("idioma", nuevoIdioma, TREINTA_DIAS);

        const usuario = getCookie("usuario");
        if (usuario) {
            saludoElem.textContent = obtenerSaludo(usuario, nuevoIdioma);
        }
    });
}

function gestionarContadorVisitas() {
    const visitasCookie = getCookie("visitas");
    const ultimaVisitaCookie = getCookie("ultima_visita");

    let numVisitas;
    if (!visitasCookie) {
        numVisitas = 1;
    } else {
        numVisitas = Number(visitasCookie) + 1;
    }

    setCookie("visitas", numVisitas, TREINTA_DIAS);

    if (ultimaVisitaCookie) {
        const fechaLegible = decodeURIComponent(ultimaVisitaCookie);
        ultimaVisitaElem.textContent = `Tu última visita fue el ${fechaLegible}.`;
    }

    const ahora = new Date();
    const fechaFormateada = ahora.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    setCookie("ultima_visita", encodeURIComponent(fechaFormateada), TREINTA_DIAS);

    const idioma = getCookie("idioma") || "es";
    if (idioma === "en") {
        contadorVisitasElem.textContent = `You have visited this page ${numVisitas} time${numVisitas === 1 ? "" : "s"}.`;
    } else {
        contadorVisitasElem.textContent = `Has visitado esta página ${numVisitas} vez${numVisitas === 1 ? "" : "es"}.`;
    }
}

function gestionarPanelControl() {
    cambiarNombreBtn.addEventListener("click", () => {
        const nuevoNombre = prompt("Introduce tu nuevo nombre:");
        if (nuevoNombre && nuevoNombre.trim() !== "") {
            const nombreLimpio = nuevoNombre.trim();
            setCookie("usuario", nombreLimpio, TREINTA_DIAS);
            const idioma = getCookie("idioma") || "es";
            saludoElem.textContent = obtenerSaludo(nombreLimpio, idioma);
        }
    });

    olvidarmeBtn.addEventListener("click", () => {
        const confirmar = confirm(
            "¿Estás seguro de que quieres borrar todos tus datos?\n" +
            "Se eliminarán tu nombre, preferencias y contador de visitas."
        );
        if (confirmar) {
            borrarTodasCookies();
            location.reload();
        }
    });
}

function gestionarPruebaCaducidadCorta() {
    const pruebaCorta = getCookie("prueba_corta");
    if (!pruebaCorta) {
        setCookie("prueba_corta", "activa", UN_MINUTO);
        const ahora = new Date();
        const expiracion = new Date(ahora.getTime() + UN_MINUTO * 1000);
        const expiracionStr = expiracion.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        pruebaCortaElem.textContent =
            `⏱️  Cookie de prueba creada (caduca en 1 minuto, a las ${expiracionStr}). ` +
            `Recarga después de ese momento para ver cómo desaparece.`;
    } else {
        pruebaCortaElem.textContent =
            `✅ Cookie de prueba sigue activa. Espera a que expire (1 min desde la primera carga).`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    gestionarPreferencias();
    gestionarUsuario();
    gestionarContadorVisitas();
    gestionarPanelControl();
    gestionarPruebaCaducidadCorta();
});
