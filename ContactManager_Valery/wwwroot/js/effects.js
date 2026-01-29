// effects.js - Дополнительные визуальные эффекты

class VisualEffects {
    // Эффект ripple для всех кнопок
    static initRippleEffect() {
        document.addEventListener('click', function(e) {
            const button = e.target.closest('button, .btn, .card, .glass-card');
            if (button) {
                this.createRipple(e, button);
            }
        }.bind(this));
    }

    static createRipple(event, element) {
        const circle = document.createElement("span");
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`;
        circle.classList.add("ripple-effect");

        const ripple = element.querySelector(".ripple-effect");
        if (ripple) {
            ripple.remove();
        }

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(circle);

        setTimeout(() => {
            circle.remove();
        }, 600);
    }

    // Эффект параллакса
    static initParallax() {
        document.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-bg');
            
            parallaxElements.forEach(element => {
                const rate = scrolled * 0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Эффект появления при скролле
    static initScrollAnimation() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдаем за всеми элементами с классом animate-on-scroll
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Эффект печатающегося текста
    static typewriterEffect(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Эффект подсветки элементов
    static initHighlightEffect() {
        document.addEventListener('mousemove', function(e) {
            const elements = document.querySelectorAll('.highlight-on-hover');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                el.style.setProperty('--mouse-x', `${x}px`);
                el.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // Эффект волны на кнопках
    static initWaveEffect() {
        document.querySelectorAll('.wave-effect').forEach(button => {
            button.addEventListener('click', function(e) {
                const wave = document.createElement('span');
                wave.classList.add('wave');
                
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                wave.style.width = wave.style.height = `${size}px`;
                wave.style.left = `${x}px`;
                wave.style.top = `${y}px`;
                
                button.appendChild(wave);
                
                setTimeout(() => {
                    wave.remove();
                }, 1000);
            });
        });
    }

    // Эффект свечения
    static initGlowEffect() {
        document.querySelectorAll('.glow-on-hover').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.classList.add('glowing');
            });
            
            element.addEventListener('mouseleave', function() {
                this.classList.remove('glowing');
            });
        });
    }

    // Эффект наклона при движении мыши
    static initTiltEffect() {
        document.querySelectorAll('.tilt-effect').forEach(element => {
            element.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 10;
                const rotateX = ((centerY - y) / centerY) * 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // Эффект плавающих частиц
    static initFloatingParticles() {
        const container = document.querySelector('.particles-container') || document.body;
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('floating-particle');
            
            // Случайные параметры
            const size = Math.random() * 20 + 5;
            const posX = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}vw`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            // Случайный цвет
            const colors = [
                'rgba(106, 17, 203, 0.3)',
                'rgba(255, 107, 53, 0.3)',
                'rgba(106, 159, 181, 0.3)',
                'rgba(138, 43, 226, 0.3)',
                'rgba(212, 165, 116, 0.3)'
            ];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(particle);
        }
    }

    // Инициализация всех эффектов
    static initAllEffects() {
        this.initRippleEffect();
        this.initParallax();
        this.initScrollAnimation();
        this.initHighlightEffect();
        this.initWaveEffect();
        this.initGlowEffect();
        this.initTiltEffect();
        this.initFloatingParticles();
        
        console.log('Все визуальные эффекты инициализированы');
    }
}

// Добавление CSS для эффектов
const effectsCSS = `
/* Ripple эффект */
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Wave эффект */
.wave {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: wave 1s ease-out;
    pointer-events: none;
}

@keyframes wave {
    to {
        transform: scale(2);
        opacity: 0;
    }
}

/* Glow эффект */
.glow-on-hover {
    transition: box-shadow 0.3s ease;
}

.glow-on-hover.glowing {
    box-shadow: 0 0 25px rgba(106, 17, 203, 0.5),
                0 0 50px rgba(255, 107, 53, 0.3);
}

/* Tilt эффект */
.tilt-effect {
    transition: transform 0.1s ease;
}

/* Highlight эффект */
.highlight-on-hover {
    position: relative;
    overflow: hidden;
}

.highlight-on-hover::before {
    content: '';
    position: absolute;
    top: var(--mouse-y);
    left: var(--mouse-x);
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
}

.highlight-on-hover:hover::before {
    opacity: 1;
}

/* Floating particles */
.floating-particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: float linear infinite;
    filter: blur(2px);
    z-index: -1;
}

@keyframes float {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

/* Fade in up анимация */
.fade-in-up {
    animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Pulsing анимация */
.pulse {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(106, 17, 203, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(106, 17, 203, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(106, 17, 203, 0);
    }
}

/* Shimmer эффект */
.shimmer {
    position: relative;
    overflow: hidden;
}

.shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.2) 50%, 
        transparent 100%);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    100% {
        left: 100%;
    }
}

/* Bounce анимация */
.bounce {
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

/* Spin анимация */
.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}

/* Scale анимация */
.scale-on-hover {
    transition: transform 0.3s ease;
}

.scale-on-hover:hover {
    transform: scale(1.05);
}
`;

// Добавляем CSS для эффектов в документ
const styleSheet = document.createElement("style");
styleSheet.textContent = effectsCSS;
document.head.appendChild(styleSheet);

// Экспорт класса для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualEffects;
} else {
    window.VisualEffects = VisualEffects;
}