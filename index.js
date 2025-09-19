// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav if open
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('show')) navLinks.classList.remove('show');
    });
});

// Navbar scroll effect (toggle .scrolled for CSS-driven styles)
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// (Removed legacy testimonial slider logic. The advanced slider logic below is used for all .testimonial-slider instances for consistent sliding.)

// Form submission handling with WhatsApp redirect
const enrollmentForm = document.getElementById('enrollmentForm');
if (enrollmentForm) {
    const statusEl = document.getElementById('formStatus');
    enrollmentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');

        // Save to localStorage in case user wants to review later
        const payload = {
            name,
            phone,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('lastEnrollmentSubmission', JSON.stringify(payload));

        // Show success message
        if (statusEl) statusEl.textContent = 'Redirecting you to WhatsApp...';

        // Prepare WhatsApp message with user's name
        const whatsappMessage = encodeURIComponent(`Hello Vista Express Logistics, my name is ${name}. I would like to register for your Importation Mentorship Program. Kindly share the registration details with me.`);
        const whatsappNumber = "2349121195283";
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        // Reset form
        this.reset();
        
        // Redirect to WhatsApp after a short delay
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            if (submitBtn) submitBtn.disabled = false;
            if (statusEl) statusEl.textContent = 'Form submitted successfully! Check your WhatsApp.';
        }, 1000);
    });
}

// Intersection Observer for fade-in animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add necessary style for fade-in
const styleTag = document.createElement('style');
styleTag.textContent = `.fade-in{opacity:1 !important;transform:translateY(0) !important}`;
document.head.appendChild(styleTag);

// Facilitator slider functionality
function initFacilitatorSlider() {
    const slides = document.querySelectorAll('.facilitator-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    
    // Initialize first slide
    slides[0].classList.add('active');

    function showSlide(index) {
        // Remove all classes first
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });

        // Calculate prev and next indices
        const prevIndex = (index - 1 + slides.length) % slides.length;
        const nextIndex = (index + 1) % slides.length;

        // Add appropriate classes
        slides[prevIndex].classList.add('prev');
        slides[index].classList.add('active');
        slides[nextIndex].classList.add('next');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
}

// Initialize the slider when the DOM is loaded
document.addEventListener('DOMContentLoaded', initFacilitatorSlider);

// Mobile navigation functionality
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
let isAnimating = false;

function toggleMobileNav() {
    if (isAnimating) return;
    
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    
    if (!isExpanded) {
        // Opening the menu
        navLinks.classList.add('show');
        // Keep page scrollable while the mobile nav is open so users can scroll the page vertically
        // (previous behavior set document.body.style.overflow = 'hidden')
    } else {
        // Closing the menu
        closeMobileNav();
    }
}

function closeMobileNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
    // No body overflow manipulation here so vertical scrolling remains available
}

// Add event listeners for mobile navigation
if (navToggle && navLinks) {
    navToggle.addEventListener('click', toggleMobileNav);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navLinks.contains(e.target);
        const isClickOnToggle = navToggle.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('show')) {
            closeMobileNav();
        }
    });
}

// Close mobile nav on resize if window becomes larger than mobile breakpoint
window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
        closeMobileNav();
    }
});

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const wasExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other questions
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current question
            question.setAttribute('aria-expanded', (!wasExpanded).toString());
        });
    });
});

// Facilitator slider functionality
(function() {
    const facilitatorSlider = document.querySelector('.facilitator-slider');
    if (!facilitatorSlider) return;

    const slides = Array.from(facilitatorSlider.querySelectorAll('.facilitator-slide'));
    if (slides.length === 0) return;

    const prevBtn = facilitatorSlider.querySelector('.slider-button.prev');
    const nextBtn = facilitatorSlider.querySelector('.slider-button.next');

    let current = 0;
    let intervalId = null;
    const AUTO_MS = 3200; // time between slides

    function updateSlides() {
        slides.forEach((s, i) => {
            s.classList.remove('active', 'prev', 'next');
            if (i === current) s.classList.add('active');
        });
    }

    function next() {
        current = (current + 1) % slides.length;
        updateSlides();
    }

    function prev() {
        current = (current - 1 + slides.length) % slides.length;
        updateSlides();
    }

    // Initialize controls
    if (prevBtn) prevBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        prev();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        next();
    });

    // Start auto-rotation
    updateSlides();
    intervalId = setInterval(next, AUTO_MS);
})();

