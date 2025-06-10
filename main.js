document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768 && menuToggle && navLinks) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight current section in navigation
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });

    // Active link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && window.innerWidth <= 768 && menuToggle && navLinks) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Add animation class when elements come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.cabin-card, .experience-item, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };

    // Run once on load and then on scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // HERO SLIDESHOW FUNCTIONALITY
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Only initialize slideshow if slides exist
    if (slides.length > 0) {
        let slideIndex = 0;
        let autoPlayInterval;
        const totalSlides = slides.length;

        // Show specific slide
        function showSlide(index) {
            // Remove active class from all slides and indicators
            slides.forEach(slide => slide.classList.remove('active'));
            if (indicators.length > 0) {
                indicators.forEach(indicator => indicator.classList.remove('active'));
            }
            
            // Add active class to current slide and indicator
            slides[index].classList.add('active');
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
        }

        // Auto-play slideshow
        function autoSlide() {
            slideIndex = (slideIndex + 1) % totalSlides;
            showSlide(slideIndex);
        }

        // Navigation functions (making them global for onclick handlers)
        window.changeSlide = function(direction) {
            slideIndex += direction;
            if (slideIndex >= totalSlides) slideIndex = 0;
            if (slideIndex < 0) slideIndex = totalSlides - 1;
            showSlide(slideIndex);
            
            // Reset auto-play timer
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(autoSlide, 5000);
        };

        window.currentSlide = function(index) {
            slideIndex = index - 1;
            showSlide(slideIndex);
            
            // Reset auto-play timer
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(autoSlide, 5000);
        };

        // Start auto-play (changes every 5 seconds)
        autoPlayInterval = setInterval(autoSlide, 5000);

        // Pause auto-play on hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });

            heroSection.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(autoSlide, 5000);
            });
        }

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        if (heroSection) {
            heroSection.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            });

            heroSection.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - next slide
                    window.changeSlide(1);
                } else {
                    // Swiped right - previous slide
                    window.changeSlide(-1);
                }
            }
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                window.changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                window.changeSlide(1);
            }
        });

        // Preload images for smoother transitions
        function preloadImages() {
            slides.forEach(slide => {
                const bgImage = slide.style.backgroundImage;
                if (bgImage) {
                    const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
                    const img = new Image();
                    img.src = imageUrl;
                }
            });
        }

        preloadImages();
    }

    // Error handling for missing images
    function handleImageErrors() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                console.warn('Image failed to load:', this.src);
            });
        });
    }

    handleImageErrors();

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});