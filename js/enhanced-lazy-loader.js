/**
 * 增强型懒加载脚本 - 使用Intersection Observer API
 * 处理页面内容区块和图片的懒加载
 */

(function() {
    // 懒加载页面内容区块
    function setupSectionLazyLoading() {
        // 要懒加载的区块选择器 - 这些区块会在滚动到可见区域时加载
        const lazyLoadSections = [
            '#features',
            '#what-is',
            '#how-it-works',
            '#why-use',
            '#gallery',
            '#faq',
            '#testimonials'
        ];
        
        // 获取所有懒加载区块
        const sections = [];
        lazyLoadSections.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                // 添加懒加载样式类
                section.classList.add('lazy-section');
                sections.push(section);
            }
        });
        
        // 如果没有区块需要懒加载，则直接返回
        if (sections.length === 0) return;
        
        // 创建交叉观察器
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 当区块进入视口时
                    const section = entry.target;
                    
                    // 添加已加载标记
                    section.classList.add('loaded');
                    
                    // 停止观察已加载的区块
                    observer.unobserve(section);
                    
                    console.log(`Lazy loaded section: ${section.id}`);
                }
            });
        }, {
            // 在元素进入视口前200px开始加载，以确保流畅的用户体验
            rootMargin: '200px',
            threshold: 0.01 // 只要有1%的元素可见就触发
        });
        
        // 开始观察所有懒加载区块
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // 懒加载图片
    function setupImageLazyLoading() {
        // 查找所有带有data-lazy-src属性的图片
        const lazyImages = document.querySelectorAll('img[data-lazy-src]');
        
        // 如果没有图片需要懒加载，则直接返回
        if (lazyImages.length === 0) return;
        
        // 创建交叉观察器
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 从data-lazy-src加载真实图片
                    if (img.dataset.lazySrc) {
                        img.src = img.dataset.lazySrc;
                        
                        // 加载完成后删除data-lazy-src属性
                        img.removeAttribute('data-lazy-src');
                        
                        // 添加已加载标记
                        img.classList.add('lazy-loaded');
                    }
                    
                    // 停止观察已加载的图片
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px', // 在图片进入视口前200px开始加载
            threshold: 0.01 // 只要有1%的图片可见就触发
        });
        
        // 开始观察所有懒加载图片
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }
    
    // 懒加载SVG图标
    function setupSvgLazyLoading() {
        // 查找所有带有lazy-load-svg类的元素
        const lazySvgs = document.querySelectorAll('.lazy-load-svg');
        
        // 如果没有SVG需要懒加载，则直接返回
        if (lazySvgs.length === 0) return;
        
        // 创建交叉观察器
        const svgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 添加已加载标记
                    entry.target.classList.add('loaded');
                    
                    // 停止观察已加载的SVG
                    svgObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '200px', // 在SVG进入视口前200px开始加载
            threshold: 0.01 // 只要有1%的SVG可见就触发
        });
        
        // 开始观察所有懒加载SVG
        lazySvgs.forEach(svg => {
            svgObserver.observe(svg);
        });
    }
    
    // 兼容性检查 - 如果浏览器不支持Intersection Observer，则直接加载所有内容
    function loadAllContent() {
        // 加载所有区块
        document.querySelectorAll('.lazy-section').forEach(section => {
            section.classList.add('loaded');
        });
        
        // 加载所有图片
        document.querySelectorAll('img[data-lazy-src]').forEach(img => {
            if (img.dataset.lazySrc) {
                img.src = img.dataset.lazySrc;
                img.removeAttribute('data-lazy-src');
                img.classList.add('lazy-loaded');
            }
        });
        
        // 加载所有SVG
        document.querySelectorAll('.lazy-load-svg').forEach(svg => {
            svg.classList.add('loaded');
        });
    }
    
    // 初始化函数
    function init() {
        // 检查浏览器是否支持Intersection Observer
        if ('IntersectionObserver' in window) {
            // 设置区块懒加载
            setupSectionLazyLoading();
            
            // 设置图片懒加载
            setupImageLazyLoading();
            
            // 设置SVG懒加载
            setupSvgLazyLoading();
        } else {
            // 如果不支持，则直接加载所有内容
            console.log('Intersection Observer not supported, loading all content');
            loadAllContent();
        }
    }
    
    // 当DOM加载完成后初始化懒加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 