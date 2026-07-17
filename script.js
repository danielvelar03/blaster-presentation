document.addEventListener('DOMContentLoaded', () => {

    /* --- LÓGICA DO IDIOMA SEM FALHAS --- */
    window.setLanguage = function(lang) {
        const body = document.body;
        const btnPt = document.getElementById('btn-pt');
        const btnEn = document.getElementById('btn-en');

        if (lang === 'pt') {
            body.className = 'lang-pt';
            if (btnPt) btnPt.classList.add('active');
            if (btnEn) btnEn.classList.remove('active');
        } else if (lang === 'en') {
            body.className = 'lang-en';
            if (btnEn) btnEn.classList.add('active');
            if (btnPt) btnPt.classList.remove('active');
        }
        
        setTimeout(checkAnimationVisibility, 30);
    }
    const bodyClass = document.body.className;
    setLanguage(bodyClass.includes('lang-pt') ? 'pt' : 'en');


    /* --- ANIMAÇÕES DE SCROLL (ENTRADA E SAÍDA ATIVAS) --- */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');   
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    function checkAnimationVisibility() {
        const elements = document.querySelectorAll('.fade-in-up');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
            }
        });
    }

    /* --- BOTÕES MAGNÉTICOS --- */
    if (window.innerWidth > 768) {
        const magnetics = document.querySelectorAll('.magnetic');
        magnetics.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'none'; 
            });

            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                btn.style.transform = `translate(0px, 0px)`;
            });
        });
    }

});


/* --- LÓGICA DO CARROSSEL NOVO (OPACIDADE DA IMAGEM E FADE) --- */
window.addEventListener('load', () => {
    const track = document.getElementById('logo-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const wrapper = document.querySelector('.carousel-wrapper');
    
    let isAnimating = false;
    let autoPlayInterval;

    function getVisibleCount() {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--logos-visiveis').trim()) || 5;
    }

    function updateVisibleClasses(action) {
        if (!track) return;
        const visibleCount = getVisibleCount();
        const slides = track.children;

        if (action === 'next') {
            slides[0].classList.remove('is-visible');
            if(slides[visibleCount]) slides[visibleCount].classList.add('is-visible');
        } else if (action === 'prev') {
            slides[0].classList.add('is-visible');
            if(slides[visibleCount]) slides[visibleCount].classList.remove('is-visible');
        } else {
            for (let i = 0; i < slides.length; i++) {
                if (i < visibleCount) {
                    slides[i].classList.add('is-visible');
                } else {
                    slides[i].classList.remove('is-visible');
                }
            }
        }
    }

    if (track) updateVisibleClasses('init');

    function getSlideWidth() {
        if (!track || !track.firstElementChild) return 0;
        return track.firstElementChild.getBoundingClientRect().width;
    }

    function moveNext() {
        if (isAnimating || !track) return; 
        isAnimating = true;

        const slideWidth = getSlideWidth();

        updateVisibleClasses('next');

        track.style.transition = 'transform 0.8s ease-in-out';
        track.style.transform = `translateX(-${slideWidth}px)`;

        setTimeout(() => {
            track.style.transition = 'none'; 
            track.appendChild(track.firstElementChild); 
            track.style.transform = 'translateX(0)'; 
            
            track.offsetHeight; 
            isAnimating = false; 
        }, 800);
    }

    function movePrev() {
        if (isAnimating || !track) return;
        isAnimating = true;

        const slideWidth = getSlideWidth();

        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform = `translateX(-${slideWidth}px)`;

        track.offsetHeight; 

        updateVisibleClasses('prev');

        track.style.transition = 'transform 0.8s ease-in-out';
        track.style.transform = 'translateX(0)';

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(moveNext, 2500); 
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay(); 
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            moveNext();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            movePrev();
            resetAutoPlay();
        });
    }

    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        wrapper.addEventListener('mouseleave', startAutoPlay);
    }

    window.addEventListener('resize', () => {
        if (!isAnimating && track) {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
            updateVisibleClasses('init');
        }
    });

    startAutoPlay();
});

/* --- CONTROLO DA SETA VOLTAR AO TOPO & SMOOTH SCROLL --- */
document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 250) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const sideLinks = document.querySelectorAll('.side-navigation a[href^="#"]');
    sideLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#top') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});