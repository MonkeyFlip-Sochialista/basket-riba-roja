/* ============================================
   BASKET RIBA-ROJA - JavaScript Principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las funcionalidades
    initNavigation();
    initScrollHeader();
    initSmoothScroll();
    initAnimationsOnScroll();
    initStatsCounter();
    initFormValidation();
});

/* ============================================
   NAVEGACIÓN MÓVIL
   ============================================ */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Abrir menú
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Cerrar menú
    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    // Cerrar al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    function closeMenu() {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ============================================
   HEADER CON SCROLL
   ============================================ */
function initScrollHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Añadir clase scrolled
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ============================================
   SMOOTH SCROLL Y NAV ACTIVO
   ============================================ */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');

    // Actualizar enlace activo al hacer scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================
   ANIMACIONES AL SCROLL
   ============================================ */
function initAnimationsOnScroll() {
    // Elementos a animar
    const animatedElements = document.querySelectorAll(
        '.about__card, .program-card, .campus__card, .event-card, .contact__item, .section-header'
    );

    // Añadir clase fade-in
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    // Observer para detectar cuando entran en viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejar de observar una vez animado
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   CONTADOR DE ESTADÍSTICAS
   ============================================ */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat__number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                stats.forEach(stat => animateCounter(stat));
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about__stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const counter = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ============================================
   VALIDACIÓN DEL FORMULARIO
   ============================================ */
function initFormValidation() {
    const form = document.getElementById('inscription-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            // Validación adicional antes de enviar
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff4444';
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault();
                showNotification('Por favor, completa todos los campos obligatorios.', 'error');
            } else {
                // Mostrar mensaje de envío
                showNotification('Enviando inscripción...', 'info');
            }
        });

        // Limpiar estilos de error al escribir
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => {
                field.style.borderColor = '';
            });
        });
    }
}

/* ============================================
   NOTIFICACIONES
   ============================================ */
function showNotification(message, type = 'info') {
    // Eliminar notificaciones anteriores
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification__close">&times;</button>
    `;

    // Estilos inline para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '24px',
        padding: '16px 24px',
        background: type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff',
        color: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideIn 0.3s ease',
        fontFamily: 'Inter, sans-serif'
    });

    // Añadir al DOM
    document.body.appendChild(notification);

    // Cerrar al hacer clic
    notification.querySelector('.notification__close').addEventListener('click', () => {
        notification.remove();
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Añadir estilos de animación para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification__close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
    }
`;
document.head.appendChild(notificationStyles);

/* ============================================
   PARALLAX SUTIL EN HERO
   ============================================ */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});
