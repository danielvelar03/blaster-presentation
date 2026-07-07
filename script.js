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
        
        // CORREÇÃO DA TELA BRANCA: Força a renderização imediata da opacidade
        setTimeout(checkAnimationVisibility, 30);
    }
    const bodyClass = document.body.className;
    setLanguage(bodyClass.includes('lang-pt') ? 'pt' : 'en');


    /* --- ANIMAÇÕES DE SCROLL PADRÃO (SÓ ENTRADA / REVERTIDO) --- */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Aparece e fica fixo
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Forçador de visibilidade para evitar bugs ao trocar de língua
    function checkAnimationVisibility() {
        const elements = document.querySelectorAll('.fade-in-up');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('visible');
            }
        });
    }


    /* --- BOTÕES MAGNÉTICOS --- */
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

});


/* --- LÓGICA DO CARROSSEL V16 (RITMO FIXO 2.5S / SEM DUPLO SALTO) --- */
window.addEventListener('load', () => {
    const track = document.getElementById('logo-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const wrapper = document.querySelector('.carousel-wrapper');
    let isTransitioning = false;
    let autoSlideInterval;

    function getSlideAmount() {
        const firstLogo = track.firstElementChild;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        return firstLogo.offsetWidth + gap; 
    }

    function slideNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        const slideAmount = getSlideAmount();

        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = `translateX(-${slideAmount}px)`;

        track.addEventListener('transitionend', function onTransitionEnd(e) {
            if (e.target !== track) return; // Ignora o ruído do mouse hover interno
            
            track.style.transition = 'none';
            track.appendChild(track.firstElementChild);
            track.style.transform = 'translateX(0)';
            track.removeEventListener('transitionend', onTransitionEnd);
            isTransitioning = false;
        });
    }

    function slidePrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        const slideAmount = getSlideAmount();

        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform = `translateX(-${slideAmount}px)`;

        track.offsetHeight; // Force reflow

        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = 'translateX(0)';

        track.addEventListener('transitionend', function onTransitionEnd(e) {
            if (e.target !== track) return; 
            
            track.removeEventListener('transitionend', onTransitionEnd);
            isTransitioning = false;
        });
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(slideNext, 2500);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    startAutoSlide();

    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoSlide);
        wrapper.addEventListener('mouseleave', startAutoSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            slideNext();
            startAutoSlide(); 
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            slidePrev();
            startAutoSlide(); 
        });
    }
});