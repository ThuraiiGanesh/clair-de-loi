/* ===================================================================
   CLAIR DE LOI — UI Components
   Header, Footer, Article Card, Language Switcher, Global Bookmark Handler
   =================================================================== */
import { LOGO_URL, SOCIAL_LINKS, formatDate, formatCategory, t, getLang, setLang, isBookmarked, toggleBookmark, showToast } from './utils.js';

const LOGO_EXTERNAL = 'https://media.base44.com/images/public/user_69f5970e46da90d039d8c527/808d1a7a2_ClairDeLoiLogo.jpeg';

// ─── HEADER ──────────────────────────────────────────────────────
export function renderHeader(currentPath) {
  const navItems = [
    { key: 'home', path: '/' },
    { key: 'mission', path: '/mission' },
    { key: 'articles', path: '/articles' },
    { key: 'quiz_nav', path: '/quiz' },
    { key: 'contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const currentLang = getLang().toUpperCase();

  return `
    <header class="site-header" id="site-header">
      <nav class="nav-inner">
        <a class="nav-brand" href="#/" aria-label="Clair De Loi Home">
          <img src="${LOGO_EXTERNAL}" alt="Clair De Loi" onerror="this.style.display='none'">
          <span class="nav-brand-text">Clair De Loi</span>
        </a>
        <div class="nav-links">
          ${navItems.map(item => `
            <a href="#${item.path}" class="nav-link ${isActive(item.path) ? 'active' : ''}">${t(item.key)}</a>
          `).join('')}
          
          <!-- Desktop Language Dropdown -->
          <div class="lang-switcher">
            <button class="lang-selected-btn" id="lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="Select Language">
              <span>${currentLang}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="lang-dropdown" id="lang-dropdown">
              <button class="lang-opt ${getLang() === 'en' ? 'active' : ''}" data-lang="en">EN (English)</button>
              <button class="lang-opt ${getLang() === 'zh' ? 'active' : ''}" data-lang="zh">中文 (Chinese)</button>
              <button class="lang-opt ${getLang() === 'ms' ? 'active' : ''}" data-lang="ms">Melayu (Malay)</button>
              <button class="lang-opt ${getLang() === 'ta' ? 'active' : ''}" data-lang="ta">தமிழ் (Tamil)</button>
            </div>
          </div>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Toggle Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div class="mobile-nav-overlay" id="mobile-nav">
        ${navItems.map(item => `
          <a href="#${item.path}" class="mobile-nav-link ${isActive(item.path) ? 'active' : ''}">${t(item.key)}</a>
        `).join('')}
        <a href="#/links" class="mobile-nav-link" style="font-size:1.25rem; color: var(--crimson);">${t('link_hub')}</a>
        
        <!-- Mobile Language Selector Pills -->
        <div class="mobile-lang-pills">
          <button class="lang-pill-btn ${getLang() === 'en' ? 'active' : ''}" data-lang="en">EN</button>
          <button class="lang-pill-btn ${getLang() === 'zh' ? 'active' : ''}" data-lang="zh">中文</button>
          <button class="lang-pill-btn ${getLang() === 'ms' ? 'active' : ''}" data-lang="ms">Melayu</button>
          <button class="lang-pill-btn ${getLang() === 'ta' ? 'active' : ''}" data-lang="ta">தமிழ்</button>
        </div>
      </div>
    </header>
  `;
}

export function bindHeaderEvents() {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (!header) return;

  // Scroll state
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Desktop Language Dropdown toggle
  const langBtn = header.querySelector('#lang-btn');
  const langDropdown = header.querySelector('#lang-dropdown');
  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = langBtn.getAttribute('aria-expanded') === 'true';
      langBtn.setAttribute('aria-expanded', !expanded);
      langDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      langBtn.setAttribute('aria-expanded', 'false');
      langDropdown.classList.remove('active');
    });
  }

  // Language buttons click handlers
  header.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.dataset.lang;
      setLang(lang);
    });
  });
}


