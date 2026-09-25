document.addEventListener('DOMContentLoaded', () => {
  // 1. Resaltar el enlace activo del menú de navegación
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // 2. Agregar botón de cambio de tema (Modo Oscuro / Claro) en el Header
  const header = document.querySelector('header');
  if (header) {
    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle';
    themeBtn.className = 'btn-secondary';

    // Recuperar preferencia previa del usuario
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      themeBtn.textContent = '☀️ Modo Claro';
    } else {
      themeBtn.textContent = '🌙 Modo Oscuro';
    }

    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const darkActive = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', darkActive ? 'dark' : 'light');
      themeBtn.textContent = darkActive ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    });

    header.appendChild(themeBtn);
  }

  // 3. Agregar dinamismo a las Tarjetas de Proyectos (Perfil.html)
  const articles = document.querySelectorAll('.tarjetas article');
  articles.forEach(article => {
    const btn = document.createElement('button');
    btn.className = 'btn-card';
    btn.textContent = 'Ver detalles';

    // Ocultar texto por defecto para hacer las tarjetas interactivas
    const paragraph = article.querySelector('p');
    if (paragraph) {
      paragraph.style.display = 'none';
    }

    btn.addEventListener('click', () => {
      if (paragraph.style.display === 'none') {
        paragraph.style.display = 'block';
        btn.textContent = 'Ocultar detalles';
      } else {
        paragraph.style.display = 'none';
        btn.textContent = 'Ver detalles';
      }
    });

    article.appendChild(btn);
  });

  // 4. Manejo e interactividad del Formulario de Contacto (Contactos.html)
  const form = document.querySelector('form');
  if (form) {
    // Reemplazar submit nativo con confirmación dinámica
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre')?.value;
      const correo = document.getElementById('correo')?.value;

      if (nombre && correo) {
        // Notificación o mensaje visual en pantalla
        const mensajeExito = document.createElement('div');
        mensajeExito.className = 'alerta-exito';
        mensajeExito.textContent = `¡Gracias, ${nombre}! Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto a ${correo}.`;

        form.replaceWith(mensajeExito);
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contacto');
  const nombre = document.getElementById('nombre');
  const correo = document.getElementById('correo');
  const mensaje = document.getElementById('mensaje');

  const btnEnviar = document.getElementById('btn-enviar');
  const btnText = btnEnviar.querySelector('.btn-text');
  const btnLoader = btnEnviar.querySelector('.btn-loader');
  const mensajeExito = document.getElementById('mensaje-exito');

  // Función para validar correo mediante expresión regular
  const esCorreoValido = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Mostrar mensaje de error
  const mostrarError = (input, elementoError, mensajeTexto) => {
    input.classList.add('input-error');
    elementoError.textContent = mensajeTexto;
  };

  // Limpiar mensaje de error
  const limpiarError = (input, elementoError) => {
    input.classList.remove('input-error');
    elementoError.textContent = '';
  };

  // Validaciones en tiempo real (mientras el usuario escribe)
  nombre.addEventListener('input', () => {
    if (nombre.value.trim().length >= 3) {
      limpiarError(nombre, document.getElementById('error-nombre'));
    }
  });

  correo.addEventListener('input', () => {
    if (esCorreoValido(correo.value.trim())) {
      limpiarError(correo, document.getElementById('error-correo'));
    }
  });

  mensaje.addEventListener('input', () => {
    if (mensaje.value.trim().length >= 10) {
      limpiarError(mensaje, document.getElementById('error-mensaje'));
    }
  });

  // Manejo del evento de envío
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let esValido = true;

    // Validar Nombre
    if (nombre.value.trim() === '') {
      mostrarError(nombre, document.getElementById('error-nombre'), 'Por favor, ingresa tu nombre.');
      esValido = false;
    } else if (nombre.value.trim().length < 3) {
      mostrarError(nombre, document.getElementById('error-nombre'), 'El nombre debe tener al menos 3 caracteres.');
      esValido = false;
    } else {
      limpiarError(nombre, document.getElementById('error-nombre'));
    }

    // Validar Correo
    if (correo.value.trim() === '') {
      mostrarError(correo, document.getElementById('error-correo'), 'Por favor, ingresa tu correo electrónico.');
      esValido = false;
    } else if (!esCorreoValido(correo.value.trim())) {
      mostrarError(correo, document.getElementById('error-correo'), 'Ingresa un correo electrónico válido.');
      esValido = false;
    } else {
      limpiarError(correo, document.getElementById('error-correo'));
    }

    // Validar Mensaje
    if (mensaje.value.trim() === '') {
      mostrarError(mensaje, document.getElementById('error-mensaje'), 'Por favor, escribe un mensaje.');
      esValido = false;
    } else if (mensaje.value.trim().length < 10) {
      mostrarError(mensaje, document.getElementById('error-mensaje'), 'El mensaje debe contener al menos 10 caracteres.');
      esValido = false;
    } else {
      limpiarError(mensaje, document.getElementById('error-mensaje'));
    }

    // Si todo es válido, simular envío
    if (esValido) {
      btnEnviar.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline';

      setTimeout(() => {
        btnEnviar.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';

        // Mostrar alerta de éxito
        mensajeExito.style.display = 'block';
        form.reset();

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          mensajeExito.style.display = 'none';
        }, 5000);
      }, 1500);
    }
  });
});

