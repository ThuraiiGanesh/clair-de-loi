/* ===================================================================
   CLAIR DE LOI — Admin Panel
   Login, Dashboard, Article CRUD with Rich Text Editor
   =================================================================== */
import { formatDate, formatCategory, showToast, showConfirm, CATEGORIES, escapeHtml } from './utils.js';

const LOGO_EXTERNAL = 'https://media.base44.com/images/public/user_69f5970e46da90d039d8c527/808d1a7a2_ClairDeLoiLogo.jpeg';

// ─── ADMIN LOGIN ─────────────────────────────────────────────────
export function AdminLoginPage(store, router) {
  const html = `
    <div class="admin-login-page">
      <div class="admin-login-card">
        <div style="text-align:center;margin-bottom:1.5rem;">
          <img src="${LOGO_EXTERNAL}" alt="Clair De Loi" style="height:48px;margin:0 auto 0.75rem;" onerror="this.style.display='none'">
        </div>
        <h1>Admin Panel</h1>
        <p class="login-sub">Sign in to manage your content</p>
        <div id="login-error" class="login-error" style="display:none;"></div>
        <form id="admin-login-form">
          <div class="form-group">
            <label class="form-label" for="admin-username">Username</label>
            <input type="text" id="admin-username" class="form-input" required placeholder="admin" autocomplete="username">
          </div>
          <div class="form-group">
            <label class="form-label" for="admin-password">Password</label>
            <input type="password" id="admin-password" class="form-input" required placeholder="Enter password" autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary">Sign In</button>
        </form>
        <p style="text-align:center;margin-top:1.5rem;font-size:0.8rem;color:var(--ink-50);">
          <a href="#/" style="color:var(--crimson);">← Back to website</a>
        </p>
      </div>
    </div>
  `;

  function init() {
    const form = document.getElementById('admin-login-form');
    const errorDiv = document.getElementById('login-error');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        const success = await store.login(username, password);
        if (success) {
          router.navigate('/admin');
        } else {
          errorDiv.textContent = 'Invalid credentials. Please try again.';
          errorDiv.style.display = 'block';
        }
      });
    }
  }

  return { html, init, layout: 'none' };
}


