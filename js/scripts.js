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