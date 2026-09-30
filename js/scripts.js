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
        // Limpia el contenedor por si acaso
        contenedorProyectos.innerHTML = '';

        proyectos.forEach(proyecto => {
          // Crear el artículo de la tarjeta
          const article = document.createElement('article');

          // Crear el título (h3)
          const h3 = document.createElement('h3');
          h3.textContent = `${proyecto.nombre} (${proyecto.anio})`;

          // Crear el párrafo de descripción
          const p = document.createElement('p');
          p.textContent = proyecto.descripcion;
          p.style.display = 'none'; // Inicialmente oculto

          // Crear el botón con el mismo estilo
          const btn = document.createElement('button');
          btn.className = 'btn-card';
          btn.textContent = 'Ver detalles';

          // Evento para mostrar/ocultar detalles
          btn.addEventListener('click', () => {
            if (p.style.display === 'none') {
              p.style.display = 'block';
              btn.textContent = 'Ocultar detalles';
            } else {
              p.style.display = 'none';
              btn.textContent = 'Ver detalles';
            }
          });

          // Armar la estructura del artículo e insertarlo en el contenedor
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

// 4. Validación y Envío con FormSubmit
  const form = document.getElementById('contacto');
  if (form) {
    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('correo');
    const mensaje = document.getElementById('mensaje');

    const errorNombre = document.getElementById('error-nombre');
    const errorCorreo = document.getElementById('error-correo');
    const errorMensaje = document.getElementById('error-mensaje');

    const esCorreoValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

    const mostrarError = (input, elementoError, mensajeTexto) => {
      input.classList.add('input-error');
      elementoError.textContent = mensajeTexto;
    };

    const limpiarError = (input, elementoError) => {
      input.classList.remove('input-error');
      elementoError.textContent = '';
    };

    // Validaciones mientras el usuario escribe
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

      // Si las validaciones pasan, se envía el formulario directamente
      if (esValido) {
        form.submit();
      }
    });
  }