const formulario = document.querySelector("#contacto");

if (formulario) {
  const nombre = document.querySelector("#nombre");
  const correo = document.querySelector("#correo");
  const mensaje = document.querySelector("#mensaje");

  const errorNombre = document.querySelector("#error-nombre");
  const errorCorreo = document.querySelector("#error-correo");
  const errorMensaje = document.querySelector("#error-mensaje");

  const exito = document.querySelector("#mensaje-exito");

  // marca o limpia un campo y escribe su mensaje de error
  function marcar(campo, parrafo, texto) {
    parrafo.textContent = texto;
    if (texto === "") {
      campo.classList.remove("campo-invalido");
    } else {
      campo.classList.add("campo-invalido");
    }
  }

  // muestra el mensaje de cierre dentro de la pagina
  function mostrarExito(texto) {
    exito.textContent = texto;
    exito.classList.remove("oculto");
  }

  // lo esconde otra vez al empezar un envio nuevo
  function ocultarExito() {
    exito.textContent = "";
    exito.classList.add("oculto");
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();          // sin esto la pagina se recarga
    ocultarExito();                   // se limpia lo de la vez anterior

    let valido = true;

    // nombre: al menos 3 caracteres que no sean espacios
    if (nombre.value.trim().length < 3) {
      marcar(nombre, errorNombre, "Escriba su nombre completo");
      valido = false;
    } else {
      marcar(nombre, errorNombre, "");
    }

    // correo: no vacio, con arroba, y con un punto despues de la arroba
    const posArroba = correo.value.indexOf("@");

    if (correo.value.trim() === "") {
      marcar(correo, errorCorreo, "Escriba su correo");
      valido = false;
    } else if (posArroba === -1) {
      marcar(correo, errorCorreo, "Al correo le falta la arroba");
      valido = false;
    } else if (correo.value.indexOf(".", posArroba) === -1) {
      marcar(correo, errorCorreo, "Al correo le falta el punto despues de la arroba");
      valido = false;
    } else {
      marcar(correo, errorCorreo, "");
    }

    // mensaje: al menos 10 caracteres
    if (mensaje.value.trim().length < 10) {
      marcar(mensaje, errorMensaje, "Escriba un mensaje de al menos 10 letras");
      valido = false;
    } else {
      marcar(mensaje, errorMensaje, "");
    }

    if (valido) {
      fetch("https://formsubmit.co/ajax/rubenn626@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nombre: nombre.value, correo: correo.value,
          mensaje: mensaje.value, _captcha: "false"
        })
      })
        .then(function () { formulario.reset(); mostrarExito("Su mensaje fue enviado."); })
        .catch(function () { mostrarExito("No se pudo enviar."); });

      formulario.reset();
      
    }
  });
}