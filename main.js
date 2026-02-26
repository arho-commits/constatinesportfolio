/* ============================================
   CONSTANTINE PORTFOLIO — MAIN.JS
   All interactivity & animations
   ============================================ */

(function () {
    'use strict';

    /* ── CURSOR GLOW ── */
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    /* ── NAVIGATION: shrink on scroll + active link ── */
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        // Shrink nav
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach((section) => {
            const sTop = section.offsetTop - 140;
            if (window.scrollY >= sTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── SMOOTH SCROLL for all anchor links ── */
    document.querySelectorAll('a[href^="#"], button[href^="#"]').forEach((el) => {
        el.addEventListener('click', (e) => {
            const href = el.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ── HAMBURGER MENU ── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                mobileMenu.classList.remove('open');
            }
        });
    }

    /* ── REEL MODAL ── */
    const playReelBtn = document.getElementById('playReel');
    const reelModal = document.getElementById('reelModal');
    const closeModal = document.getElementById('closeModal');

    function openModal() {
        reelModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModalFn() {
        reelModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (playReelBtn) playReelBtn.addEventListener('click', openModal);
    if (closeModal) closeModal.addEventListener('click', closeModalFn);
    if (reelModal) reelModal.addEventListener('click', (e) => {
        if (e.target === reelModal) closeModalFn();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModalFn();
    });

    /* ── PORTFOLIO FILTER ── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Toggle active button
            filterBtns.forEach((b) => b.classList.remove('filter-btn--active'));
            btn.classList.add('filter-btn--active');

            const filter = btn.dataset.filter;

            projectCards.forEach((card) => {
                const match = filter === 'all' || card.dataset.category === filter;

                if (match) {
                    card.style.animation = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    // Re-trigger paint
                    void card.offsetWidth;

                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.display = '';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });

    /* ── SCROLL REVEAL (IntersectionObserver) ── */
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        );

        revealEls.forEach((el) => revealObs.observe(el));
    } else {
        // Fallback — just show everything
        revealEls.forEach((el) => el.classList.add('revealed'));
    }

    /* ── ANIMATED STAT COUNTERS ── */
    const statNums = document.querySelectorAll('.stat__number');

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const step = duration / target;
        let current = 0;

        const timer = setInterval(() => {
            current++;
            el.textContent = current;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            }
        }, Math.max(step, 20));
    }

    if ('IntersectionObserver' in window) {
        const statsObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        statNums.forEach(animateCounter);
                        statsObs.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );

        const statsSection = document.querySelector('.stats');
        if (statsSection) statsObs.observe(statsSection);
    }

    /* ── SKILL BAR ANIMATION ── */
    const skillBars = document.querySelectorAll('.skill-bar__fill');

    if ('IntersectionObserver' in window) {
        const skillObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        skillBars.forEach((bar) => {
                            const width = bar.dataset.width;
                            setTimeout(() => {
                                bar.style.width = width + '%';
                            }, 200);
                        });
                        skillObs.disconnect();
                    }
                });
            },
            { threshold: 0.3 }
        );

        const aboutSection = document.querySelector('.about');
        if (aboutSection) skillObs.observe(aboutSection);
    }

    /* ── TESTIMONIAL DOTS ── */
    const track = document.getElementById('testimonialsTrack');
    const dotsWrap = document.getElementById('testDots');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];

    if (track && dotsWrap && cards.length) {
        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'test-dot';
            dot.style.cssText = `
        width: 8px; height: 8px; border-radius: 50%;
        background: ${i === 0 ? 'var(--gold)' : 'var(--border)'};
        cursor: pointer; transition: background 0.3s;
      `;
            dot.addEventListener('click', () => {
                cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            });
            dotsWrap.appendChild(dot);
        });

        const dots = dotsWrap.querySelectorAll('.test-dot');

        // Update active dot on scroll
        track.addEventListener('scroll', () => {
            const scrollLeft = track.scrollLeft;
            const cardWidth = cards[0].offsetWidth + 24;
            const index = Math.round(scrollLeft / cardWidth);

            dots.forEach((d, i) => {
                d.style.background = i === index ? 'var(--gold)' : 'var(--border)';
                d.style.transform = i === index ? 'scale(1.3)' : 'scale(1)';
            });
        }, { passive: true });
    }

    /* ── CONTACT FORM VALIDATION ── */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Simple validation
            if (!name || !email || !message) {
                // Highlight empty fields
                [document.getElementById('name'), document.getElementById('email'), document.getElementById('message')].forEach((el) => {
                    if (!el.value.trim()) {
                        el.style.borderColor = '#ff6b6b';
                        el.addEventListener('input', () => {
                            el.style.borderColor = '';
                        }, { once: true });
                    }
                });
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                const emailEl = document.getElementById('email');
                emailEl.style.borderColor = '#ff6b6b';
                emailEl.focus();
                return;
            }

            // Start loading animation
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg style="width:18px;height:18px;animation:spin 1s linear infinite" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4V2A10 10 0 002 12h2a8 8 0 018-8z"/>
                </svg>
                Sending...
            `;

            if (!document.getElementById('spinStyle')) {
                const style = document.createElement('style');
                style.id = 'spinStyle';
                style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
                document.head.appendChild(style);
            }

            // Real submission to Formspree
            const data = new FormData(contactForm);
            fetch(contactForm.action, {
                method: contactForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    submitBtn.style.display = 'none';
                    formSuccess.classList.add('visible');
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        let errorMsg = "Oops! There was a problem submitting your form";

                        // Handle the specific Formspree "unverified" error
                        if (data.error && data.error.includes("isn't set up yet")) {
                            errorMsg = "Verification Required: Please check cojokoh@outlook.com to activate this form!";
                        } else if (data.errors) {
                            errorMsg = data.errors.map(error => error.message).join(", ");
                        }

                        alert(errorMsg);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `Send Message<svg class="btn__arrow" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>`;
                    });
                }
            }).catch(error => {
                alert("Oops! There was a problem submitting your form. Please check your connection.");
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Send Message<svg class="btn__arrow" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>`;
            });
        });
    }

    /* ── PARALLAX on hero content ── */
    const heroContent = document.querySelector('.hero__content');
    const heroBg = document.querySelector('.hero__bg');

    if (heroContent && heroBg) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            heroContent.style.transform = `translateY(${y * 0.3}px)`;
            heroContent.style.opacity = Math.max(0, 1 - y / 600);
            heroBg.style.transform = `translateY(${y * 0.15}px)`;
        }, { passive: true });
    }

    /* ── BENTO CARD VIDEO MODAL ── */
    const vidModal = document.getElementById('vidModal');
    const vidModalPlayer = document.getElementById('vidModalPlayer');
    const vidModalClose = document.getElementById('vidModalClose');
    const vidModalTag = document.getElementById('vidModalTag');
    const vidModalTitle = document.getElementById('vidModalTitle');

    function openVidModal(src, title, tag) {
        vidModalPlayer.src = src;
        vidModalTitle.textContent = title;
        vidModalTag.textContent = tag;
        vidModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        vidModalPlayer.load(); // Ensure player is ready for new source
        vidModalPlayer.play().catch(() => { });
    }

    function closeVidModal() {
        vidModal.classList.remove('open');
        document.body.style.overflow = '';
        vidModalPlayer.pause();
        vidModalPlayer.src = '';
    }

    document.querySelectorAll('.bento-card').forEach((card) => {
        card.addEventListener('click', () => {
            const src = card.dataset.src;
            const title = card.dataset.title;
            const tag = card.dataset.tag;
            if (src) openVidModal(src, title, tag);
        });
    });

    if (vidModalClose) vidModalClose.addEventListener('click', closeVidModal);
    if (vidModal) vidModal.addEventListener('click', (e) => {
        if (e.target === vidModal) closeVidModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeVidModal();
    });

    /* ── SMART VIDEO LAZY-PRELOAD ── */
    const bentoVideos = document.querySelectorAll('.bento-thumb');

    if ('IntersectionObserver' in window && bentoVideos.length) {
        const videoObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    const src = video.dataset.src;

                    if (entry.isIntersecting) {
                        // Set src if not already set
                        if (!video.src && src) {
                            video.muted = true; // Essential for mobile autoplay
                            video.setAttribute('playsinline', ''); // Essential for iOS
                            video.src = src;
                            video.load();
                        }

                        // Play the snippet
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(() => {
                                // Autoplay might be blocked until user interaction
                            });
                        }
                    } else {
                        // Pause if not intersecting to save CPU/GPU
                        video.pause();

                        // Optional: Clear src to save memory if it's very heavy
                        // video.src = '';
                        // video.load();
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px 100px 0px' }
        );

        bentoVideos.forEach((vid) => videoObs.observe(vid));
    } else {
        // Fallback for older browsers
        bentoVideos.forEach((vid) => {
            if (vid.dataset.src) vid.src = vid.dataset.src;
            vid.setAttribute('preload', 'metadata');
        });
    }

})();
