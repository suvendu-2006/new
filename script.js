// ==================== NAVIGATION SCROLL EFFECT ====================
const mainNav = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks.classList.remove('active');
        }
    });
});

// ==================== NETFLIX-STYLE INTRO ====================
window.addEventListener('load', () => {
    const netflixIntro = document.getElementById('netflixIntro');
    const strips = document.querySelectorAll('.netflix-strip');
    const netflixText = document.querySelector('.netflix-text');
    const zoomContainer = document.querySelector('.netflix-zoom-container');

    netflixIntro.style.display = 'flex';
    netflixIntro.style.opacity = '1';
    document.body.classList.add('intro-active');

    const tl = gsap.timeline({
        onComplete: () => {
            netflixIntro.style.display = 'none';
            document.body.classList.remove('intro-active');
            document.querySelectorAll('.nav-bar, #hero, #why-us, #games, #tournaments, #contact').forEach((section, i) => {
                gsap.to(section, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.06, ease: 'power2.out' });
            });
        }
    });

    tl.to(strips, { height: '100vh', duration: 0.6, ease: 'power2.out', stagger: { each: 0.08, from: 'random' } });
    tl.to(strips, { scaleY: 0, duration: 0.5, ease: 'power3.inOut' }, '+=0.1')
        .to(netflixText, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4');
    tl.to(zoomContainer, { scale: 15, duration: 0.9, ease: 'power4.in' }, '+=0.2')
        .to(netflixText, { color: '#a855f7', duration: 0.3 }, '-=0.9');
    tl.to(netflixIntro, { opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');
});

// ==================== STATS COUNTER ====================
function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const isDecimal = target % 1 !== 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        if (isDecimal) el.textContent = current.toFixed(1);
        else if (target > 1000) el.textContent = Math.floor(current).toLocaleString() + '+';
        else el.textContent = Math.floor(current);
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(c => {
                if (c.textContent === '0' || c.textContent.startsWith('0')) animateCounter(c);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

// ==================== FAQ ACCORDION ====================
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(o => { if (o !== item) o.classList.remove('active'); });
        item.classList.toggle('active', !isActive);
    });
});

// ==================== PARALLAX ====================
const parallaxBg = document.getElementById('parallaxBg');
window.addEventListener('scroll', () => {
    if (parallaxBg) parallaxBg.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
});

// ==================== OTP VERIFICATION (Simulation) ====================
// Initialize EmailJS (used for registration notifications only)
emailjs.init('1MYaKlTvBGdJbw45E');

let generatedOTP = '';
let otpTimer = null;
let otpVerified = false;
let otpCountdown = 0;

function sendOTP() {
    const phone = document.getElementById('phone').value.trim();
    if (!phone || phone.length < 10) {
        showOtpNotification('⚠️ Please enter a valid phone number', 'error');
        document.getElementById('phone').focus();
        return;
    }

    // Generate 6-digit OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Show OTP section
    const otpSection = document.getElementById('otpSection');
    otpSection.style.display = 'block';
    document.getElementById('otpVerified').style.display = 'none';

    // Clear previous OTP boxes
    document.querySelectorAll('.otp-box').forEach(box => {
        box.value = '';
        box.classList.remove('filled', 'error', 'success');
    });
    document.querySelectorAll('.otp-box')[0].focus();

    // Disable send button & start timer
    const sendBtn = document.getElementById('sendOtpBtn');
    sendBtn.disabled = true;
    otpCountdown = 60;
    updateTimerDisplay();

    otpTimer = setInterval(() => {
        otpCountdown--;
        updateTimerDisplay();
        if (otpCountdown <= 0) {
            clearInterval(otpTimer);
            sendBtn.disabled = false;
            sendBtn.textContent = 'Resend';
            document.getElementById('otpTimer').textContent = 'Expired';
            document.getElementById('otpTimer').classList.add('expired');
        }
    }, 1000);

    // Show OTP via notification (simulating SMS delivery)
    showOtpNotification(`📱 OTP sent to ${phone}: ${generatedOTP}`, 'success');

    document.getElementById('otpStatus').textContent = '';
    document.getElementById('otpStatus').className = 'otp-status';
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('otpTimer');
    timerEl.textContent = `(${otpCountdown}s)`;
    timerEl.classList.remove('expired');
}

