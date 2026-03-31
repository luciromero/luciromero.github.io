/* =============================================
   main.js – Página personal con Jekyll
   ============================================= */

/* ---------- Tema claro/oscuro ---------- */
(function () {
  const body = document.body;
  const toggleBtn = document.getElementById('themeToggle');
  const storageKey = 'site-theme';
  let fallbackTheme = 'dark';

  const getSavedTheme = function () {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return fallbackTheme;
    }
  };

  const setSavedTheme = function (theme) {
    fallbackTheme = theme;
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Ignorar si el navegador bloquea storage
    }
  };

  const applyTheme = function (theme) {
    const isLight = theme === 'light';
    body.classList.toggle('theme-light', isLight);
    body.classList.toggle('theme-dark', !isLight);
    document.documentElement.setAttribute('data-bs-theme', isLight ? 'light' : 'dark');

    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');
    const text = toggleBtn.querySelector('.theme-toggle-text');

    if (icon) {
      icon.className = isLight ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
    }
    if (text) {
      text.textContent = isLight ? 'Oscuro' : 'Claro';
    }

    toggleBtn.setAttribute('aria-label', isLight ? 'Activar tema oscuro' : 'Activar tema claro');
    toggleBtn.setAttribute('title', isLight ? 'Activar tema oscuro' : 'Activar tema claro');
  };

  const initialTheme = getSavedTheme() || 'dark';
  applyTheme(initialTheme);

  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', function () {
    const nextTheme = body.classList.contains('theme-light') ? 'dark' : 'light';
    setSavedTheme(nextTheme);
    applyTheme(nextTheme);
  });
})();

/* ---------- AOS (Animate on Scroll) ---------- */
AOS.init({
  duration: 780,
  easing: 'ease-out-cubic',
  once: true,
  offset: 70,
});

/* ---------- Navbar: clase "scrolled" al hacer scroll ---------- */
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const toggleScrolled = () => {
    nav.classList.toggle('scrolled', window.scrollY > 48);
  };

  window.addEventListener('scroll', toggleScrolled, { passive: true });
  toggleScrolled(); // ejecutar al cargar por si ya está scrolleado
})();

/* ---------- Smooth scroll + cierre de menú móvil ---------- */
document.querySelectorAll('a[href*="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const rawHref = this.getAttribute('href');
    if (!rawHref || rawHref === '#') return;

    const url = new URL(rawHref, window.location.href);
    const isSamePage = url.pathname === window.location.pathname && url.origin === window.location.origin;
    if (!isSamePage || !url.hash) return;

    const target = document.querySelector(url.hash);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Cerrar el menú colapsable de Bootstrap en móvil
    const navCollapse = document.getElementById('navbarNav');
    if (navCollapse && navCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});

/* ---------- Nav link activo al hacer scroll (Intersection Observer) ---------- */
(function () {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('#mainNav .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          const href = link.getAttribute('href') || '';
          const hash = href.includes('#') ? href.slice(href.indexOf('#')) : href;
          link.classList.toggle(
            'active',
            hash === '#' + entry.target.id
          );
        });
      });
    },
    { threshold: 0.38 }
  );

  sections.forEach(function (s) { observer.observe(s); });
})();

/* ---------- Animación de las barras de habilidades ---------- */
(function () {
  const bars = document.querySelectorAll('.progress-bar[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-width') + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(function (bar) {
    bar.style.width = '0%';         // asegurar punto de partida
    observer.observe(bar);
  });
})();

/* ---------- Formulario de contacto (Formspree) ---------- */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Estado de carga
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando…';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>¡Mensaje enviado!';
        btn.style.background = 'linear-gradient(135deg,#00c853,#00e676)';
        form.reset();
      } else {
        throw new Error('server_error');
      }
    } catch {
      btn.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>Error al enviar. Intenta por email.';
      btn.style.background = 'linear-gradient(135deg,#d32f2f,#f44336)';
    } finally {
      setTimeout(function () {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }
  });
})();

/* ---------- Pre-llenar formulario desde parámetros de plan ---------- */
(function () {
  const params = new URLSearchParams(window.location.search);
  const plan     = params.get('plan');
  const servicio = params.get('servicio');
  const precio   = params.get('precio');

  if (!plan || !servicio) return;

  const subj = document.getElementById('fsubject');
  const msg  = document.getElementById('fmessage');

  if (subj && !subj.value) {
    subj.value = 'Plan ' + plan + ' – ' + servicio;
  }

  if (msg && !msg.value) {
    const precioStr = precio ? ' (desde ' + precio + ')' : '';
    msg.value = 'Hola, me interesa el plan "' + plan + '" de ' + servicio + precioStr + '.\n\n';
    // Posicionar el cursor al final para que el usuario agregue su descripción
    msg.focus();
    msg.setSelectionRange(msg.value.length, msg.value.length);
  }
})();

/* ---------- Botón WhatsApp del formulario de contacto ---------- */
(function () {
  const waBtn = document.getElementById('whatsappContactBtn');
  if (!waBtn) return;

  waBtn.addEventListener('click', function () {
    const name    = (document.getElementById('fname')?.value    || '').trim();
    const contact = (document.getElementById('femail')?.value   || '').trim();
    const subject = (document.getElementById('fsubject')?.value || '').trim();
    const message = (document.getElementById('fmessage')?.value || '').trim();

    var parts = [];
    if (name)    parts.push('Hola, soy ' + name + (contact ? ' (' + contact + ')' : '') + '.');
    if (subject) parts.push('*' + subject + '*');
    if (message) parts.push(message);

    const text  = parts.join('\n');
    const phone = waBtn.getAttribute('data-phone');
    const url   = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
