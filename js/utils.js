/* ===================================================================
   CLAIR DE LOI — JavaScript Utilities
   Router, ArticleStore, Toast, Animations, Helpers
   =================================================================== */

// ─── ROUTER ──────────────────────────────────────────────────────
export class Router {
  constructor() {
    this.routes = [];
    this.notFoundHandler = null;
  }

  add(path, handler, meta = {}) {
    const paramNames = [];
    const pattern = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const regex = new RegExp('^' + pattern + '$');
    this.routes.push({ path, regex, paramNames, handler, meta });
    return this;
  }

  setNotFound(handler) {
    this.notFoundHandler = handler;
    return this;
  }

  navigate(path) {
    window.location.hash = '#' + path;
  }

  getCurrentPath() {
    return window.location.hash.slice(1) || '/';
  }

  resolve(path) {
    for (const route of this.routes) {
      const match = path.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(match[i + 1]);
        });
        return { route, params };
      }
    }
    return null;
  }

  start(callback) {
    const handle = () => {
      const path = this.getCurrentPath();
      const result = this.resolve(path);
      if (result) {
        callback(result.route, result.params);
      } else if (this.notFoundHandler) {
        callback({ handler: this.notFoundHandler, meta: { layout: 'public' } }, {});
      }
    };
    window.addEventListener('hashchange', handle);
    handle();
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────
export function generateId() {
  return 'art-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatCategory(cat) {
  const map = {
    legal_insights: 'Legal Insights',
    opinion: 'Opinion',
    case_study: 'Case Study',
    news: 'News',
    explainer: 'Explainer'
  };
  return map[cat] || cat;
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export const LOGO_URL = 'static/images/logo.png';

export const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'legal_insights', label: 'Legal Insights' },
  { key: 'opinion', label: 'Opinion' },
  { key: 'case_study', label: 'Case Study' },
  { key: 'news', label: 'News' },
  { key: 'explainer', label: 'Explainer' }
];

export const SOCIAL_LINKS = {
  instagram_sg: 'https://www.instagram.com/clairdeloi.singapore/',
  instagram_main: 'https://www.instagram.com/clairdeloi/',
  linkedin: 'https://www.linkedin.com/company/clair-de-loi-singapore/',
  email: 'clairdeloisingapore@gmail.com'
};


// ─── TOAST NOTIFICATION ─────────────────────────────────────────
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


// ─── CONFIRM DIALOG ─────────────────────────────────────────────
export function showConfirm(title, message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="confirm-dialog-actions">
          <button class="btn btn-ghost btn-sm" id="confirm-cancel">Cancel</button>
          <button class="btn btn-primary btn-sm" id="confirm-ok">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirm-cancel').onclick = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('#confirm-ok').onclick = () => { overlay.remove(); resolve(true); };
  });
}


// ─── ANIMATIONS ─────────────────────────────────────────────────
export function initAnimations() {
  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.apple-reveal, .apple-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // Animated counters
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const duration = 1600;
      const startTime = performance.now();
      function tick(now) {
        const elapsed = Math.min(1, (now - startTime) / duration);
        el.textContent = Math.round(easeOutCubic(elapsed) * target).toLocaleString();
        if (elapsed < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  // Grid stagger
  const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.article-card, .values-card, .admin-stat-card, .linktree-link');
        items.forEach((item, index) => {
          item.style.transitionDelay = `${index * 0.08}s`;
          item.classList.add('is-in');
        });
        gridObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.grid-stagger').forEach(el => gridObserver.observe(el));

  // Magnetic hover
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      let raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
      const STRENGTH = 10;
      function loop() {
        tx += (cx - tx) * 0.18;
        ty += (cy - ty) * 0.18;
        el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
        if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
          raf = requestAnimationFrame(loop);
        } else { raf = null; }
      }
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        cx = dx * STRENGTH; cy = dy * STRENGTH;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      el.addEventListener('mouseleave', () => {
        cx = 0; cy = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
    });
  }
}


// ─── ARTICLE STORE ──────────────────────────────────────────────
export class ArticleStore {
  constructor() {
    this.articles = [];
    this.authenticated = false;
    this.KEY = 'cdl_articles';
    this.AUTH_KEY = 'cdl_admin_auth';
  }

  async load() {
    try {
      const url = this.isAuthenticated() ? '/api/articles/admin' : '/api/articles';
      const res = await fetch(url);
      if (res.ok) {
        this.articles = await res.json();
      } else {
        throw new Error('Non-200 response from backend');
      }
    } catch (e) {
      console.warn("Failed to load articles from backend API. Falling back to local storage.", e);
      this.articles = JSON.parse(localStorage.getItem(this.KEY) || '[]');
      if (this.articles.length === 0) {
        // Re-seed locally if empty
        this.articles = this.getLocalSeedArticles();
        localStorage.setItem(this.KEY, JSON.stringify(this.articles));
      }
    }
  }

  getAll() {
    return this.articles;
  }

  getLocalSeedArticles() {
    return [
      {
        id: 'art-seed-001',
        title: "Understanding Contract Law: A Beginner's Guide",
        slug: 'understanding-contract-law',
        excerpt: "Contract law forms the backbone of commercial and personal transactions. This guide breaks down the essential elements every aspiring legal mind should know.",
        content: `<h2>What Is a Contract?</h2><p>A contract is a legally binding agreement...</p>`,
        category: 'explainer',
        cover_image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
        video_url: '',
        instagram_link: 'https://www.instagram.com/clairdeloi.singapore/',
        author: 'Clair De Loi Editorial',
        is_featured: true,
        is_published: true,
        published_date: '2026-05-15',
        created_at: Date.now() - 100000
      }
    ];
  }

  async checkAuth() {
    try {
      const res = await fetch('/api/auth/check');
      if (res.ok) {
        const data = await res.json();
        this.authenticated = data.authenticated;
        sessionStorage.setItem(this.AUTH_KEY, this.authenticated ? 'true' : 'false');
      }
    } catch (e) {
      console.warn("Auth check request failed. Falling back to sessionStorage.", e);
      this.authenticated = sessionStorage.getItem(this.AUTH_KEY) === 'true';
    }
    return this.authenticated;
  }

  isAuthenticated() {
    return this.authenticated || sessionStorage.getItem(this.AUTH_KEY) === 'true';
  }

