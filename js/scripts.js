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

  // 3. Carga dinámica de Tarjetas de Proyectos desde archivo JSON
  const contenedorProyectos = document.getElementById('contenedor-proyectos');

  if (contenedorProyectos) {
    fetch('proyectos.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar el archivo de proyectos');
        }
        return response.json();
      })
      .then(proyectos => {
        contenedorProyectos.innerHTML = '';

        proyectos.forEach(proyecto => {
          const article = document.createElement('article');

          const h3 = document.createElement('h3');
          h3.textContent = `${proyecto.nombre} (${proyecto.anio})`;

          const p = document.createElement('p');
          p.textContent = proyecto.descripcion;
          p.style.display = 'none';

          const btn = document.createElement('button');
          btn.className = 'btn-card';
          btn.textContent = 'Ver detalles';

          btn.addEventListener('click', () => {
            if (p.style.display === 'none') {
              p.style.display = 'block';
              btn.textContent = 'Ocultar detalles';
            } else {
              p.style.display = 'none';
              btn.textContent = 'Ver detalles';
            }
          });

          article.appendChild(h3);
          article.appendChild(p);
          article.appendChild(btn);

          contenedorProyectos.appendChild(article);
        });
      })
      .catch(error => {
        console.error('Error:', error);
        contenedorProyectos.innerHTML = '<p>No se pudieron cargar los proyectos en este momento.</p>';
      });
  }

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
    const btnText = btnEnviar ? btnEnviar.querySelector('.btn-text') : null;
    const mensajeExito = document.getElementById('mensaje-exito');

    const esCorreoValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

    const mostrarError = (input, elementoError, mensajeTexto) => {
      input.classList.add('input-error');
      if (elementoError) elementoError.textContent = mensajeTexto;
    };

    const limpiarError = (input, elementoError) => {
      input.classList.remove('input-error');
      if (elementoError) elementoError.textContent = '';
    };

    // Validaciones en tiempo real
    nombre.addEventListener('input', () => {
      if (nombre.value.trim().length >= 3) limpiarError(nombre, errorNombre);
    });

    correo.addEventListener('input', () => {
      if (esCorreoValido(correo.value.trim())) limpiarError(correo, errorCorreo);
    });

    mensaje.addEventListener('input', () => {
      if (mensaje.value.trim().length >= 10) limpiarError(mensaje, errorMensaje);
    });

    // Evento Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let esValido = true;

      // Validación Nombre
      if (nombre.value.trim().length < 3) {
        mostrarError(nombre, errorNombre, 'El nombre debe tener al menos 3 caracteres.');
        esValido = false;
      } else {
        limpiarError(nombre, errorNombre);
      }

      // Validación Correo
      if (!esCorreoValido(correo.value.trim())) {
        mostrarError(correo, errorCorreo, 'Ingresa un correo electrónico válido.');
        esValido = false;
      } else {
        limpiarError(correo, errorCorreo);
      }

      // Validación Mensaje
      if (mensaje.value.trim().length < 10) {
        mostrarError(mensaje, errorMensaje, 'Escribe un mensaje de al menos 10 caracteres.');
        esValido = false;
      } else {
        limpiarError(mensaje, errorMensaje);
      }

      // Petición AJAX si el formulario es válido
      if (esValido) {
        if (btnEnviar) btnEnviar.disabled = true;
        if (btnText) btnText.textContent = 'Enviando...';

        fetch('https://formsubmit.co/ajax/rubenn626@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            nombre: nombre.value.trim(),
            email: correo.value.trim(),
            mensaje: mensaje.value.trim(),
            _subject: 'Nuevo mensaje desde tu sitio web'
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Respuesta del servidor no fue OK');
            }
            return response.json();
          })
          .then(data => {
            if (btnEnviar) btnEnviar.disabled = false;
            if (btnText) btnText.textContent = 'Enviar Mensaje';

            if (mensajeExito) {
              mensajeExito.style.display = 'block';
              mensajeExito.style.color = '#155724';
              mensajeExito.style.backgroundColor = '#d4edda';
              mensajeExito.style.padding = '10px';
              mensajeExito.style.borderRadius = '5px';
              mensajeExito.style.marginTop = '15px';
              mensajeExito.textContent = '✔ ¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.';
            }

            form.reset();

            setTimeout(() => {
              if (mensajeExito) mensajeExito.style.display = 'none';
            }, 6000);
          })
          .catch(error => {
            console.error('Error al enviar formulario:', error);
            if (btnEnviar) btnEnviar.disabled = false;
            if (btnText) btnText.textContent = 'Enviar Mensaje';

            if (mensajeExito) {
              mensajeExito.style.display = 'block';
              mensajeExito.style.color = '#721c24';
              mensajeExito.style.backgroundColor = '#f8d7da';
              mensajeExito.style.padding = '10px';
              mensajeExito.style.borderRadius = '5px';
              mensajeExito.style.marginTop = '15px';
              mensajeExito.textContent = '❌ Hubo un error al enviar el mensaje. Revisa tu conexión o inténtalo más tarde.';
            }
          });
      }
    });
  }
});