// Testimonial slider controls
// Initialize all testimonial-slider instances on the page
;(function() {
    const sliders = Array.from(document.querySelectorAll('.testimonial-slider'));
    if (sliders.length === 0) return;

    sliders.forEach((slider) => {
        const originalSlides = Array.from(slider.querySelectorAll('.slide'));
        if (originalSlides.length === 0) return;

        // Validate each slide's image (if present). Remove slides with broken/blank images.
        const validations = originalSlides.map((slide) => {
            return new Promise((resolve) => {
                const img = (slide.tagName === 'IMG') ? slide : slide.querySelector('img');
                if (!img) {
                    // No image to validate; keep the slide
                    return resolve({ slide, valid: true });
                }

                // If image already loaded, check naturalWidth
                if (img.complete) {
                    return resolve({ slide, valid: img.naturalWidth > 0 });
                }

                // Otherwise listen for load/error with a timeout fallback
                let settled = false;
                const onLoad = () => {
                    if (settled) return; settled = true;
                    cleanup();
                    resolve({ slide, valid: img.naturalWidth > 0 });
                };
                const onError = () => {
                    if (settled) return; settled = true;
                    cleanup();
                    resolve({ slide, valid: false });
                };
                const cleanup = () => {
                    img.removeEventListener('load', onLoad);
                    img.removeEventListener('error', onError);
                };

                img.addEventListener('load', onLoad, { once: true });
                img.addEventListener('error', onError, { once: true });

                // Fallback: resolve after 5s based on naturalWidth (prevents stalled init)
                setTimeout(() => {
                    if (settled) return; settled = true;
                    cleanup();
                    resolve({ slide, valid: img.naturalWidth > 0 });
                }, 5000);
            });
        });

        Promise.all(validations).then((results) => {
            const invalidSlides = results.filter(r => !r.valid).map(r => r.slide);
            const validSlides = results.filter(r => r.valid).map(r => r.slide);

            // Remove invalid slides from DOM so they won't show as blank slides
            invalidSlides.forEach(s => { if (s.parentNode) s.parentNode.removeChild(s); });

            if (validSlides.length === 0) return; // nothing to initialize

            // create dots
            const dotsWrap = document.createElement('div');
            dotsWrap.className = 'slider-dots';
            validSlides.forEach((s, i) => {
                const btn = document.createElement('button');
                btn.setAttribute('aria-label', `Show slide ${i + 1}`);
                btn.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(btn);
            });
            slider.appendChild(dotsWrap);

            const prevBtn = slider.querySelector('.slider-button.prev');
            const nextBtn = slider.querySelector('.slider-button.next');
            const dots = Array.from(dotsWrap.children);

            let current = 0;
            let intervalId = null;
            const AUTO_MS = 3200; // time between slides

            function updateClasses() {
                validSlides.forEach((s, i) => {
                    s.classList.remove('active', 'prev', 'next');
                    s.setAttribute('aria-hidden', 'true');
                    s.tabIndex = -1;
                });

                const active = validSlides[current];
                const nextIdx = (current + 1) % validSlides.length;
                const prevIdx = (current - 1 + validSlides.length) % validSlides.length;

                if (validSlides[prevIdx]) validSlides[prevIdx].classList.add('prev');
                if (validSlides[nextIdx]) validSlides[nextIdx].classList.add('next');

                if (active) {
                    active.classList.add('active');
                    active.removeAttribute('aria-hidden');
                    active.tabIndex = 0;
                }

                dots.forEach((d, i) => d.classList.toggle('active', i === current));
            }

            function goTo(index) {
                current = ((index % validSlides.length) + validSlides.length) % validSlides.length;
                updateClasses();
                restartAutoplay();
            }

            function next() {
                goTo(current + 1);
            }
            function prev() {
                goTo(current - 1);
            }

            function startAutoplay() {
                stopAutoplay();
                intervalId = setInterval(() => { next(); }, AUTO_MS);
            }
            function stopAutoplay() {
                if (intervalId) { clearInterval(intervalId); intervalId = null; }
            }
            function restartAutoplay() {
                stopAutoplay();
                setTimeout(startAutoplay, AUTO_MS);
            }

            // attach controls
            if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); next(); });
            if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); prev(); });

            // pause on hover/focus
            slider.addEventListener('mouseenter', stopAutoplay);
            slider.addEventListener('mouseleave', startAutoplay);
            slider.addEventListener('focusin', stopAutoplay);
            slider.addEventListener('focusout', startAutoplay);

            // keyboard navigation
            slider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
                else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
            });

            // Function to adjust slider height to match the active image to avoid blank/white areas
            const sliderContainer = slider.querySelector('.slider-container') || slider;
            function getActiveImage() {
                const active = validSlides[current];
                if (!active) return null;
                // slide may be an <img> or contain an <img>
                return (active.tagName === 'IMG') ? active : active.querySelector('img');
            }

            function adjustSliderHeight() {
                const img = getActiveImage();
                if (!img) {
                    // fallback - clear explicit height
                    if (sliderContainer) sliderContainer.style.height = '';
                    return;
                }

                // If the image has natural dimensions, compute the displayed height when constrained to container width
                const containerWidth = sliderContainer.clientWidth || slider.clientWidth;
                if (!containerWidth) return;

                // If the image is already loaded, use its natural sizes to compute scaled height
                let height = img.clientHeight;
                if (img.naturalWidth && img.naturalWidth > 0) {
                    const scale = containerWidth / img.naturalWidth;
                    height = Math.round(img.naturalHeight * scale);
                }

                // Apply the height to the slider container to prevent layout shifts
                sliderContainer.style.height = height + 'px';
            }

            // Debounce helper for resize
            function debounce(fn, wait) {
                let t = null;
                return function(...args) {
                    clearTimeout(t);
                    t = setTimeout(() => fn.apply(this, args), wait);
                };
            }

            const debouncedAdjust = debounce(adjustSliderHeight, 120);

            // Attach load listeners to all valid slide images so the height can be recalculated when they finish loading
            validSlides.forEach(s => {
                const img = (s.tagName === 'IMG') ? s : s.querySelector('img');
                if (img) {
                    // if already complete, no need to wait
                    if (!img.complete) img.addEventListener('load', adjustSliderHeight, { once: true });
                    img.addEventListener('error', adjustSliderHeight, { once: true });
                }
            });

            // Recalculate on window resize
            window.addEventListener('resize', debouncedAdjust);

            // initialize
            updateClasses();
            // Ensure correct height before starting autoplay
            adjustSliderHeight();
            startAutoplay();
        });
    });
})();

// Inline hero image slideshow (crossfade between two images)
/* (function() {
    const heroImg = document.querySelector('.hero-inline-img');
    if (!heroImg) return;

    const imgs = [
        'images/goodfold1.jpg',
        'images/altimage.jpg'
    ];
    let idx = 0;
    const crossfade = (nextIdx) => {
        // fade out
        heroImg.classList.add('is-fading');
        setTimeout(() => {
            // swap src while hidden
            heroImg.src = imgs[nextIdx];
            // force reflow then fade back in
            // eslint-disable-next-line no-unused-expressions
            heroImg.offsetWidth;
            heroImg.classList.remove('is-fading');
        }, 450); // match CSS transition duration to ensure smooth fade
    };

    // loop
    setInterval(() => {
        idx = (idx + 1) % imgs.length;
        crossfade(idx);
    }, 6200); // change image every 6.2s for slower transitions
})(); */

// Prevent browser from restoring scroll position on refresh to avoid jumps.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Ensure we don't force-scroll to top in a way that causes a visible jump; let the browser handle initial positioning.
// Removed the previous onbeforeunload and onload forced scrolls to avoid glitches on mobile.
