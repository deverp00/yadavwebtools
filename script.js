// ============================================================
//  YADAV WEB TOOLS – GLOBAL SCRIPT (MODERN)
//  Includes: Hamburger · Search · Theme · Ripple · Reveal
//            Scroll Progress · Back-to-Top · Header Shadow
//            Nav Scrim · Hero Counters · Card Spotlight
//            Explore More Tools · Universal Navigation
//            Favicon Injection
// ============================================================

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // ---------- 1. HAMBURGER + NAV SCRIM ----------
  var hamburger = $('.hamburger');
  var nav = $('#primary-nav');
  var scrim = $('#navScrim');

  function openNav() {
    if (!nav || !hamburger) return;
    nav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    if (scrim) { scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('show'); }); }
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    if (!nav || !hamburger) return;
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (scrim) {
      scrim.classList.remove('show');
      setTimeout(function () { scrim.hidden = true; }, 260);
    }
    document.body.style.overflow = '';
  }

  if (hamburger && nav) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      nav.classList.contains('open') ? closeNav() : openNav();
    });

    if (scrim) scrim.addEventListener('click', closeNav);

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
        closeNav();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
        hamburger.focus();
      }
    });

    // close nav when a link inside is clicked (mobile)
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 699px)').matches) closeNav();
      });
    });
  }

  // ---------- 2. SEARCH ----------
  var searchToggle = $('#searchToggle');
  var searchBox = $('.search-box');
  var searchInput = $('#searchInput');
  var searchDropdown = $('#searchDropdown');
  var searchContainer = $('#searchContainer');

  if (searchToggle && searchBox && searchInput && searchDropdown) {
    searchToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var expanded = searchBox.classList.toggle('search-expanded');
      searchToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (expanded) {
        searchInput.focus();
        searchDropdown.classList.add('open');
      } else {
        searchDropdown.classList.remove('open');
      }
    });

    searchInput.addEventListener('focus', function () {
      searchDropdown.classList.add('open');
    });

    document.addEventListener('click', function (e) {
      if (searchContainer && !searchContainer.contains(e.target)) {
        searchBox.classList.remove('search-expanded');
        searchToggle.setAttribute('aria-expanded', 'false');
        searchDropdown.classList.remove('open');
      }
    });

    searchInput.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      var items = $$('.dropdown-list li', searchDropdown);
      var hasResults = false;

      items.forEach(function (item) {
        if (item.id === 'noResult') return;
        var text = item.textContent.toLowerCase();
        if (!query || text.indexOf(query) !== -1) {
          item.style.display = '';
          hasResults = true;
        } else {
          item.style.display = 'none';
        }
      });

      var noResult = $('#noResult', searchDropdown);
      if (!hasResults && query.length > 0) {
        if (!noResult) {
          var li = document.createElement('li');
          li.id = 'noResult';
          li.textContent = 'No tools found. Try a different search.';
          li.style.cssText = 'padding:10px 16px;color:var(--text-muted);font-size:.9rem;text-align:center;';
          var lastList = searchDropdown.querySelector('.dropdown-list:last-child');
          if (lastList) lastList.appendChild(li);
        } else {
          noResult.style.display = '';
        }
      } else if (noResult) {
        noResult.style.display = 'none';
      }
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchBox.classList.remove('search-expanded');
        searchDropdown.classList.remove('open');
        searchToggle.setAttribute('aria-expanded', 'false');
        this.blur();
      }
    });

    searchDropdown.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        searchBox.classList.remove('search-expanded');
        searchDropdown.classList.remove('open');
        searchToggle.setAttribute('aria-expanded', 'false');
        searchInput.value = '';
        $$('.dropdown-list li', searchDropdown).forEach(function (item) { item.style.display = ''; });
      }
    });
  }

  // ---------- 3. THEME TOGGLE (persistent) ----------
  var THEME_KEY = 'ywt-theme';
  var toggleBtn = $('#themeToggle');

  function readStoredTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      if (t === 'dark' || t === 'light') return t;
    } catch (e) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    // html[data-theme] drives the CSS variables,
    // body.dark-mode keeps every legacy `.dark-mode ...` rule working.
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }

  applyTheme(readStoredTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  // ---------- 4. RIPPLE ----------
  if (!prefersReducedMotion.matches) {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn');
      if (!btn || btn.disabled) return;
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 0.6;
      var x = e.clientX - rect.left - size / 2;
      var y = e.clientY - rect.top - size / 2;
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  }

  // ---------- 5. SCROLL REVEAL ----------
  var revealEls = $$('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    } else {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
      revealEls.forEach(function (el) { revealObs.observe(el); });
    }
  }

  // ---------- 6. HEADER SHADOW ON SCROLL ----------
  var header = $('#siteHeader');
  if (header) {
    var onHeaderScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onHeaderScroll();
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
  }

  // ---------- 7. SCROLL PROGRESS BAR ----------
  var progress = $('#scrollProgress');
  if (progress) {
    var updateProgress = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      progress.style.width = pct + '%';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  // ---------- 8. BACK TO TOP ----------
  var toTop = $('#toTop');
  if (toTop) {
    var toggleToTop = function () {
      toTop.classList.toggle('show', window.scrollY > 320);
    };
    toggleToTop();
    window.addEventListener('scroll', toggleToTop, { passive: true });

    toTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  }

  // ---------- 9. HERO COUNTERS ----------
  var counters = $$('.stat-num');
  if (counters.length) {
    var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };

    var animateCounter = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (prefersReducedMotion.matches) {
        el.textContent = target + suffix;
        return;
      }
      var start = performance.now();
      var duration = 1400;
      var step = function (now) {
        var t = Math.min(1, (now - start) / duration);
        var val = Math.round(target * easeOutCubic(t));
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var counterObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { counterObs.observe(c); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  // ---------- 10. TOOL CARD SPOTLIGHT ----------
  if (!prefersReducedMotion.matches) {
    var cards = $$('.tool-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 100;
        var my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });

    // Section title bars get the same spotlight
    var titleBars = $$('.section-title-bar');
    titleBars.forEach(function (bar) {
      bar.addEventListener('mousemove', function (e) {
        var rect = bar.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 100;
        var my = ((e.clientY - rect.top) / rect.height) * 100;
        bar.style.setProperty('--mx', mx + '%');
        bar.style.setProperty('--my', my + '%');
      });
    });
  }

})();

