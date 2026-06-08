"""
app.py — Main Flask backend server for Clair De Loi Singapore.
"""

import os
import sqlite3
import urllib.request
import urllib.parse
import json
from datetime import datetime
from functools import wraps
from flask import (
    Flask, send_from_directory, request, jsonify, session, abort
)
from werkzeug.security import check_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database.db')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'clairdeloi-session-secret-key-2026'

# Load environment variables if .env exists
env_path = os.path.join(BASE_DIR, '.env')
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            if '=' in line and not line.strip().startswith('#'):
                key, val = line.strip().split('=', 1)
                os.environ[key.strip()] = val.strip()

# Gemini Config
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyAQ-Ab8RN6K75zzte1l2kc9XW13aipFMU5e_9z04x1gc5IzVJYAtZg')
# Fallback support for both direct key and raw provided key
if GEMINI_API_KEY and not GEMINI_API_KEY.startswith('AIzaSy'):
    GEMINI_API_KEY = f"AIzaSy{GEMINI_API_KEY.replace('.', '-')}"

GEMINI_MODEL = 'gemini-2.5-flash'
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

# ─── DATABASE CONNECTION ───────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

# ─── DECORATORS ────────────────────────────────────────────────────
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('authenticated'):
            return jsonify({'error': 'Unauthorized access'}), 401
        return f(*args, **kwargs)
    return decorated_function

# ─── STATIC ROUTING ────────────────────────────────────────────────
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory(os.path.join(BASE_DIR, 'js'), path)

@app.route('/styles/<path:path>')
def send_styles(path):
    return send_from_directory(os.path.join(BASE_DIR, 'styles'), path)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory(os.path.join(BASE_DIR, 'static'), path)

# ─── AUTHENTICATION API ────────────────────────────────────────────
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'error': 'Missing credentials'}), 400

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()

    if user and check_password_hash(user['password_hash'], password):
        session['authenticated'] = True
        session['username'] = username
        return jsonify({'success': True, 'message': 'Logged in successfully'})
    
    return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    return jsonify({'authenticated': session.get('authenticated', False)})

# ─── ARTICLES API ──────────────────────────────────────────────────
@app.route('/api/articles', methods=['GET'])
def get_articles():
    conn = get_db()
    articles = conn.execute(
        "SELECT * FROM articles WHERE is_published = 1 ORDER BY published_date DESC"
    ).fetchall()
    conn.close()
    return jsonify([dict(a) for a in articles])