function otpInputHandler(el) {
    const val = el.value;
    // Only allow digits
    el.value = val.replace(/[^0-9]/g, '');
    if (el.value) {
        el.classList.add('filled');
        // Auto-focus next box
        const idx = parseInt(el.getAttribute('data-index'));
        const nextBox = document.querySelector(`.otp-box[data-index="${idx + 1}"]`);
        if (nextBox) nextBox.focus();
    } else {
        el.classList.remove('filled');
    }
}

function otpKeyHandler(e, el) {
    const idx = parseInt(el.getAttribute('data-index'));
    if (e.key === 'Backspace' && !el.value) {
        const prevBox = document.querySelector(`.otp-box[data-index="${idx - 1}"]`);
        if (prevBox) { prevBox.focus(); prevBox.value = ''; prevBox.classList.remove('filled'); }
    }
    // Allow paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigator.clipboard.readText().then(text => {
            const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
            digits.split('').forEach((d, i) => {
                const box = document.querySelector(`.otp-box[data-index="${i}"]`);
                if (box) { box.value = d; box.classList.add('filled'); }
            });
            const lastBox = document.querySelector(`.otp-box[data-index="${Math.min(digits.length, 5)}"]`);
            if (lastBox) lastBox.focus();
        });
    }
}

function verifyOTP() {
    const boxes = document.querySelectorAll('.otp-box');
    const entered = Array.from(boxes).map(b => b.value).join('');
    const statusEl = document.getElementById('otpStatus');

    if (entered.length < 6) {
        statusEl.textContent = 'Please enter all 6 digits';
        statusEl.className = 'otp-status error';
        boxes.forEach(b => { if (!b.value) b.classList.add('error'); });
        return;
    }

    if (entered === generatedOTP) {
        // Success!
        otpVerified = true;
        clearInterval(otpTimer);
        boxes.forEach(b => b.classList.add('success'));
        statusEl.textContent = '✅ OTP Verified Successfully!';
        statusEl.className = 'otp-status success';

        setTimeout(() => {
            document.getElementById('otpSection').style.display = 'none';
            document.getElementById('otpVerified').style.display = 'flex';
            document.getElementById('phone').disabled = true;
            document.getElementById('sendOtpBtn').style.display = 'none';
        }, 800);
    } else {
        // Wrong OTP
        statusEl.textContent = '❌ Invalid OTP. Please try again.';
        statusEl.className = 'otp-status error';
        boxes.forEach(b => { b.classList.add('error'); b.classList.remove('filled', 'success'); });
        setTimeout(() => {
            boxes.forEach(b => { b.value = ''; b.classList.remove('error'); });
            boxes[0].focus();
        }, 1000);
    }
}

function showOtpNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.otp-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `otp-notification ${type}`;
    notif.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">×</button>`;
    notif.style.cssText = `
        position: fixed; top: 90px; right: 20px; z-index: 9999;
        padding: 16px 24px; border-radius: 16px; font-size: 15px; font-weight: 600;
        font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 12px;
        animation: slideInRight 0.4s ease-out forwards; max-width: 450px;
        backdrop-filter: blur(20px); border: 1px solid;
        ${type === 'success'
            ? 'background: rgba(34,197,94,0.15); color: #22c55e; border-color: rgba(34,197,94,0.3); box-shadow: 0 8px 32px rgba(34,197,94,0.2);'
            : 'background: rgba(236,72,153,0.15); color: #ec4899; border-color: rgba(236,72,153,0.3); box-shadow: 0 8px 32px rgba(236,72,153,0.2);'
        }
    `;
    notif.querySelector('button').style.cssText = 'background:none;border:none;color:inherit;font-size:20px;cursor:pointer;padding:0 4px;';
    document.body.appendChild(notif);

    // Auto-dismiss after 8 seconds
    setTimeout(() => { if (notif.parentElement) notif.remove(); }, 8000);
}

