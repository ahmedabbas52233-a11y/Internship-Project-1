// ===== CONFIG =====
const CONFIG = {
    API_BASE_URL: 'https://decodelabs-api.onrender.com/api', // UPDATE THIS
    // API_BASE_URL: 'http://localhost:3000/api', // Local dev
    REFRESH_INTERVAL: 30000,
    TOAST_DURATION: 4000
};

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.animationId = null;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = Math.min(60, Math.floor(window.innerWidth / 25));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Mouse interaction
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
                const force = (180 - dist) / 180;
                p.vx -= (dx / dist) * force * 0.015;
                p.vy -= (dy / dist) * force * 0.015;
            }

            p.x += p.vx;
            p.y += p.vy;

            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Bounds
            if (p.x < 0) { p.x = 0; p.vx *= -1; }
            if (p.x > this.canvas.width) { p.x = this.canvas.width; p.vx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; }
            if (p.y > this.canvas.height) { p.y = this.canvas.height; p.vy *= -1; }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
            this.ctx.fill();

            // Connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const cdx = p.x - p2.x;
                const cdy = p.y - p2.y;
                const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
                if (cdist < 130) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - cdist / 130)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }
}

// ===== API SERVICE =====
class ApiService {
    static async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            const data = await response.json();
            return { ok: response.ok, status: response.status, data };
        } catch (error) {
            return { ok: false, status: 0, error: error.message, data: { error: { message: error.message } } };
        }
    }

    static async health() {
        return this.request('/health');
    }

    static async getUsers(page = 1, limit = 10) {
        return this.request(`/users?page=${page}&limit=${limit}`);
    }

    static async createUser(userData) {
        return this.request('/users', { method: 'POST', body: JSON.stringify(userData) });
    }

    static async getPosts(page = 1, limit = 10) {
        return this.request(`/posts?page=${page}&limit=${limit}`);
    }

    static async createPost(postData) {
        return this.request('/posts', { method: 'POST', body: JSON.stringify(postData) });
    }

    static async submitContact(contactData) {
        return this.request('/contact', { method: 'POST', body: JSON.stringify(contactData) });
    }
}

// ===== UI HELPERS =====
class UI {
    static toast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const icon = type === 'success' ? '✓' : '✕';
        toast.innerHTML = `<span class="toast__icon">${icon}</span><span class="toast__text">${message}</span>`;
        toast.className = `toast ${type} show`;

        setTimeout(() => toast.classList.remove('show'), CONFIG.TOAST_DURATION);
    }

    static showResponse(elementId, result) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const isSuccess = result.ok && result.status < 400;
        const badgeClass = isSuccess ? 'api-response__badge--success' : 'api-response__badge--error';
        const badgeText = result.status === 0 ? 'NETWORK ERROR' : `HTTP ${result.status}`;

        el.innerHTML = `
            <div class="api-response__header">
                <span class="api-response__badge ${badgeClass}">${badgeText}</span>
                <span style="color: var(--text-muted); font-size: 0.7rem;">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="api-response__body">${JSON.stringify(result.data || result.error, null, 2)}</div>
        `;
        el.className = `api-response show ${isSuccess ? 'success' : 'error'}`;
    }

    static setLoading(btnId, spinnerId, loading) {
        const btn = document.getElementById(btnId);
        const spinner = document.getElementById(spinnerId);
        if (btn) btn.disabled = loading;
        if (spinner) spinner.classList.toggle('show', loading);
    }

    static updateStatus(online) {
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');
        const status = document.getElementById('navStatus');

        if (dot) dot.style.background = online ? 'var(--accent-green)' : 'var(--accent-red)';
        if (text) text.textContent = online ? 'API Online' : 'API Offline';
        if (status) status.classList.toggle('offline', !online);
    }
}

// ===== TAB SYSTEM =====
class TabSystem {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        this.init();
    }

    init() {
        const tabs = this.container.querySelectorAll('.api-tab');
        const panels = this.container.querySelectorAll('.api-panel');

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                if (panels[index]) panels[index].classList.add('active');
            });
        });
    }
}

// ===== DASHBOARD =====
class Dashboard {
    constructor() {
        this.init();
    }

