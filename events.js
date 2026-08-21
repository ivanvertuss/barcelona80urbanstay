(() => {
  const MONTHS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const section = document.getElementById('eventos');
  if (!section) return;
  const grid = section.querySelector('.events-grid--upcoming');
  if (!grid) return;

  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

  fetch('./events.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`events.json ${response.status}`);
      return response.json();
    })
    .then(data => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const events = (data.events || []).filter(event => {
        const date = new Date(`${event.date}T00:00:00`);
        return !Number.isNaN(date.getTime()) && date >= today;
      }).slice(0, 8);
      if (!events.length) return;

      grid.innerHTML = events.map((event, index) => {
        const date = new Date(`${event.date}T00:00:00`);
        const day = String(date.getDate()).padStart(2, '0');
        const month = MONTHS[date.getMonth()];
        const details = [event.venue, event.time ? event.time.slice(0,5) : ''].filter(Boolean).join(' · ');
        return `<a class="event-card${index === 0 ? ' event-card--featured' : ''}" href="${escapeHtml(event.url)}" target="_blank" rel="noopener"><span class="event-date"><b>${day}</b><small>${month}</small></span><div><strong>${escapeHtml(event.name)}</strong><small>${escapeHtml(details || 'Vigo')}</small></div><em>Ver información y entradas</em></a>`;
      }).join('');

      const eyebrow = section.querySelector('.section-heading .eyebrow');
      if (eyebrow) {
        const updated = data.updatedAt ? new Date(data.updatedAt) : new Date();
        eyebrow.textContent = `AGENDA ACTUALIZADA · ${MONTHS[updated.getMonth()]} ${updated.getFullYear()}`;
      }
    })
    .catch(error => console.warn('Urban Stay: se mantienen los eventos de respaldo.', error));
})();