// ─── ADMIN SIDEBAR LAYOUT ────────────────────────────────────────
export function renderAdminLayout(content, currentPath) {
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' },
    { label: 'Articles', path: '/admin/articles', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
    { label: 'Quiz Manager', path: '/admin/quiz', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' }
  ];

  const isActive = (path) => currentPath === path;

  return `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-sidebar-brand">
          <img src="${LOGO_EXTERNAL}" alt="Clair De Loi" onerror="this.style.display='none'">
          <div>
            <div class="admin-sidebar-brand-text">Clair De Loi</div>
            <div class="admin-sidebar-brand-sub">Admin</div>
          </div>
        </div>
        <nav class="admin-nav">
          ${navItems.map(item => `
            <a href="#${item.path}" class="admin-nav-link ${isActive(item.path) ? 'active' : ''}">
              ${item.icon}
              <span>${item.label}</span>
            </a>
          `).join('')}
          <a href="#/" class="admin-nav-link admin-mobile-only-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Exit</span>
          </a>
        </nav>
        <a href="#/" class="admin-back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Back to Site
        </a>
      </aside>
      <main class="admin-main">
        ${content}
      </main>
    </div>
  `;
}


// ─── ADMIN DASHBOARD ─────────────────────────────────────────────
export function AdminDashboardPage(store) {
  const stats = store.getStats();
  const recent = store.getAll().sort((a, b) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 5);

  const content = `
    <h1 style="font-size:1.75rem;margin-bottom:2rem;">Dashboard</h1>

    <div class="admin-stats">
      <div class="admin-stat-card">
        <div class="admin-stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="admin-stat-number" data-counter="${stats.total}">0</div>
        <div class="admin-stat-label">Total Articles</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="admin-stat-number" data-counter="${stats.published}">0</div>
        <div class="admin-stat-label">Published</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="admin-stat-number" data-counter="${stats.featured}">0</div>
        <div class="admin-stat-label">Featured</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="admin-stat-number" id="quiz-count-stat">—</div>
        <div class="admin-stat-label">Quiz Questions</div>
      </div>
    </div>

    <!-- Analytics Section -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:2rem;margin-bottom:2rem;">
      <div style="background:var(--white);border:1px solid var(--warm-2);border-radius:8px;padding:1.5rem;">
        <h3 style="font-size:0.85rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink-50);margin-bottom:1rem;">Category Distribution</h3>
        <div id="category-chart" style="display:flex;flex-direction:column;gap:0.5rem;"></div>
      </div>
      <div style="background:var(--white);border:1px solid var(--warm-2);border-radius:8px;padding:1.5rem;">
        <h3 style="font-size:0.85rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink-50);margin-bottom:1rem;">Quick Actions</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <a href="#/admin/articles" class="btn btn-ghost btn-sm" style="text-align:left;justify-content:flex-start;">📝 Manage Articles</a>
          <a href="#/admin/quiz" class="btn btn-ghost btn-sm" style="text-align:left;justify-content:flex-start;">❓ Quiz Manager</a>
          <a href="#/" class="btn btn-ghost btn-sm" style="text-align:left;justify-content:flex-start;">🌐 View Live Site</a>
        </div>
      </div>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
      <h2 style="font-size:1.25rem;">Recent Articles</h2>
      <a href="#/admin/articles" style="font-size:0.8rem;color:var(--crimson);font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">View All →</a>
    </div>

    <div class="admin-article-list">
      ${recent.length === 0 ? `
        <div style="padding:2rem;text-align:center;color:var(--ink-50);">
          No articles yet. <a href="#/admin/articles" style="color:var(--crimson);">Create your first article.</a>
        </div>
      ` : recent.map(a => `
        <a href="#/admin/articles?edit=${a.id}" class="admin-article-item">
          ${a.cover_image_url
            ? `<img src="${a.cover_image_url}" class="admin-article-thumb" alt="">`
            : `<div class="admin-article-thumb" style="display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;color:var(--crimson-30);">CDL</div>`
          }
          <div class="admin-article-info">
            <div class="admin-article-title-text">${a.title}</div>
            <div class="admin-article-details">
              <span class="badge ${a.is_published ? 'badge-published' : 'badge-draft'}">${a.is_published ? 'Published' : 'Draft'}</span>
              ${a.is_featured ? '<span class="badge badge-featured">★ Featured</span>' : ''}
              <span>${formatCategory(a.category)}</span>
              <span>${formatDate(a.published_date)}</span>
            </div>
          </div>
        </a>
      `).join('')}
    </div>

    <div style="margin-top:2.5rem;margin-bottom:1rem;">
      <h2 style="font-size:1.25rem;">Contact Messages</h2>
    </div>
    <div class="admin-message-list" id="admin-message-list">
      <div style="padding:2rem;text-align:center;color:var(--ink-50);">Loading messages...</div>
    </div>
  `;

  async function init() {
    // Load analytics stats
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        // Update quiz count
        const quizStat = document.getElementById('quiz-count-stat');
        if (quizStat) quizStat.textContent = data.quiz_questions_total;

        // Render category distribution chart
        const chartEl = document.getElementById('category-chart');
        if (chartEl && data.categories) {
          const catLabels = { legal_insights: 'Legal Insights', opinion: 'Opinion', case_study: 'Case Study', news: 'News', explainer: 'Explainer' };
          const catColors = { legal_insights: '#BC1E22', opinion: '#c9880a', case_study: '#2d8a4e', news: '#4a7dba', explainer: '#8b5cf6' };
          const maxVal = Math.max(...Object.values(data.categories), 1);

          chartEl.innerHTML = Object.entries(catLabels).map(([key, label]) => {
            const count = data.categories[key] || 0;
            const pct = (count / maxVal) * 100;
            const color = catColors[key] || '#999';
            return `
              <div style="display:flex;align-items:center;gap:0.75rem;">
                <span style="font-size:0.75rem;color:var(--ink-70);width:90px;text-align:right;white-space:nowrap;">${label}</span>
                <div style="flex:1;height:18px;background:var(--warm-1);border-radius:4px;overflow:hidden;position:relative;">
                  <div style="height:100%;width:${pct}%;background:${color};border-radius:4px;transition:width 0.8s var(--ease-out);"></div>
                </div>
                <span style="font-size:0.75rem;font-weight:600;color:var(--ink);width:20px;">${count}</span>
              </div>
            `;
          }).join('');
        }
      }
    } catch (e) {
      console.warn("Could not load admin stats:", e);
    }

    // Load contact messages
    const list = document.getElementById('admin-message-list');
    if (!list) return;

    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const messages = await res.json();
        if (messages.length === 0) {
          list.innerHTML = `
            <div style="padding:2rem;text-align:center;color:var(--ink-50);">
              No messages received yet.
            </div>
          `;
        } else {
          list.innerHTML = messages.map(m => `
            <div class="admin-message-item" style="padding:1.25rem;background:var(--white);border:1px solid var(--warm-2);margin-bottom:0.75rem;border-radius:6px;text-align:left;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.5rem;">
                <strong>${escapeHtml(m.name)}</strong>
                <span style="font-size:0.75rem;color:var(--ink-50);">${formatDate(m.created_at)}</span>
              </div>
              <div style="font-size:0.8rem;color:var(--crimson);margin-bottom:0.5rem;font-weight:500;">
                Email: <a href="mailto:${escapeHtml(m.email)}" style="text-decoration:underline;">${escapeHtml(m.email)}</a>
                ${m.subject ? ` | Subject: ${escapeHtml(m.subject)}` : ''}
              </div>
              <p style="font-size:0.85rem;color:var(--ink-80);line-height:1.5;white-space:pre-wrap;margin:0;">${escapeHtml(m.message)}</p>
            </div>
          `).join('');
        }
      } else {
        list.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--error);">Failed to load messages from server.</div>`;
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
      list.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--ink-50);">No messages available offline.</div>`;
    }
  }

  return { html: content, init };
}

