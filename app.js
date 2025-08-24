class MatrixPresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 20;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.slideCounter = document.getElementById('slideCounter');
        this.matrixRain = document.getElementById('matrixRain');
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupKeyboardControls();
        this.createMatrixRain();
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Start matrix rain animation only on title slide
        this.toggleMatrixRain();
        
        // Add progressive disclosure animations
        this.setupProgressiveDisclosure();
    }

    setupNavigation() {
        // Ensure buttons exist before adding event listeners
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
            
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        } else {
            console.error('Navigation buttons not found');
        }
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
            }
        });
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        // Remove active class from current slide
        if (this.slides[this.currentSlide - 1]) {
            this.slides[this.currentSlide - 1].classList.remove('active');
        }
        
        // Add active class to new slide
        this.currentSlide = slideNumber;
        if (this.slides[this.currentSlide - 1]) {
            this.slides[this.currentSlide - 1].classList.add('active');
        }
        
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.toggleMatrixRain();
        
        // Trigger progressive disclosure for new slide
        this.animateSlideContent();
    }

    updateSlideCounter() {
        if (this.slideCounter) {
            this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
        }
    }

    updateNavigationButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        }
    }

    toggleMatrixRain() {
        if (this.matrixRain) {
            // Show matrix rain only on title slide
            if (this.currentSlide === 1) {
                this.matrixRain.style.opacity = '0.1';
                this.startMatrixAnimation();
            } else {
                this.matrixRain.style.opacity = '0';
                this.stopMatrixAnimation();
            }
        }
    }

    createMatrixRain() {
        if (!this.matrixRain) return;
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const columns = Math.floor(window.innerWidth / 20);
        
        this.matrixRain.innerHTML = '';
        
        for (let i = 0; i < columns; i++) {
            this.createMatrixColumn(i, chars);
        }
    }

    createMatrixColumn(columnIndex, chars) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.left = `${columnIndex * 20}px`;
        column.style.top = '0';
        column.style.width = '20px';
        column.style.height = '100vh';
        column.classList.add('matrix-column');
        
        this.matrixRain.appendChild(column);
        
        // Create falling characters for this column
        const intervalId = setInterval(() => {
            if (this.matrixRain && this.matrixRain.style.opacity !== '0') {
                this.createFallingChar(column, chars);
            }
        }, Math.random() * 2000 + 500);
        
        // Store interval ID for cleanup
        column.intervalId = intervalId;
    }

    createFallingChar(column, chars) {
        const char = document.createElement('div');
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.classList.add('matrix-char');
        char.style.left = '0';
        char.style.animationDuration = `${Math.random() * 3 + 2}s`;
        char.style.animationDelay = `${Math.random() * 2}s`;
        char.style.opacity = Math.random() * 0.8 + 0.2;
        
        column.appendChild(char);
        
        // Remove character after animation
        setTimeout(() => {
            if (char && char.parentNode) {
                char.parentNode.removeChild(char);
            }
        }, 5000);
    }

    startMatrixAnimation() {
        this.matrixAnimating = true;
    }

    stopMatrixAnimation() {
        this.matrixAnimating = false;
    }

    setupProgressiveDisclosure() {
        // Add animation classes to elements that should appear progressively
        this.slides.forEach((slide, index) => {
            const elements = slide.querySelectorAll('.content-grid > *, .concept-grid > *, .intelligence-level, .concept-item, .ability, .step, .advantage, .criterion, .phrase, .solution, .pipeline-step');
            
            elements.forEach((element, i) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.transitionDelay = `${i * 0.1}s`;
                element.dataset.animationIndex = i;
            });
        });
    }

    animateSlideContent() {
        const currentSlideElement = this.slides[this.currentSlide - 1];
        if (!currentSlideElement) return;
        
        const elements = currentSlideElement.querySelectorAll('[data-animation-index]');
        
        // Reset all animations first
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        });
        
        // Trigger animations with delay
        setTimeout(() => {
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 200);
    }

    // Utility methods for special slide interactions
    highlightCode(codeElement) {
        if (!codeElement) return;
        
        const text = codeElement.textContent;
        const keywords = ['def', 'if', 'else', 'for', 'in', 'return', 'import', 'from', 'class', 'self'];
        
        let highlightedText = text;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlightedText = highlightedText.replace(regex, `<span style="color: #FFFF00;">${keyword}</span>`);
        });
        
        codeElement.innerHTML = highlightedText;
    }

    // Add typewriter effect for certain text elements
    typeWriter(element, text, speed = 50) {
        if (!element) return;
        
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Add glitch effect for emphasis
    glitchText(element) {
        if (!element) return;
        
        const originalText = element.textContent;
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        
        let glitchInterval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map(char => Math.random() < 0.1 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
                .join('');
        }, 50);
        
        setTimeout(() => {
            clearInterval(glitchInterval);
            element.textContent = originalText;
        }, 1000);
    }

    // Handle window resize
    handleResize() {
        this.createMatrixRain();
    }
}

// Special effects and animations
class SlideEffects {
    constructor(presentation) {
        this.presentation = presentation;
        this.setupSpecialEffects();
    }

