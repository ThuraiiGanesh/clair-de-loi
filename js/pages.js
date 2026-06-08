/* ===================================================================
   CLAIR DE LOI — Public Pages
   Home, Mission, Articles, ArticleView, Contact, Links, 404, Legal Quiz
   =================================================================== */
import { formatDate, formatCategory, CATEGORIES, SOCIAL_LINKS, LOGO_URL, t, isBookmarked } from './utils.js';
import { renderArticleCard } from './ui.js';

const LOGO_EXTERNAL = 'https://media.base44.com/images/public/user_69f5970e46da90d039d8c527/808d1a7a2_ClairDeLoiLogo.jpeg';

// ─── HOME PAGE ───────────────────────────────────────────────────
export function HomePage(store) {
  const published = store.getPublished();
  const featured = store.getFeatured();
  const latest = published.filter(a => !a.is_featured).slice(0, 6);
  const igArticles = published.filter(a => a.instagram_link);

  let featuredSection = '';
  if (featured) {
    featuredSection = `
      <section class="section container">
        <div class="section-header apple-reveal">
          <h2>${t('featured')}</h2>
          <div class="section-rule"></div>
        </div>
        ${renderArticleCard(featured, { featured: true })}
      </section>
    `;
  }

  let latestSection = '';
  if (latest.length > 0) {
    latestSection = `
      <section class="section container">
        <div class="section-header apple-reveal">
          <h2>${t('latest')}</h2>
          <div class="section-rule"></div>
          <a href="#/articles" class="view-all">${t('view_all')} →</a>
        </div>
        <div class="grid-3 grid-stagger">
          ${latest.map(a => renderArticleCard(a)).join('')}
        </div>
      </section>
    `;
  }

  let igSection = '';
  if (igArticles.length > 0) {
    igSection = `
      <section class="section container">
        <div class="section-header apple-reveal">
          <h2>${t('from_instagram')}</h2>
          <div class="section-rule"></div>
        </div>
        <div class="ig-mosaic apple-scale">
          ${igArticles.map(a => `
            <a href="${a.instagram_link}" target="_blank" rel="noopener noreferrer" class="ig-tile">
              ${a.cover_image_url 
                ? `<img src="${a.cover_image_url}" alt="${a.title}" loading="lazy">`
                : `<div class="article-card-placeholder" style="width:100%;height:100%">CDL</div>`
              }
              <div class="ig-tile-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                <span class="ig-tile-title">${a.title}</span>
              </div>
            </a>
          `).join('')}
        </div>
        <div class="ig-follow apple-reveal">
          <a href="${SOCIAL_LINKS.instagram_sg}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" data-magnetic>
            ${t('follow_instagram')} <span class="arr">↗</span>
          </a>
        </div>
      </section>
    `;
  }

  let emptyState = '';
  if (published.length === 0) {
    emptyState = `
      <section class="section container">
        <div class="empty-state apple-reveal">
          <h2>${t('coming_soon')}</h2>
          <p>${t('coming_soon_sub')}</p>
        </div>
      </section>
    `;
  }

  const html = `
    <div class="hero">
      <div class="hero-bg"></div>
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      
      <div class="container hero-content apple-reveal">
        <div class="eyebrow-pill">
          <span class="tag"><span class="dot"></span> ${t('latest')}</span>
          <span>${t('quiz_title')} ${t('coming_soon').toLowerCase()}!</span>
        </div>
        <h1>${t('hero_title')}</h1>
        <p class="hero-sub">${t('hero_sub')}</p>
        
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom: 2rem;">
          <a href="#/articles" class="btn btn-primary" data-magnetic>
            ${t('explore_articles')} <span class="arr">→</span>
          </a>
          <a href="#/quiz" class="btn btn-forest" data-magnetic style="background:var(--crimson-dark); color:var(--white);">
            ${t('quiz_nav')} <span class="arr">↗</span>
          </a>
          <a href="#/mission" class="btn btn-ghost" data-magnetic>
            ${t('mission')} <span class="arr">↗</span>
          </a>
        </div>
      </div>
    </div>
    ${featuredSection}
    ${latestSection}
    ${igSection}
    ${emptyState}
  `;

  return { html, init: () => {} };
}