// ─── ADMIN ARTICLES PAGE ─────────────────────────────────────────
export function AdminArticlesPage(store, router) {
  const content = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;">
      <h1 style="font-size:1.75rem;">Articles</h1>
      <button class="btn btn-primary btn-sm" id="btn-new-article">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Article
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div style="display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap; background:var(--white); padding:1rem; border:1px solid var(--warm-2); border-radius:8px; align-items:center;">
      <div style="flex:1; min-width:200px; position:relative;">
        <input type="text" id="article-search" placeholder="Search title, excerpt, content, author..." style="width:100%; padding:0.5rem 0.75rem 0.5rem 2.5rem; border:1px solid var(--warm-2); border-radius:6px; font-size:0.85rem; height:38px;">
        <span style="position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:var(--ink-30); display:flex; align-items:center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
      </div>
      <div>
        <select id="article-filter-category" style="padding:0.5rem 0.75rem; border:1px solid var(--warm-2); border-radius:6px; font-size:0.85rem; background:var(--white); color:var(--ink); height:38px;">
          <option value="all">All Categories</option>
          <option value="explainer">Explainer</option>
          <option value="opinion">Opinion</option>
          <option value="case_study">Case Study</option>
          <option value="news">News</option>
          <option value="legal_insights">Legal Insights</option>
        </select>
      </div>
      <div>
        <select id="article-filter-status" style="padding:0.5rem 0.75rem; border:1px solid var(--warm-2); border-radius:6px; font-size:0.85rem; background:var(--white); color:var(--ink); height:38px;">
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>

    <!-- Bulk Actions Panel -->
    <div id="bulk-actions-panel" style="display:none; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1.5rem; background:var(--crimson-10); border:1px solid var(--crimson-20); padding:0.75rem 1.25rem; border-radius:8px; flex-wrap:wrap; width:100%;">
      <div style="font-size:0.85rem; color:var(--crimson); font-weight:600;">
        <span id="selected-count">0</span> items selected
      </div>
      <div style="display:flex; gap:0.5rem;">
        <button class="btn btn-ghost btn-sm" id="btn-bulk-publish" style="border-color:var(--crimson-30); color:var(--crimson); font-size:0.75rem; padding:0.35rem 0.75rem; background:var(--white);">Bulk Publish</button>
        <button class="btn btn-ghost btn-sm" id="btn-bulk-unpublish" style="border-color:var(--crimson-30); color:var(--crimson); font-size:0.75rem; padding:0.35rem 0.75rem; background:var(--white);">Bulk Unpublish</button>
        <button class="btn btn-primary btn-sm" id="btn-bulk-delete" style="background:var(--error); color:var(--white); border-color:var(--error); font-size:0.75rem; padding:0.35rem 0.75rem;">Bulk Delete</button>
      </div>
    </div>

    <div class="admin-article-list" id="admin-articles-list">
      <div style="padding:2rem;text-align:center;color:var(--ink-50);">Loading articles...</div>
    </div>

    <!-- Editor overlay (hidden) -->
    <div class="admin-editor-overlay" id="editor-overlay" style="display:none;">
      <div class="admin-editor-panel">
        <div class="admin-editor-header">
          <h2 id="editor-title">New Article</h2>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn btn-ghost btn-sm" id="editor-cancel">Cancel</button>
            <button class="btn btn-primary btn-sm" id="editor-save">Save Article</button>
          </div>
        </div>
        <div class="admin-editor-body">
          <div class="admin-editor-main">
            <input type="text" class="admin-editor-title-input" id="ed-title" placeholder="Article title...">
            
            <div class="editor-field" style="margin-bottom:1rem;">
              <label>Excerpt</label>
              <textarea id="ed-excerpt" rows="2" placeholder="Brief summary..." style="width:100%;padding:0.5rem 0.75rem;border:1px solid var(--warm-2);font-size:0.85rem;border-radius:4px;resize:vertical;"></textarea>
            </div>

            <label style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-50);display:block;margin-bottom:0.4rem;">Content</label>
            <div class="editor-toolbar" id="editor-toolbar">
              <button class="editor-toolbar-btn" data-cmd="bold" title="Bold"><b>B</b></button>
              <button class="editor-toolbar-btn" data-cmd="italic" title="Italic"><i>I</i></button>
              <button class="editor-toolbar-btn" data-cmd="underline" title="Underline"><u>U</u></button>
              <div class="editor-toolbar-divider"></div>
              <button class="editor-toolbar-btn" data-cmd="formatBlock" data-val="h2" title="Heading 2">H2</button>
              <button class="editor-toolbar-btn" data-cmd="formatBlock" data-val="h3" title="Heading 3">H3</button>
              <button class="editor-toolbar-btn" data-cmd="formatBlock" data-val="p" title="Paragraph">P</button>
              <div class="editor-toolbar-divider"></div>
              <button class="editor-toolbar-btn" data-cmd="insertUnorderedList" title="Bullet List">• List</button>
              <button class="editor-toolbar-btn" data-cmd="insertOrderedList" title="Numbered List">1. List</button>
              <div class="editor-toolbar-divider"></div>
              <button class="editor-toolbar-btn" data-cmd="formatBlock" data-val="blockquote" title="Blockquote">"</button>
              <button class="editor-toolbar-btn" data-cmd="createLink" title="Insert Link">🔗</button>
              <button class="editor-toolbar-btn" data-cmd="removeFormat" title="Clear Formatting">✕</button>
            </div>
            <div class="editor-content" id="ed-content" contenteditable="true"></div>
          </div>

          <div class="admin-editor-sidebar">
            <div class="editor-field">
              <label>Cover Image</label>
              <div id="cover-area">
                <div class="cover-upload-area" id="cover-upload">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <p>Click to upload image</p>
                  <input type="file" id="cover-file" accept="image/*" style="display:none;">
                </div>
              </div>
            </div>

            <div class="editor-field">
              <label>Category</label>
              <select id="ed-category">
                ${CATEGORIES.filter(c => c.key !== 'all').map(c => `
                  <option value="${c.key}">${c.label}</option>
                `).join('')}
              </select>
            </div>

            <div class="editor-field">
              <label>Author</label>
              <input type="text" id="ed-author" placeholder="Author name" value="Clair De Loi Editorial">
            </div>

            <div class="editor-field">
              <label>Publish Date</label>
              <input type="date" id="ed-date" value="${new Date().toISOString().split('T')[0]}">
            </div>

            <div class="editor-field">
              <div class="editor-toggle-row">
                <span class="editor-toggle-label">Published</span>
                <label class="toggle-switch">
                  <input type="checkbox" id="ed-published">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="editor-field">
              <div class="editor-toggle-row">
                <span class="editor-toggle-label">Featured</span>
                <label class="toggle-switch">
                  <input type="checkbox" id="ed-featured">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="editor-field">
              <label>Instagram Link</label>
              <input type="url" id="ed-instagram" placeholder="https://instagram.com/p/...">
            </div>

            <div class="editor-field">
              <label>Video URL (YouTube/Vimeo embed)</label>
              <input type="url" id="ed-video" placeholder="https://youtube.com/embed/...">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  let allArticles = [];
  let currentSearch = '';
  let currentCategory = 'all';
  let currentStatus = 'all';
  let selectedIds = new Set();
  let editingId = null;
  let coverImageData = '';

  function renderList() {
    const list = document.getElementById('admin-articles-list');
    if (!list) return;

    // Filter articles
    const filtered = allArticles.filter(a => {
      // 1. Search text
      if (currentSearch) {
        const query = currentSearch.toLowerCase();
        const matchesTitle = (a.title || '').toLowerCase().includes(query);
        const matchesExcerpt = (a.excerpt || '').toLowerCase().includes(query);
        const matchesContent = (a.content || '').toLowerCase().includes(query);
        const matchesAuthor = (a.author || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesExcerpt && !matchesContent && !matchesAuthor) {
          return false;
        }
      }
      // 2. Category
      if (currentCategory !== 'all' && a.category !== currentCategory) {
        return false;
      }
      // 3. Status
      if (currentStatus !== 'all') {
        const isPub = a.is_published ? 'published' : 'draft';
        if (isPub !== currentStatus) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      list.innerHTML = `
        <div style="padding:2rem;text-align:center;color:var(--ink-50);">
          No articles match your search or filter criteria.
        </div>
      `;
      updateBulkPanel();
      return;
    }

    const allFilteredSelected = filtered.every(a => selectedIds.has(a.id));

    // Render list structure
    list.innerHTML = `
      <div style="display:flex; align-items:center; padding:0.75rem 1.5rem; border-bottom:1px solid var(--warm-2); background:var(--warm-1); font-size:0.75rem; font-weight:600; color:var(--ink-50);">
        <input type="checkbox" id="select-all-articles" style="margin-right:1.25rem; cursor:pointer; width:16px; height:16px;" ${allFilteredSelected ? 'checked' : ''}>
        <div style="flex:1;">Title / Status / Category / Date</div>
        <div style="width:100px; text-align:right;">Actions</div>
      </div>
      ${filtered.map(a => `
        <div class="admin-article-item" data-id="${a.id}" style="align-items:center; padding:0.75rem 1.5rem;">
          <input type="checkbox" class="article-select-checkbox" data-id="${a.id}" style="margin-right:1.25rem; cursor:pointer; width:16px; height:16px;" ${selectedIds.has(a.id) ? 'checked' : ''}>
          ${a.cover_image_url
            ? `<img src="${a.cover_image_url}" class="admin-article-thumb" alt="">`
            : `<div class="admin-article-thumb" style="display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;color:var(--crimson-30);">CDL</div>`
          }
          <div class="admin-article-info">
            <div class="admin-article-title-text" style="font-size:0.95rem; font-weight:600;">${escapeHtml(a.title)}</div>
            <div class="admin-article-details" style="margin-top:0.25rem;">
              <span class="badge ${a.is_published ? 'badge-published' : 'badge-draft'}">${a.is_published ? 'Published' : 'Draft'}</span>
              ${a.is_featured ? '<span class="badge badge-featured">★ Featured</span>' : ''}
              <span>${formatCategory(a.category)}</span>
              ${a.instagram_link ? '<span>📸</span>' : ''}
              <span>${formatDate(a.published_date)}</span>
            </div>
          </div>
          <div class="admin-article-actions" style="margin-left:auto;">
            <button class="admin-action-btn edit-btn" title="Edit" data-id="${a.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="admin-action-btn delete-btn" title="Delete" data-id="${a.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `).join('')}
    `;

    // Bind edit/delete buttons
    list.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const article = store.getById(id);
        if (article) openEditor(article);
      });
    });

    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const confirmed = await showConfirm('Delete Article', 'Are you sure you want to delete this article? This action cannot be undone.');
        if (confirmed) {
          await store.delete(id);
          showToast('Article deleted.');
          selectedIds.delete(id);
          allArticles = store.getAll().sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
          renderList();
        }
      });
    });

    // Bind selection events
    const selectAllCheck = list.querySelector('#select-all-articles');
    if (selectAllCheck) {
      selectAllCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
          filtered.forEach(a => selectedIds.add(a.id));
        } else {
          filtered.forEach(a => selectedIds.delete(a.id));
        }
        renderList();
      });
    }

    list.querySelectorAll('.article-select-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = cb.dataset.id;
        if (e.target.checked) {
          selectedIds.add(id);
        } else {
          selectedIds.delete(id);
        }
        updateBulkPanel();
        
        const allChecked = filtered.every(a => selectedIds.has(a.id));
        const selectAll = document.getElementById('select-all-articles');
        if (selectAll) selectAll.checked = allChecked;
      });
    });

    updateBulkPanel();
  }

  function updateBulkPanel() {
    const panel = document.getElementById('bulk-actions-panel');
    const countSpan = document.getElementById('selected-count');
    if (!panel || !countSpan) return;

    if (selectedIds.size > 0) {
      panel.style.display = 'flex';
      countSpan.textContent = selectedIds.size;
    } else {
      panel.style.display = 'none';
    }
  }

  function openEditor(article = null) {
    const overlay = document.getElementById('editor-overlay');
    const title = document.getElementById('editor-title');
    overlay.style.display = 'flex';

    if (article) {
      editingId = article.id;
      title.textContent = 'Edit Article';
      document.getElementById('ed-title').value = article.title || '';
      document.getElementById('ed-excerpt').value = article.excerpt || '';
      document.getElementById('ed-content').innerHTML = article.content || '';
      document.getElementById('ed-category').value = article.category || 'news';
      document.getElementById('ed-author').value = article.author || '';
      document.getElementById('ed-date').value = article.published_date || '';
      document.getElementById('ed-published').checked = article.is_published || false;
      document.getElementById('ed-featured').checked = article.is_featured || false;
      document.getElementById('ed-instagram').value = article.instagram_link || '';
      document.getElementById('ed-video').value = article.video_url || '';
      coverImageData = article.cover_image_url || '';

      if (coverImageData) {
        showCoverPreview(coverImageData);
      }
    } else {
      editingId = null;
      title.textContent = 'New Article';
      document.getElementById('ed-title').value = '';
      document.getElementById('ed-excerpt').value = '';
      document.getElementById('ed-content').innerHTML = '';
      document.getElementById('ed-category').value = 'news';
      document.getElementById('ed-author').value = 'Clair De Loi Editorial';
      document.getElementById('ed-date').value = new Date().toISOString().split('T')[0];
      document.getElementById('ed-published').checked = false;
      document.getElementById('ed-featured').checked = false;
      document.getElementById('ed-instagram').value = '';
      document.getElementById('ed-video').value = '';
      coverImageData = '';
    }
  }

  function closeEditor() {
    document.getElementById('editor-overlay').style.display = 'none';
    editingId = null;
    coverImageData = '';
    resetCoverUpload();
  }

  function showCoverPreview(src) {
    const area = document.getElementById('cover-area');
    area.innerHTML = `
      <div class="cover-preview">
        <img src="${src}" alt="Cover preview">
        <button class="cover-preview-remove" id="cover-remove" title="Remove cover">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;
    document.getElementById('cover-remove').addEventListener('click', () => {
      coverImageData = '';
      resetCoverUpload();
    });
  }

  function resetCoverUpload() {
    const area = document.getElementById('cover-area');
    area.innerHTML = `
      <div class="cover-upload-area" id="cover-upload">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p>Click to upload image</p>
        <input type="file" id="cover-file" accept="image/*" style="display:none;">
      </div>
    `;
    bindCoverUpload();
  }

  function bindCoverUpload() {
    const upload = document.getElementById('cover-upload');
    const fileInput = document.getElementById('cover-file');
    if (upload && fileInput) {
      upload.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            coverImageData = ev.target.result;
            showCoverPreview(coverImageData);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  async function saveArticle() {
    const data = {
      title: document.getElementById('ed-title').value.trim(),
      excerpt: document.getElementById('ed-excerpt').value.trim(),
      content: document.getElementById('ed-content').innerHTML,
      category: document.getElementById('ed-category').value,
      author: document.getElementById('ed-author').value.trim(),
      published_date: document.getElementById('ed-date').value,
      is_published: document.getElementById('ed-published').checked,
      is_featured: document.getElementById('ed-featured').checked,
      instagram_link: document.getElementById('ed-instagram').value.trim(),
      video_url: document.getElementById('ed-video').value.trim(),
      cover_image_url: coverImageData
    };

    if (!data.title) {
      showToast('Please enter a title', 'error');
      return;
    }

    if (editingId) {
      await store.update(editingId, data);
      showToast('Article updated successfully!');
    } else {
      await store.create(data);
      showToast('Article created successfully!');
    }

    closeEditor();
    router.navigate('/admin/articles');
  }

  function init() {
    allArticles = store.getAll().sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
    renderList();

    // Bind Search Input
    const searchInp = document.getElementById('article-search');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderList();
      });
    }

    // Bind Category Filter
    const catSel = document.getElementById('article-filter-category');
    if (catSel) {
      catSel.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        renderList();
      });
    }

    // Bind Status Filter
    const statusSel = document.getElementById('article-filter-status');
    if (statusSel) {
      statusSel.addEventListener('change', (e) => {
        currentStatus = e.target.value;
        renderList();
      });
    }

    // Bind Bulk Action Buttons
    const btnBulkPublish = document.getElementById('btn-bulk-publish');
    if (btnBulkPublish) {
      btnBulkPublish.addEventListener('click', async () => {
        if (selectedIds.size === 0) return;
        const confirmed = await showConfirm('Bulk Publish', `Are you sure you want to publish the ${selectedIds.size} selected articles?`);
        if (confirmed) {
          const ids = Array.from(selectedIds);
          const success = await store.bulkAction('publish', ids);
          if (success) {
            showToast(`Published ${ids.length} articles.`);
            selectedIds.clear();
            allArticles = store.getAll().sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
            renderList();
          } else {
            showToast('Bulk publish failed', 'error');
          }
        }
      });
    }

    const btnBulkUnpublish = document.getElementById('btn-bulk-unpublish');
    if (btnBulkUnpublish) {
      btnBulkUnpublish.addEventListener('click', async () => {
        if (selectedIds.size === 0) return;
        const confirmed = await showConfirm('Bulk Unpublish', `Are you sure you want to unpublish the ${selectedIds.size} selected articles?`);
        if (confirmed) {
          const ids = Array.from(selectedIds);
          const success = await store.bulkAction('unpublish', ids);
          if (success) {
            showToast(`Unpublished ${ids.length} articles.`);
            selectedIds.clear();
            allArticles = store.getAll().sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
            renderList();
          } else {
            showToast('Bulk unpublish failed', 'error');
          }
        }
      });
    }

    const btnBulkDelete = document.getElementById('btn-bulk-delete');
    if (btnBulkDelete) {
      btnBulkDelete.addEventListener('click', async () => {
        if (selectedIds.size === 0) return;
        const confirmed = await showConfirm('Bulk Delete', `Are you sure you want to delete the ${selectedIds.size} selected articles? This cannot be undone.`);
        if (confirmed) {
          const ids = Array.from(selectedIds);
          const success = await store.bulkAction('delete', ids);
          if (success) {
            showToast(`Deleted ${ids.length} articles.`);
            selectedIds.clear();
            allArticles = store.getAll().sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
            renderList();
          } else {
            showToast('Bulk delete failed', 'error');
          }
        }
      });
    }

    // New article
    document.getElementById('btn-new-article')?.addEventListener('click', () => openEditor());

    // Editor cancel / save
    document.getElementById('editor-cancel')?.addEventListener('click', closeEditor);
    document.getElementById('editor-save')?.addEventListener('click', saveArticle);

    // Close on overlay click
    document.getElementById('editor-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'editor-overlay') closeEditor();
    });

    // Rich text toolbar
    document.getElementById('editor-toolbar')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.editor-toolbar-btn');
      if (!btn) return;
      e.preventDefault();
      const cmd = btn.dataset.cmd;
      const val = btn.dataset.val || null;

      if (cmd === 'createLink') {
        const url = prompt('Enter URL:');
        if (url) document.execCommand(cmd, false, url);
      } else if (cmd === 'formatBlock') {
        document.execCommand(cmd, false, `<${val}>`);
      } else {
        document.execCommand(cmd, false, val);
      }

      document.getElementById('ed-content').focus();
    });

    // Cover upload
    bindCoverUpload();

    // Check for ?edit= param in hash
    const hashQuery = window.location.hash.split('?')[1];
    if (hashQuery) {
      const params = new URLSearchParams(hashQuery);
      const editId = params.get('edit');
      if (editId) {
        const article = store.getById(editId);
        if (article) setTimeout(() => openEditor(article), 100);
      }
    }
  }

  return { html: content, init };
}


// ─── ADMIN QUIZ MANAGER ─────────────────────────────────────────
export function AdminQuizPage(store, router) {
  const content = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;">
      <h1 style="font-size:1.75rem;">Quiz Manager</h1>
      <button class="btn btn-primary btn-sm" id="btn-new-question">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Question
      </button>
    </div>

    <!-- Difficulty Filter -->
    <div id="quiz-filter-pills" style="display:flex;gap:0.5rem;margin-bottom:1.5rem;flex-wrap:wrap;">
      <button class="category-pill active" data-filter="all" style="padding:0.4rem 1rem;border:1px solid var(--warm-3);border-radius:999px;background:var(--crimson);color:var(--white);font-size:0.75rem;font-weight:600;cursor:pointer;transition:all 0.2s;">All</button>
      <button class="category-pill" data-filter="easy" style="padding:0.4rem 1rem;border:1px solid var(--warm-3);border-radius:999px;background:var(--white);color:var(--ink);font-size:0.75rem;font-weight:600;cursor:pointer;transition:all 0.2s;">🌱 Easy</button>
      <button class="category-pill" data-filter="medium" style="padding:0.4rem 1rem;border:1px solid var(--warm-3);border-radius:999px;background:var(--white);color:var(--ink);font-size:0.75rem;font-weight:600;cursor:pointer;transition:all 0.2s;">⚖️ Medium</button>
      <button class="category-pill" data-filter="hard" style="padding:0.4rem 1rem;border:1px solid var(--warm-3);border-radius:999px;background:var(--white);color:var(--ink);font-size:0.75rem;font-weight:600;cursor:pointer;transition:all 0.2s;">🔥 Hard</button>
    </div>

    <div id="quiz-questions-list" style="display:flex;flex-direction:column;gap:0.75rem;">
      <div style="padding:2rem;text-align:center;color:var(--ink-50);">Loading questions...</div>
    </div>

    <!-- Quiz Editor Overlay -->
    <div class="admin-editor-overlay" id="quiz-editor-overlay" style="display:none;">
      <div class="admin-editor-panel" style="max-width:640px;">
        <div class="admin-editor-header">
          <h2 id="quiz-editor-title">New Question</h2>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn btn-ghost btn-sm" id="quiz-editor-cancel">Cancel</button>
            <button class="btn btn-primary btn-sm" id="quiz-editor-save">Save Question</button>
          </div>
        </div>
        <div style="padding:1.5rem;overflow-y:auto;max-height:calc(100vh - 120px);">
          <div class="editor-field" style="margin-bottom:1rem;">
            <label style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-50);display:block;margin-bottom:0.4rem;">Question Text *</label>
            <textarea id="qed-text" rows="3" style="width:100%;padding:0.75rem;border:1px solid var(--warm-2);font-size:0.9rem;border-radius:6px;resize:vertical;" placeholder="Enter the quiz question..."></textarea>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <div class="editor-field">
              <label style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-50);display:block;margin-bottom:0.4rem;">Difficulty</label>
              <select id="qed-difficulty" style="width:100%;padding:0.5rem 0.75rem;border:1px solid var(--warm-2);font-size:0.85rem;border-radius:6px;">
                <option value="easy">🌱 Easy</option>
                <option value="medium" selected>⚖️ Medium</option>
                <option value="hard">🔥 Hard</option>
              </select>
            </div>
            <div class="editor-field">
              <label style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-50);display:block;margin-bottom:0.4rem;">Correct Answer</label>
              <select id="qed-correct" style="width:100%;padding:0.5rem 0.75rem;border:1px solid var(--warm-2);font-size:0.85rem;border-radius:6px;">
                <option value="0">Option A</option>
                <option value="1">Option B</option>
                <option value="2">Option C</option>
              </select>
            </div>
          </div>

          <div class="editor-field" style="margin-bottom:1rem;">
            <label style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-50);display:block;margin-bottom:0.4rem;">Answer Options *</label>
            <div id="qed-options-list" style="display:flex;flex-direction:column;gap:0.5rem;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="font-weight:700;font-size:0.8rem;color:var(--crimson);width:20px;">A</span>
                <input type="text" class="qed-option-input" data-idx="0" style="flex:1;padding:0.5rem 0.75rem;border:1px solid var(--warm-2);font-size:0.85rem;border-radius:6px;" placeholder="Option A...">
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="font-weight:700;font-size:0.8rem;color:var(--crimson);width:20px;">B</span>
                <input type="text" class="qed-option-input" data-idx="1" style="flex:1;padding:0.5rem 0.75rem;border:1px solid var(--warm-2);font-size:0.85rem;border-radius:6px;" placeholder="Option B...">
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="font-weight:700;font-size:0.8rem;color:var(--crimson);width:20px;">C</span>
                <input type="text" class="qed-option-input" data-idx="2" style="flex:1;padding:0.5rem 0.75rem;border:1px solid var(--warm-2);font-size:0.85rem;border-radius:6px;" placeholder="Option C...">
              </div>
            </div>
          </div>

          <div class="editor-field" style="margin-bottom:1rem;">
            <label style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-50);display:block;margin-bottom:0.4rem;">Explanation</label>
            <textarea id="qed-explanation" rows="3" style="width:100%;padding:0.75rem;border:1px solid var(--warm-2);font-size:0.85rem;border-radius:6px;resize:vertical;" placeholder="Explain the correct answer..."></textarea>
          </div>

          <div class="editor-field">
            <label style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-50);display:block;margin-bottom:0.4rem;">Recommended Article ID (optional)</label>
            <input type="text" id="qed-rec-article" style="width:100%;padding:0.5rem 0.75rem;border:1px solid var(--warm-2);font-size:0.85rem;border-radius:6px;" placeholder="e.g. art-seed-001">
          </div>
        </div>
      </div>
    </div>
  `;

  let allQuestions = [];
  let currentFilter = 'all';
  let editingId = null;

  function renderList() {
    const list = document.getElementById('quiz-questions-list');
    if (!list) return;
    const filtered = currentFilter === 'all' ? allQuestions : allQuestions.filter(q => q.difficulty === currentFilter);
    const diffEmoji = { easy: '🌱', medium: '⚖️', hard: '🔥' };
    const diffColors = { easy: '#2d8a4e', medium: '#c9880a', hard: '#c44040' };

    if (filtered.length === 0) {
      list.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--ink-50);">No questions found${currentFilter !== 'all' ? ` for "${currentFilter}" difficulty` : ''}.</div>`;
      return;
    }

    list.innerHTML = filtered.map((q, idx) => `
      <div class="admin-article-item" data-qid="${q.id}" style="cursor:default;">
        <div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:8px;background:${diffColors[q.difficulty]}15;flex-shrink:0;">
          <span style="font-size:1.1rem;">${diffEmoji[q.difficulty] || '❓'}</span>
        </div>
        <div class="admin-article-info" style="flex:1;min-width:0;">
          <div class="admin-article-title-text" style="font-size:0.9rem;line-height:1.35;">${escapeHtml(q.text)}</div>
          <div class="admin-article-details" style="margin-top:0.35rem;">
            <span class="badge" style="background:${diffColors[q.difficulty]}18;color:${diffColors[q.difficulty]};border:1px solid ${diffColors[q.difficulty]}30;">${q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}</span>
            <span style="color:var(--ink-50);font-size:0.75rem;">${q.options.length} options</span>
            <span style="color:var(--success);font-size:0.75rem;font-weight:600;">✓ ${String.fromCharCode(65 + q.correct_answer)}</span>
          </div>
        </div>
        <div class="admin-article-actions">
          <button class="admin-action-btn quiz-edit-btn" title="Edit" data-qid="${q.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="admin-action-btn quiz-delete-btn" title="Delete" data-qid="${q.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    // Bind edit buttons
    list.querySelectorAll('.quiz-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qid = parseInt(btn.dataset.qid);
        const question = allQuestions.find(q => q.id === qid);
        if (question) openEditor(question);
      });
    });

    // Bind delete buttons
    list.querySelectorAll('.quiz-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const qid = parseInt(btn.dataset.qid);
        const confirmed = await showConfirm('Delete Question', 'Are you sure you want to delete this quiz question? This cannot be undone.');
        if (confirmed) {
          const success = await store.deleteQuiz(qid);
          if (success) {
            showToast('Question deleted.');
            allQuestions = allQuestions.filter(q => q.id !== qid);
            renderList();
          } else {
            showToast('Failed to delete question.', 'error');
          }
        }
      });
    });
  }

  function openEditor(question = null) {
    const overlay = document.getElementById('quiz-editor-overlay');
    const title = document.getElementById('quiz-editor-title');
    overlay.style.display = 'flex';

    if (question) {
      editingId = question.id;
      title.textContent = 'Edit Question';
      document.getElementById('qed-text').value = question.text || '';
      document.getElementById('qed-difficulty').value = question.difficulty || 'medium';
      document.getElementById('qed-explanation').value = question.explanation || '';
      document.getElementById('qed-rec-article').value = question.recommendation_article_id || '';
      document.getElementById('qed-correct').value = question.correct_answer || 0;
      const inputs = document.querySelectorAll('.qed-option-input');
      question.options.forEach((opt, i) => {
        if (inputs[i]) inputs[i].value = opt;
      });
    } else {
      editingId = null;
      title.textContent = 'New Question';
      document.getElementById('qed-text').value = '';
      document.getElementById('qed-difficulty').value = 'medium';
      document.getElementById('qed-explanation').value = '';
      document.getElementById('qed-rec-article').value = '';
      document.getElementById('qed-correct').value = '1';
      document.querySelectorAll('.qed-option-input').forEach(inp => inp.value = '');
    }
  }

  function closeEditor() {
    document.getElementById('quiz-editor-overlay').style.display = 'none';
    editingId = null;
  }

  async function saveQuestion() {
    const text = document.getElementById('qed-text').value.trim();
    const difficulty = document.getElementById('qed-difficulty').value;
    const explanation = document.getElementById('qed-explanation').value.trim();
    const recommendation_article_id = document.getElementById('qed-rec-article').value.trim();
    const correct_answer = parseInt(document.getElementById('qed-correct').value, 10);
    const options = Array.from(document.querySelectorAll('.qed-option-input')).map(inp => inp.value.trim()).filter(Boolean);

    if (!text) { showToast('Please enter question text', 'error'); return; }
    if (options.length < 2) { showToast('At least 2 options are required', 'error'); return; }
    if (correct_answer >= options.length) { showToast('Correct answer index exceeds number of options', 'error'); return; }

    const data = { text, difficulty, explanation, recommendation_article_id, options, correct_answer };

    try {
      if (editingId) {
        const updated = await store.updateQuiz(editingId, data);
        const idx = allQuestions.findIndex(q => q.id === editingId);
        if (idx !== -1) allQuestions[idx] = updated;
        showToast('Question updated!');
      } else {
        const created = await store.createQuiz(data);
        allQuestions.push(created);
        showToast('Question created!');
      }
      closeEditor();
      renderList();
    } catch (e) {
      showToast(e.message || 'Failed to save question', 'error');
    }
  }

  async function init() {
    // Load all questions
    allQuestions = await store.loadQuiz(null);
    renderList();

    // Filter pills
    const pills = document.getElementById('quiz-filter-pills');
    if (pills) {
      pills.addEventListener('click', (e) => {
        const pill = e.target.closest('.category-pill');
        if (!pill) return;
        pills.querySelectorAll('.category-pill').forEach(p => {
          p.style.background = 'var(--white)';
          p.style.color = 'var(--ink)';
          p.classList.remove('active');
        });
        pill.classList.add('active');
        pill.style.background = 'var(--crimson)';
        pill.style.color = 'var(--white)';
        currentFilter = pill.dataset.filter;
        renderList();
      });
    }

    // New question button
    document.getElementById('btn-new-question')?.addEventListener('click', () => openEditor());

    // Editor cancel/save
    document.getElementById('quiz-editor-cancel')?.addEventListener('click', closeEditor);
    document.getElementById('quiz-editor-save')?.addEventListener('click', saveQuestion);

    // Close on overlay click
    document.getElementById('quiz-editor-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'quiz-editor-overlay') closeEditor();
    });
  }

  return { html: content, init };
}

