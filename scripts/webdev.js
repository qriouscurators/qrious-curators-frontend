// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
    });
});

gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    gsap.set(follower, {
        x: followerX,
        y: followerY
    });
});

// Cursor Hover Effects
const hoverElements = document.querySelectorAll('[data-cursor]');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        const action = el.getAttribute('data-cursor');
        
        if (action === '-hidden') {
            follower.classList.add('hidden');
            cursor.style.opacity = '0';
        } else {
            follower.classList.add('active');
            follower.textContent = action.replace('-', '');
        }
    });
    
    el.addEventListener('mouseleave', () => {
        follower.classList.remove('active', 'hidden');
        follower.textContent = '';
        cursor.style.opacity = '1';
    });
});

// Magnetic Buttons
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.5,
            ease: "power2.out"
        });
        
        if (el.querySelector('span')) {
            gsap.to(el.querySelector('span'), {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
        
        if (el.querySelector('span')) {
            gsap.to(el.querySelector('span'), {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        }
    });
});

// Theme Change on Scroll
const sections = document.querySelectorAll('section[data-color]');
sections.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => updateTheme(section.getAttribute('data-color')),
        onEnterBack: () => updateTheme(section.getAttribute('data-color')),
    });
});

function updateTheme(color) {
    if (color === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

// Ensure SplitType is loaded before running text animations
window.addEventListener('load', () => {
    // Intro Animation
    const heroTimeline = gsap.timeline();

    // Split Text Initialization
    const splitTexts = document.querySelectorAll('.split-text');
    splitTexts.forEach(text => {
        const split = new SplitType(text, { types: 'words, chars' });
        
        // For hero title, animate chars immediately
        if (text.classList.contains('hero-title')) {
            heroTimeline.fromTo(split.chars, 
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.02, ease: "power4.out" },
                0.5
            );
        } else {
            // For other split texts, animate on scroll
            gsap.fromTo(split.chars, 
                { y: 50, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.8, 
                    stagger: 0.01, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: text,
                        start: "top 80%",
                    }
                }
            );
        }
    });

    // Hero Media Animation
    heroTimeline.to('.hero-media', {
        scale: 1,
        duration: 1.2,
        ease: "expo.out"
    }, 1);

    // Fade Up Elements
    const fadeUpElements = document.querySelectorAll('.fade-up');
    fadeUpElements.forEach(el => {
        // If in hero, add to timeline
        if (el.closest('.hero')) {
            heroTimeline.to(el, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }, 1.5);
        } else {
            // Otherwise, ScrollTrigger
            gsap.to(el, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                }
            });
        }
    });

    // Parallax Media
    gsap.to('.parallax-media video', {
        y: 50,
        ease: "none",
        scrollTrigger: {
            trigger: '.parallax-media',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Horizontal Scroll Projects
    const horizontalSections = gsap.utils.toArray('.horizontal-scroll-wrapper');
    
    horizontalSections.forEach(wrapper => {
        const container = wrapper.querySelector('.horizontal-scroll-container');
        
        gsap.to(container, {
            x: () => -(container.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                start: "center center",
                end: () => `+=${container.scrollWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });
    });

    // FAQ Toggle Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});