(function () {
  'use strict';

  const config = window.URBAN_STAY_ANALYTICS || {};
  const enabled = Boolean(config.enabled && config.scriptUrl);
  const property = config.property || document.title;
  const viewedSections = new Set();

  window.plausible = window.plausible || function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
  window.plausible.init = window.plausible.init || function (options) {
    window.plausible.o = options || {};
  };

  function clean(value, fallback) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return (text || fallback || 'Sin etiqueta').slice(0, 100);
  }

  function track(name, props) {
    if (!enabled) return;
    const safeProps = Object.assign({
      property: property,
      language: document.documentElement.lang || navigator.language || 'unknown'
    }, props || {});
    window.plausible(name, { props: safeProps });
  }

  function labelFor(element) {
    return clean(
      element.dataset.analyticsLabel ||
      element.getAttribute('aria-label') ||
      element.querySelector('h3,strong')?.textContent ||
      element.textContent,
      element.id || element.tagName
    );
  }

  function classifyLink(anchor) {
    const href = anchor.getAttribute('href') || '';
    if (href.startsWith('tel:')) return 'Llamada';
    if (href.includes('wa.me') || href.includes('whatsapp')) return 'WhatsApp';
    if (href.includes('google.com/maps') || href.includes('maps.google') || href.includes('openstreetmap')) return 'Abrir mapa';
    if (href.includes('airbnb.')) return 'Airbnb';
    if (href.startsWith('#')) return 'Navegacion interna';
    if (/^https?:/i.test(href)) return 'Enlace externo';
    return 'Enlace';
  }

  function clickHandler(event) {
    const target = event.target.closest('a,button,[role="button"],.place-card');
    if (!target) return;
    const label = labelFor(target);

    if (target.classList.contains('place-card')) {
      track('Lugar abierto', { label: label, place_id: target.dataset.id || 'unknown' });
      return;
    }
    if (target.dataset.open) {
      track('Informacion abierta', { label: target.dataset.open });
    }
    if (target.dataset.cat) {
      track('Filtro usado', { category: target.dataset.cat, label: label });
    }
    if (target.dataset.eventFilter) {
      track('Filtro de eventos', { category: target.dataset.eventFilter });
    }
    if (target.id === 'copyWifi') track('WiFi copiado');
    if (target.id === 'openConcierge' || target.id === 'sideConcierge' || target.id === 'featureConcierge') track('Concierge abierto');
    if (target.id === 'installBtn' || target.id === 'installAppBtn') track('Instalacion solicitada');
    if (target.id === 'enterBtn') track('Guia iniciada');

    if (target.tagName === 'A') {
      const type = classifyLink(target);
      if (type !== 'Navegacion interna') {
        track(type, { label: label, destination: clean(target.hostname || target.getAttribute('href'), 'unknown') });
      }
    }
  }

  function observeSections() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
        const id = entry.target.id || 'sin-id';
        if (viewedSections.has(id)) return;
        viewedSections.add(id);
        track('Seccion vista', {
          section: id,
          label: clean(entry.target.querySelector('h1,h2')?.textContent, id)
        });
      });
    }, { threshold: [0.35] });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
  }

  function load() {
    document.addEventListener('click', clickHandler, true);
    observeSections();
    window.addEventListener('appinstalled', () => track('Guia instalada'));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') track('Sesion finalizada');
    });

    if (!enabled) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = config.scriptUrl;
    script.dataset.urbanStayAnalytics = 'true';
    script.onerror = () => console.warn('Urban Stay Analytics: no se pudo cargar Plausible.');
    document.head.appendChild(script);
    window.plausible.init(config.options || {});
    track('Laboratorio activo', { version: config.version || '1.0' });
  }

  window.UrbanStayAnalytics = { track: track, enabled: enabled };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
