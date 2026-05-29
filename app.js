/**
 * DecodeLabs Project 1 - Responsive Frontend Interface
 * Senior Developer Edition
 * Features: Mobile Nav, Scroll-to-Top, Contact Form Validation,
 * Tag Filtering, Custom Alerts, Animated Counters
 */

(function() {
    'use strict';

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');
    const navOverlay = document.getElementById('navOverlay');
    let navOpen = false;

    function toggleNav() {
        navOpen = !navOpen;
        navToggle.setAttribute('aria-expanded', String(navOpen));
        primaryNav.setAttribute('aria-hidden', String(!navOpen));
        navOverlay.classList.toggle('active', navOpen);
        document.body.style.overflow = navOpen ? 'hidden' : '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleNav);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', toggleNav);
    }

    // Close nav on link click (mobile)
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            if (navOpen) toggleNav();
        });
    });

    // Close nav on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navOpen) toggleNav();
    });

    // ============================================
    // SCROLL TO TOP
    // ============================================
    const scrollTopBtn = document.getElementById('scrollTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // TAG FILTERING
    // ============================================
    const tagCloud = document.getElementById('tagCloud');

    if (tagCloud) {
        tagCloud.querySelectorAll('.tag').forEach(function(tag) {
            tag.addEventListener('click', function() {
                tagCloud.querySelectorAll('.tag').forEach(function(t) {
                    t.classList.remove('active');
                });
                this.classList.add('active');

                var selectedTag = this.getAttribute('data-tag');
                showAlert('Filtering by: ' + selectedTag.toUpperCase());
            });
        });
    }

    // ============================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        var nameInput = document.getElementById('contact-name');
        var emailInput = document.getElementById('contact-email');
        var subjectInput = document.getElementById('contact-subject');
        var messageInput = document.getElementById('contact-message');

        var errorName = document.getElementById('error-name');
        var errorEmail = document.getElementById('error-email');
        var errorSubject = document.getElementById('error-subject');
        var errorMessage = document.getElementById('error-message');

        function validateField(input, errorEl, validator) {
            var isValid = validator(input.value.trim());
            if (!isValid && input.value.trim() !== '') {
                input.classList.add('is-invalid');
                errorEl.style.display = 'flex';
            } else {
                input.classList.remove('is-invalid');
                errorEl.style.display = 'none';
            }
            return isValid;
        }

        function validateName() {
            return validateField(nameInput, errorName, function(v) {
                return v.length >= 2 && /^[a-zA-Z\s'-]+$/.test(v);
            });
        }

        function validateEmail() {
            return validateField(emailInput, errorEmail, function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            });
        }

        function validateSubject() {
            return validateField(subjectInput, errorSubject, function(v) {
                return v !== '';
            });
        }

        function validateMessage() {
            return validateField(messageInput, errorMessage, function(v) {
                return v.length >= 10;
            });
        }

        // Real-time validation on blur
        if (nameInput) nameInput.addEventListener('blur', validateName);
        if (emailInput) emailInput.addEventListener('blur', validateEmail);
        if (subjectInput) subjectInput.addEventListener('blur', validateSubject);
        if (messageInput) messageInput.addEventListener('blur', validateMessage);

        // Clear errors on input
        [nameInput, emailInput, subjectInput, messageInput].forEach(function(input) {
            if (input) {
                input.addEventListener('input', function() {
                    input.classList.remove('is-invalid');
                    var errorEl = document.getElementById('error-' + input.id.replace('contact-', ''));
                    if (errorEl) errorEl.style.display = 'none';
                });
            }
        });

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            var isNameValid = validateName();
            var isEmailValid = validateEmail();
            var isSubjectValid = validateSubject();
            var isMessageValid = validateMessage();

            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                var formData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    subject: subjectInput.value,
                    message: messageInput.value.trim()
                };

                // Simulate API call
                var submitBtn = contactForm.querySelector('button[type="submit"]');
                var originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending...</span>';

                setTimeout(function() {
                    showAlert('Thank you, ' + formData.name + '! Your message has been sent successfully.');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 1500);
            } else {
                showAlert('Please fix the errors in the form before submitting.');

                // Focus first invalid field
                var firstInvalid = contactForm.querySelector('.is-invalid, :invalid:not(:placeholder-shown)');
                if (firstInvalid) firstInvalid.focus();
            }
        });
    }

    // ============================================
    // ARTICLE LINK CLICKS
    // ============================================
    document.querySelectorAll('.article-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            var title = this.getAttribute('data-title');
            showAlert('Opening: ' + title);
        });
    });

    // ============================================
    // VIEW ALL LINK
    // ============================================
    var viewAllLink = document.getElementById('viewAllLink');
    if (viewAllLink) {
        viewAllLink.addEventListener('click', function(event) {
            event.preventDefault();
            showAlert('All modules coming soon!');
        });
    }

    // ============================================
    // FEATURE CARD LINKS
    // ============================================
    document.querySelectorAll('.feature-card__link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            showAlert('Detailed documentation coming soon!');
        });
    });

    // ============================================
    // CUSTOM ALERT / TOAST NOTIFICATION
    // ============================================
    function showAlert(message) {
        var existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) existingAlert.remove();

        var alert = document.createElement('div');
        alert.className = 'custom-alert';
        alert.setAttribute('role', 'alert');
        alert.setAttribute('aria-live', 'polite');
        alert.textContent = message;

        document.body.appendChild(alert);

        requestAnimationFrame(function() {
            alert.classList.add('show');
        });

        setTimeout(function() {
            alert.classList.remove('show');
            setTimeout(function() {
                if (alert.parentNode) alert.parentNode.removeChild(alert);
            }, 300);
        }, 3500);
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(event) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            var target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                var headerOffset = 80;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        var scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                var current = '';
                var scrollPos = window.scrollY + 150;

                sections.forEach(function(section) {
                    var sectionTop = section.offsetTop;
                    if (scrollPos >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(function(link) {
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === '#' + current) {
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }, 50);
        });
    }

    // ============================================
    // PREFERS REDUCED MOTION
    // ============================================
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    }

    prefersReducedMotion.addEventListener('change', function(event) {
        if (event.matches) {
            document.documentElement.style.scrollBehavior = 'auto';
        } else {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    });

    // ============================================
    // REVEAL ON SCROLL (Simple Intersection Observer)
    // ============================================
    var revealElements = document.querySelectorAll('.feature-card, .article-card, .contact__detail');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });
    }

    console.log('DecodeLabs Project 1: Senior Edition loaded successfully');
})();