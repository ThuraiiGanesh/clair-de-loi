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
    { label: 'Articles', path: '/admin/articles', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' }
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
        </div>
        <div class="admin-stat-number" data-counter="${stats.igLinked}">0</div>
        <div class="admin-stat-label">IG Linked</div>
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
  const articles = store.getAll().sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

  const content = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;">
      <h1 style="font-size:1.75rem;">Articles</h1>
      <button class="btn btn-primary btn-sm" id="btn-new-article">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Article
      </button>
    </div>

    <div class="admin-article-list" id="admin-articles-list">
      ${articles.length === 0 ? `
        <div style="padding:2rem;text-align:center;color:var(--ink-50);">
          No articles yet. Click "New Article" to create your first one.
        </div>
      ` : articles.map(a => `
        <div class="admin-article-item" data-id="${a.id}">
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
              ${a.instagram_link ? '<span>📸</span>' : ''}
              <span>${formatDate(a.published_date)}</span>
            </div>
          </div>
          <div class="admin-article-actions">
            <button class="admin-action-btn edit-btn" title="Edit" data-id="${a.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="admin-action-btn delete-btn" title="Delete" data-id="${a.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `).join('')}
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

  let editingId = null;
  let coverImageData = '';

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

    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const article = store.getById(id);
        if (article) openEditor(article);
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const confirmed = await showConfirm('Delete Article', 'Are you sure you want to delete this article? This action cannot be undone.');
        if (confirmed) {
          await store.delete(id);
          showToast('Article deleted.');
          router.navigate('/admin/articles');
        }
      });
    });

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