// ─── FOOTER ──────────────────────────────────────────────────────
export function renderFooter() {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand-col">
            <img src="${LOGO_URL}" alt="Clair De Loi" class="footer-brand-logo" onerror="this.style.display='none'">
            <p class="footer-tagline">${t('tagline')}</p>
            <p class="footer-desc">${t('footer_desc')}</p>
          </div>
          <div>
            <h4 class="footer-heading">${t('navigate')}</h4>
            <a href="#/" class="footer-link">${t('home')}</a>
            <a href="#/mission" class="footer-link">${t('mission')}</a>
            <a href="#/articles" class="footer-link">${t('articles')}</a>
            <a href="#/quiz" class="footer-link">${t('quiz_nav')}</a>
            <a href="#/contact" class="footer-link">${t('contact')}</a>
            <a href="#/links" class="footer-link">${t('links')}</a>
          </div>
          <div>
            <h4 class="footer-heading">${t('follow_us')}</h4>
            <a href="${SOCIAL_LINKS.instagram_sg}" target="_blank" rel="noopener noreferrer" class="footer-social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              Instagram (Singapore)
            </a>
            <a href="${SOCIAL_LINKS.instagram_main}" target="_blank" rel="noopener noreferrer" class="footer-social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              Instagram (Main)
            </a>
            <a href="${SOCIAL_LINKS.linkedin}" target="_blank" rel="noopener noreferrer" class="footer-social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; ${year} Clair De Loi. All rights reserved.
        </div>
      </div>
    </footer>
  `;
}


// ─── ARTICLE CARD ────────────────────────────────────────────────
export function renderArticleCard(article, options = {}) {
  const { featured = false } = options;
  const imageHtml = article.cover_image_url
    ? `<img src="${article.cover_image_url}" alt="${article.title}" loading="lazy">`
    : `<div class="article-card-placeholder">CDL</div>`;

  const bookmarked = isBookmarked(article.id);
  const bookmarkBtnHtml = `
    <button class="card-bookmark-btn ${bookmarked ? 'active' : ''}" data-bookmark-id="${article.id}" aria-label="${t('bookmark_tooltip')}" title="${t('bookmark_tooltip')}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    </button>
  `;

  return `
    <div class="article-card-wrapper">
      <a href="#/article/${article.id}" class="article-card ${featured ? 'featured' : ''} apple-reveal">
        <div class="article-card-image">
          ${imageHtml}
          <span class="article-card-category">${formatCategory(article.category)}</span>
          ${bookmarkBtnHtml}
        </div>
        <div class="article-card-body">
          <div class="article-card-meta">
            <span>${formatDate(article.published_date)}</span>
            <div class="article-card-meta-divider"></div>
            <span>${article.author || 'Clair De Loi'}</span>
          </div>
          <h3 class="article-card-title">${article.title}</h3>
          <p class="article-card-excerpt">${article.excerpt || ''}</p>
          <span class="article-card-read-more">${t('explore_articles').split(' ')[0]} More</span>
        </div>
      </a>
    </div>
  `;
}

// ─── GLOBAL BOOKMARK CLICK HANDLER ──────────────────────────────
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.card-bookmark-btn');
  if (btn) {
    e.preventDefault();
    e.stopPropagation();
    const id = btn.dataset.bookmarkId;
    const added = toggleBookmark(id);
    
    // Toggle active classes on all matching bookmark buttons in DOM
    document.querySelectorAll(`.card-bookmark-btn[data-bookmark-id="${id}"]`).forEach(el => {
      el.classList.toggle('active', added);
      const svg = el.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', added ? 'currentColor' : 'none');
      }
    });

    showToast(added ? t('saved_badge') + '!' : t('unbookmark') || 'Removed');

    // Automatically trigger reload if we're looking at Bookmarked category
    const activeCategoryPill = document.querySelector('.category-pill.active');
    if (activeCategoryPill && activeCategoryPill.dataset.category === 'saved') {
      activeCategoryPill.click();
    }
  }
});
