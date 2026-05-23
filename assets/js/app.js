/* ============================================================
   Vaishnavi Gaushala — Shared App Script
   ----------------------------------------------------------------
   Loaded on every page after Bootstrap + GSAP.
   Responsibilities:
     1. Inject reusable HTML partials (navbar, footer, etc.)
     2. Set the active nav link based on the current URL
     3. Stamp the current year into the footer
     4. Sticky-nav scroll state
     5. Cart state in localStorage + cart-count badge
     6. Footer accordion on mobile
     7. Toast helper (window.vaiToast)
     8. Back-to-top button injection + behaviour
     9. Page-fade transition on internal link clicks
     10. Loading splash flag for first-visit
   ============================================================ */

(function () {
  'use strict';

  // ------------------------------------------------------------
  // 1. Partial loader
  // ------------------------------------------------------------
  /**
   * loadPartial — fetch an HTML fragment and inject it into the
   * first element with [data-partial="<name>"].
   *
   * Usage in markup:
   *   <header data-partial="navbar"></header>
   *   <footer data-partial="footer"></footer>
   *
   * Looks for the file at /components/<name>.html.
   * Resolves once injection + after-callback have run.
   */
  window.loadPartial = async function loadPartial(name, afterInject) {
    const host = document.querySelector(`[data-partial="${name}"]`);
    if (!host) return;
    try {
      const res = await fetch(`components/${name}.html`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Partial ${name} returned ${res.status}`);
      host.innerHTML = await res.text();
      if (typeof afterInject === 'function') afterInject(host);
      host.dispatchEvent(new CustomEvent('partial:loaded', { bubbles: true, detail: { name } }));
    } catch (err) {
      console.error('[loadPartial]', err);
      // Friendly fallback so the page still functions
      host.innerHTML = `<div style="padding:1rem;color:#7A1F1F;">
        Could not load ${name}. Serve the site via a local server (e.g. VS Code Live Server)
        so fetch() can reach /components/${name}.html.
      </div>`;
    }
  };

  // ------------------------------------------------------------
  // 2. Highlight active nav link
  // ------------------------------------------------------------
  function setActiveNav() {
    // Pull "data-page" from <body>; falls back to filename inference.
    const explicit = document.body.dataset.page;
    let active = explicit;
    if (!active) {
      const path = location.pathname.toLowerCase();
      if (path.includes('product'))   active = 'products';
      else if (path.includes('service')) active = 'services';
      else if (path.includes('about'))   active = 'about';
      else if (path.includes('contact')) active = 'contact';
      else if (path.includes('cart'))    active = 'cart';
      else if (path.includes('login') || path.includes('register')) active = 'login';
      else if (path.includes('profile')) active = 'profile';
      else active = 'home';
    }
    document.querySelectorAll('[data-nav]').forEach(el => {
      if (el.dataset.nav === active) {
        el.setAttribute('aria-current', 'page');
      } else {
        el.removeAttribute('aria-current');
      }
    });
  }

  // ------------------------------------------------------------
  // 3. Year stamp
  // ------------------------------------------------------------
  function stampYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  // ------------------------------------------------------------
  // 4. Sticky nav scroll state
  // ------------------------------------------------------------
  function initStickyNav() {
    const nav = document.querySelector('[data-vai-nav]');
    if (!nav) return;
    const update = () => {
      if (window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // ------------------------------------------------------------
  // 5. Cart state
  // ------------------------------------------------------------
  const CART_KEY = 'vai_cart_v1';

  const Cart = {
    get() {
      try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
      } catch {
        return [];
      }
    },
    set(items) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      this.renderBadge();
      document.dispatchEvent(new CustomEvent('cart:changed', { detail: { items } }));
    },
    count() {
      return this.get().reduce((sum, l) => sum + (l.qty || 0), 0);
    },
    add(product, qty = 1) {
      const items = this.get();
      const existing = items.find(l => l.id === product.id && l.size === product.size);
      if (existing) {
        existing.qty += qty;
      } else {
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: product.size || product.weight || '',
          qty
        });
      }
      this.set(items);
    },
    update(id, size, qty) {
      const items = this.get().map(l =>
        (l.id === id && l.size === size) ? { ...l, qty } : l
      ).filter(l => l.qty > 0);
      this.set(items);
    },
    remove(id, size) {
      this.set(this.get().filter(l => !(l.id === id && l.size === size)));
    },
    clear() { this.set([]); },
    subtotal() {
      return this.get().reduce((sum, l) => sum + (l.price * l.qty), 0);
    },
    renderBadge() {
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        const c = this.count();
        el.textContent = c;
        el.style.display = c > 0 ? 'inline-flex' : 'none';
      });
    }
  };
  window.vaiCart = Cart;

  // ------------------------------------------------------------
  // 6. Footer accordion (mobile only)
  // ------------------------------------------------------------
  function initFooterAccordion() {
    const cols = document.querySelectorAll('.vai-footer__col-collapsible');
    cols.forEach(col => {
      const h = col.querySelector('h4');
      if (!h) return;
      h.setAttribute('role', 'button');
      h.setAttribute('tabindex', '0');
      const toggle = () => {
        // only operates on mobile widths via CSS, but no harm if user clicks on desktop
        if (window.matchMedia('(max-width: 767.98px)').matches) {
          col.classList.toggle('is-open');
        }
      };
      h.addEventListener('click', toggle);
      h.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }

  // ------------------------------------------------------------
  // 7. Toast
  // ------------------------------------------------------------
  function ensureToastNode() {
    let t = document.querySelector('.vai-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'vai-toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    return t;
  }
  window.vaiToast = function (message, variant = 'success') {
    const node = ensureToastNode();
    node.className = `vai-toast vai-toast--${variant}`;
    node.textContent = message;
    requestAnimationFrame(() => node.classList.add('is-visible'));
    clearTimeout(node._timer);
    node._timer = setTimeout(() => node.classList.remove('is-visible'), 2400);
  };

  // ------------------------------------------------------------
  // 8. Back-to-top button
  // ------------------------------------------------------------
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15"/>
      </svg>`;
    document.body.appendChild(btn);

    const onScroll = () => {
      if (window.scrollY > 600) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------
  // 9. Loading splash (first-visit only, gated by sessionStorage)
  // ------------------------------------------------------------
  const SPLASH_KEY = 'vai_splash_shown_v1';
  function maybeShowSplash() {
    if (sessionStorage.getItem(SPLASH_KEY)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem(SPLASH_KEY, '1');
      return;
    }
    const splash = document.createElement('div');
    splash.className = 'vai-splash';
    splash.setAttribute('aria-hidden', 'true');
    splash.innerHTML = `
      <img class="vai-splash__mark logo-img logo-img--blend" src="assets/img/vaishnavilogo.jpeg" alt="Vaishnavi Gau Seva Gausansthan" width="96" height="96" />
      <div class="vai-splash__wordmark">Vaishnavi</div>
      <div class="vai-splash__deva">गऊ सेवा</div>
    `;
    document.body.appendChild(splash);
    sessionStorage.setItem(SPLASH_KEY, '1');
    // Fade out after ~1s
    setTimeout(() => {
      splash.classList.add('is-out');
      setTimeout(() => splash.remove(), 500);
    }, 900);
  }

  // ------------------------------------------------------------
  // 10. Page transition (internal link clicks)
  // ------------------------------------------------------------
  function initPageTransitions() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      // Skip if modifier keys, target=_blank, download, external, mailto/tel, hash-only, or data-no-transition
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (a.target === '_blank') return;
      if (a.hasAttribute('download')) return;
      if (a.dataset.noTransition !== undefined) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
      if (href.startsWith('#')) return;
      try {
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname && url.search === location.search) return; // same page
      } catch { return; }

      e.preventDefault();
      overlay.classList.add('is-active');
      setTimeout(() => { location.href = a.href; }, 220);
    });

    // pageshow handles back/forward cache returns
    window.addEventListener('pageshow', () => overlay.classList.remove('is-active'));
  }

  // ------------------------------------------------------------
  // 11. Footer newsletter (lives in every footer, on every page)
  // ------------------------------------------------------------
  function initFooterNewsletter() {
    const form = document.querySelector('.vai-footer [data-newsletter]');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value.trim();
      if (!email) {
        window.vaiToast && window.vaiToast('Please enter your email.', 'error');
        return;
      }
      window.vaiToast && window.vaiToast('Thank you. Letters arriving shortly.', 'success');
      form.reset();
    });
  }

  // ------------------------------------------------------------
  // 12. Bootstrap UI lifecycle
  // ------------------------------------------------------------
  function onReady() {
    maybeShowSplash();
    Promise.all([
      window.loadPartial('navbar', () => {
        setActiveNav();
        initStickyNav();
        Cart.renderBadge();
      }),
      // Footer is now inlined directly into each page (not a partial).
      // We resolve immediately so the rest of the lifecycle proceeds.
      Promise.resolve()
    ]).then(() => {
      initBackToTop();
      initPageTransitions();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
