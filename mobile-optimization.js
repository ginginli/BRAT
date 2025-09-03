// 移动端体验优化JavaScript

class MobileOptimizer {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.touchStartTime = 0;
        this.longPressTimer = null;
        this.gestureState = {
            scale: 1,
            lastScale: 1,
            startDistance: 0,
            startX: 0,
            startY: 0
        };
        
        this.init();
    }
    
    init() {
        if (this.isMobile) {
            this.setupMobileLayout();
            this.setupTouchInteractions();
            this.setupGestureSupport();
            this.setupPerformanceOptimizations();
            this.setupLoadingOptimizations();
            this.setupAccessibility();
        }
        
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    // 1. 移动端布局设置
    setupMobileLayout() {
        // 创建移动端控制面板
        this.createMobileControlPanel();
        
        // 创建移动端下载按钮
        this.createMobileDownloadButton();
        
        // 创建移动端导航
        this.createMobileNavigation();
        
        // 调整预览区域
        this.adjustPreviewArea();
    }
    
    createMobileControlPanel() {
        const existingPanel = document.querySelector('.mobile-control-panel');
        if (existingPanel) return;
        
        const panel = document.createElement('div');
        panel.className = 'mobile-control-panel';
        panel.innerHTML = `
            <div class="control-group">
                <h4>文本设置</h4>
                <textarea id="mobile-text-input" placeholder="输入您的文本..." maxlength="50"></textarea>
            </div>
            
            <div class="control-group">
                <h4>背景颜色</h4>
                <div class="color-grid">
                    <div class="color-option selected" style="background-color: #8ACF01;" data-color="#8ACF01"></div>
                    <div class="color-option" style="background-color: #ffffff;" data-color="#ffffff"></div>
                    <div class="color-option" style="background-color: #000000;" data-color="#000000"></div>
                    <div class="color-option" style="background-color: #4D90CD;" data-color="#4D90CD"></div>
                    <div class="color-option" style="background-color: #ff6b6b;" data-color="#ff6b6b"></div>
                    <div class="color-option" style="background-color: #ffd93d;" data-color="#ffd93d"></div>
                </div>
                <input type="color" id="mobile-bg-color" value="#8ACF01" style="margin-top: 10px;">
            </div>
            
            <div class="control-group">
                <h4>文字颜色</h4>
                <div class="color-grid">
                    <div class="color-option selected" style="background-color: #000000;" data-color="#000000"></div>
                    <div class="color-option" style="background-color: #ffffff;" data-color="#ffffff"></div>
                    <div class="color-option" style="background-color: #8ACF01;" data-color="#8ACF01"></div>
                    <div class="color-option" style="background-color: #ff6b6b;" data-color="#ff6b6b"></div>
                    <div class="color-option" style="background-color: #4D90CD;" data-color="#4D90CD"></div>
                    <div class="color-option" style="background-color: #ffd93d;" data-color="#ffd93d"></div>
                </div>
                <input type="color" id="mobile-text-color" value="#000000" style="margin-top: 10px;">
            </div>
            
            <div class="control-group">
                <h4>字体大小</h4>
                <div class="slider-group">
                    <label>大小</label>
                    <input type="range" id="mobile-font-size" min="20" max="200" value="120">
                    <div class="value-display" id="font-size-value">120px</div>
                </div>
            </div>
            
            <div class="control-group">
                <h4>模糊效果</h4>
                <div class="slider-group">
                    <label>模糊</label>
                    <input type="range" id="mobile-blur" min="0" max="5" step="0.1" value="2">
                    <div class="value-display" id="blur-value">2px</div>
                </div>
            </div>
            
            <div class="control-group">
                <h4>主题选择</h4>
                <div class="theme-options">
                    <button class="theme-btn active" data-theme="green">绿色</button>
                    <button class="theme-btn" data-theme="black">黑色</button>
                    <button class="theme-btn" data-theme="white">白色</button>
                    <button class="theme-btn" data-theme="blue">蓝色</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.setupMobileControlEvents();
    }
    
    createMobileDownloadButton() {
        const existingBtn = document.querySelector('.mobile-download-btn');
        if (existingBtn) return;
        
        const btn = document.createElement('button');
        btn.className = 'mobile-download-btn';
        btn.innerHTML = '⬇';
        btn.setAttribute('aria-label', '下载图片');
        
        btn.addEventListener('click', () => {
            this.downloadImage();
        });
        
        document.body.appendChild(btn);
    }
    
    createMobileNavigation() {
        // 创建汉堡菜单按钮
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // 创建移动端导航菜单
        const mobileNav = document.createElement('nav');
        mobileNav.className = 'mobile-nav';
        mobileNav.innerHTML = `
            <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/brat-album-cover-maker">专辑封面制作</a></li>
                <li><a href="/meme-generator">表情包生成</a></li>
                <li><a href="/brat-different-colors">所有颜色</a></li>
                <li><a href="/services.html">服务</a></li>
                <li><a href="/portfolio.html">作品集</a></li>
                <li><a href="/contact.html">联系我们</a></li>
            </ul>
        `;
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        
        // 添加到页面
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(menuToggle);
        }
        document.body.appendChild(mobileNav);
        document.body.appendChild(overlay);
        
        // 设置事件监听
        this.setupMobileNavigationEvents(menuToggle, mobileNav, overlay);
    }
    
    // 2. 触摸交互优化
    setupTouchInteractions() {
        // 长按支持
        this.setupLongPress();
        
        // 触摸反馈
        this.setupTouchFeedback();
        
        // 防止双击缩放
        this.preventDoubleZoom();
        
        // 优化滚动
        this.optimizeScrolling();
    }
    
    setupLongPress() {
        const elements = document.querySelectorAll('.theme-btn, .color-option, .mobile-download-btn');
        
        elements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                this.touchStartTime = Date.now();
                this.longPressTimer = setTimeout(() => {
                    this.handleLongPress(e.target);
                }, 500);
            });
            
            element.addEventListener('touchend', () => {
                clearTimeout(this.longPressTimer);
            });
            
            element.addEventListener('touchmove', () => {
                clearTimeout(this.longPressTimer);
            });
        });
    }
    
    handleLongPress(element) {
        element.classList.add('long-press');
        
        // 触觉反馈
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // 长按功能
        if (element.classList.contains('theme-btn')) {
            this.showThemeInfo(element.dataset.theme);
        } else if (element.classList.contains('color-option')) {
            this.showColorInfo(element.dataset.color);
        }
        
        setTimeout(() => {
            element.classList.remove('long-press');
        }, 600);
    }
    
    setupTouchFeedback() {
        // 为所有可点击元素添加触摸反馈
        const clickableElements = document.querySelectorAll('button, .color-option, input[type="range"]');
        
        clickableElements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                element.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('touchend', (e) => {
                element.style.transform = 'scale(1)';
            });
        });
    }
    
    preventDoubleZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    optimizeScrolling() {
        // 优化滚动性能
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.mobile-control-panel')) {
                e.stopPropagation();
            }
        }, { passive: true });
    }
    
    // 3. 手势支持
    setupGestureSupport() {
        this.setupPinchZoom();
        this.setupSwipeGestures();
        this.setupSliderGestures();
    }
    
    setupPinchZoom() {
        const previewContainer = document.querySelector('.preview-container');
        if (!previewContainer) return;
        
        previewContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                this.gestureState.startDistance = this.getDistance(e.touches[0], e.touches[1]);
                this.gestureState.lastScale = this.gestureState.scale;
            }
        });
        
        previewContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = currentDistance / this.gestureState.startDistance;
                this.gestureState.scale = Math.max(0.5, Math.min(3, this.gestureState.lastScale * scale));
                
                this.applyZoom(this.gestureState.scale);
            }
        });
        
        previewContainer.addEventListener('touchend', () => {
            this.gestureState.startDistance = 0;
        });
    }
    
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    applyZoom(scale) {
        const memeContainer = document.querySelector('#meme-container');
        if (memeContainer) {
            memeContainer.style.transform = `scale(${scale})`;
            memeContainer.style.transformOrigin = 'center center';
        }
    }
    
    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // 水平滑动
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.handleSwipeLeft();
                } else {
                    this.handleSwipeRight();
                }
            }
            
            // 垂直滑动
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
                if (diffY > 0) {
                    this.handleSwipeUp();
                } else {
                    this.handleSwipeDown();
                }
            }
        });
    }
    
    handleSwipeLeft() {
        // 切换到下一个主题
        this.switchToNextTheme();
    }
    
    handleSwipeRight() {
        // 切换到上一个主题
        this.switchToPreviousTheme();
    }
    
    handleSwipeUp() {
        // 增加字体大小
        this.adjustFontSize(10);
    }
    
    handleSwipeDown() {
        // 减少字体大小
        this.adjustFontSize(-10);
    }
    
    setupSliderGestures() {
        const sliders = document.querySelectorAll('input[type="range"]');
        
        sliders.forEach(slider => {
            let isDragging = false;
            
            slider.addEventListener('touchstart', () => {
                isDragging = true;
            });
            
            slider.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    this.showSliderValue(slider);
                }
            });
            
            slider.addEventListener('touchend', () => {
                isDragging = false;
                this.hideSliderValue();
            });
        });
    }
    
    showSliderValue(slider) {
        const value = slider.value;
        const unit = slider.id.includes('font') ? 'px' : 'px';
        const display = document.getElementById(slider.id.replace('mobile-', '') + '-value');
        
        if (display) {
            display.textContent = value + unit;
        }
    }
    
    hideSliderValue() {
        // 可以添加隐藏逻辑
    }
    
    // 4. 性能优化
    setupPerformanceOptimizations() {
        this.optimizeImageGeneration();
        this.setupVirtualScrolling();
        this.optimizeDOMOperations();
    }
    
    optimizeImageGeneration() {
        // 使用 requestAnimationFrame 优化图片生成
        let isGenerating = false;
        
        const originalGenerate = window.generateMeme;
        if (originalGenerate) {
            window.generateMeme = () => {
                if (isGenerating) return;
                
                isGenerating = true;
                requestAnimationFrame(() => {
                    originalGenerate();
                    isGenerating = false;
                });
            };
        }
    }
    
    setupVirtualScrolling() {
        // 为长列表实现虚拟滚动
        const longLists = document.querySelectorAll('.color-grid, .theme-options');
        
        longLists.forEach(list => {
            if (list.children.length > 10) {
                this.implementVirtualScrolling(list);
            }
        });
    }
    
    implementVirtualScrolling(container) {
        // 简化的虚拟滚动实现
        const items = Array.from(container.children);
        const itemHeight = 50; // 假设每个项目高度
        const visibleCount = Math.ceil(container.offsetHeight / itemHeight);
        
        let startIndex = 0;
        
        const updateVisibleItems = () => {
            const endIndex = Math.min(startIndex + visibleCount, items.length);
            
            items.forEach((item, index) => {
                if (index >= startIndex && index < endIndex) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };
        
        updateVisibleItems();
    }
    
    optimizeDOMOperations() {
        // 批量DOM操作
        this.batchDOMUpdates = [];
        this.batchTimer = null;
        
        this.scheduleDOMUpdate = (callback) => {
            this.batchDOMUpdates.push(callback);
            
            if (!this.batchTimer) {
                this.batchTimer = requestAnimationFrame(() => {
                    this.batchDOMUpdates.forEach(callback => callback());
                    this.batchDOMUpdates = [];
                    this.batchTimer = null;
                });
            }
        };
    }
    
    // 5. 加载体验优化
    setupLoadingOptimizations() {
        this.setupSkeletonScreen();
        this.setupProgressiveLoading();
        this.setupOfflineSupport();
    }
    
    setupSkeletonScreen() {
        // 创建骨架屏
        const skeletonHTML = `
            <div class="skeleton-container">
                <div class="skeleton skeleton-preview"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-button"></div>
            </div>
        `;
        
        // 在内容加载前显示骨架屏
        const content = document.querySelector('.generator-container');
        if (content) {
            content.insertAdjacentHTML('beforebegin', skeletonHTML);
            
            // 内容加载完成后移除骨架屏
            window.addEventListener('load', () => {
                const skeleton = document.querySelector('.skeleton-container');
                if (skeleton) {
                    skeleton.remove();
                }
            });
        }
    }
    
    setupProgressiveLoading() {
        // 渐进式加载图片
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    setupOfflineSupport() {
        // 简单的离线支持
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // 静默失败
            });
        }
    }
    
    // 6. 可访问性优化
    setupAccessibility() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupHighContrastMode();
    }
    
    setupKeyboardNavigation() {
        // 键盘导航支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }
    
    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Shift + Tab
            if (currentIndex === 0) {
                e.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
            }
        } else {
            // Tab
            if (currentIndex === focusableElements.length - 1) {
                e.preventDefault();
                focusableElements[0].focus();
            }
        }
    }
    
    setupScreenReaderSupport() {
        // 为动态内容添加ARIA标签
        const dynamicElements = document.querySelectorAll('.mobile-control-panel, .mobile-download-btn');
        
        dynamicElements.forEach(element => {
            if (!element.getAttribute('aria-label')) {
                element.setAttribute('aria-label', element.textContent || '控制元素');
            }
        });
    }
    
    setupHighContrastMode() {
        // 检测高对比度模式
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
    }
    
    // 7. 移动端控制面板事件
    setupMobileControlEvents() {
        // 文本输入
        const textInput = document.getElementById('mobile-text-input');
        if (textInput) {
            textInput.addEventListener('input', (e) => {
                this.updateText(e.target.value);
            });
        }
        
        // 颜色选择
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectColor(e.target);
            });
        });
        
        // 滑块控制
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateSlider(e.target);
            });
        });
        
        // 主题选择
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectTheme(e.target);
            });
        });
    }
    
    setupMobileNavigationEvents(menuToggle, mobileNav, overlay) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        // 点击菜单项后关闭菜单
        const menuItems = mobileNav.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                overlay.classList.remove('active');
            });
        });
    }
    
    // 8. 工具方法
    updateText(text) {
        const textOverlay = document.querySelector('#text-overlay');
        if (textOverlay) {
            textOverlay.textContent = text;
        }
    }
    
    selectColor(element) {
        // 移除其他选中状态
        const siblings = element.parentNode.querySelectorAll('.color-option');
        siblings.forEach(sibling => sibling.classList.remove('selected'));
        
        // 添加选中状态
        element.classList.add('selected');
        
        // 更新颜色
        const color = element.dataset.color;
        const isBackground = element.closest('.control-group').querySelector('h4').textContent.includes('背景');
        
        if (isBackground) {
            this.updateBackgroundColor(color);
        } else {
            this.updateTextColor(color);
        }
    }
    
    updateBackgroundColor(color) {
        const memeContainer = document.querySelector('#meme-container');
        if (memeContainer) {
            memeContainer.style.backgroundColor = color;
        }
    }
    
    updateTextColor(color) {
        const textOverlay = document.querySelector('#text-overlay');
        if (textOverlay) {
            textOverlay.style.color = color;
        }
    }
    
    updateSlider(slider) {
        const value = slider.value;
        const unit = slider.id.includes('font') ? 'px' : 'px';
        
        if (slider.id.includes('font-size')) {
            this.updateFontSize(value);
        } else if (slider.id.includes('blur')) {
            this.updateBlur(value);
        }
        
        // 更新显示值
        const display = document.getElementById(slider.id.replace('mobile-', '') + '-value');
        if (display) {
            display.textContent = value + unit;
        }
    }
    
    updateFontSize(size) {
        const textOverlay = document.querySelector('#text-overlay');
        if (textOverlay) {
            textOverlay.style.fontSize = size + 'px';
        }
    }
    
    updateBlur(blur) {
        const textOverlay = document.querySelector('#text-overlay');
        if (textOverlay) {
            textOverlay.style.filter = `blur(${blur}px)`;
        }
    }
    
    selectTheme(button) {
        // 移除其他选中状态
        const siblings = button.parentNode.querySelectorAll('.theme-btn');
        siblings.forEach(sibling => sibling.classList.remove('active'));
        
        // 添加选中状态
        button.classList.add('active');
        
        // 应用主题
        const theme = button.dataset.theme;
        this.applyTheme(theme);
    }
    
    applyTheme(theme) {
        const memeContainer = document.querySelector('#meme-container');
        if (memeContainer) {
            // 移除所有主题类
            memeContainer.classList.remove('theme-green', 'theme-black', 'theme-white', 'theme-blue');
            // 添加新主题类
            memeContainer.classList.add(`theme-${theme}`);
        }
    }
    
    switchToNextTheme() {
        const themes = ['green', 'black', 'white', 'blue'];
        const currentButton = document.querySelector('.theme-btn.active');
        const currentIndex = themes.indexOf(currentButton.dataset.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        const nextButton = document.querySelector(`[data-theme="${themes[nextIndex]}"]`);
        if (nextButton) {
            this.selectTheme(nextButton);
        }
    }
    
    switchToPreviousTheme() {
        const themes = ['green', 'black', 'white', 'blue'];
        const currentButton = document.querySelector('.theme-btn.active');
        const currentIndex = themes.indexOf(currentButton.dataset.theme);
        const prevIndex = (currentIndex - 1 + themes.length) % themes.length;
        
        const prevButton = document.querySelector(`[data-theme="${themes[prevIndex]}"]`);
        if (prevButton) {
            this.selectTheme(prevButton);
        }
    }
    
    adjustFontSize(delta) {
        const slider = document.getElementById('mobile-font-size');
        if (slider) {
            const newValue = Math.max(20, Math.min(200, parseInt(slider.value) + delta));
            slider.value = newValue;
            this.updateSlider(slider);
        }
    }
    
    downloadImage() {
        // 显示加载状态
        this.showLoadingOverlay();
        
        // 模拟下载过程
        setTimeout(() => {
            // 这里应该调用实际的下载函数
            if (window.downloadMeme) {
                window.downloadMeme();
            }
            this.hideLoadingOverlay();
        }, 1000);
    }
    
    showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
        `;
        document.body.appendChild(overlay);
    }
    
    hideLoadingOverlay() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    showThemeInfo(theme) {
        const info = {
            green: '绿色主题 - 经典Brat风格',
            black: '黑色主题 - 简约时尚',
            white: '白色主题 - 清新简洁',
            blue: '蓝色主题 - 现代感十足'
        };
        
        this.showToast(info[theme] || '主题信息');
    }
    
    showColorInfo(color) {
        this.showToast(`颜色: ${color}`);
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 10000;
            font-size: 14px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }
    
    adjustPreviewArea() {
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
            previewContainer.style.marginBottom = '200px';
        }
    }
    
    handleResize() {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            if (this.isMobile) {
                this.setupMobileLayout();
            } else {
                this.removeMobileElements();
            }
        }
    }
    
    removeMobileElements() {
        const mobileElements = document.querySelectorAll('.mobile-control-panel, .mobile-download-btn, .mobile-nav, .nav-overlay');
        mobileElements.forEach(element => element.remove());
    }
}

// 初始化移动端优化
document.addEventListener('DOMContentLoaded', () => {
    new MobileOptimizer();
});

// 导出类供其他脚本使用
window.MobileOptimizer = MobileOptimizer;