    async init() {
        await this.refresh();
        setInterval(() => this.refresh(), CONFIG.REFRESH_INTERVAL);
    }

    async refresh() {
        // Health
        const health = await ApiService.health();
        UI.updateStatus(health.ok);

        const healthEl = document.getElementById('dashHealth');
        const healthSub = document.getElementById('dashHealthSub');
        if (healthEl) {
            healthEl.textContent = health.ok ? '●' : '●';
            healthEl.style.color = health.ok ? 'var(--accent-green)' : 'var(--accent-red)';
        }
        if (healthSub) healthSub.textContent = health.ok ? 'Operational' : 'Unreachable';

        // Users
        const users = await ApiService.getUsers(1, 1);
        const usersEl = document.getElementById('dashUsers');
        if (usersEl) usersEl.textContent = users.data?.pagination?.total || '0';

        // Posts
        const posts = await ApiService.getPosts(1, 1);
        const postsEl = document.getElementById('dashPosts');
        if (postsEl) postsEl.textContent = posts.data?.pagination?.total || '0';

        // Contacts (from localStorage as fallback)
        const contactsEl = document.getElementById('dashContacts');
        if (contactsEl) {
            const stored = parseInt(localStorage.getItem('contactCount') || '0');
            contactsEl.textContent = stored;
        }
    }
}

// ===== FORM HANDLERS =====
function setupForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            UI.setLoading('contactSubmit', 'contactSpinner', true);

            const result = await ApiService.submitContact({
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value
            });

            UI.showResponse('contactResponse', result);

            if (result.ok) {
                UI.toast('Message sent successfully!');
                contactForm.reset();
                const current = parseInt(localStorage.getItem('contactCount') || '0');
                localStorage.setItem('contactCount', current + 1);
                new Dashboard().refresh();
            } else {
                UI.toast(result.data?.error?.message || 'Failed to send message', 'error');
            }

            UI.setLoading('contactSubmit', 'contactSpinner', false);
        });
    }

    // User form
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            UI.setLoading('userSubmit', 'userSpinner', true);

            const result = await ApiService.createUser({
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                password: document.getElementById('userPassword').value
            });

            UI.showResponse('userResponse', result);

            if (result.ok) {
                UI.toast('User created successfully!');
                userForm.reset();
                new Dashboard().refresh();
            } else {
                UI.toast(result.data?.error?.message || 'Failed to create user', 'error');
            }

            UI.setLoading('userSubmit', 'userSpinner', false);
        });
    }

    // Quick contact form (footer)
    const quickForm = document.getElementById('quickContactForm');
    if (quickForm) {
        quickForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const result = await ApiService.submitContact({
                name: document.getElementById('quickName').value,
                email: document.getElementById('quickEmail').value,
                message: document.getElementById('quickMessage').value
            });

            if (result.ok) {
                UI.toast('Message sent!');
                quickForm.reset();
                const current = parseInt(localStorage.getItem('contactCount') || '0');
                localStorage.setItem('contactCount', current + 1);
            } else {
                UI.toast('Failed to send', 'error');
            }
        });
    }

    // Health check button
    const healthBtn = document.getElementById('healthBtn');
    if (healthBtn) {
        healthBtn.addEventListener('click', async () => {
            UI.setLoading('healthBtn', 'healthSpinner', true);
            const result = await ApiService.health();
            UI.showResponse('healthResponse', result);
            UI.updateStatus(result.ok);
            UI.setLoading('healthBtn', 'healthSpinner', false);
        });
    }
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
    }
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
    }
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('open'));
        });
    }
}

// ===== NAV SCROLL =====
function setupNavScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
    });
}

// ===== SCROLL REVEAL =====
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== ACTIVE NAV LINK =====
function setupActiveNav() {
    const links = document.querySelectorAll('.nav__links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    new ParticleSystem('particle-canvas');

    // Setup UI
    setupNavScroll();
    setupSmoothScroll();
    setupScrollReveal();
    setupMobileMenu();
    setupActiveNav();
    setupForms();

    // Initialize tabs if present
    new TabSystem('.api-tabs');

    // Initialize dashboard if present
    if (document.getElementById('dashHealth')) {
        new Dashboard();
    }

    // Initial health check
    ApiService.health().then(result => UI.updateStatus(result.ok));
});