// Add slide-in animation
if (!document.getElementById('otpAnimStyle')) {
    const style = document.createElement('style');
    style.id = 'otpAnimStyle';
    style.textContent = `@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(style);
}

// ==================== REGISTRATION FORM ====================
const regForm = document.getElementById('registrationForm');
const formSuccess = document.getElementById('formSuccess');

if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check OTP verification
        if (!otpVerified) {
            showOtpNotification('⚠️ Please verify your phone number with OTP first', 'error');
            document.getElementById('phone').focus();
            return;
        }

        // Simulate submission
        const btn = regForm.querySelector('.register-btn');
        btn.textContent = 'Registering...';
        btn.disabled = true;

        setTimeout(() => {
            // Send notification email to admin
            const regData = {
                to_email: 'consequenseoptional1@gmail.com',
                to_name: 'Admin',
                message: `🎮 New Registration!\n\nGamer Tag: ${document.getElementById('gamerTag').value}\nFull Name: ${document.getElementById('fullName').value}\nEmail: ${document.getElementById('email').value}\nPhone: ${document.getElementById('phone').value}\nGame: ${document.getElementById('game').value}\nSkill Level: ${document.getElementById('skill').value}`
            };
            emailjs.send('service_5f4gae9', 'template_s1h6eyy', regData)
                .then(() => console.log('Admin notification sent!'))
                .catch((err) => console.log('Notification failed:', err));

            regForm.style.display = 'none';
            formSuccess.style.display = 'block';
            gsap.from(formSuccess, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' });
            gsap.from(formSuccess.querySelector('i'), { scale: 0, rotation: -180, duration: 0.8, delay: 0.2, ease: 'back.out(2)' });
        }, 1500);
    });
}

// ==================== LIQUID BUTTON EFFECT ====================
class LiquidButtonEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.liquid-btn');
        this.turbulence = document.getElementById('turbulenceElement');
        this.displacement = document.getElementById('displacementElement');
        this.init();
    }
    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.filter = 'url(#liquidFilter)';
                gsap.to(this.displacement, { attr: { scale: 15 }, duration: 0.6, ease: 'power2.out' });
                gsap.to(this.turbulence, { attr: { baseFrequency: '0.03 0.03' }, duration: 0.6, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(this.displacement, { attr: { scale: 0 }, duration: 0.4, ease: 'power2.in', onComplete: () => { btn.style.filter = 'none'; } });
                gsap.to(this.turbulence, { attr: { baseFrequency: '0.01 0.01' }, duration: 0.4, ease: 'power2.in' });
            });
        });
    }
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== INTERSECTION OBSERVER ====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.bento-card, .game-card, .tournament-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ==================== GAMES HORIZONTAL SCROLL ====================
const gamesContainer = document.querySelector('.games-scroll-container');
if (gamesContainer) {
    let isDown = false, startX, scrollLeft;
    gamesContainer.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - gamesContainer.offsetLeft; scrollLeft = gamesContainer.scrollLeft; });
    gamesContainer.addEventListener('mouseleave', () => isDown = false);
    gamesContainer.addEventListener('mouseup', () => isDown = false);
    gamesContainer.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); gamesContainer.scrollLeft = scrollLeft - ((e.pageX - gamesContainer.offsetLeft) - startX) * 2; });
    gamesContainer.addEventListener('wheel', e => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        gamesContainer.scrollLeft += e.deltaY;
    }, { passive: false });
}

// ==================== SOCIAL DOCK ANIMATIONS ====================
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function () {
        gsap.to(this, { y: -16, scale: 1.3, rotation: 10, duration: 0.4, ease: 'back.out(1.7)' });
        gsap.to(this.querySelector('i'), { scale: 1.1, rotation: -10, duration: 0.3, ease: 'power2.out' });
    });
    icon.addEventListener('mouseleave', function () {
        gsap.to(this, { y: 0, scale: 1, rotation: 0, duration: 0.3, ease: 'power2.in' });
        gsap.to(this.querySelector('i'), { scale: 1, rotation: 0, duration: 0.3, ease: 'power2.in' });
    });
});

// ==================== INIT ====================
window.addEventListener('DOMContentLoaded', () => {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    new LiquidButtonEffect();
    gsap.from('.hero-content', { opacity: 0, y: 60, duration: 1.2, ease: 'power3.out', delay: 0.3 });
    gsap.to('.gradient-mesh', { scale: 1.05, rotation: 5, duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.set('.tournament-card', { opacity: 1, y: 0 });
    gsap.from('.tournament-card', {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '#tournaments', start: 'top 80%', once: true, onEnter: () => { gsap.to('.tournament-card', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }); } }
    });
});

// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const root = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
    gsap.to(themeToggle, { rotation: '+=360', duration: 0.6, ease: 'back.out(1.7)' });
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
}
