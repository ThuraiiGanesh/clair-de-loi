"""
init_db.py — Database initialization and seeding for Clair De Loi Singapore.

Creates database tables (users, articles, contacts) and seeds sample content.
"""

import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def create_tables(conn):
    cursor = conn.cursor()

    # Users table (Admin accounts)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Articles table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT NOT NULL,
            excerpt TEXT,
            content TEXT,
            category TEXT NOT NULL CHECK(category IN ('legal_insights', 'opinion', 'case_study', 'news', 'explainer')),
            cover_image_url TEXT,
            video_url TEXT,
            instagram_link TEXT,
            author TEXT,
            is_featured INTEGER DEFAULT 0,
            is_published INTEGER DEFAULT 0,
            published_date TEXT,
            created_at INTEGER NOT NULL
        )
    ''')

    # Contact form submissions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create indexes
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_contacts_date ON contacts(created_at)')

    conn.commit()
    print("[OK] Tables created successfully.")


def seed_data(conn):
    cursor = conn.cursor()

    # Seed Admin Account
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        admin_hash = generate_password_hash('clairdeloi2026', method='pbkdf2:sha256')
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            ('admin', admin_hash)
        )
        print("[OK] Admin account seeded: admin / clairdeloi2026")

    # Seed Sample Articles
    cursor.execute("SELECT COUNT(*) FROM articles")
    if cursor.fetchone()[0] == 0:
        import time
        now = int(time.time() * 1000)
        articles = [
            (
                'art-seed-001',
                "Understanding Contract Law: A Beginner's Guide",
                'understanding-contract-law',
                "Contract law forms the backbone of commercial and personal transactions. This guide breaks down the essential elements every aspiring legal mind should know.",
                """<h2>What Is a Contract?</h2>
<p>A contract is a legally binding agreement between two or more parties that is enforceable by law. At its core, contract law governs the promises we make to each other in everyday life — from buying a cup of coffee to signing a multi-million dollar business deal.</p>
<p>Understanding contract law is essential not just for lawyers, but for anyone who participates in modern society. Every time you click "I agree" on a terms of service page, you are entering into a contract.</p>

<h2>The Four Essential Elements</h2>
<p>For a contract to be valid, four fundamental elements must be present:</p>

<h3>1. Offer</h3>
<p>An offer is a clear statement of willingness to enter into an agreement on certain terms. It must be communicated to the offeree and must be sufficiently definite. For example, if a shopkeeper displays goods with price tags, this generally constitutes an <em>invitation to treat</em> rather than an offer — a subtle but important distinction in contract law.</p>

<h3>2. Acceptance</h3>
<p>Acceptance occurs when the offeree agrees to the terms of the offer. The acceptance must be unconditional and communicated to the offeror. The "mirror image rule" states that acceptance must match the offer exactly — any variation may constitute a counter-offer rather than acceptance.</p>

<h3>3. Consideration</h3>
<p>Consideration refers to something of value exchanged between the parties. It need not be monetary — it can be a promise to do something, a promise to refrain from doing something, or the transfer of a right. The key requirement is that consideration must be sufficient but need not be adequate.</p>

<blockquote>"The law will not inquire into the adequacy of consideration, but it must be real and have some value in the eyes of the law." — Chappell & Co Ltd v Nestlé Co Ltd [1960]</blockquote>

<h3>4. Intention to Create Legal Relations</h3>
<p>Both parties must intend for the agreement to be legally binding. In commercial agreements, this intention is generally presumed. In social and domestic arrangements, however, the presumption is that parties do not intend to create legal relations — though this can be rebutted.</p>

<h2>When Contracts Go Wrong</h2>
<p>Breaches of contract occur when one party fails to fulfil their obligations. Remedies may include damages (monetary compensation), specific performance (court-ordered fulfilment), or rescission (cancellation of the contract). Understanding these remedies is crucial for anyone navigating contractual disputes.</p>

<p>At Clair De Loi, we believe that legal literacy begins with understanding the agreements that shape our daily lives. Contract law is where that journey starts.</p>""",
                'explainer',
                'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
                '',
                'https://www.instagram.com/clairdeloi.singapore/',
                'Clair De Loi Editorial',
                1,  # is_featured
                1,  # is_published
                '2026-05-15',
                now - 100000
            ),
            (
                'art-seed-002',
                'The Evolving Landscape of Digital Privacy Rights',
                'evolving-landscape-digital-privacy-rights',
                "From GDPR to Singapore's PDPA, digital privacy laws are transforming how we think about personal data in the age of artificial intelligence.",
                """<h2>A New Frontier for Rights</h2>
<p>In an era where data is often described as "the new oil," the legal frameworks governing digital privacy have become some of the most consequential areas of modern law. As individuals generate unprecedented volumes of personal data through smartphones, social media, and IoT devices, governments worldwide are racing to establish protections.</p>

<h2>The GDPR Standard</h2>
<p>The European Union's General Data Protection Regulation (GDPR), which came into effect in 2018, set the gold standard for data protection legislation. Its key principles include:</p>
<ul>
<li><strong>Lawfulness, fairness, and transparency</strong> in data processing</li>
<li><strong>Purpose limitation</strong> — data collected for one purpose cannot be repurposed without consent</li>
<li><strong>Data minimisation</strong> — only collecting what is strictly necessary</li>
<li><strong>The right to be forgotten</strong> — individuals can request deletion of their personal data</li>
</ul>

<h2>Singapore's Personal Data Protection Act (PDPA)</h2>
<p>Singapore's PDPA takes a pragmatic approach, balancing individual privacy rights with organisational needs. The Act establishes a consent-based framework while recognising legitimate business purposes. Recent amendments have introduced mandatory data breach notification requirements and increased penalties for non-compliance.</p>

<blockquote>"Privacy is not about having something to hide. It is about having the right to choose what to share." — Edward Snowden</blockquote>

<h2>The AI Challenge</h2>
<p>Artificial intelligence poses unique challenges to existing privacy frameworks. Machine learning algorithms can infer sensitive personal information from seemingly innocuous data points. The question of algorithmic transparency — understanding <em>how</em> AI systems make decisions using personal data — remains one of the most pressing legal challenges of our time.</p>

<p>As these technologies continue to evolve, so too must our legal frameworks. The conversation about digital privacy is far from over — it has only just begun.</p>""",
                'legal_insights',
                'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1200',
                '',
                '',
                'Clair De Loi Research Team',
                0,  # is_featured
                1,  # is_published
                '2026-05-28',
                now - 50000
            ),
            (
                'art-seed-003',
                'Opinion: Why Legal Literacy Should Be Taught in Schools',
                'why-legal-literacy-should-be-taught-in-schools',
                "An informed citizenry is the foundation of a functioning democracy. It's time we start building that foundation in our classrooms.",
                """<h2>The Gap in Our Education</h2>
<p>We teach our young people mathematics, science, history, and literature. We prepare them for careers in engineering, medicine, business, and the arts. Yet we send them into the adult world largely ignorant of the legal system that governs nearly every aspect of their lives.</p>
<p>This is not merely an oversight — it is a systemic failure with real consequences.</p>

<h2>Why It Matters</h2>
<p>Consider the everyday legal situations a young person faces upon turning 18:</p>
<ul>
<li>Signing a rental lease or employment contract</li>
<li>Understanding their rights during a police encounter</li>
<li>Navigating consumer protection when making purchases</li>
<li>Exercising their right to vote with an understanding of constitutional principles</li>
<li>Using social media within the bounds of defamation and privacy law</li>
</ul>
<p>Without basic legal literacy, young people are vulnerable to exploitation and unable to fully exercise their rights as citizens.</p>

<h2>The Case for Integration</h2>
<p>Legal literacy need not be a standalone subject. It can be integrated into existing curricula — social studies, civics, even literature courses can incorporate discussions of legal principles. Mock trial programmes, case study analyses, and visits to courthouses can make legal education engaging and practical.</p>

<blockquote>"The law is not just a profession — it is the operating system of society. Everyone should understand the basics of how it works."</blockquote>

<h2>A Call to Action</h2>
<p>At Clair De Loi, we believe that legal literacy is not a luxury — it is a necessity. We call upon educators, policymakers, and legal professionals to work together in making legal education accessible to every young person.</p>
<p>An informed citizenry creates better societies. Let us start building that foundation in our schools.</p>""",
                'opinion',
                'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200',
                '',
                'https://www.instagram.com/clairdeloi/',
                'Editorial Board',
                0,  # is_featured
                1,  # is_published
                '2026-06-02',
                now
            )
        ]
        cursor.executemany(
            """INSERT INTO articles (id, title, slug, excerpt, content, category, cover_image_url, video_url, instagram_link, author, is_featured, is_published, published_date, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            articles
        )
        print(f"[OK] {len(articles)} default articles seeded.")

    conn.commit()


if __name__ == '__main__':
    # Delete old database if it exists for a clean setup
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print("[OK] Cleared old database file.")

    conn = get_connection()
    create_tables(conn)
    seed_data(conn)
    conn.close()
    print("[DONE] SQLite Database initialized successfully.")