    setupSpecialEffects() {
        // Add hover effects to interactive elements
        this.setupHoverEffects();
        this.setupClickEffects();
    }

    setupHoverEffects() {
        // Add glow effect to buttons and interactive elements
        const interactiveElements = document.querySelectorAll('.nav-btn, .intelligence-level, .concept-item, .step, .advantage');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
                element.style.transform = 'scale(1.02)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = 'none';
                element.style.transform = 'scale(1)';
            });
        });
    }

    setupClickEffects() {
        // Add click ripple effect
        const clickableElements = document.querySelectorAll('.nav-btn');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                element.appendChild(ripple);
                
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(0, 255, 0, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple-effect 0.6s linear';
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

// Audio manager for sound effects (optional)
class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = false; // Start disabled, can be enabled by user
    }

    // Create audio context and sounds
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
            this.enabled = true;
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    createSounds() {
        // Create simple beep sounds for navigation
        this.sounds.navigate = this.createBeep(800, 0.1, 0.05);
        this.sounds.error = this.createBeep(400, 0.2, 0.1);
    }

    createBeep(frequency, duration, volume) {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName] && this.enabled) {
            this.sounds[soundName]();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled && !this.audioContext) {
            this.initAudio();
        }
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all DOM elements are fully loaded
    setTimeout(() => {
        const presentation = new MatrixPresentation();
        const effects = new SlideEffects(presentation);
        const audio = new AudioManager();

        // Add CSS for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-effect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .nav-btn {
                position: relative;
                overflow: hidden;
            }
            
            /* Matrix rain fade in/out */
            .matrix-rain {
                transition: opacity 1s ease-in-out;
            }
            
            /* Slide transitions */
            .slide {
                transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
            }
            
            /* Progressive disclosure animations */
            .intelligence-level,
            .concept-item,
            .ability,
            .step,
            .advantage,
            .criterion,
            .phrase,
            .solution,
            .pipeline-step {
                transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
            }
            
            /* Hover effects */
            .intelligence-level:hover,
            .concept-item:hover,
            .step:hover,
            .advantage:hover,
            .criterion:hover {
                transform: translateY(-2px) !important;
            }
            
            /* Loading animation for first slide */
            .main-title {
                animation: matrix-title-load 2s ease-in-out;
            }
            
            @keyframes matrix-title-load {
                0% {
                    opacity: 0;
                    transform: scale(0.8) rotateX(-15deg);
                    text-shadow: 0 0 50px rgba(0, 255, 0, 0);
                }
                50% {
                    opacity: 0.8;
                    text-shadow: 0 0 30px rgba(0, 255, 0, 0.8);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) rotateX(0deg);
                    text-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
                }
            }
            
            /* Pulse animation for important elements */
            .highlight {
                animation: pulse-glow 2s infinite alternate;
            }
            
            @keyframes pulse-glow {
                0% {
                    text-shadow: 0 0 5px currentColor;
                }
                100% {
                    text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
                }
            }
            
            /* Error state animations */
            .answer.error {
                animation: shake 0.5s ease-in-out;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            /* Success state animations */
            .answer.correct {
                animation: success-glow 1s ease-in-out;
            }
            
            @keyframes success-glow {
                0% {
                    background: rgba(0, 255, 0, 0.1);
                }
                50% {
                    background: rgba(0, 255, 0, 0.3);
                    transform: scale(1.02);
                }
                100% {
                    background: rgba(0, 255, 0, 0.2);
                    transform: scale(1);
                }
            }
            
            /* Code highlighting improvements */
            pre code {
                animation: code-reveal 1s ease-in-out;
            }
            
            @keyframes code-reveal {
                0% {
                    opacity: 0;
                    filter: blur(2px);
                }
                100% {
                    opacity: 1;
                    filter: blur(0);
                }
            }
        `;
        document.head.appendChild(style);

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                presentation.handleResize();
            }, 250);
        });

        // Add keyboard shortcut help (optional)
        const helpShortcuts = {
            'Arrow Keys': 'Navigate slides',
            'Space/Page Down': 'Next slide',
            'Page Up': 'Previous slide',
            'Home': 'First slide',
            'End': 'Last slide'
        };

        // Preload images and optimize performance
        const preloadImages = () => {
            // No external images in this presentation, but this function
            // could be used to preload any future image assets
        };

        // Initialize performance optimizations
        const optimizePerformance = () => {
            // Reduce animation frequency when not visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // Pause heavy animations when tab is not visible
                    presentation.stopMatrixAnimation();
                } else {
                    // Resume animations when tab becomes visible
                    if (presentation.currentSlide === 1) {
                        presentation.startMatrixAnimation();
                    }
                }
            });
        };

        preloadImages();
        optimizePerformance();

        // Expose presentation instance globally for debugging
        window.presentation = presentation;
        window.audio = audio;
        
        console.log('Matrix Presentation initialized successfully!');
        console.log('Use arrow keys or buttons to navigate. Press F12 and check window.presentation for debugging.');
    }, 100); // Small delay to ensure DOM is fully ready
});