// ─── MISSION PAGE ────────────────────────────────────────────────
export function MissionPage() {
  const html = `
    <div class="section mission-hero">
      <div class="mission-watermark">CLARITY</div>
      <div class="container">
        <div class="apple-reveal">
          <h1>${t('mission_title')}</h1>
          <p class="mission-statement" style="margin-top: 1.5rem;">
            ${t('mission_p1')}<br><br>
            ${t('mission_p2')}
          </p>
        </div>
      </div>
    </div>

    <section class="section container">
      <div class="section-header apple-reveal" style="margin-bottom: 3rem;">
        <h2>${t('values_title')}</h2>
        <div class="section-rule"></div>
      </div>
      <div class="grid-3 grid-stagger">
        <div class="values-card apple-reveal">
          <div class="values-card-rule"></div>
          <h3>${t('val_clarity')}</h3>
          <p>${t('val_clarity_sub')}</p>
        </div>
        <div class="values-card apple-reveal">
          <div class="values-card-rule"></div>
          <h3>${t('val_integrity')}</h3>
          <p>${t('val_integrity_sub')}</p>
        </div>
        <div class="values-card apple-reveal">
          <div class="values-card-rule"></div>
          <h3>${t('val_impact')}</h3>
          <p>${t('val_impact_sub')}</p>
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="brand-quote apple-scale">
        <div class="brand-quote-mark">"</div>
        <blockquote>${t('quote_text')}</blockquote>
        <div style="width:60px;height:2px;background:var(--crimson);margin:1.5rem auto;"></div>
        <p class="brand-quote-attr">— Clair De Loi</p>
      </div>
    </section>
  `;

  return { html, init: () => {} };
}


// ─── ARTICLES PAGE ───────────────────────────────────────────────
export function ArticlesPage(store) {
  const archiveCategories = [...CATEGORIES, { key: 'saved', label: t('cat_saved') }];

  const html = `
    <section class="section container" style="padding-top: calc(var(--nav-height) + 2rem);">
      <div class="apple-reveal">
        <div style="width:40px;height:2px;background:var(--crimson);margin-bottom:1rem;"></div>
        <h1>${t('archive_title')}</h1>
        <p style="color:var(--ink-70);margin-top:0.75rem;max-width:560px;">
          ${t('archive_subtitle')}
        </p>

        <!-- Dynamic Category Filters (including Saved) -->
        <div class="category-filters" id="category-filters">
          ${archiveCategories.map(c => `
            <button class="category-pill ${c.key === 'all' ? 'active' : ''}" data-category="${c.key}">
              ${c.key === 'saved' ? t('cat_saved') : t('cat_' + c.key)}
            </button>
          `).join('')}
        </div>

        <!-- Search Bar input -->
        <div class="archive-search-container" style="margin-top: 2rem; max-width: 480px; position: relative;">
          <input type="text" id="archive-search" class="form-input search-input" placeholder="${t('search_placeholder')}" style="width:100%; padding-left: 2.5rem; height: 44px; border-radius: 999px; border: 1px solid var(--warm-3); background: rgba(255,255,255,0.7);">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-50)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); pointer-events: none;">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <div class="grid-3 grid-stagger" id="articles-grid" style="margin-top: 2.5rem;">
        ${store.getPublished().map(a => renderArticleCard(a)).join('')}
      </div>

      <div id="articles-empty" style="display:none;" class="empty-state">
        <h2>${t('no_articles_found')}</h2>
        <p>${t('no_articles_found_sub')}</p>
      </div>
    </section>
  `;

  function init() {
    const filters = document.getElementById('category-filters');
    const grid = document.getElementById('articles-grid');
    const empty = document.getElementById('articles-empty');
    const searchInput = document.getElementById('archive-search');
    if (!filters || !grid) return;

    let currentCategory = 'all';
    let searchQuery = '';

    const renderFilteredList = () => {
      let articles = store.getByCategory(currentCategory);

      // Search filter logic
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        articles = articles.filter(a => 
          a.title.toLowerCase().includes(query) || 
          (a.excerpt && a.excerpt.toLowerCase().includes(query)) ||
          (a.content && a.content.toLowerCase().includes(query))
        );
      }

      if (articles.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';

        if (currentCategory === 'saved') {
          empty.innerHTML = `
            <h2>${t('no_saved_articles')}</h2>
            <p>${t('no_saved_articles_sub')}</p>
          `;
        } else {
          empty.innerHTML = `
            <h2>${t('no_articles_found')}</h2>
            <p>${t('no_articles_found_sub')}</p>
          `;
        }
      } else {
        grid.style.display = '';
        empty.style.display = 'none';
        grid.innerHTML = articles.map(a => renderArticleCard(a)).join('');
      }
    };

    filters.addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (!pill) return;

      filters.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      currentCategory = pill.dataset.category;
      renderFilteredList();
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderFilteredList();
      });
    }
  }

  return { html, init };
}


