document.addEventListener('DOMContentLoaded', function() {
    // تحديث سنة حقوق النشر
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // معرض الصور
    const slider = document.querySelector('.gallery-slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    let isAnimating = false;
    let startX = 0;
    let currentX = 0;
    let slideInterval;
    const slideCount = slides.length;

    // تهيئة المعرض
    function initSlider() {
        // تعيين العرض المناسب للشرائح
        slides.forEach(slide => {
            slide.style.width = '100%';
        });
        
        // بدء التشغيل التلقائي
        startAutoSlide();
        
        // إضافة أحداث السحب للمس الشاشات
        setupTouchEvents();
    }

    // التشغيل التلقائي
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            goToSlide((currentIndex + 1) % slideCount);
        }, 5000);
    }

    // إيقاف التشغيل التلقائي
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // الانتقال لشريحة محددة
    function goToSlide(index) {
        if (isAnimating || index === currentIndex) return;
        
        isAnimating = true;
        currentIndex = index;
        
        // تحديث المؤشرات
        updateIndicators();
        
        // الحركة السلسة
        slider.style.transition = 'transform 0.7s ease-in-out';
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // إعادة التشغيل التلقائي بعد الانتقال
        setTimeout(() => {
            isAnimating = false;
            stopAutoSlide();
            startAutoSlide();
        }, 700);
    }

    // تحديث المؤشرات
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // أحداث السحب للمس الشاشات
    function setupTouchEvents() {
        slider.addEventListener('touchstart', handleTouchStart, { passive: false });
        slider.addEventListener('touchmove', handleTouchMove, { passive: false });
        slider.addEventListener('touchend', handleTouchEnd);
        
        // لأجهزة الكمبيوتر
        slider.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleTouchStart(e) {
        stopAutoSlide();
        startX = e.touches[0].clientX;
        currentX = startX;
        slider.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (!startX) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        slider.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
        e.preventDefault();
    }

    function handleTouchEnd() {
        if (!startX) return;
        
        const diff = currentX - startX;
        
        // تحديد إذا كان السحب كافيًا لتغيير الشريحة
        if (Math.abs(diff) > 100) {
            if (diff > 0 && currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else if (diff < 0 && currentIndex < slideCount - 1) {
                goToSlide(currentIndex + 1);
            } else {
                resetSlidePosition();
            }
        } else {
            resetSlidePosition();
        }
        
        startX = 0;
        currentX = 0;
    }

    function handleMouseDown(e) {
        stopAutoSlide();
        startX = e.clientX;
        currentX = startX;
        slider.style.transition = 'none';
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (!startX) return;
        currentX = e.clientX;
        const diff = currentX - startX;
        slider.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
    }

    function handleMouseUp() {
        if (!startX) return;
        
        const diff = currentX - startX;
        
        if (Math.abs(diff) > 100) {
            if (diff > 0 && currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else if (diff < 0 && currentIndex < slideCount - 1) {
                goToSlide(currentIndex + 1);
            } else {
                resetSlidePosition();
            }
        } else {
            resetSlidePosition();
        }
        
        startX = 0;
        currentX = 0;
    }

    function resetSlidePosition() {
        slider.style.transition = 'transform 0.3s ease';
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        startAutoSlide();
    }

    // أحداث الأزرار
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < slideCount - 1) {
            goToSlide(currentIndex + 1);
        }
    });

    // أحداث المؤشرات
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // بدء المعرض
    initSlider();

    // إيقاف التشغيل التلقائي عند تحويم الماوس
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
});