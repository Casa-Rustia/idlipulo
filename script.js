(() => {
  'use strict';
  const trips = window.IDLIPULO_TRIPS || [];
  const config = window.IDLIPULO_CONFIG || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const store = {get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }};
  let saved = new Set((Array.isArray(store.get('idlipulo-saved', [])) ? store.get('idlipulo-saved', []) : []).filter(id => trips.some(t => t.id === id)));
  let toastTimer;
  const toast = message => { const el = $('#toast'); if (!el) return; clearTimeout(toastTimer); el.textContent = message; el.hidden = false; toastTimer = setTimeout(() => { el.hidden = true; }, 3200); };
  const updateSaved = () => {
    $$('[data-saved-count]').forEach(e => { e.textContent = saved.size; });
    $$('[data-save]').forEach(button => {
      const active = saved.has(button.dataset.save);
      const trip = trips.find(t => t.id === button.dataset.save);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', `${active ? 'Remove' : 'Save'} ${trip?.name || 'trip'}${active ? ' from' : ' to'} saved trips`);
      button.innerHTML = active ? '&#9829;' : '&#9825;';
    });
  };
  const card = trip => `<article class="destination-card"><div class="destination-photo"><a href="trip.html?destination=${trip.id}" aria-label="Explore ${escape(trip.name)}"><img src="${trip.image}" alt="${escape(trip.alt)}" width="800" height="680" loading="lazy" decoding="async"/></a><button class="save-button" type="button" data-save="${trip.id}" aria-pressed="false" aria-label="Save ${escape(trip.name)} to saved trips">&#9825;</button><span class="destination-tag">${escape(trip.mood)}</span></div><div class="card-top"><h3><a href="trip.html?destination=${trip.id}">${escape(trip.name)}</a></h3><span class="region">${escape(trip.region)}</span></div><p>${escape(trip.intro)}</p><div class="card-bottom"><span>${trip.days} days · ${trip.nights} nights / suggested</span><a href="trip.html?destination=${trip.id}">Explore trip <span aria-hidden="true">↗</span></a></div></article>`;
  const menu = $('#nav-links'); const toggle = $('#menu-toggle');
  const sizeMenu = () => { if (menu?.classList.contains('is-open')) menu.style.maxHeight = Math.max(80, window.innerHeight - menu.getBoundingClientRect().top - 12) + 'px'; };
  const closeMenu = () => { menu?.classList.remove('is-open'); menu?.style.removeProperty('max-height'); toggle?.setAttribute('aria-expanded', 'false'); toggle?.setAttribute('aria-label', 'Open menu'); };
  toggle?.addEventListener('click', () => { const open = menu.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); sizeMenu(); });
  menu?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { const returnFocus = menu?.classList.contains('is-open') && menu.contains(document.activeElement); closeMenu(); if (returnFocus) toggle.focus(); } });
  document.addEventListener('click', e => { if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  window.addEventListener('resize', () => { if (innerWidth > 1100) closeMenu(); else sizeMenu(); });
  const years = $$('[data-year]'); years.forEach(el => { el.textContent = new Date().getFullYear(); });
  let renderSaved = () => {};
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-save]');
    if (!button) return;
    const id = button.dataset.save; const trip = trips.find(t => t.id === id);
    if (!trip) return;
    const wasSaved = saved.has(id); wasSaved ? saved.delete(id) : saved.add(id);
    const persisted = store.set('idlipulo-saved', [...saved]); updateSaved(); renderSaved();
    toast(`${trip.name} ${wasSaved ? 'removed from' : 'added to'} your saved trips.${persisted ? '' : ' Saving is available for this visit only.'}`);
  });
  const grid = $('#destination-grid');
  if (grid) {
    let category = 'all', query = '';
    const render = () => {
      const filtered = trips.filter(t => (category === 'all' || t.category === category) && `${t.name} ${t.region} ${t.mood} ${t.intro}`.toLowerCase().includes(query.toLowerCase().trim()));
      grid.innerHTML = filtered.length ? filtered.map(card).join('') : '<div class="empty-state"><h3>A different kind of escape?</h3><p>Try another place, or clear your filters to see all six destinations.</p><button class="button outline" type="button" id="reset-filters">Show all destinations</button></div>';
      $('#results-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'destination' : 'destinations'} to make your own`;
      $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === category)));
      updateSaved();
    };
    $$('[data-filter]').forEach(b => b.addEventListener('click', () => { category = b.dataset.filter; $('#travel-style').value = category; render(); }));
    $('#destination-finder')?.addEventListener('submit', e => { e.preventDefault(); query = $('#destination-search').value; category = $('#travel-style').value; render(); $('#destinations').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); });
    document.addEventListener('click', e => { if (e.target.id === 'reset-filters') { query = ''; category = 'all'; $('#destination-search').value = ''; $('#travel-style').value = 'all'; render(); } });
    render();
  }
  if ($('#saved-grid')) {
    renderSaved = () => { const list = trips.filter(t => saved.has(t.id)); $('#saved-grid').innerHTML = list.length ? list.map(card).join('') : '<div class="empty-state"><h2>Your next escape starts here.</h2><p>Tap the heart on a destination to keep it here while you plan.</p><a class="button" href="./#destinations">Explore destinations <span aria-hidden="true">↗</span></a></div>'; updateSaved(); };
    renderSaved();
  }
  if ($('#trip-root')) {
    const id = new URLSearchParams(location.search).get('destination'); const t = trips.find(t => t.id === id);
    if (!t) {
      document.title = 'Find your next escape | IdliPulo';
      $('#trip-root').innerHTML = '<div class="container section empty-state"><p class="eyebrow">A new direction</p><h1>Let’s find your island.</h1><p>That trip isn’t in our collection. Explore the destinations to find your next escape.</p><a class="button" href="./#destinations">See destinations</a></div>';
    } else {
      document.title = `${t.name} travel itinerary | IdliPulo`;
      $('meta[name="description"]').content = `${t.intro} Explore a suggested ${t.days}-day ${t.name} itinerary and plan your trip with IdliPulo.`;
      $('#trip-root').innerHTML = `<div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Home</a><span aria-hidden="true">/</span><a href="./#destinations">Destinations</a><span aria-hidden="true">/</span><span aria-current="page">${escape(t.name)}</span></nav><div class="page-intro"><p class="eyebrow">${escape(t.region)} · ${escape(t.mood)}</p><h1>${escape(t.name)}, at your pace.</h1><p>${escape(t.intro)}</p></div><div class="trip-hero"><img src="${t.image}" alt="${escape(t.alt)}" fetchpriority="high"/><button class="save-button" data-save="${t.id}" type="button" aria-label="Save ${t.name}" aria-pressed="false">&#9825;</button></div><div class="trip-layout"><div class="trip-content"><p class="eyebrow">The feeling</p><p>${escape(t.description)}</p><h2>Little things to look forward to.</h2><ul>${t.highlights.map(h => `<li>${escape(h)}</li>`).join('')}</ul><h2>A little structure. Plenty of freedom.</h2><p>A suggested itinerary to start the conversation. Your final route can be shaped around your dates, interests, and local conditions.</p><ol class="itinerary">${t.plan.map((d, i) => `<li><span class="day-label">DAY ${String(i + 1).padStart(2, '0')}</span><div><h3>${escape(d[0])}</h3><p>${escape(d[1])}</p></div></li>`).join('')}</ol><h2>Make it yours.</h2><p>Tell us your preferred dates, group size, and travel style. Accommodation, transfers, guides, activities, and any entrance or permit fees will be itemised in a tailored proposal before you decide.</p><p class="fine-print">Flights, hotels, excursions, and pricing are not reserved or guaranteed by this sample itinerary. Weather, access rules, and operator availability may change the route.</p></div><aside class="trip-aside" aria-label="Plan this trip"><p class="eyebrow">Your starting point</p><h2>${t.days} days.<br/>A different pace.</h2><p>Build your own ${escape(t.name)} escape.</p><div class="trip-meta"><div><strong>Suggested stay</strong>${t.days} days / ${t.nights} nights</div><div><strong>The route</strong>${escape(t.route)}</div><div><strong>The pace</strong>${escape(t.pace)}</div></div><a class="button" href="plan.html?destination=${t.id}">Plan this escape <span aria-hidden="true">↗</span></a><p class="fine-print">Request a tailored proposal. No payment or booking is made here.</p><a class="text-link" href="./#destinations">Explore other destinations</a></aside></div></div>`;
    }
  }
  const form = $('#inquiry-form');
  if (form) {
    const destinationSelect = $('#trip-destination'); trips.forEach(t => { const o = document.createElement('option'); o.value = t.id; o.textContent = `${t.name}, ${t.region}`; destinationSelect.append(o); });
    const selected = new URLSearchParams(location.search).get('destination'); if (trips.some(t => t.id === selected)) destinationSelect.value = selected;
    $('#saved-trip-chips').innerHTML = saved.size ? [...saved].map(id => `<a class="saved-chip" href="trip.html?destination=${id}">${escape(trips.find(t => t.id === id).name)} ↗</a>`).join('') : '<p class="fine-print">Save a destination with its heart button and come back when you’re ready.</p>';
    const today = new Date(); const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const dateInput = $('#departure'); dateInput.min = minimumDate;
    const flexible = $('#flexible-dates');
    const dateState = () => { dateInput.disabled = flexible.checked; dateInput.required = !flexible.checked; };
    flexible.addEventListener('change', dateState); dateState();
    const realEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.inquiryEmail || '') && !/your(email|domain)|example\.(com|org)/i.test(config.inquiryEmail);
    const sendingButton = $('#send-request'); sendingButton.hidden = !realEmail;
    $('#delivery-note').textContent = realEmail ? 'Review your request before sending it to the travel team. No booking or payment is made by this form.' : 'Email delivery is not connected in this preview. You can prepare and download your trip request; nothing will be sent or booked.';
    form.action = realEmail ? `https://formsubmit.co/${encodeURIComponent(config.inquiryEmail)}` : '#';
    const next = $('#form-next'); if (/^https?:$/.test(location.protocol)) next.value = new URL('thank-you.html', location.href).href;
    const readForm = () => Object.fromEntries(new FormData(form).entries());
    const draftButton = $('#save-draft');
    draftButton.addEventListener('click', () => { const values = readForm(); values['Flexible dates'] = flexible.checked ? 'Flexible' : 'Fixed'; delete values._honey; const ok = store.set('idlipulo-request-draft', values); $('#draft-status').textContent = ok ? 'Draft saved on this device. You can return to this page to finish it.' : 'Your browser could not save this draft. You can still prepare and download your request.'; $('#draft-status').hidden = false; });
    const draft = store.get('idlipulo-request-draft', null);
    if (draft && typeof draft === 'object') {
      Object.entries(draft).forEach(([name,value]) => { const el = form.elements.namedItem(name); if (!el || name.startsWith('_')) return; if (el instanceof RadioNodeList) el.value = value; else if (el.type === 'checkbox') el.checked = value === 'Flexible'; else el.value = value; });
      if (selected && trips.some(t => t.id === selected)) destinationSelect.value = selected;
      dateState(); $('#draft-status').textContent = 'Your saved draft has been restored on this device.'; $('#draft-status').hidden = false;
    }
    let summaryText = ''; const dialog = $('#request-dialog');
    form.addEventListener('submit', event => {
      event.preventDefault(); dateInput.setCustomValidity('');
      if (!flexible.checked && dateInput.value && dateInput.value < minimumDate) dateInput.setCustomValidity('Please choose today or a future date.');
      if (!form.reportValidity()) return;
      const values = readForm(); const t = trips.find(t => t.id === values.Destination);
      const rows = [['Name',values.Name],['Email',values.email],['Service',form.elements.Service?.selectedOptions[0]?.textContent || 'Holiday planning'],['Departure city',values['Departure city'] || 'To discuss'],['Trip length',values['Trip length'] ? values['Trip length'] + ' days' : 'To discuss'],['Destination',t?.name || 'Help me choose'],['Dates',flexible.checked ? 'Flexible dates' : values.Departure],['Travellers',`${values.Adults} adults, ${values.Children} children`],['Budget',values.Budget || 'To discuss'],['Travel style',values.Style || 'Open to suggestions'],['Notes',values.Notes || 'No extra notes']];
      $('#request-summary').innerHTML = rows.map(([key,value]) => `<dt>${escape(key)}</dt><dd>${escape(value)}</dd>`).join('');
      summaryText = 'IdliPulo — Travel request\n\n' + rows.map(([key,value]) => `${key}: ${value}`).join('\n') + '\n\nThis is a trip request, not a confirmed booking.\n';
      $('#review-delivery-note').textContent = realEmail ? 'Check your details, then send your request to the travel team. Your booking is only confirmed after a separate proposal and agreement.' : 'Your request is ready to download. Email delivery is not connected in this preview, so this request has not been sent.';
      dialog.showModal(); document.body.classList.add('dialog-open');
    });
    $('#download-request').addEventListener('click', () => { const blob = new Blob([summaryText],{type:'text/plain;charset=utf-8'}); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'IdliPulo-trip-request.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url),1000); toast('Your trip request has been downloaded.'); });
    sendingButton.addEventListener('click', () => { if (!realEmail || !form.checkValidity()) return; sendingButton.disabled = true; sendingButton.textContent = 'Sending…'; HTMLFormElement.prototype.submit.call(form); });
    $('#close-request').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
    dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
    $('#clear-draft')?.addEventListener('click', () => { try { localStorage.removeItem('idlipulo-request-draft'); } catch {} form.reset(); dateState(); $('#draft-status').textContent = 'Your saved draft has been cleared.'; $('#draft-status').hidden = false; });
  }
  updateSaved();
})();
