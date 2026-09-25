document.addEventListener('DOMContentLoaded', () => {
  // 1. Resaltar enlace activo
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // 2. Botón de Modo Oscuro / Claro
  const header = document.querySelector('header');
  if (header) {
    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle';
    themeBtn.className = 'btn-secondary';

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

  // 3. Tarjetas de Proyectos
  const articles = document.querySelectorAll('.tarjetas article');
  articles.forEach(article => {
    const btn = document.createElement('button');
    btn.className = 'btn-card';
    btn.textContent = 'Ver detalles';

    const paragraph = article.querySelector('p');
    if (paragraph) paragraph.style.display = 'none';

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

  // 4. Validación y Envío con FormSubmit (AJAX)
  const form = document.getElementById('contacto');
  if (form) {
    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('correo');
    const mensaje = document.getElementById('mensaje');

    const errorNombre = document.getElementById('error-nombre');
    const errorCorreo = document.getElementById('error-correo');
    const errorMensaje = document.getElementById('error-mensaje');

    const btnEnviar = document.getElementById('btn-enviar');
    const btnText = btnEnviar.querySelector('.btn-text');
    const btnLoader = btnEnviar.querySelector('.btn-loader');
    const mensajeExito = document.getElementById('mensaje-exito');

    const esCorreoValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

    const mostrarError = (input, elementoError, mensajeTexto) => {
      input.classList.add('input-error');
      elementoError.textContent = mensajeTexto;
    };

    const limpiarError = (input, elementoError) => {
      input.classList.remove('input-error');
      elementoError.textContent = '';
    };

    // Validaciones al escribir
    nombre.addEventListener('input', () => {
      if (nombre.value.trim().length >= 3) limpiarError(nombre, errorNombre);
    });

    correo.addEventListener('input', () => {
      if (esCorreoValido(correo.value.trim())) limpiarError(correo, errorCorreo);
    });

    mensaje.addEventListener('input', () => {
      if (mensaje.value.trim().length >= 10) limpiarError(mensaje, errorMensaje);
    });

    // Envío del formulario
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let esValido = true;

      if (nombre.value.trim().length < 3) {
        mostrarError(nombre, errorNombre, 'El nombre debe tener al menos 3 caracteres.');
        esValido = false;
      } else {
        limpiarError(nombre, errorNombre);
      }

      if (!esCorreoValido(correo.value.trim())) {
        mostrarError(correo, errorCorreo, 'Ingresa un correo electrónico válido.');
        esValido = false;
      } else {
        limpiarError(correo, errorCorreo);
      }

      if (mensaje.value.trim().length < 10) {
        mostrarError(mensaje, errorMensaje, 'El mensaje debe tener al menos 10 caracteres.');
        esValido = false;
      } else {
        limpiarError(mensaje, errorMensaje);
      }

      if (esValido) {
        // Mostrar Estado de Carga
        btnEnviar.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        // Petición AJAX a FormSubmit
        fetch('https://formsubmit.co/ajax/rubenn626@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            Nombre: nombre.value.trim(),
            Email: correo.value.trim(),
            Mensaje: mensaje.value.trim(),
            _subject: 'Nuevo mensaje desde tu sitio web'
          })
        })
          .then(response => response.json())
          .then(data => {
            btnEnviar.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';

            mensajeExito.style.display = 'block';
            mensajeExito.textContent = '✔ ¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.';
            form.reset();

            setTimeout(() => {
              mensajeExito.style.display = 'none';
            }, 6000);
          })
          .catch(error => {
            btnEnviar.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';

            mensajeExito.style.display = 'block';
            mensajeExito.textContent = '❌ Hubo un error al enviar el mensaje. Inténtalo nuevamente.';
          });
      }
    });
  }
});