  async login(username, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        this.authenticated = true;
        sessionStorage.setItem(this.AUTH_KEY, 'true');
        return true;
      }
    } catch (e) {
      console.warn("Login request failed. Trying local fallback.", e);
    }

    // Fallback credentials for standalone client-side execution
    if (username === 'admin' && password === 'clairdeloi2026') {
      this.authenticated = true;
      sessionStorage.setItem(this.AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn("Logout request failed.", e);
    }
    this.authenticated = false;
    sessionStorage.removeItem(this.AUTH_KEY);
  }

  getPublished() {
    return this.articles
      .filter(a => a.is_published)
      .sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
  }

  getFeatured() {
    const published = this.getPublished();
    return published.find(a => a.is_featured) || published[0] || null;
  }

  getById(id) {
    return this.articles.find(a => a.id === id) || null;
  }

  getByCategory(category) {
    if (!category || category === 'all') return this.getPublished();
    if (category === 'saved') return this.getBookmarked();
    return this.getPublished().filter(a => a.category === category);
  }

  getBookmarked() {
    const bookmarkedIds = JSON.parse(localStorage.getItem('cdl_bookmarks') || '[]');
    return this.articles.filter(a => bookmarkedIds.includes(a.id) && a.is_published);
  }

  async create(data) {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const article = await res.json();
        await this.load();
        return article;
      }
    } catch (e) {
      console.error("Create article failed on backend API. Falling back to local storage.", e);
    }

    // Fallback logic
    const articles = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    const article = {
      id: 'art-' + Date.now(),
      title: data.title || 'Untitled',
      slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'untitled',
      excerpt: data.excerpt || '',
      content: data.content || '',
      category: data.category || 'news',
      cover_image_url: data.cover_image_url || '',
      video_url: data.video_url || '',
      instagram_link: data.instagram_link || '',
      author: data.author || 'Clair De Loi',
      is_featured: data.is_featured || false,
      is_published: data.is_published || false,
      published_date: data.published_date || new Date().toISOString().split('T')[0],
      created_at: Date.now()
    };
    articles.push(article);
    localStorage.setItem(this.KEY, JSON.stringify(articles));
    this.articles = articles;
    return article;
  }

  async update(id, data) {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const article = await res.json();
        await this.load();
        return article;
      }
    } catch (e) {
      console.error("Update article failed on backend API. Falling back to local storage.", e);
    }

    // Fallback logic
    const articles = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    const idx = articles.findIndex(a => a.id === id);
    if (idx !== -1) {
      articles[idx] = { ...articles[idx], ...data };
      localStorage.setItem(this.KEY, JSON.stringify(articles));
      this.articles = articles;
      return articles[idx];
    }
    return null;
  }

  async delete(id) {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await this.load();
        return true;
      }
    } catch (e) {
      console.error("Delete article failed on backend API. Falling back to local storage.", e);
    }

    // Fallback logic
    const articles = JSON.parse(localStorage.getItem(this.KEY) || '[]');
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(filtered));
    this.articles = filtered;
    return true;
  }

  getStats() {
    const all = this.articles;
    return {
      total: all.length,
      published: all.filter(a => !!a.is_published).length,
      featured: all.filter(a => !!a.is_featured).length,
      igLinked: all.filter(a => !!a.instagram_link).length
    };
  }

  // ─── QUIZ MANAGEMENT ────────────────────────────────────────────
  async loadQuiz(difficulty = null) {
    try {
      const url = difficulty ? `/api/quiz?difficulty=${difficulty}` : '/api/quiz/admin';
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Failed to load quiz questions from backend.", e);
    }
    return [];
  }

  async createQuiz(data) {
    try {
      const res = await fetch('/api/quiz/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to create question');
    } catch (e) {
      console.error("Create quiz question failed:", e);
      throw e;
    }
  }

  async updateQuiz(id, data) {
    try {
      const res = await fetch(`/api/quiz/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to update question');
    } catch (e) {
      console.error("Update quiz question failed:", e);
      throw e;
    }
  }

  async deleteQuiz(id) {
    try {
      const res = await fetch(`/api/quiz/admin/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.error("Delete quiz question failed:", e);
    }
    return false;
  }

  // ─── BULK OPERATIONS ────────────────────────────────────────────
  async bulkAction(action, ids) {
    try {
      const res = await fetch('/api/articles/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids })
      });
      if (res.ok) {
        await this.load();
        return true;
      }
    } catch (e) {
      console.error("Bulk action failed:", e);
    }
    return false;
  }
}

