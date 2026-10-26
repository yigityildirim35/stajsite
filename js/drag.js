/* Fare ve dokunmatik ekran için ortak sürükle-bırak.
   HTML5 sürükle-bırak akıllı tahtalarda çalışmadığı için Pointer Events kullanılıyor.
   Bırakılabilecek alanlar "data-drop" özelliği taşır. */
const Drag = {
  active: false,

  /* opts.onDrop(zone, el): bırakma kabul edildiyse true döndürür, değilse parça geri döner.
     opts.onTap(el): parçaya sürüklemeden dokunulduğunda çağrılır. */
  make(el, opts) {
    el.classList.add('draggable');

    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0 || Drag.active) return;
      e.preventDefault();
      const id = e.pointerId;
      const startX = e.clientX;
      const startY = e.clientY;
      let ghost = null;
      let over = null;
      try { el.setPointerCapture(id); } catch (err) { /* eski tarayıcılar */ }

      const move = (ev) => {
        if (ev.pointerId !== id) return;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!ghost) {
          // Küçük titremeler dokunma sayılsın, sürükleme değil
          if (Math.abs(dx) + Math.abs(dy) < 10) return;
          const r = el.getBoundingClientRect();
          ghost = el.cloneNode(true);
          ghost.classList.add('drag-ghost');
          ghost.style.left = r.left + 'px';
          ghost.style.top = r.top + 'px';
          ghost.style.width = r.width + 'px';
          ghost.style.height = r.height + 'px';
          document.body.appendChild(ghost);
          el.classList.add('drag-source');
          Drag.active = true;
        }
        ghost.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.06)';
        const zone = Drag.zoneAt(ev.clientX, ev.clientY);
        if (zone !== over) {
          if (over) over.classList.remove('drop-hover');
          if (zone) zone.classList.add('drop-hover');
          over = zone;
        }
      };

      const end = (ev) => {
        if (ev.pointerId !== id) return;
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', end);
        el.removeEventListener('pointercancel', end);

        if (!ghost) {
          if (ev.type === 'pointerup' && opts.onTap) opts.onTap(el);
          return;
        }
        Drag.active = false;
        if (over) over.classList.remove('drop-hover');

        const accepted = ev.type === 'pointerup' && over && opts.onDrop(over, el);
        if (accepted) {
          ghost.remove();
          el.classList.remove('drag-source');
          return;
        }
        // Kabul edilmedi: parça yumuşakça yerine geri döner
        ghost.classList.add('drag-return');
        ghost.style.transform = 'translate(0,0)';
        setTimeout(() => {
          ghost.remove();
          el.classList.remove('drag-source');
        }, 320);
      };

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    });
  },

  zoneAt(x, y) {
    const hit = document.elementFromPoint(x, y);
    return hit ? hit.closest('[data-drop]') : null;
  }
};