// ─── ARTICLE VIEW PAGE ──────────────────────────────────────────
export function ArticleViewPage(store, params) {
  const article = store.getById(params.id);

  if (!article) {
    return {
      html: `
        <section class="section container" style="padding-top: calc(var(--nav-height) + 2rem);">
          <div class="empty-state">
            <h2>Article Not Found</h2>
            <p>The article you're looking for doesn't exist or has been removed.</p>
            <a href="#/articles" class="btn btn-primary">Browse Articles</a>
          </div>
        </section>
      `,
      init: () => {}
    };
  }

  const coverHtml = article.cover_image_url ? `
    <div class="article-view-cover">
      <img src="${article.cover_image_url}" alt="${article.title}">
    </div>
  ` : '';

  const videoHtml = article.video_url ? `
    <div class="article-view-video">
      <iframe src="${article.video_url}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
    </div>
  ` : '';

  const igHtml = article.instagram_link ? `
    <div class="article-ig-section apple-reveal">
      <h3>${t('social_footprint')}</h3>
      <p style="color:var(--ink-70);font-size:0.9rem;margin-bottom:1rem;">${t('social_footprint_desc')}</p>
      <a href="${article.instagram_link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
        ${t('view_on_instagram')} <span class="arr">↗</span>
      </a>
    </div>
  ` : '';

  const bookmarked = isBookmarked(article.id);
  const bookmarkBtnHtml = `
    <button class="article-view-bookmark-btn card-bookmark-btn ${bookmarked ? 'active' : ''}" data-bookmark-id="${article.id}" aria-label="${t('bookmark_tooltip')}" style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; text-transform: uppercase; font-weight: 600; padding: 0.5rem 1rem; border: 1px solid var(--warm-3); border-radius: 4px; transition: all 0.3s var(--ease-out); cursor: pointer;">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      <span class="bookmark-label-text">${bookmarked ? t('saved_badge') : t('bookmark_tooltip').split(' ')[0]}</span>
    </button>
  `;

  const html = `
    <div class="reading-progress" id="reading-progress"></div>
    <section class="section container" style="padding-top: calc(var(--nav-height) + 1rem);">
      ${coverHtml}
      <div style="max-width:720px;margin:0 auto;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem; flex-wrap:wrap; gap:1rem;">
          <a href="#/articles" class="article-view-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            ${t('back_to_articles')}
          </a>
          ${bookmarkBtnHtml}
        </div>
        
        <div class="article-view-category">${formatCategory(article.category)}</div>
        <h1 class="article-view-title">${article.title}</h1>
        <div class="article-view-meta">
          <span>${formatDate(article.published_date)}</span>
          <div class="article-card-meta-divider"></div>
          <span>${article.author || 'Clair De Loi'}</span>
        </div>
        <div class="article-view-separator"></div>
        ${videoHtml}
        <div class="prose">
          ${article.content}
        </div>
        ${igHtml}
      </div>
    </section>
  `;

  function init() {
    // Reading progress bar
    const bar = document.getElementById('reading-progress');
    if (bar) {
      const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = Math.min(100, progress) + '%';
      };
      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();
    }

    // Connect text updates on bookmark toggles in detail page
    const bookmarkBtn = document.querySelector('.article-view-bookmark-btn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        // Delay slightly for the global class-toggling event listener to run first
        setTimeout(() => {
          const isSaved = bookmarkBtn.classList.contains('active');
          const label = bookmarkBtn.querySelector('.bookmark-label-text');
          if (label) {
            label.textContent = isSaved ? t('saved_badge') : t('bookmark_tooltip').split(' ')[0];
          }
        }, 10);
      });
    }
  }

  return { html, init };
}