@app.route('/api/articles/admin', methods=['GET'])
@login_required
def get_articles_admin():
    conn = get_db()
    articles = conn.execute(
        "SELECT * FROM articles ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return jsonify([dict(a) for a in articles])

@app.route('/api/articles/<id>', methods=['GET'])
def get_article(id):
    conn = get_db()
    article = conn.execute("SELECT * FROM articles WHERE id = ?", (id,)).fetchone()
    conn.close()
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    return jsonify(dict(article))

@app.route('/api/articles', methods=['POST'])
@login_required
def create_article():
    data = request.json or {}
    title = data.get('title', 'Untitled').strip()
    slug = data.get('slug', '').strip()
    excerpt = data.get('excerpt', '').strip()
    content = data.get('content', '').strip()
    category = data.get('category', 'news')
    cover_image_url = data.get('cover_image_url', '').strip()
    video_url = data.get('video_url', '').strip()
    instagram_link = data.get('instagram_link', '').strip()
    author = data.get('author', 'Clair De Loi').strip()
    is_featured = 1 if data.get('is_featured') else 0
    is_published = 1 if data.get('is_published') else 0
    published_date = data.get('published_date', datetime.now().strftime('%Y-%m-%d'))
    
    # Generate unique ID
    import time
    art_id = f"art-{int(time.time() * 1000)}"
    if not slug:
        slug = title.lower().replace(' ', '-').replace('/', '-')

    conn = get_db()
    
    # If this article is featured, un-feature other articles
    if is_featured:
        conn.execute("UPDATE articles SET is_featured = 0")
        
    conn.execute(
        """INSERT INTO articles (id, title, slug, excerpt, content, category, cover_image_url, video_url, instagram_link, author, is_featured, is_published, published_date, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (art_id, title, slug, excerpt, content, category, cover_image_url, video_url, instagram_link, author, is_featured, is_published, published_date, int(time.time() * 1000))
    )
    conn.commit()
    
    article = conn.execute("SELECT * FROM articles WHERE id = ?", (art_id,)).fetchone()
    conn.close()
    return jsonify(dict(article)), 211

@app.route('/api/articles/<id>', methods=['PUT'])
@login_required
def update_article(id):
    data = request.json or {}
    title = data.get('title', '').strip()
    excerpt = data.get('excerpt', '').strip()
    content = data.get('content', '').strip()
    category = data.get('category', 'news')
    cover_image_url = data.get('cover_image_url', '').strip()
    video_url = data.get('video_url', '').strip()
    instagram_link = data.get('instagram_link', '').strip()
    author = data.get('author', '').strip()
    is_featured = 1 if data.get('is_featured') else 0
    is_published = 1 if data.get('is_published') else 0
    published_date = data.get('published_date', '').strip()

    conn = get_db()
    
    # Verify article exists
    existing = conn.execute("SELECT id FROM articles WHERE id = ?", (id,)).fetchone()
    if not existing:
        conn.close()
        return jsonify({'error': 'Article not found'}), 404

    # If featured, un-feature all others
    if is_featured:
        conn.execute("UPDATE articles SET is_featured = 0 WHERE id != ?", (id,))

    slug = title.lower().replace(' ', '-').replace('/', '-')

    conn.execute(
        """UPDATE articles 
           SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, cover_image_url = ?, video_url = ?, instagram_link = ?, author = ?, is_featured = ?, is_published = ?, published_date = ?
           WHERE id = ?""",
        (title, slug, excerpt, content, category, cover_image_url, video_url, instagram_link, author, is_featured, is_published, published_date, id)
    )
    conn.commit()
    
    article = conn.execute("SELECT * FROM articles WHERE id = ?", (id,)).fetchone()
    conn.close()
    return jsonify(dict(article))

@app.route('/api/articles/<id>', methods=['DELETE'])
@login_required
def delete_article(id):
    conn = get_db()
    existing = conn.execute("SELECT id FROM articles WHERE id = ?", (id,)).fetchone()
    if not existing:
        conn.close()
        return jsonify({'error': 'Article not found'}), 404

    conn.execute("DELETE FROM articles WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'Article deleted successfully'})

# ─── CONTACT SUBMISSIONS API ───────────────────────────────────────
@app.route('/api/contact', methods=['POST'])
def save_contact():
    data = request.json or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message:
        return jsonify({'error': 'Name, email, and message are required'}), 400

    conn = get_db()
    conn.execute(
        "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)",
        (name, email, subject, message)
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'Contact message submitted successfully'})

@app.route('/api/contacts', methods=['GET'])
@login_required
def get_contacts():
    conn = get_db()
    messages = conn.execute("SELECT * FROM contacts ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([dict(m) for m in messages])

# ─── CHATBOT GEMINI PROXY API ──────────────────────────────────────
def get_mock_reply(user_message):
    msg = user_message.lower()
    if 'contract' in msg:
        return "**Contract Law** is a foundational legal topic. A valid contract in Singapore requires four elements: **Offer**, **Acceptance**, **Consideration** (something of value exchanged), and **Intention to create legal relations**. If you'd like to learn more, check out our featured article: *Understanding Contract Law: A Beginner's Guide* in the Articles section!"
    elif 'privacy' in msg or 'data' in msg or 'pdpa' in msg:
        return "In Singapore, digital privacy and personal data protection are governed by the **Personal Data Protection Act (PDPA)**. It regulates the collection, use, and disclosure of personal data by organisations. For a deeper look, check out our article: *The Evolving Landscape of Digital Privacy Rights*!"
    elif 'clair' in msg or 'about' in msg or 'who are you' in msg or 'society' in msg:
        return "**Clair De Loi** (French for *Clarity of Law*) is a youth-led law society based in Singapore. Our mission is to make legal concepts accessible and engaging for everyone. Our motto is *'Ubi societas ibi ius'* (Where there is society, there is law). Feel free to browse our Articles, take our Legal Literacy Quiz, or reach out to us!"
    elif 'contact' in msg or 'email' in msg or 'join' in msg or 'contribute' in msg:
        return "You can get in touch with us through our **Contact Us** page or email us directly at **clairdeloisingapore@gmail.com**. You can also follow us on Instagram: **@clairdeloi.singapore**!"
    else:
        return "👋 Hello! I am the Clair De Loi AI Assistant running in **offline preview mode**.\n\nTo unlock my full AI capabilities powered by Google Gemini, please configure a valid `GEMINI_API_KEY` in the `.env` file.\n\nIn the meantime, feel free to ask me about **Clair De Loi**, **contract law**, or **digital privacy**!"

@app.route('/api/chat', methods=['POST'])
def chatbot_proxy():
    data = request.json or {}
    system_instruction = data.get('system_instruction', {})
    contents = data.get('contents', [])

    if not contents:
        return jsonify({'error': 'Chat contents empty'}), 400

    # Build the Gemini API payload
    body = {
        "system_instruction": system_instruction,
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 800,
            "topP": 0.9
        }
    }

    try:
        req_data = json.dumps(body).encode('utf-8')
        req = urllib.request.Request(
            GEMINI_ENDPOINT,
            data=req_data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        with urllib.request.urlopen(req) as res:
            res_data = res.read().decode('utf-8')
            response_json = json.loads(res_data)
            
            # Extract reply text
            candidates = response_json.get('candidates', [])
            reply = 'I apologize, I couldn\'t generate a response. Please try again.'
            if candidates:
                parts = candidates[0].get('content', {}).get('parts', [])
                if parts:
                    reply = parts[0].get('text', reply)
                    
            return jsonify({'reply': reply})
            
    except Exception as e:
        print(f"Chatbot server error: {e}. Falling back to offline mock reply.")
        user_message = ""
        try:
            if contents and len(contents) > 0:
                last_turn = contents[-1]
                if last_turn.get('parts'):
                    user_message = last_turn['parts'][0].get('text', '')
        except Exception:
            pass
            
        mock_reply = get_mock_reply(user_message)
        return jsonify({'reply': mock_reply})



if __name__ == '__main__':
    # Auto-initialize DB if not exists
    if not os.path.exists(DB_PATH):
        print("Database not found. Initializing database...")
        import subprocess
        subprocess.run(['python', 'init_db.py'], check=True)

    print("Starting Flask web server on http://localhost:3000...")
    app.run(host='0.0.0.0', port=3000, debug=True)
