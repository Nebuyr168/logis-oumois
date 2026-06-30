/* =======================================================================
   CAMPING DU LAC — script partagé (accueil + pages secondaires)
   - Bascule de style via le sélecteur (#01/#02/#03 + Tarifs sur l'accueil)
   - Mémorise le style choisi (localStorage) et le conserve de page en page
   - Injecte le badge « À modifier » sur les images d'ambiance (placeholders)
   ======================================================================= */
(function () {
  var KEY = 'camping_style';
  var STYLES = ['v-ess', 'v-sig', 'v-pre'];

  function views() { return Array.prototype.slice.call(document.querySelectorAll('.view')); }
  function has(id) { return !!document.getElementById(id); }

  function show(id, save) {
    if (!has(id)) return;
    views().forEach(function (v) { v.classList.toggle('active', v.id === id); });
    document.querySelectorAll('.sw-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.target === id);
    });
    // on ne mémorise QUE les styles (pas l'onglet Tarifs), pour que la
    // navigation entre pages garde la bonne ambiance.
    if (save !== false && STYLES.indexOf(id) > -1) {
      try { localStorage.setItem(KEY, id); } catch (e) {}
    }
    window.scrollTo(0, 0);
  }

  document.querySelectorAll('.sw-btn[data-target]').forEach(function (b) {
    b.addEventListener('click', function () { show(b.dataset.target, true); });
  });

  function initialView() {
    if (location.hash === '#tarifs' && has('v-tar')) return 'v-tar';
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved && has(saved)) return saved;
    for (var i = 0; i < STYLES.length; i++) { if (has(STYLES[i])) return STYLES[i]; }
    var v = views(); return v.length ? v[0].id : null;
  }

  var iv = initialView();
  if (iv) show(iv, false);

  function initBadges() {
    document.querySelectorAll('img[src*="/ambiance/"]').forEach(function (img) {
      if (img.dataset.amod) return;
      img.dataset.amod = '1';
      var host = img.closest('.ph,figure,.media') || img.parentElement;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      var b = document.createElement('span');
      b.className = 'amod-badge';
      b.textContent = 'À modifier';
      host.appendChild(b);
    });
  }
  initBadges();
  document.addEventListener('DOMContentLoaded', initBadges);
})();