export const TRANSLATIONS = {
            en: {
              home: 'Home',
              mission: 'Our Mission',
              articles: 'Articles',
              contact: 'Contact Us',
              links: 'Link Hub', 
              link_hub: 'Link Hub',
              exit: 'Exit',
              hero_title: 'Illuminating the Law,<br><em class="glow-text">One Story at a Time.</em>',
              hero_sub: 'Clair De Loi is a youth-led law society dedicated to illuminating legal concepts and making discourse engaging and impactful through editorial excellence.',
              explore_articles: 'Explore Articles',
              featured: 'Featured',
              latest: 'Latest',
              view_all: 'View All',
              from_instagram: 'From Our Instagram',
              follow_instagram: 'Follow us on Instagram',
              coming_soon: 'Coming Soon',
              coming_soon_sub: 'Our editorial team is preparing thought-provoking content. Stay tuned.',
              tagline: '"Ubi societas ibi ius." — Where there is society, there is law.',
              footer_desc: 'Clair De Loi is a youth law society dedicated to illuminating the law through accessible, editorial-quality discourse.',
              navigate: 'Navigate',
              follow_us: 'Follow Us',
              mission_title: 'Our <span class="crimson-italic">Mission</span>',
              mission_p1: 'Clair De Loi — meaning "clarity of law" in French — is a youth-led law society dedicated to illuminating legal concepts for the everyday person. We believe that legal literacy is the cornerstone of an informed, empowered citizenry.',
              mission_p2: 'Through editorial articles, case analyses, opinion pieces, and community engagement, we strive to bridge the gap between complex legal frameworks and public understanding. Our team of aspiring lawyers and passionate writers work together to translate the intricacies of the law into accessible, thought-provoking content.',
              values_title: 'Our Core <span class="crimson-italic">Values</span>',
              val_clarity: 'Clarity',
              val_clarity_sub: 'We translate legal complexity into accessible language. The law should not be a mystery — it should be understood by all who are governed by it.',
              val_integrity: 'Integrity',
              val_integrity_sub: 'Every article is built on thorough research and balanced perspectives. We are committed to presenting the law fairly, without bias or oversimplification.',
              val_impact: 'Impact',
              val_impact_sub: 'Informed citizens create better societies. We believe that spreading legal literacy empowers individuals to exercise their rights and fulfil their responsibilities.',
              quote_text: '"The law is reason, free from passion. It is through clarity that we find justice."',
              quote_author: 'Aristotle',
              contact_title: 'Get in <span class="crimson-italic">Touch</span>',
              contact_sub: 'Have a question, collaboration idea, or simply want to connect? We\'d love to hear from you.',
              name: 'Name',
              email: 'Email',
              subject: 'Subject',
              message: 'Message',
              send_message: 'Send Message',

              // Category Names
              cat_all: 'All',
              cat_legal_insights: 'Legal Insights',
              cat_opinion: 'Opinion',
              cat_case_study: 'Case Study',
              cat_news: 'News',
              cat_explainer: 'Explainer',
              cat_saved: 'Saved Articles',

              // Search & Bookmarks
              archive_title: 'The <span class="crimson-italic">Archive</span>',
              archive_subtitle: 'A curated collection of articles exploring the law through diverse lenses — from foundational explainers to bold opinions on the future of legal discourse.',
              search_placeholder: 'Search articles by title or content...',
              no_articles_found: 'No articles found',
              no_articles_found_sub: 'Try adjusting your search query or select another category.',
              no_saved_articles: 'No saved articles yet',
              no_saved_articles_sub: 'Bookmark articles from the archive or detail view to read them later.',
              bookmark_tooltip: 'Save article for offline reading',
              saved_badge: 'Saved',
              back_to_articles: 'Back to Articles',
              social_footprint: 'Social Footprint',
              social_footprint_desc: 'This article was also shared on our Instagram. View the original post.',
              view_on_instagram: 'View on Instagram',

              // Quiz translation keys
              quiz_nav: 'Legal Quiz',
              quiz_title: 'Legal Literacy Quiz',
              quiz_subtitle: 'Test your knowledge on everyday Singapore legal scenarios.',
              quiz_start: 'Start Assessment',
              quiz_next: 'Next Question',
              quiz_results: 'Your Results',
              quiz_score: 'You scored',
              quiz_restart: 'Take Quiz Again',
              quiz_recommended: 'Recommended Reading',
              quiz_correct: 'Correct!',
              quiz_incorrect: 'Incorrect',
              quiz_rank_expert: 'Legal Expert ⚖️',
              quiz_rank_scholar: 'Aspiring Scholar 📚',
              quiz_rank_citizen: 'Curious Citizen 🏛️',
              quiz_feedback_high: 'Outstanding! You have a strong grasp of foundational legal principles in Singapore.',
              quiz_feedback_mid: 'Good job! You understand common scenarios well, but there is still room to expand your legal literacy.',
              quiz_feedback_low: 'Nice try! Legal concepts can be complex. Dive into our article archive to strengthen your knowledge.',

              // Quiz Question 1
              q1_text: 'You see an item in a store window priced at $10. You bring it to the counter, but the cashier says the price tag is wrong and it costs $15. Can you legally force them to sell it to you for $10?',
              q1_o1: 'Yes, the display was a binding offer.',
              q1_o2: 'No, the display is an "invitation to treat," not a binding offer.',
              q1_o3: 'Yes, price tags are legally binding under all circumstances.',
              q1_exp: 'In contract law, displaying goods in a shop window or shelf is generally an "invitation to treat," which invites you to make an offer. The contract is only formed when you offer to buy and the shop accepts.',

              // Quiz Question 2
              q2_text: 'A local company sends you promotional text messages. You never gave them your phone number or consent. Which Singapore law protects you against this?',
              q2_o1: 'Cybersecurity Act (CSA)',
              q2_o2: 'Personal Data Protection Act (PDPA) & Spam Control Act',
              q2_o3: 'Protection from Online Falsehoods and Manipulation Act (POFMA)',
              q2_exp: 'Under Singapore\'s Personal Data Protection Act (PDPA), organisations generally cannot collect or use your personal data (like your phone number) for marketing without your consent, and the Spam Control Act regulates unsolicited messages.',

              // Quiz Question 3
              q3_text: 'You hire a freelance photographer to take photos for your new business website. Unless agreed otherwise in the contract, who automatically owns the copyright of these photos in Singapore?',
              q3_o1: 'You (since you paid for the photos).',
              q3_o2: 'The freelance photographer.',
              q3_o3: 'Both of you share copyright equally.',
              q3_exp: 'Under Singapore\'s Copyright Act 2021, the default owner of copyright in commissioned works (like photos, portraits, or music) is the creator (the photographer), unless there is a contract that states copyright is transferred to the commissioner.',

              // Quiz Question 4
              q4_text: 'You post a public review online claiming a business owner stole money, knowing it is false, which ruins their reputation. Can you be sued for defamation?',
              q4_o1: 'No, internet reviews are protected by absolute free speech.',
              q4_o2: 'Yes, false statements that cause serious harm to a person\'s or business\'s reputation can lead to civil lawsuits for defamation.',
              q4_o3: 'No, online defamation only applies to official news sites, not individual posts.',
              q4_exp: 'In Singapore, sharing false statements about a person or business that lowers them in the estimation of right-thinking members of society can lead to a civil lawsuit for defamation (specifically libel, since it is in written/permanent form).',

              // Quiz Question 5
              q5_text: 'In Singapore\'s system of governance, which branch of government has the power to interpret laws and administer justice?',
              q5_o1: 'The Executive (Cabinet & Prime Minister)',
              q5_o2: 'The Legislature (Parliament)',
              q5_o3: 'The Judiciary (Supreme Court & State Courts)',
              q5_exp: 'Under the principle of separation of powers, the Judiciary is responsible for interpreting the law and administering justice, independent of the Executive (government administration) and the Legislature (law-making body).',

              // Quiz Difficulty
              quiz_select_difficulty: 'Select Difficulty',
              quiz_difficulty_desc: 'Choose your challenge level. Questions adapt to your selection.',
              quiz_easy: 'Easy',
              quiz_easy_desc: 'Basic legal concepts and terminology',
              quiz_medium: 'Medium',
              quiz_medium_desc: 'Applied legal knowledge and reasoning',
              quiz_hard: 'Hard',
              quiz_hard_desc: 'Advanced case law and nuanced principles',
              quiz_questions_count: 'questions'
            },
            zh: {
              home: '首页',
              mission: '我们的使命',
              articles: '文章归档',
              contact: '联系我们',
              links: '链接中心',
              link_hub: '链接中心',
              exit: '返回网站',
              hero_title: '启迪法律思维，<br><em class="glow-text">讲好每个故事。</em>',
              hero_sub: 'Clair De Loi 是一个由青年主导的法学社团，致力于通过卓越的编辑工作，阐明法律概念，使法律讨论更具吸引力和影响力。',
              explore_articles: '浏览文章',
              featured: '精选推荐',
              latest: '最新文章',
              view_all: '查看全部',
              from_instagram: '来自我们的Instagram',
              follow_instagram: '在Instagram上关注我们',
              coming_soon: '即将推出',
              coming_soon_sub: '我们的编辑团队正在筹备精彩内容，敬请期待。',
              tagline: '“有社会，便有法律。” —— 法律与社会同行。',
              footer_desc: 'Clair De Loi 是一个青年法学社团，致力于通过通俗易懂的优质社评启迪公众对法律的认知。',
              navigate: '快速导航',
              follow_us: '关注我们',
              mission_title: '我们的<span class="crimson-italic">使命</span>',
              mission_p1: 'Clair De Loi — 在法语中意为“法律的清晰度” — 是一个由青年主导的法学社团，致力于为普罗大众阐明法律概念。我们坚信，法律素养是培养知情、赋能公民的基石。',
              mission_p2: '通过社论文章、案例分析、观点评论和社区互动，我们努力弥合复杂法律框架与公众理解之间的鸿沟。我们的准律师和热心撰稿人团队紧密合作，将深奥的法律条文转化为通俗易懂、引人深思的内容。',
              values_title: '我们的核心<span class="crimson-italic">价值观</span>',
              val_clarity: '清晰易懂',
              val_clarity_sub: '我们将复杂的法律术语转化为通俗易懂的语言。法律不应是谜团，而应被所有受其管辖的人所理解。',
              val_integrity: '诚实严谨',
              val_integrity_sub: '每篇文章都建立在详实的研究和客观的视角之上。我们致力于公正地呈现法律，不偏不倚，亦不以偏概全。',
              val_impact: '社会影响',
              val_impact_sub: '知情公民创造美好社会。我们相信，普及法律素养能赋能个人行使权利并履行义务。',
              quote_text: '“法律是免除激情的理性。唯有透过清晰，我们方能寻得正义。”',
              quote_author: '亚里士多德',
              contact_title: '与我们<span class="crimson-italic">联络</span>',
              contact_sub: '有任何疑问、反馈或有志于加入我们？欢迎给我们留言。',
              name: '姓名',
              email: '电子邮箱',
              subject: '主题',
              message: '留言内容',
              send_message: '发送留言',

              // Category Names
              cat_all: '全部',
              cat_legal_insights: '法律见解',
              cat_opinion: '观点评论',
              cat_case_study: '案例分析',
              cat_news: '时事新闻',
              cat_explainer: '法律科普',
              cat_saved: '我的收藏',

              // Search & Bookmarks
              archive_title: '文章<span class="crimson-italic">归档</span>',
              archive_subtitle: '精心策划的文章合集，从基础的科普到对未来法律讨论的独到观点，带您从不同视角探索法律。',
              search_placeholder: '按标题或内容搜索文章...',
              no_articles_found: '未找到相关文章',
              no_articles_found_sub: '请尝试调整您的搜索词或选择其他分类。',
              no_saved_articles: '暂无收藏文章',
              no_saved_articles_sub: '从归档页或文章详情页中点击收藏，以便稍后阅读。',
              bookmark_tooltip: '收藏文章以备离线阅读',
              saved_badge: '已收藏',
              back_to_articles: '返回文章列表',
              social_footprint: '社交足迹',
              social_footprint_desc: '此文章也分享到了我们的Instagram上。点击查看原始帖子。',
              view_on_instagram: '在Instagram上查看',

              // Quiz translation keys
              quiz_nav: '法律问答',
              quiz_title: '法律素养自测',
              quiz_subtitle: '测试您对新加坡日常法律场景的了解程度。',
              quiz_start: '开始测试',
              quiz_next: '下一题',
              quiz_results: '测试结果',
              quiz_score: '您的得分',
              quiz_restart: '重新测试',
              quiz_recommended: '推荐阅读',
              quiz_correct: '回答正确！',
              quiz_incorrect: '回答错误',
              quiz_rank_expert: '法律专家 ⚖️',
              quiz_rank_scholar: '律政先锋 📚',
              quiz_rank_citizen: '守法公民 🏛️',
              quiz_feedback_high: '太棒了！您对新加坡的基本法律原则有非常扎实的理解。',
              quiz_feedback_mid: '做得好！您对常见的法律场景很熟悉，但仍有空间来拓宽您的法律视野。',
              quiz_feedback_low: '不错的尝试！法律概念通常很复杂。欢迎阅读我们的归档文章以充实您的知识。',

              // Quiz Question 1
              q1_text: '场景：您在商店橱窗里看到一件标价为10元的商品。您拿到柜台，但收银员说价格标签错了，实际价格是15元。您在法律上能强迫他们以10元卖给您吗？',
              q1_o1: '能，商品的展示陈设是具有约束力的要约（Offer）。',
              q1_o2: '不能，展示陈设只是一种“要约邀请”（Invitation to Treat），而非具有约束力的要约。',
              q1_o3: '能，价格标签在任何情况下都具有法律约束力。',
              q1_exp: '在合同法中，在商店橱窗或货架上陈列商品通常被称为“要约邀请”（invitation to treat），即邀请顾客出价。只有当顾客提出购买意向且商家接受时，合同才成立。',

              // Quiz Question 2
              q2_text: '一家本地公司在您未提供电话号码或同意的情况下，向您发送促销短信。哪部新加坡法律可以保护您免受此类骚扰？',
              q2_o1: '网络安全法 (CSA)',
              q2_o2: '个人数据保护法 (PDPA) 和 垃圾信息控制法',
              q2_o3: '防止网络假信息和网络操纵法案 (POFMA)',
              q2_exp: '根据新加坡的《个人数据保护法》(PDPA)，企业在未获得您同意的情况下，通常不能收集或使用您的个人数据（如电话号码）进行营销推广，同时《垃圾信息控制法》也规范了未授权垃圾消息的发送。',

              // Quiz Question 3
              q3_text: '您聘请了一位自由摄影师为您的新商业网站拍摄照片。除非在合同中另有约定，在新加坡谁会自动拥有这些照片的版权？',
              q3_o1: '您（因为您付了钱）。',
              q3_o2: '该自由摄影师。',
              q3_o3: '双方共同拥有版权。',
              q3_exp: '根据新加坡的《版权法2021》，受托创作的作品（如照片、肖像或音乐）的默认版权所有人是创作者（即摄影师），除非双方合同明确规定版权转移给委托人。',

              // Quiz Question 4
              q4_text: '您在网络上发布公开评论，在明知不属实的情况下声称某店主偷钱，致使该店主的信誉严重受损。您会被起诉诽谤吗？',
              q4_o1: '不会，网络评论受到绝对言论自由的保护。',
              q4_o2: '会，发布对个人或企业信誉造成严重损害的虚假言论可能导致民事诽谤诉讼。',
              q4_o3: '不会，网络诽谤仅适用于官方新闻网站，不适用于个人贴子。',
              q4_exp: '在新加坡，发布散布关于个人或企业的虚假言论，降低其在社会中的评价，可能会面临民事诽谤诉讼（由于是书面或永久形式，具体为书面诽谤 libel）。',

              // Quiz Question 5
              q5_text: '在新加坡的政治体制中，哪一个政府分支拥有解释法律和执行司法审判的权力？',
              q5_o1: '行政机关（内阁与总理）',
              q5_o2: '立法机关（国会）',
              q5_o3: '司法机关（最高法院与国家法院）',
              q5_exp: '根据三权分立原则，司法机关负责解释法律和主持司法公正，独立于行政机关（政府运作）和立法机关（法律制定）。'
            },
            ms: {
              home: 'Utama',
              mission: 'Misi Kami',
              articles: 'Artikel',
              contact: 'Hubungi Kami',
              links: 'Hab Pautan',
              link_hub: 'Hab Pautan',
              exit: 'Kembali',
              hero_title: 'Menerangi Undang-undang,<br><em class="glow-text">Satu Kisah Setiap Masa.</em>',
              hero_sub: 'Clair De Loi ialah persatuan undang-undang diterajui belia yang berdedikasi untuk menerangkan konsep undang-undang dan menjadikan wacana menarik serta berimpak melalui kecemerlangan editorial.',
              explore_articles: 'Terokai Artikel',
              featured: 'Pilihan',
              latest: 'Terkini',
              view_all: 'Lihat Semua',
              from_instagram: 'Dari Instagram Kami',
              follow_instagram: 'Ikuti kami di Instagram',
              coming_soon: 'Akan Datang',
              coming_soon_sub: 'Pasukan editorial kami sedang menyediakan kandungan yang menarik. Harap bersabar.',
              tagline: '"Di mana ada masyarakat, di situ ada undang-undang." — Wujud bersama sosial.',
              footer_desc: 'Clair De Loi ialah persatuan undang-undang belia yang berdedikasi untuk menerangi undang-undang melalui penulisan editorial yang berkualiti dan mudah difahami.',
              navigate: 'Navigasi',
              follow_us: 'Ikuti Kami',
              mission_title: '<span class="crimson-italic">Misi</span> Kami',
              mission_p1: 'Clair De Loi — bermaksud "kejelasan undang-undang" dalam bahasa Perancis — ialah persatuan undang-undang yang diterajui oleh belia yang berdedikasi untuk menerangi konsep undang-undang bagi masyarakat umum. Kami percaya bahawa literasi undang-undang adalah asas bagi warganegara yang bermaklumat dan berdaya.',
              mission_p2: 'Melalui artikel editorial, analisis kes, penulisan pendapat, dan penglibatan komuniti, kami berusaha untuk merapatkan jurang antara rangka kerja undang-undang yang kompleks dengan pemahaman awam. Pasukan bakal peguam dan penulis kami bekerjasama untuk menterjemahkan kerumitan undang-undang kepada kandungan yang mudah diakses dan merangsang pemikiran.',
              values_title: '<span class="crimson-italic">Nilai</span> Teras Kami',
              val_clarity: 'Kejelasan',
              val_clarity_sub: 'Kami menterjemah kerumitan undang-undang kepada bahasa yang mudah difahami. Undang-undang tidak sepatutnya menjadi misteri — ia perlu difahami oleh semua orang yang tertakluk kepadanya.',
              val_integrity: 'Integriti',
              val_integrity_sub: 'Setiap artikel dibina atas penyelidikan menyeluruh dan perspektif seimbang. Kami komited untuk membentangkan undang-undang secara adil, tanpa berat sebelah atau terlalu dipermudahkan.',
              val_impact: 'Impak',
              val_impact_sub: 'Masyarakat berpengetahuan membina negara yang lebih baik. Kami percaya literasi undang-undang memperkasa individu untuk menuntut hak dan melaksanakan tanggungjawab mereka.',
              quote_text: '"Undang-undang adalah akal, bebas daripada keghairahan. Melalui kejelasanlah kita menemui keadilan."',
              quote_author: 'Aristotle',
              contact_title: 'Hubungi <span class="crimson-italic">Kami</span>',
              contact_sub: 'Mempunyai soalan, idea kolaborasi, atau sekadar ingin berhubung? Kami sentiasa bersedia mendengar daripada anda.',
              name: 'Nama',
              email: 'E-mel',
              subject: 'Subjek',
              message: 'Mesej',
              send_message: 'Hantar Mesej',

              // Category Names
              cat_all: 'Semua',
              cat_legal_insights: 'Wawasan Undang-undang',
              cat_opinion: 'Pendapat',
              cat_case_study: 'Kajian Kes',
              cat_news: 'Berita',
              cat_explainer: 'Penerangan',
              cat_saved: 'Artikel Disimpan',

              // Search & Bookmarks
              archive_title: '<span class="crimson-italic">Arkib</span> Kami',
              archive_subtitle: 'Koleksi artikel terpilih yang menerokai undang-undang melalui pelbagai perspektif — daripada penerangan asas hingga pendapat berani tentang masa depan wacana undang-undang.',
              search_placeholder: 'Cari artikel menggunakan tajuk atau kandungan...',
              no_articles_found: 'Tiada artikel ditemui',
              no_articles_found_sub: 'Cuba laraskan carian anda atau pilih kategori lain.',
              no_saved_articles: 'Tiada artikel disimpan lagi',
              no_saved_articles_sub: 'Simpan artikel dari arkib atau paparan terperinci untuk dibaca kemudian.',
              bookmark_tooltip: 'Simpan artikel untuk bacaan luar talian',
              saved_badge: 'Disimpan',
              back_to_articles: 'Kembali ke Artikel',
              social_footprint: 'Jejak Sosial',
              social_footprint_desc: 'Artikel ini juga dikongsi di Instagram kami. Lihat hantaran asal.',
              view_on_instagram: 'Lihat di Instagram',

              // Quiz translation keys
              quiz_nav: 'Kuiz Undang2',
              quiz_title: 'Kuiz Literasi Undang-undang',
              quiz_subtitle: 'Uji pengetahuan anda tentang senario undang-undang harian di Singapura.',
              quiz_start: 'Mula Kuiz',
              quiz_next: 'Soalan Seterusnya',
              quiz_results: 'Keputusan Kuiz',
              quiz_score: 'Skor anda ialah',
              quiz_restart: 'Ambil Kuiz Semula',
              quiz_recommended: 'Bacaan Cadangan',
              quiz_correct: 'Betul!',
              quiz_incorrect: 'Salah',
              quiz_rank_expert: 'Pakar Undang-undang ⚖️',
              quiz_rank_scholar: 'Cendekiawan Harapan 📚',
              quiz_rank_citizen: 'Warganegara Prihatin 🏛️',
              quiz_feedback_high: 'Hebat! Anda mempunyai pemahaman yang sangat kukuh tentang prinsip undang-undang asas di Singapura.',
              quiz_feedback_mid: 'Syabas! Anda memahami senario biasa dengan baik, tetapi masih ada ruang untuk meluaskan literasi undang-undang anda.',
              quiz_feedback_low: 'Cuba lagi! Konsep undang-undang boleh menjadi agak rumit. Terokai arkib artikel kami untuk mengukuhkan pengetahuan anda.',

              // Quiz Question 1
              q1_text: 'Senario: Anda melihat satu barang dipamerkan di tingkap kedai berharga $10. Anda membawanya ke kaunter, tetapi juruwang mengatakan tanda harga itu salah dan ia berharga $15. Bolehkah anda secara sah memaksa mereka menjualnya dengan harga $10?',
              q1_o1: 'Ya, paparan itu adalah satu tawaran (Offer) yang mengikat.',
              q1_o2: 'Tidak, paparan itu adalah \'pelawaan tawaran\' (Invitation to Treat), bukan tawaran yang mengikat.',
              q1_o3: 'Ya, tanda harga adalah mengikat secara sah dalam semua keadaan.',
              q1_exp: 'Dalam undang-undang kontrak, mempamerkan barangan di tingkap kedai atau di rak kedai biasanya merupakan satu \'pelawaan tawaran\' (invitation to treat), iaitu pelawaan kepada pelanggan untuk membuat tawaran. Kontrak hanya terbentuk apabila pelanggan membuat tawaran untuk membeli dan penjual menerimanya.',

              // Quiz Question 2
              q2_text: 'Sebuah syarikat tempatan menghantar SMS promosi kepada anda. Anda tidak pernah memberikan nombor telefon anda atau bersetuju. Undang-undang Singapura manakah yang melindungi anda?',
              q2_o1: 'Akta Keselamatan Siber (CSA)',
              q2_o2: 'Akta Perlindungan Data Peribadi (PDPA) & Akta Kawalan Spam',
              q2_o3: 'Akta Perlindungan daripada Kepalsuan dan Manipulasi Dalam Talian (POFMA)',
              q2_exp: 'Di bawah Akta Perlindungan Data Peribadi (PDPA) Singapura, organisasi secara amnya tidak dibenarkan mengumpul atau menggunakan data peribadi anda (seperti nombor telefon) untuk pemasaran tanpa persetujuan anda, dan Akta Kawalan Spam mengawal mesej yang tidak diminta.',

              // Quiz Question 3
              q3_text: 'Anda melantik seorang jurugambar bebas untuk mengambil foto bagi laman web perniagaan baru anda. Melainkan dipersetujui sebaliknya dalam kontrak, siapakah pemilik hak cipta foto tersebut secara automatik di Singapura?',
              q3_o1: 'Anda (kerana anda telah membayar untuk foto tersebut).',
              q3_o2: 'Jurugambar bebas tersebut.',
              q3_o3: 'Kedua-dua pihak berkongsi hak cipta secara sama rata.',
              q3_exp: 'Di bawah Akta Hak Cipta 2021 Singapura, pemilik asal hak cipta bagi hasil karya yang ditempah (seperti foto, lukisan potret, atau muzik) ialah pencipta (iaitu jurugambar), melainkan terdapat kontrak bertulis yang menyatakan hak cipta dipindahkan kepada pelanggan.',

              // Quiz Question 4
              q4_text: 'Anda menyiarkan ulasan awam di internet mendakwa seorang pemilik perniagaan telah mencuri wang, sedangkan anda tahu dakwaan itu palsu dan boleh merosakkan reputasinya. Bolehkah anda disaman atas fitnah?',
              q4_o1: 'Tidak, ulasan internet dilindungi secara mutlak oleh kebebasan bersuara.',
              q4_o2: 'Ya, kenyataan palsu yang menyebabkan kemudaratan serius kepada reputasi seseorang atau perniagaan boleh membawa kepada saman sivil fitnah.',
              q4_o3: 'Tidak, fitnah dalam talian hanya terpakai kepada laman berita rasmi, bukan catatan individu.',
              q4_exp: 'Di Singapura, menyebarkan kenyataan palsu mengenai seseorang atau perniagaan yang menjatuhkan reputasi mereka di mata masyarakat boleh menyebabkan saman sivil bagi fitnah (khususnya bertulis/libel, memandangkan ia dalam bentuk bertulis/kekal).',

              // Quiz Question 5
              q5_text: 'Dalam sistem tadbir urus Singapura, cabang kerajaan manakah yang mempunyai kuasa untuk mentafsir undang-undang dan melaksanakan keadilan?',
              q5_o1: 'Eksekutif (Kabinet & Perdana Menteri)',
              q5_o2: 'Legislatif / Perundangan (Parlimen)',
              q5_o3: 'Kehakiman (Mahkamah Agung & Mahkamah Negeri)',
              q5_exp: 'Di bawah prinsip pengasingan kuasa, Badan Kehakiman bertanggungjawab mentafsir undang-undang dan menegakkan keadilan, bebas daripada Badan Eksekutif (pentadbiran kerajaan) dan Badan Legislatif (pembuat undang-undang).'
            },
            ta: {
              home: 'முகப்பு',
              mission: 'எங்கள் நோக்கம்',
              articles: 'கட்டுரைகள்',
              contact: 'தொடர்புக்கு',
              links: 'இணைப்பு மையம்',
              link_hub: 'இணைப்பு மையம்',
              exit: 'வெளியேறு',
              hero_title: 'சட்டத்தை விளக்குவோம்,<br><em class="glow-text">ஒவ்வொரு கதையாக.</em>',
              hero_sub: 'Clair De Loi என்பது இளைஞர்களால் நடத்தப்படும் ஒரு சட்டச் சங்கம் ஆகும். இது எளிய முறையில் சட்டக் கருத்துக்களை விளக்கவும், வாதங்களை சுவாரஸ்யமாக்கவும் உருவாக்கப்பட்டது.',
              explore_articles: 'கட்டுரைகளை ஆராய்க',
              featured: 'சிறப்பு கட்டுரை',
              latest: 'சமீபத்தியவை',
              view_all: 'அனைத்தையும் காண்க',
              from_instagram: 'எங்கள் இன்ஸ்டாகிராமிலிருந்து',
              follow_instagram: 'இன்ஸ்டாகிராமில் எங்களைப் பின்தொடரவும்',
              coming_soon: 'விரைவில் வரும்',
              coming_soon_sub: 'எங்கள் ஆசிரியர் குழு புதிய மற்றும் பயனுள்ள கட்டுரைகளை தயாரித்து வருகிறது.',
              tagline: '"சமூகம் உள்ள இடத்தில் சட்டம் இருக்கும்." — சட்டம் சமூகத்தின் அடிப்படை.',
              footer_desc: 'Clair De Loi என்பது இளைஞர்களுக்கான சட்டச் சங்கம். இது எளிய மற்றும் தரமான கட்டுரைகள் மூலம் சட்ட விழிப்புணர்வை ஏற்படுத்துகிறது.',
              navigate: 'வழிசெலுத்தல்',
              follow_us: 'எங்களை பின்தொடரவும்',
              mission_title: 'எங்கள் <span class="crimson-italic">நோக்கம்</span>',
              mission_p1: 'Clair De Loi — பிரெஞ்சு மொழியில் "சட்டத்தின் தெளிவு" என்று பொருள் — இது எளிய மக்களுக்கு சட்டக் கருத்துக்களை விளக்குவதற்காக இளைஞர்களால் நடத்தப்படும் ஒரு சட்டச் சங்கமாகும். சட்ட அறிவு என்பது விழிப்புணர்வுள்ள மற்றும் அதிகாரம் பெற்ற குடிமக்களின் அடித்தளம் என்று நாங்கள் நம்புகிறோம்.',
              mission_p2: 'தலையங்கக் கட்டுரைகள், வழக்கு ஆய்வுகள், கருத்துப் பதிவுகள் மற்றும் சமூக ஈடுபாடுகள் மூலம், சிக்கலான சட்ட அமைப்புகளுக்கும் பொதுமக்களின் புரிதலுக்கும் இடையிலான இடைவெளியைக் குறைக்க நாங்கள் பாடுபடுகிறோம். எங்கள் எதிர்கால வழக்கறிஞர்கள் மற்றும் எழுத்தாளர்கள் குழு இணைந்து, சட்டத்தின் நுணுக்கங்களை எளிமையான மற்றும் சிந்திக்கத் தூண்டும் உள்ளடக்கமாக மாற்றுகிறது.',
              values_title: 'எங்கள் முக்கிய <span class="crimson-italic">மதிப்புகள்</span>',
              val_clarity: 'தெளிவு',
              val_clarity_sub: 'சட்டத்தின் சிக்கல்களை எளிய மொழியில் மொழிபெயர்க்கிறோம். சட்டம் ஒரு புதிராக இருக்கக்கூடாது — அதன்கீழ் நிர்வகிக்கப்படும் அனைவரும் அதைப் புரிந்துகொள்ள வேண்டும்.',
              val_integrity: 'நேர்மை',
              val_integrity_sub: 'ஒவ்வொரு கட்டுரையும் ஆழமான ஆராய்ச்சி மற்றும் நடுநிலையான பார்வையின் அடிப்படையில் உருவாக்கப்படுகிறது. சட்டத்தை நியாயமாகவும், சார்பு அல்லது மிகைப்படுத்தல் இல்லாமலும் வழங்க நாங்கள் கடமைப்பட்டுள்ளோம்.',
              val_impact: 'தாக்கம்',
              val_impact_sub: 'அறிவார்ந்த குடிமக்கள் சிறந்த சமூகத்தை உருவாக்குகிறார்கள். சட்ட அறிவைப் பரப்புவது தனிநபர்கள் தங்கள் உரிமைகளைப் பயன்படுத்தவும் கடமைகளை நிறைவேற்றவும் அதிகாரம் அளிக்கும் என்று நம்புகிறோம்.',
              quote_text: '"சட்டம் என்பது உணர்ச்சியற்ற பகுத்தறிவு ஆகும். தெளிவின் மூலமே நமக்கு நீதி கிடைக்கிறது."',
              quote_author: 'அரிஸ்டாட்டில்',
              contact_title: 'தொடர்பு <span class="crimson-italic">கொள்ளுங்கள்</span>',
              contact_sub: 'கேள்விகள், கூட்டுப்பணி யோசனைகள் அல்லது தொடர்பு கொள்ள வேண்டுமா? உங்களிடமிருந்து கேட்க நாங்கள் விரும்புகிறோம்.',
              name: 'பெயர்',
              email: 'மின்னஞ்சல் முகவரி',
              subject: 'தலைப்பு',
              message: 'செய்தி',
              send_message: 'செய்தி அனுப்பு',

              // Category Names
              cat_all: 'அனைத்தும்',
              cat_legal_insights: 'சட்ட நுண்ணறிவுகள்',
              cat_opinion: 'கருத்து',
              cat_case_study: 'வழக்கு ஆய்வு',
              cat_news: 'செய்திகள்',
              cat_explainer: 'விளக்கம்',
              cat_saved: 'சேமிக்கப்பட்டவை',

              // Search & Bookmarks
              archive_title: 'ஆவணக் <span class="crimson-italic">காப்பகம்</span>',
              archive_subtitle: 'சட்டத்தை பல்வேறு கோணங்களில் ஆராயும் கட்டுரைகளின் தொகுப்பு — அடிப்படை விளக்கங்கள் முதல் சட்ட விவாதத்தின் எதிர்காலம் பற்றிய கருத்துக்கள் வரை.',
              search_placeholder: 'தலைப்பு அல்லது உள்ளடக்கத்தின் மூலம் தேடுங்கள்...',
              no_articles_found: 'கட்டுரைகள் எதுவும் கிடைக்கவில்லை',
              no_articles_found_sub: 'தேடலை மாற்றவும் அல்லது வேறு வகையைத் தேர்ந்தெடுக்கவும்.',
              no_saved_articles: 'சேமிக்கப்பட்ட கட்டுரைகள் எதுவும் இல்லை',
              no_saved_articles_sub: 'பின்னர் படிக்க காப்பகம் அல்லது விவரப் பக்கத்திலிருந்து கட்டுரைகளைச் சேமிக்கவும்.',
              bookmark_tooltip: 'ஆஃப்லைனில் படிக்க கட்டுரையைச் சேமிக்கவும்',
              saved_badge: 'சேமிக்கப்பட்டது',
              back_to_articles: 'கட்டுரைகளுக்குத் திரும்பு',
              social_footprint: 'சமூக தடம்',
              social_footprint_desc: 'இந்தக் கட்டுரை எங்கள் இன்ஸ்டாகிராமிலும் பகிரப்பட்டது. அசல் பதிவைப் பார்க்கவும்.',
              view_on_instagram: 'இன்ஸ்டாகிராமில் காண்க',

              // Quiz translation keys
              quiz_nav: 'சட்ட வினாடிவினா',
              quiz_title: 'சட்ட அறிவு வினாடிவினா',
              quiz_subtitle: 'தினசரி சிங்கப்பூர் சட்டச் சூழ்நிலைகள் குறித்த உங்கள் அறிவைச் சோதிக்கவும்.',
              quiz_start: 'மதிப்பீட்டைத் தொடங்கு',
              quiz_next: 'அடுத்த கேள்வி',
              quiz_results: 'உங்கள் முடிவுகள்',
              quiz_score: 'நீங்கள் பெற்ற மதிப்பெண்',
              quiz_restart: 'மீண்டும் வினாடிவினா செய்',
              quiz_recommended: 'பரிந்துரைக்கப்பட்ட வாசிப்பு',
              quiz_correct: 'சரி!',
              quiz_incorrect: 'தவறு',
              quiz_rank_expert: 'சட்ட நிபுணர் ⚖️',
              quiz_rank_scholar: 'வளர்ந்துவரும் அறிஞர் 📚',
              quiz_rank_citizen: 'ஆர்வமுள்ள குடிமகன் 🏛️',
              quiz_feedback_high: 'அருமை! சிங்கப்பூரின் அடிப்படைச் சட்டக் கோட்பாடுகள் குறித்த சிறந்த புரிதல் உங்களிடம் உள்ளது.',
              quiz_feedback_mid: 'நன்று! பொதுவான சூழ்நிலைகளை நன்கு புரிந்துகொள்கிறீர்கள், ஆனால் உங்கள் சட்ட அறிவை இன்னும் மேம்படுத்த முடியும்.',
              quiz_feedback_low: 'நல்ல முயற்சி! சட்டக் கருத்துகள் சற்று கடினமாக இருக்கலாம். உங்கள் அறிவை மேம்படுத்த எங்கள் கட்டுரைகளைப் படியுங்கள்.',

              // Quiz Question 1
              q1_text: 'காட்சி: ஒரு கடையின் ஜன்னலில் $10 என விலை குறிக்கப்பட்ட ஒரு பொருளைப் பார்க்கிறீர்கள். அதை நீங்கள் கவுண்டருக்குக் கொண்டு செல்லும்போது, விலை அட்டை தவறு என்றும் அதன் விலை $15 என்றும் காசாளர் கூறுகிறார். சட்டப்பூர்வமாக அதை $10-க்கு விற்கும்படி நீங்கள் அவர்களை கட்டாயப்படுத்த முடியுமா?',
              q1_o1: 'ஆம், காட்சிப்படுத்தல் ஒரு பிணைப்பான சலுகையாகும் (Offer).',
              q1_o2: 'இல்லை, காட்சிப்படுத்தல் என்பது ஒரு \'அழைப்பாகும்\' (Invitation to Treat), பிணைப்பான சலுகை அல்ல.',
              q1_o3: 'ஆம், விலை அட்டைகள் அனைத்து சூழ்நிலைகளிலும் சட்டப்பூர்வமாக பிணைக்கப்படுபவை.',
              q1_exp: 'ஒப்பந்த சட்டத்தில், ஒரு கடையின் ஜன்னல் அல்லது அலமாரியில் பொருட்களைக் காட்சிப்படுத்துவது பொதுவாக ஒரு \'அழைப்பாகும்\' (invitation to treat). நீங்கள் அதை வாங்க சலுகை அளித்து, அதை கடை ஏற்கும் போதே ஒப்பந்தம் உருவாகிறது.',

              // Quiz Question 2
              q2_text: 'ஒரு உள்ளூர் நிறுவனம் உங்களுக்கு விளம்பர குறுஞ்செய்திகளை அனுப்புகிறது. உங்கள் தொலைபேசி எண்ணையோ அல்லது சம்மதத்தையோ நீங்கள் அவர்களுக்கு வழங்கவேயில்லை. எந்த சிங்கப்பூர் சட்டம் உங்களைப் பாதுகாக்கிறது?',
              q2_o1: 'சைபர் பாதுகாப்பு சட்டம் (CSA)',
              q2_o2: 'தனிநபர் தரவு பாதுகாப்பு சட்டம் (PDPA) & தேவையற்ற விளம்பரங்கள் தடுப்புச் சட்டம்',
              q2_o3: 'ஆன்லைன் பொய்கள் மற்றும் கையாளுதல்களிலிருந்து பாதுகாப்பு சட்டம் (POFMA)',
              q2_exp: 'சிங்கப்பூரின் தனிநபர் தரவு பாதுகாப்பு சட்டத்தின் (PDPA) கீழ், விளம்பர நோக்கங்களுக்காக உங்களின் தரவை (தொலைபேசி எண் போன்றவை) உங்கள் அனுமதியின்றி நிறுவனங்கள் சேகரிக்கவோ பயன்படுத்தவோ முடியாது.',

              // Quiz Question 3
              q3_text: 'உங்கள் புதிய வணிக இணையதளத்திற்கு புகைப்படங்களை எடுக்க ஒரு பகுதி நேர புகைப்படக் கலைஞரை நியமிக்கிறீர்கள். ஒப்பந்தத்தில் வேறுவிதமாக ஒப்புக் கொள்ளப்படாவிட்டால், சிங்கப்பூரில் இந்த புகைப்படங்களின் பதிப்புரிமை யாருக்கு சொந்தமாகும்?',
              q3_o1: 'உங்களுக்கு (ஏனெனில் நீங்கள் புகைப்படங்களுக்கு பணம் செலுத்தியுள்ளீர்கள்).',
              q3_o2: 'பகுதி நேர புகைப்படக் கலைஞருக்கு.',
              q3_o3: 'இருவரும் பதிப்புரிமையை சமமாகப் பகிர்ந்து கொள்வீர்கள்.',
              q3_exp: 'சிங்கப்பூரின் பதிப்புரிமை சட்டம் 2021-ன் படி, ஒப்பந்தத்தில் வேறுவிதமாக குறிப்பிடப்படாவிட்டால், புகைப்படங்கள் அல்லது இசை போன்ற படைப்புகளின் பதிப்புரிமை அதை உருவாக்கிய புகைப்படக் கலைஞருக்கே சொந்தமாகும்.',

              // Quiz Question 4
              q4_text: 'ஒரு வணிக உரிமையாளர் பணத்தைத் திருடியதாக இணையத்தில் ஒரு தவறான குற்றச்சாட்டைப் பகிர்கிறீர்கள், அது அவரது நற்பெயரைக் கெடுக்கிறது. அவதூறுக்காக உங்கள் மீது வழக்குத் தொடர முடியுமா?',
              q4_o1: 'இல்லை, இணைய கருத்துக்கள் முழுமையான பேச்சு சுதந்திரத்தால் பாதுகாக்கப்படுகின்றன.',
              q4_o2: 'ஆம், ஒரு நபர் அல்லது வணிகத்தின் நற்பெயருக்குக் கடுமையான தீங்கு விளைவிக்கும் தவறான அறிக்கைகள் அவதூறு வழக்குகளுக்கு வழிவகுக்கும்.',
              q4_o3: 'இல்லை, ஆன்லைன் அவதூறு அதிகாரப்பூர்வ செய்தி தளங்களுக்கு மட்டுமே பொருந்தும், தனிநபர் பதிவுகளுக்கு அல்ல.',
              q4_exp: 'சிங்கப்பூரில், ஒரு நபர் அல்லது வணிகத்தைப் பற்றி தவறான கூற்றுகளைப் பரப்புவது அவதூறு வழக்குக்கு (Defamation) வழிவகுக்கும். இது எழுத்து வடிவில் இருப்பதால் குறிப்பாக அவதூறு வழக்காகும் (Libel).',

              // Quiz Question 5
              q5_text: 'சிங்கப்பூரின் ஆட்சி முறையில், சட்டங்களை விளக்கவும் நீதியை வழங்கவும் எந்த அரசுப் பிரிவுக்கு அதிகாரம் உள்ளது?',
              q5_o1: 'நிர்வாகக் குழு (அமைச்சரவை & பிரதமர்)',
              q5_o2: 'நாடாளுமன்றம் (சட்டமன்றம்)',
              q5_o3: 'நீதித்துறை (உச்ச நீதிமன்றம் & மாநில நீதிமன்றங்கள்)',
              q5_exp: 'அதிகாரப் பகிர்வு கோட்பாட்டின் படி, சட்டங்களை விளக்குவதற்கும் நீதியை வழங்குவதற்கும் நீதித்துறைக்கு மட்டுமே அதிகாரம் உள்ளது, இது நிர்வாகம் மற்றும் சட்டமன்றத்திலிருந்து தனித்து செயல்படும்.'
            }
          };

          // Bookmark helpers
          export function getBookmarks() {
          return JSON.parse(localStorage.getItem('cdl_bookmarks') || '[]');
        }

        export function isBookmarked(id) {
          const bookmarks = getBookmarks();
          return bookmarks.includes(id);
        }

        export function toggleBookmark(id) {
          let bookmarks = getBookmarks();
          const index = bookmarks.indexOf(id);
          if (index === -1) {
            bookmarks.push(id);
            localStorage.setItem('cdl_bookmarks', JSON.stringify(bookmarks));
            return true; // Added
          } else {
            bookmarks.splice(index, 1);
            localStorage.setItem('cdl_bookmarks', JSON.stringify(bookmarks));
            return false; // Removed
          }
        }

        export function getLang() {
          return localStorage.getItem('cdl_lang') || 'en';
        }

        export function t(key) {
          const lang = getLang();
          return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
        }

        export function setLang(lang) {
          if (TRANSLATIONS[lang]) {
            localStorage.setItem('cdl_lang', lang);
            window.location.reload();
          }
        }