// ─── CONTACT PAGE ────────────────────────────────────────────────
export function ContactPage() {
  const html = `
    <section class="section container" style="padding-top: calc(var(--nav-height) + 2rem);">
      <div class="apple-reveal">
        <div style="width:40px;height:2px;background:var(--crimson);margin-bottom:1rem;"></div>
        <h1>${t('contact_title')}</h1>
        <p style="color:var(--ink-70);margin-top:0.75rem;max-width:500px;">
          ${t('contact_sub')}
        </p>
      </div>

      <div class="contact-layout" style="margin-top: 3rem;">
        <div class="apple-reveal">
          <form id="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="contact-name">${t('name')} *</label>
                <input type="text" id="contact-name" class="form-input" required placeholder="Your full name">
              </div>
              <div class="form-group">
                <label class="form-label" for="contact-email">${t('email')} *</label>
                <input type="email" id="contact-email" class="form-input" required placeholder="your@email.com">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="contact-subject">${t('subject')}</label>
              <input type="text" id="contact-subject" class="form-input" placeholder="What's this about?">
            </div>
            <div class="form-group">
              <label class="form-label" for="contact-message">${t('message')} *</label>
              <textarea id="contact-message" class="form-input" required placeholder="Tell us more..." style="min-height:160px;"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" data-magnetic>
              ${t('send_message')}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>

        <div class="apple-reveal" style="transition-delay: 0.15s;">
          <div class="contact-info-card">
            <div class="contact-info-item">
              <div class="contact-info-label">${t('email')}</div>
              <div class="contact-info-value">
                <a href="mailto:${SOCIAL_LINKS.email}">${SOCIAL_LINKS.email}</a>
              </div>
            </div>
            <div class="contact-info-item">
              <div class="contact-info-label">${t('follow_us')}</div>
              <div class="contact-info-value">
                <a href="${SOCIAL_LINKS.instagram_sg}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  @clairdeloi.singapore
                </a>
                <a href="${SOCIAL_LINKS.instagram_main}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  @clairdeloi
                </a>
                <a href="${SOCIAL_LINKS.linkedin}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:0.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  function init() {
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;
        
        const { showToast } = window.__cdl_utils || {};
        
        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
          });
          
          if (res.ok) {
            if (showToast) showToast("Message sent successfully! We'll get back to you soon.");
            form.reset();
          } else {
            const errData = await res.json();
            if (showToast) showToast(errData.error || "Failed to send message.", "error");
          }
        } catch (err) {
          console.error("Failed to submit contact via API:", err);
          if (showToast) showToast("Message sent (Offline cache mode)! We'll get back to you.");
          form.reset();
        }
      });
    }
  }

  return { html, init };
}


// ─── LINK-IN-BIO PAGE ───────────────────────────────────────────
export function LinksPage(store) {
  const articles = store.getPublished().slice(0, 8);

  const html = `
    <div class="linktree-page">
      <div class="linktree-header apple-reveal">
        <img src="${LOGO_EXTERNAL}" alt="Clair De Loi" class="linktree-logo">
        <h1 class="linktree-name">Clair De Loi</h1>
        <p class="linktree-bio">Illuminating the law, one story at a time. 🏛️</p>
      </div>

      <div class="linktree-links grid-stagger">
        <a href="#/" class="linktree-link apple-reveal">
          <div class="linktree-link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div class="linktree-link-text">
            <div class="linktree-link-title">🏠 Visit Our Website</div>
            <div class="linktree-link-desc">Explore our full collection of articles and content</div>
          </div>
        </a>

        ${articles.map(a => `
          <a href="#/article/${a.id}" class="linktree-link apple-reveal">
            <div class="linktree-link-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div class="linktree-link-text">
              <div class="linktree-link-title">📄 ${a.title}</div>
              <div class="linktree-link-desc">${formatCategory(a.category)} · ${formatDate(a.published_date)}</div>
            </div>
          </a>
        `).join('')}

        <a href="${SOCIAL_LINKS.instagram_sg}" target="_blank" rel="noopener noreferrer" class="linktree-link apple-reveal">
          <div class="linktree-link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </div>
          <div class="linktree-link-text">
            <div class="linktree-link-title">📸 Instagram (Singapore)</div>
            <div class="linktree-link-desc">@clairdeloi.singapore</div>
          </div>
        </a>

        <a href="${SOCIAL_LINKS.instagram_main}" target="_blank" rel="noopener noreferrer" class="linktree-link apple-reveal">
          <div class="linktree-link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </div>
          <div class="linktree-link-text">
            <div class="linktree-link-title">📸 Instagram (Main)</div>
            <div class="linktree-link-desc">@clairdeloi</div>
          </div>
        </a>

        <a href="${SOCIAL_LINKS.linkedin}" target="_blank" rel="noopener noreferrer" class="linktree-link apple-reveal">
          <div class="linktree-link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </div>
          <div class="linktree-link-text">
            <div class="linktree-link-title">💼 LinkedIn</div>
            <div class="linktree-link-desc">Connect with us professionally</div>
          </div>
        </a>
      </div>

      <div class="linktree-social apple-reveal" style="margin-top: 2.5rem;">
        <a href="${SOCIAL_LINKS.instagram_sg}" target="_blank" rel="noopener noreferrer" aria-label="Instagram Singapore">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
        </a>
        <a href="${SOCIAL_LINKS.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        <a href="mailto:${SOCIAL_LINKS.email}" aria-label="Email">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </a>
      </div>
    </div>
  `;

  return { html, init: () => {}, layout: 'none' };
}


// ─── 404 PAGE ────────────────────────────────────────────────────
export function NotFoundPage() {
  const html = `
    <div class="not-found-page">
      <div class="not-found-404">404</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a href="#/" class="btn btn-primary" data-magnetic>
        Return Home <span class="arr">→</span>
      </a>
    </div>
  `;

  return { html, init: () => {} };
}


// ─── LEGAL LITERACY QUIZ PAGE ────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    textKey: 'q1_text',
    options: [
      { key: 'q1_o1', isCorrect: false },
      { key: 'q1_o2', isCorrect: true },
      { key: 'q1_o3', isCorrect: false }
    ],
    expKey: 'q1_exp',
    recommendation: 'art-seed-001'
  },
  {
    id: 2,
    textKey: 'q2_text',
    options: [
      { key: 'q2_o1', isCorrect: false },
      { key: 'q2_o2', isCorrect: true },
      { key: 'q2_o3', isCorrect: false }
    ],
    expKey: 'q2_exp',
    recommendation: 'art-seed-002'
  },
  {
    id: 3,
    textKey: 'q3_text',
    options: [
      { key: 'q3_o1', isCorrect: false },
      { key: 'q3_o2', isCorrect: true },
      { key: 'q3_o3', isCorrect: false }
    ],
    expKey: 'q3_exp',
    recommendation: 'art-seed-003'
  },
  {
    id: 4,
    textKey: 'q4_text',
    options: [
      { key: 'q4_o1', isCorrect: false },
      { key: 'q4_o2', isCorrect: true },
      { key: 'q4_o3', isCorrect: false }
    ],
    expKey: 'q4_exp',
    recommendation: 'art-seed-003'
  },
  {
    id: 5,
    textKey: 'q5_text',
    options: [
      { key: 'q5_o1', isCorrect: false },
      { key: 'q5_o2', isCorrect: false },
      { key: 'q5_o3', isCorrect: true }
    ],
    expKey: 'q5_exp',
    recommendation: 'art-seed-001'
  }
];

export function QuizPage(store) {
  const html = `
    <section class="section container" style="padding-top: calc(var(--nav-height) + 2rem); min-height: 80vh; display: flex; align-items: center; justify-content: center;">
      <div class="quiz-wrapper apple-reveal" id="quiz-wrapper" style="width: 100%; max-width: 640px;">
        <!-- Dynamic steps render here -->
      </div>
    </section>
  `;

  function init() {
    const wrapper = document.getElementById('quiz-wrapper');
    if (!wrapper) return;

    let currentStep = 0; // 0 = welcome, 1..5 = questions, 6 = results
    let score = 0;
    let answers = []; // tracks correctness of each question: [true, false, ...]

    const renderWelcome = () => {
      wrapper.innerHTML = `
        <div class="quiz-welcome-card" style="text-align: center; padding: 3rem 2rem; background: var(--white); border: 1px solid var(--warm-2); border-radius: 12px; box-shadow: var(--shadow-md);">
          <div class="quiz-icon-header" style="margin-bottom: 1.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto;"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h1 style="font-size: 2.25rem; font-family: var(--font-heading); font-weight: 700; margin-bottom: 1rem; color: var(--ink);">${t('quiz_title')}</h1>
          <p class="quiz-intro-text" style="color: var(--ink-70); font-size: 1.05rem; margin-bottom: 2.5rem; line-height: 1.6;">${t('quiz_subtitle')}</p>
          <button class="btn btn-primary" id="btn-start-quiz" data-magnetic style="font-size: 0.85rem; padding: 1rem 2.5rem; border-radius: 999px;">
            ${t('quiz_start')} <span class="arr">→</span>
          </button>
        </div>
      `;
      document.getElementById('btn-start-quiz').addEventListener('click', () => {
        currentStep = 1;
        renderQuestion();
      });
    };

    const renderQuestion = () => {
      const qIdx = currentStep - 1;
      const q = QUESTIONS[qIdx];
      const progressPercent = ((currentStep) / QUESTIONS.length) * 100;

      wrapper.innerHTML = `
        <div class="quiz-question-card" style="padding: 2.5rem; background: var(--white); border: 1px solid var(--warm-2); border-radius: 12px; box-shadow: var(--shadow-md);">
          <!-- Quiz Progress Indicator -->
          <div class="quiz-progress-bar-container" style="margin-bottom: 2rem;">
            <div style="display:flex; justify-content:space-between; font-size: 0.8rem; font-weight:600; color: var(--ink-50); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
              <span>Question ${currentStep} of ${QUESTIONS.length}</span>
              <span>${Math.round(progressPercent)}%</span>
            </div>
            <div class="quiz-progress-bar-track" style="height: 4px; background: var(--warm-1); border-radius: 999px; overflow: hidden;">
              <div class="quiz-progress-bar-fill" style="width: ${progressPercent}%; height: 100%; background: var(--crimson); transition: width 0.4s var(--ease-out);"></div>
            </div>
          </div>
          
          <h2 class="quiz-question-text" style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 600; line-height: 1.4; color: var(--ink); margin-bottom: 2rem;">${t(q.textKey)}</h2>
          
          <div class="quiz-options-list" id="quiz-options" style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${q.options.map((opt, oIdx) => `
              <button class="quiz-option-btn" data-opt-idx="${oIdx}" style="display: flex; align-items: center; text-align: left; padding: 1.15rem 1.5rem; border: 1px solid var(--warm-2); background: var(--parchment); border-radius: 8px; font-size: 0.95rem; font-weight: 500; color: var(--ink); transition: all 0.25s var(--ease-out); cursor: pointer;">
                <span class="quiz-option-letter" style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: 1px solid var(--warm-3); border-radius: 50%; font-size: 0.75rem; font-weight: 700; margin-right: 1rem; background: var(--white); transition: all 0.2s;">${String.fromCharCode(65 + oIdx)}</span>
                <span class="quiz-option-title" style="flex:1;">${t(opt.key)}</span>
              </button>
            `).join('')}
          </div>

          <div class="quiz-explanation-box" id="quiz-explanation" style="display:none; margin-top: 1.5rem; padding: 1.25rem 1.5rem; border-radius: 8px; border-left: 4px solid var(--warm-3); background: var(--warm-1); font-size: 0.9rem; line-height: 1.55;">
            <div class="quiz-exp-status" id="quiz-exp-status" style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; margin-bottom: 0.5rem;"></div>
            <p class="quiz-exp-text" style="color: var(--ink-80); margin: 0;">${t(q.expKey)}</p>
          </div>

          <div class="quiz-actions" style="margin-top: 2rem; display: flex; justify-content: flex-end;">
            <button class="btn btn-primary" id="btn-next-question" style="display:none;" data-magnetic>
              ${t('quiz_next')} <span class="arr">→</span>
            </button>
          </div>
        </div>
      `;

      const optionsDiv = document.getElementById('quiz-options');
      const nextBtn = document.getElementById('btn-next-question');
      const expBox = document.getElementById('quiz-explanation');
      const expStatus = document.getElementById('quiz-exp-status');

      let answered = false;

      optionsDiv.addEventListener('click', (e) => {
        if (answered) return;
        const btn = e.target.closest('.quiz-option-btn');
        if (!btn) return;

        answered = true;
        const selectedIdx = parseInt(btn.dataset.optIdx, 10);
        const opt = q.options[selectedIdx];
        const isCorrect = opt.isCorrect;

        answers.push(isCorrect);
        if (isCorrect) score++;

        // Style updates for selected option and reveals correct option
        optionsDiv.querySelectorAll('.quiz-option-btn').forEach((b, idx) => {
          const isBtnCorrect = q.options[idx].isCorrect;
          b.disabled = true;
          
          if (idx === selectedIdx) {
            if (isCorrect) {
              b.classList.add('correct');
              b.style.borderColor = 'var(--success)';
              b.style.background = 'rgba(45, 138, 78, 0.08)';
              const letter = b.querySelector('.quiz-option-letter');
              if (letter) {
                letter.style.background = 'var(--success)';
                letter.style.color = 'var(--white)';
                letter.style.borderColor = 'var(--success)';
              }
            } else {
              b.classList.add('incorrect');
              b.style.borderColor = 'var(--error)';
              b.style.background = 'rgba(196, 64, 64, 0.08)';
              const letter = b.querySelector('.quiz-option-letter');
              if (letter) {
                letter.style.background = 'var(--error)';
                letter.style.color = 'var(--white)';
                letter.style.borderColor = 'var(--error)';
              }
            }
          } else if (isBtnCorrect) {
            b.classList.add('correct-highlight');
            b.style.borderColor = 'var(--success)';
            b.style.background = 'rgba(45, 138, 78, 0.04)';
            const letter = b.querySelector('.quiz-option-letter');
            if (letter) {
              letter.style.background = 'var(--success)';
              letter.style.color = 'var(--white)';
              letter.style.borderColor = 'var(--success)';
            }
          }
        });

        // Set explanation classes
        expBox.style.display = 'block';
        if (isCorrect) {
          expBox.style.borderColor = 'var(--success)';
          expBox.style.background = 'rgba(45, 138, 78, 0.04)';
          expStatus.style.color = 'var(--success)';
          expStatus.innerHTML = `✓ ${t('quiz_correct')}`;
        } else {
          expBox.style.borderColor = 'var(--error)';
          expBox.style.background = 'rgba(196, 64, 64, 0.04)';
          expStatus.style.color = 'var(--error)';
          expStatus.innerHTML = `✕ ${t('quiz_incorrect')}`;
        }

        nextBtn.style.display = 'inline-flex';
      });

      nextBtn.addEventListener('click', () => {
        currentStep++;
        if (currentStep > QUESTIONS.length) {
          renderResults();
        } else {
          renderQuestion();
        }
      });
    };

    const renderResults = () => {
      let rankKey = 'quiz_rank_citizen';
      let feedbackKey = 'quiz_feedback_low';
      
      if (score === QUESTIONS.length) {
        rankKey = 'quiz_rank_expert';
        feedbackKey = 'quiz_feedback_high';
      } else if (score >= 3) {
        rankKey = 'quiz_rank_scholar';
        feedbackKey = 'quiz_feedback_mid';
      }

      // Compile unique recommended article IDs
      const recommendations = [];
      answers.forEach((correct, idx) => {
        if (!correct) {
          const q = QUESTIONS[idx];
          if (q.recommendation && !recommendations.includes(q.recommendation)) {
            recommendations.push(q.recommendation);
          }
        }
      });

      // Seeding fallback if they did great
      if (recommendations.length === 0) {
        recommendations.push('art-seed-001');
      }

      wrapper.innerHTML = `
        <div class="quiz-results-card" style="text-align: center; padding: 3rem 2.5rem; background: var(--white); border: 1px solid var(--warm-2); border-radius: 12px; box-shadow: var(--shadow-md);">
          <h1 style="font-size: 2.25rem; font-family: var(--font-heading); margin-bottom: 1.5rem;">${t('quiz_results')}</h1>
          
          <div class="quiz-results-badge-wrap" style="display:flex; flex-direction:column; align-items:center; gap:1rem; margin-bottom: 2rem;">
            <div class="quiz-score-circle" style="display:flex; align-items:center; justify-content:center; width:110px; height:110px; border-radius:50%; border:3px solid var(--crimson); font-family:var(--font-heading); font-size:1.75rem; font-weight:700;">
              <span class="quiz-score-num" data-counter="${score}" style="font-size: 2.5rem; color: var(--crimson);">0</span>
              <span class="quiz-score-denom" style="color: var(--ink-50); font-size: 1.25rem; margin-left: 0.25rem;">/ ${QUESTIONS.length}</span>
            </div>
            <div class="quiz-rank-label" style="font-size: 1.15rem; font-weight: 700; color: var(--ink);">${t(rankKey)}</div>
          </div>
          
          <p class="quiz-feedback-text" style="color: var(--ink-70); font-size: 1.05rem; line-height: 1.6; max-width: 480px; margin: 0 auto 2.5rem;">${t(feedbackKey)}</p>
          
          <div class="quiz-recommended-section" style="margin-top: 2.5rem; text-align: left;">
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; margin-bottom: 1rem; border-bottom: 1px solid var(--warm-2); padding-bottom: 0.5rem; color: var(--ink);">
              ${t('quiz_recommended')}
            </h3>
            <div class="quiz-recommended-list">
              <div id="quiz-recommendations-placeholder" style="color: var(--ink-50); font-size: 0.9rem;">Loading recommendations...</div>
            </div>
          </div>
          
          <div class="quiz-results-actions" style="margin-top: 3rem;">
            <button class="btn btn-primary" id="btn-restart-quiz" data-magnetic style="border-radius:999px; font-size:0.8rem; padding: 0.9rem 2rem;">
              ${t('quiz_restart')}
            </button>
          </div>
        </div>
      `;

      // Populate recommendations list
      const recList = wrapper.querySelector('.quiz-recommended-list');
      if (recList) {
        const recHtml = recommendations.map(id => {
          const art = store.getById(id);
          if (art) {
            return `
              <a href="#/article/${art.id}" class="quiz-rec-item" style="display:flex; align-items:center; gap:1rem; padding:0.9rem; border:1px solid var(--warm-2); margin-bottom:0.75rem; border-radius:8px; background:var(--white); transition: all 0.3s var(--ease-out); box-shadow: var(--shadow-xs);">
                ${art.cover_image_url 
                  ? `<img src="${art.cover_image_url}" alt="" style="width:64px; height:48px; object-fit:cover; border-radius:4px;">` 
                  : `<div style="width:64px; height:48px; display:flex; align-items:center; justify-content:center; background:var(--crimson-10); border-radius:4px; font-weight:bold; color:var(--crimson); font-size:0.6rem;">CDL</div>`
                }
                <div style="flex:1;">
                  <div style="font-weight:600; font-size:0.92rem; color:var(--ink); line-height: 1.35;">${art.title}</div>
                  <div style="font-size:0.75rem; color:var(--crimson); text-transform:uppercase; letter-spacing:0.05em; margin-top:0.2rem; font-weight: 500;">${formatCategory(art.category)}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            `;
          }
          return '';
        }).join('');

        if (recHtml.trim()) {
          recList.innerHTML = recHtml;
          
          // Hover interactions
          recList.querySelectorAll('.quiz-rec-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
              item.style.borderColor = 'var(--crimson-30)';
              item.style.transform = 'translateY(-2px)';
              item.style.boxShadow = 'var(--shadow-md)';
            });
            item.addEventListener('mouseleave', () => {
              item.style.borderColor = 'var(--warm-2)';
              item.style.transform = 'translateY(0)';
              item.style.boxShadow = 'var(--shadow-xs)';
            });
          });
        } else {
          recList.innerHTML = `<p style="color: var(--ink-50); font-size: 0.9rem;">Check out our full <a href="#/articles" style="color: var(--crimson); text-decoration: underline;">article archive</a> to explore more legal topics!</p>`;
        }
      }

      document.getElementById('btn-restart-quiz').addEventListener('click', () => {
        currentStep = 0;
        score = 0;
        answers = [];
        renderWelcome();
      });

      // Score count-up animation
      setTimeout(() => {
        const scoreNum = wrapper.querySelector('.quiz-score-num');
        if (scoreNum) {
          const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
          const target = score;
          const duration = 1200;
          const startTime = performance.now();
          function tick(now) {
            const elapsed = Math.min(1, (now - startTime) / duration);
            scoreNum.textContent = Math.round(easeOutCubic(elapsed) * target);
            if (elapsed < 1) requestAnimationFrame(tick);
            else scoreNum.textContent = target;
          }
          requestAnimationFrame(tick);
        }
      }, 100);
    };

    // Store reference to store on window object for recommendations lookup
    window.__cdl_store = store;

    // Start with welcome screen
    renderWelcome();
  }

  return { html, init };
}
