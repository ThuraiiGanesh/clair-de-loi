/* ===================================================================
   CLAIR DE LOI — Main Application Entry Point
   SPA Router initialization, page rendering, layout management
   =================================================================== */
import { Router, ArticleStore, initAnimations, showToast } from './utils.js';
import { renderHeader, renderFooter, bindHeaderEvents } from './ui.js';
import { HomePage, MissionPage, ArticlesPage, ArticleViewPage, ContactPage, LinksPage, NotFoundPage, QuizPage } from './pages.js';
import { AdminLoginPage, AdminDashboardPage, AdminArticlesPage, AdminQuizPage, renderAdminLayout } from './admin.js';
import { initChatbot } from './chatbot.js';

// ─── INITIALIZATION ──────────────────────────────────────────────
const store = new ArticleStore();
const router = new Router();

// Expose utils globally for cross-module access
window.__cdl_utils = { showToast };

// ─── ROUTE DEFINITIONS ──────────────────────────────────────────
// Public routes
router.add('/', () => HomePage(store), { layout: 'public' });
router.add('/mission', () => MissionPage(), { layout: 'public' });
router.add('/articles', () => ArticlesPage(store), { layout: 'public' });
router.add('/article/:id', (params) => ArticleViewPage(store, params), { layout: 'public' });
router.add('/quiz', () => QuizPage(store), { layout: 'public' });
router.add('/contact', () => ContactPage(), { layout: 'public' });
router.add('/links', () => LinksPage(store), { layout: 'none' });

// Admin routes
router.add('/admin/login', () => AdminLoginPage(store, router), { layout: 'none' });
router.add('/admin', () => AdminDashboardPage(store), { layout: 'admin' });
router.add('/admin/articles', () => AdminArticlesPage(store, router), { layout: 'admin' });
router.add('/admin/quiz', () => AdminQuizPage(store, router), { layout: 'admin' });

// 404
router.setNotFound(() => NotFoundPage());


// ─── RENDER ENGINE ───────────────────────────────────────────────
// ─── RENDER ENGINE ───────────────────────────────────────────────
async function renderPage(route, params) {
  const app = document.getElementById('app');
  const path = router.getCurrentPath();

  // Double check session auth asynchronously
  await store.checkAuth();

  // Check admin auth for admin routes
  if (route.meta.layout === 'admin' && !store.isAuthenticated()) {
    router.navigate('/admin/login');
    return;
  }

  // Get page content
  const page = route.handler(params);
  const layout = page.layout || route.meta.layout || 'public';

  // Scroll to top
  window.scrollTo(0, 0);

  // Remove old reading progress bar
  const oldProgress = document.querySelector('.reading-progress');
  if (oldProgress) oldProgress.remove();

  // Render based on layout
  switch (layout) {
    case 'public':
      app.innerHTML = `
        <div class="page-wrapper">
          ${renderHeader(path)}
          <main class="page-content" role="main">
            ${page.html}
          </main>
          ${renderFooter()}
        </div>
      `;
      bindHeaderEvents();
      break;

    case 'admin':
      app.innerHTML = renderAdminLayout(page.html, path);
      break;

    case 'none':
      app.innerHTML = page.html;
      break;

    default:
      app.innerHTML = page.html;
  }

  // Initialize page-specific JS
  if (page.init) {
    setTimeout(() => page.init(), 50);
  }

  // Re-initialize animations
  setTimeout(() => initAnimations(), 100);

  // Update document title
  updateTitle(path);
}

function updateTitle(path) {
  const titles = {
    '/': 'Clair De Loi — Illuminating the Law',
    '/mission': 'Our Mission — Clair De Loi',
    '/articles': 'The Archive — Clair De Loi',
    '/quiz': 'Legal Quiz — Clair De Loi',
    '/contact': 'Contact Us — Clair De Loi',
    '/links': 'Links — Clair De Loi',
    '/admin': 'Dashboard — Clair De Loi Admin',
    '/admin/articles': 'Articles — Clair De Loi Admin',
    '/admin/quiz': 'Quiz Manager — Clair De Loi Admin',
    '/admin/login': 'Admin Login — Clair De Loi'
  };

  if (path.startsWith('/article/')) {
    const id = path.split('/')[2];
    const article = store.getById(id);
    document.title = article ? `${article.title} — Clair De Loi` : 'Article — Clair De Loi';
  } else {
    document.title = titles[path] || 'Clair De Loi';
  }
}


// ─── START APPLICATION ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Load data and auth state from Flask backend
  try {
    await store.checkAuth();
    await store.load();
  } catch (e) {
    console.error("Initialization error:", e);
  }

  // Start router with dynamic API loading before rendering
  router.start(async (route, params) => {
    try {
      await store.load();
    } catch (e) {
      console.warn("Could not reload articles during navigation:", e);
    }
    renderPage(route, params);
  });

  // Initialize chatbot (global widget)
  initChatbot();

  console.log(
    '%c⚖ Clair De Loi %c Illuminating the law, one story at a time.',
    'background: #BC1E22; color: white; padding: 4px 8px; font-weight: bold; font-family: Georgia, serif;',
    'color: #666; font-style: italic;'
  );
});