// ============================================================
//  EXPLORE MORE TOOLS – Dynamic Injection
// ============================================================
(function () {
  'use strict';

  var tools = [
    { name: 'Access',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>', path: '/dav/tools/accessibility-tool/index.html' },
    { name: 'Age',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', path: '/dav/tools/age-calculator/index.html' },
    { name: 'Archive', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1" ry="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>', path: '/dav/tools/file-archiver/index.html' },
    { name: 'Base',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>', path: '/dav/tools/number-converter/index.html' },
    { name: 'BMI',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><line x1="8" y1="6" x2="8" y2="18"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="16" y1="6" x2="16" y2="18"/></svg>', path: '/dav/tools/bmi-calculator/index.html' },
    { name: 'Curr',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/><polyline points="15 9 18 9 18 12"/><line x1="18" y1="9" x2="14" y2="9"/><polyline points="9 15 6 15 6 12"/><line x1="6" y1="15" x2="10" y2="15"/></svg>', path: '/dav/tools/currency-converter/index.html' },
    { name: 'Forex',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="4" height="12" rx="1"/><line x1="5" y1="6" x2="5" y2="8"/><line x1="5" y1="20" x2="5" y2="22"/><rect x="10" y="12" width="4" height="8" rx="1"/><line x1="12" y1="10" x2="12" y2="12"/><line x1="12" y1="20" x2="12" y2="22"/><rect x="17" y="6" width="4" height="14" rx="1"/><line x1="19" y1="4" x2="19" y2="6"/><line x1="19" y1="20" x2="19" y2="22"/></svg>', path: '/dav/tools/forex-dashboard/index.html' },
    { name: 'GST',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', path: '/dav/tools/gst-calculator/index.html' },
    { name: 'Image',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>', path: '/dav/tools/image-resizer/index.html' },
    { name: 'Loan',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>', path: '/dav/tools/loan-calculator/index.html' },
    { name: 'Merge',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z"/><polyline points="14 2 14 8 20 8"/><polyline points="8 13 11 16 8 19"/><polyline points="16 13 13 16 16 19"/></svg>', path: '/dav/tools/pdf-merger/index.html' },
    { name: 'Pass',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', path: '/dav/tools/password-generator/index.html' },
    { name: 'PDF',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>', path: '/dav/tools/pdf-editor/index.html' },
    { name: 'Percent', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><line x1="5" y1="5" x2="19" y2="19"/></svg>', path: '/dav/tools/percentage-calculator/index.html' },
    { name: 'QR',      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><line x1="14" y1="14" x2="14" y2="21"/><line x1="17" y1="14" x2="17" y2="21"/><line x1="14" y1="17" x2="21" y2="17"/></svg>', path: '/dav/tools/qr-generator/index.html' },
    { name: 'SIP',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>', path: '/dav/tools/sip-calculator/index.html' },
    { name: 'Hosting', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.13.12a4 4 0 0 0 5.64 0l.13-.12a4 4 0 0 1 5.64 0l.13.12z"/><path d="M12 12v.01"/></svg>', path: '/dav/tools/hosting-checker/index.html' },
    { name: 'JSON',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 8 16 13"/><polyline points="8 21 3 16 8 11"/><line x1="16" y1="8" x2="3" y2="8"/><line x1="21" y1="16" x2="8" y2="16"/></svg>', path: '/dav/tools/json-editor/index.html' },
    { name: 'Text',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>', path: '/dav/tools/text-counter/index.html' },
    { name: 'Unit',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', path: '/dav/tools/unit-converter/index.html' }
  ];

  function getCurrentPath() { return window.location.pathname; }

  function getRandomTools(currentPath, count) {
    var available = tools.filter(function (t) { return t.path !== currentPath; });
    if (available.length <= count) return available;
    var shuffled = available.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
    }
    return shuffled.slice(0, count);
  }

  function buildMoreToolsHTML() {
    var currentPath = getCurrentPath();
    if (currentPath.indexOf('/tools/') === -1) return null;

    var picks = getRandomTools(currentPath, 4);
    if (!picks.length) return null;

    var html = '';
    html += '<section class="section tools-section more-tools-section reveal" style="margin-top:32px;">';
    html += '  <div class="section-title-bar">';
    html += '    <h2>Explore More Tools</h2>';
    html += '    <p class="section-sub">Try something else — hand-picked for you.</p>';
    html += '  </div>';
    html += '  <div class="section-body">';
    html += '    <div class="more-tools-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;">';

    picks.forEach(function (tool) {
      html += '<a href="' + tool.path + '" class="more-tool-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 10px;color:var(--text);text-decoration:none;min-height:90px;text-align:center;transition:transform .26s cubic-bezier(.22,.61,.36,1),border-color .26s cubic-bezier(.22,.61,.36,1),box-shadow .26s cubic-bezier(.22,.61,.36,1);">';
      html += '  <span style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;margin-bottom:6px;color:var(--brand);">' + tool.icon + '</span>';
      html += '  <span style="font-weight:600;font-size:.85rem;color:var(--text);">' + tool.name + '</span>';
      html += '</a>';
    });

    html += '    </div>';
    html += '  </div>';
    html += '</section>';

    return html;
  }

  function insertMoreTools() {
    var html = buildMoreToolsHTML();
    if (!html) return;

    var footer = document.querySelector('.site-footer');
    if (!footer) return;

    var temp = document.createElement('div');
    temp.innerHTML = html;
    while (temp.children.length > 0) {
      footer.parentNode.insertBefore(temp.children[0], footer);
    }

    var cards = document.querySelectorAll('.more-tool-card');
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px)';
        this.style.borderColor = 'var(--brand)';
        this.style.boxShadow = '0 12px 30px rgba(0,0,0,.08)';
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform = '';
        this.style.borderColor = 'var(--border)';
        this.style.boxShadow = '';
      });
    });

    var section = document.querySelector('.more-tools-section');
    if (section && 'IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(section);
    } else if (section) {
      section.classList.add('visible');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertMoreTools);
  } else {
    insertMoreTools();
  }
})();

// ============================================================
//  UNIVERSAL NAVIGATION ACTIVE STATE
// ============================================================
(function () {
  'use strict';

  var currentPath = window.location.pathname;
  var navList = document.querySelector('.nav-list');
  if (!navList) return;

  var allLinks = navList.querySelectorAll('a');
  allLinks.forEach(function (link) { link.removeAttribute('aria-current'); });

  // ---- Tool pages ----
  if (currentPath.indexOf('/tools/') !== -1) {
    var toolName = '';
    var match = document.title.match(/^(.*?)\s*[—·]\s*Yadav Web Tools$/);
    if (match) {
      toolName = match[1].trim();
    } else {
      var parts = currentPath.split('/');
      for (var i = 0; i < parts.length; i++) {
        if (parts[i] === 'tools' && i + 1 < parts.length) {
          var folder = parts[i + 1];
          toolName = folder.replace(/-/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); });
          break;
        }
      }
    }

    if (toolName) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#';
      a.textContent = toolName;
      a.setAttribute('aria-current', 'page');
      a.style.cursor = 'default';
      a.style.pointerEvents = 'none';
      li.appendChild(a);
      navList.appendChild(li);
    }
    return;
  }

  // ---- Static pages ----
  var navMap = {
    '/dav/': 'Home',
    '/dav/index.html': 'Home',
    '/dav/about/': 'About',
    '/dav/about/index.html': 'About',
    '/dav/contact/': 'Contact',
    '/dav/contact/index.html': 'Contact',
    '/dav/privacy-policy/': 'Privacy Policy',
    '/dav/privacy-policy/index.html': 'Privacy Policy',
    '/dav/disclaimer/': 'Disclaimer',
    '/dav/disclaimer/index.html': 'Disclaimer',
    '/dav/terms/': 'Terms',
    '/dav/terms/index.html': 'Terms'
  };

  var expectedLabel = null;
  for (var path in navMap) {
    if (currentPath === path || currentPath === path + 'index.html') {
      expectedLabel = navMap[path];
      break;
    }
  }

  if (!expectedLabel) {
    allLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && currentPath.endsWith(href.replace(/^\//, ''))) {
        expectedLabel = link.textContent.trim();
      }
    });
  }

  if (expectedLabel) {
    allLinks.forEach(function (link) {
      if (link.textContent.trim() === expectedLabel) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }
})();

// ============================================================
//  FAVICON AUTO-INJECT
// ============================================================
(function () {
  if (document.querySelector('link[rel="icon"]')) return;
  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = '/dav/favicon.svg';
  document.head.appendChild(link);
})();
