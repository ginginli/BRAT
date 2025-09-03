// 性能优化JavaScript

class PerformanceOptimizer {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.performanceMetrics = {
            fps: 0,
            memoryUsage: 0,
            renderTime: 0,
            lastFrameTime: 0
        };
        
        this.optimizationSettings = {
            enableVirtualScrolling: true,
            enableImageLazyLoading: true,
            enableDOMBatching: true,
            enableCanvasOptimization: true,
            enableMemoryManagement: true
        };
        
        this.init();
    }
    
    init() {
        this.setupPerformanceMonitoring();
        this.optimizeImageGeneration();
        this.setupDOMOptimizations();
        this.setupCanvasOptimizations();
        this.setupMemoryManagement();
        this.setupLazyLoading();
        this.setupVirtualScrolling();
        
        if (this.isMobile) {
            this.setupMobileOptimizations();
        }
    }
    
    // 1. 性能监控
    setupPerformanceMonitoring() {
        this.startFPSMonitoring();
        this.setupMemoryMonitoring();
        this.setupRenderTimeMonitoring();
        this.createPerformancePanel();
    }
    
    startFPSMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                this.updatePerformancePanel();
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.performanceMetrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                this.updatePerformancePanel();
            }, 1000);
        }
    }
    
    setupRenderTimeMonitoring() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'measure') {
                    this.performanceMetrics.renderTime = Math.round(entry.duration);
                    this.updatePerformancePanel();
                }
            }
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
    
    createPerformancePanel() {
        const panel = document.createElement('div');
        panel.className = 'performance-panel';
        panel.innerHTML = `
            <h3>性能监控</h3>
            <div class="performance-metric">
                <span>FPS:</span>
                <span class="value" id="fps-value">0</span>
            </div>
            <div class="performance-metric">
                <span>内存:</span>
                <span class="value" id="memory-value">0MB</span>
            </div>
            <div class="performance-metric">
                <span>渲染时间:</span>
                <span class="value" id="render-value">0ms</span>
            </div>
            <button onclick="this.parentElement.classList.toggle('visible')">切换显示</button>
        `;
        
        document.body.appendChild(panel);
        
        // 双击显示/隐藏
        panel.addEventListener('dblclick', () => {
            panel.classList.toggle('visible');
        });
    }
    
    updatePerformancePanel() {
        const fpsValue = document.getElementById('fps-value');
        const memoryValue = document.getElementById('memory-value');
        const renderValue = document.getElementById('render-value');
        
        if (fpsValue) {
            fpsValue.textContent = this.performanceMetrics.fps;
            fpsValue.className = this.performanceMetrics.fps < 30 ? 'value warning' : 'value good';
        }
        
        if (memoryValue) {
            memoryValue.textContent = this.performanceMetrics.memoryUsage + 'MB';
            memoryValue.className = this.performanceMetrics.memoryUsage > 100 ? 'value warning' : 'value good';
        }
        
        if (renderValue) {
            renderValue.textContent = this.performanceMetrics.renderTime + 'ms';
            renderValue.className = this.performanceMetrics.renderTime > 16 ? 'value warning' : 'value good';
        }
    }
    
    // 2. 图片生成优化
    optimizeImageGeneration() {
        this.setupCanvasOptimization();
        this.setupImageCaching();
        this.setupWebWorkerSupport();
    }
    
    setupCanvasOptimization() {
        // 优化Canvas渲染
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            
            // 启用硬件加速
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // 设置像素比
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * pixelRatio;
            canvas.height = canvas.offsetHeight * pixelRatio;
            ctx.scale(pixelRatio, pixelRatio);
        }
    }
    
    setupImageCaching() {
        this.imageCache = new Map();
        this.maxCacheSize = 50;
        
        // 重写图片生成函数以使用缓存
        const originalGenerate = window.generateMeme;
        if (originalGenerate) {
            window.generateMeme = () => {
                const cacheKey = this.generateCacheKey();
                
                if (this.imageCache.has(cacheKey)) {
                    this.loadFromCache(cacheKey);
                    return;
                }
                
                performance.mark('image-generation-start');
                originalGenerate();
                performance.mark('image-generation-end');
                performance.measure('image-generation', 'image-generation-start', 'image-generation-end');
                
                this.saveToCache(cacheKey);
            };
        }
    }
    
    generateCacheKey() {
        const text = document.querySelector('#text-input')?.value || '';
        const theme = document.querySelector('.theme-btn.active')?.dataset.theme || 'green';
        const fontSize = document.querySelector('#font-size')?.value || '120';
        const blur = document.querySelector('#blur')?.value || '2';
        
        return `${text}-${theme}-${fontSize}-${blur}`;
    }
    
    saveToCache(key) {
        const canvas = document.querySelector('canvas');
        if (canvas && this.imageCache.size < this.maxCacheSize) {
            const imageData = canvas.toDataURL('image/png');
            this.imageCache.set(key, imageData);
        }
    }
    
    loadFromCache(key) {
        const imageData = this.imageCache.get(key);
        if (imageData) {
            const img = document.querySelector('#meme-image');
            if (img) {
                img.src = imageData;
            }
        }
    }
    
    setupWebWorkerSupport() {
        // 为复杂的图片处理创建Web Worker
        if (typeof Worker !== 'undefined') {
            this.imageWorker = new Worker('/js/image-worker.js');
            
            this.imageWorker.onmessage = (e) => {
                const { imageData, type } = e.data;
                this.handleWorkerResult(imageData, type);
            };
        }
    }
    
    handleWorkerResult(imageData, type) {
        switch (type) {
            case 'image-processed':
                this.displayProcessedImage(imageData);
                break;
            case 'error':
                console.error('Worker error:', imageData);
                break;
        }
    }
    
    displayProcessedImage(imageData) {
        const img = document.querySelector('#meme-image');
        if (img) {
            img.src = imageData;
        }
    }
    
    // 3. DOM操作优化
    setupDOMOptimizations() {
        this.setupDOMBatching();
        this.setupVirtualDOM();
        this.setupEventDelegation();
    }
    
    setupDOMBatching() {
        this.domUpdates = [];
        this.batchTimer = null;
        
        this.scheduleDOMUpdate = (callback) => {
            this.domUpdates.push(callback);
            
            if (!this.batchTimer) {
                this.batchTimer = requestAnimationFrame(() => {
                    this.flushDOMUpdates();
                });
            }
        };
    }
    
    flushDOMUpdates() {
        // 批量执行DOM更新
        const fragment = document.createDocumentFragment();
        
        this.domUpdates.forEach(update => {
            if (typeof update === 'function') {
                update();
            }
        });
        
        this.domUpdates = [];
        this.batchTimer = null;
    }
    
    setupVirtualDOM() {
        // 简化的虚拟DOM实现
        this.virtualDOM = new Map();
        
        this.updateVirtualDOM = (element, newProps) => {
            const key = element.id || element.className;
            const oldProps = this.virtualDOM.get(key) || {};
            
            // 计算差异
            const diff = this.calculateDiff(oldProps, newProps);
            
            if (Object.keys(diff).length > 0) {
                this.applyDiff(element, diff);
                this.virtualDOM.set(key, newProps);
            }
        };
    }
    
    calculateDiff(oldProps, newProps) {
        const diff = {};
        
        for (const key in newProps) {
            if (oldProps[key] !== newProps[key]) {
                diff[key] = newProps[key];
            }
        }
        
        return diff;
    }
    
    applyDiff(element, diff) {
        for (const [key, value] of Object.entries(diff)) {
            if (key.startsWith('style.')) {
                const styleProp = key.replace('style.', '');
                element.style[styleProp] = value;
            } else if (key.startsWith('class.')) {
                const className = key.replace('class.', '');
                if (value) {
                    element.classList.add(className);
                } else {
                    element.classList.remove(className);
                }
            } else {
                element[key] = value;
            }
        }
    }
    
    setupEventDelegation() {
        // 使用事件委托减少事件监听器数量
        document.addEventListener('click', (e) => {
            if (e.target.matches('.theme-btn')) {
                this.handleThemeClick(e.target);
            } else if (e.target.matches('.color-option')) {
                this.handleColorClick(e.target);
            } else if (e.target.matches('.download-button')) {
                this.handleDownloadClick();
            }
        });
        
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="range"]')) {
                this.handleSliderInput(e.target);
            } else if (e.target.matches('textarea')) {
                this.handleTextInput(e.target);
            }
        });
    }
    
    handleThemeClick(button) {
        this.scheduleDOMUpdate(() => {
            // 移除其他按钮的active类
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 添加active类到当前按钮
            button.classList.add('active');
            
            // 应用主题
            const theme = button.dataset.theme;
            this.applyTheme(theme);
        });
    }
    
    handleColorClick(option) {
        this.scheduleDOMUpdate(() => {
            // 移除其他选项的selected类
            option.parentNode.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // 添加selected类到当前选项
            option.classList.add('selected');
            
            // 应用颜色
            const color = option.dataset.color;
            this.applyColor(color, option);
        });
    }
    
    handleDownloadClick() {
        this.scheduleDOMUpdate(() => {
            this.downloadImage();
        });
    }
    
    handleSliderInput(slider) {
        this.scheduleDOMUpdate(() => {
            const value = slider.value;
            const type = slider.id;
            
            if (type.includes('font-size')) {
                this.updateFontSize(value);
            } else if (type.includes('blur')) {
                this.updateBlur(value);
            }
        });
    }
    
    handleTextInput(textarea) {
        this.scheduleDOMUpdate(() => {
            this.updateText(textarea.value);
        });
    }
    
    // 4. Canvas优化
    setupCanvasOptimizations() {
        this.setupCanvasPooling();
        this.setupOffscreenCanvas();
        this.setupCanvasCaching();
    }
    
    setupCanvasPooling() {
        this.canvasPool = [];
        this.maxPoolSize = 5;
        
        // 预创建Canvas对象
        for (let i = 0; i < this.maxPoolSize; i++) {
            const canvas = document.createElement('canvas');
            this.canvasPool.push(canvas);
        }
    }
    
    getCanvasFromPool() {
        return this.canvasPool.pop() || document.createElement('canvas');
    }
    
    returnCanvasToPool(canvas) {
        if (this.canvasPool.length < this.maxPoolSize) {
            // 清理Canvas
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.canvasPool.push(canvas);
        }
    }
    
    setupOffscreenCanvas() {
        if (typeof OffscreenCanvas !== 'undefined') {
            this.offscreenCanvas = new OffscreenCanvas(600, 600);
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        }
    }
    
    setupCanvasCaching() {
        this.canvasCache = new Map();
        this.maxCanvasCacheSize = 20;
    }
    
    // 5. 内存管理
    setupMemoryManagement() {
        this.setupGarbageCollection();
        this.setupMemoryMonitoring();
        this.setupResourceCleanup();
    }
    
    setupGarbageCollection() {
        // 定期清理缓存
        setInterval(() => {
            this.cleanupCaches();
        }, 30000); // 每30秒清理一次
    }
    
    cleanupCaches() {
        // 清理图片缓存
        if (this.imageCache.size > this.maxCacheSize * 0.8) {
            const keys = Array.from(this.imageCache.keys());
            const keysToDelete = keys.slice(0, Math.floor(keys.length * 0.3));
            keysToDelete.forEach(key => this.imageCache.delete(key));
        }
        
        // 清理Canvas缓存
        if (this.canvasCache.size > this.maxCanvasCacheSize * 0.8) {
            const keys = Array.from(this.canvasCache.keys());
            const keysToDelete = keys.slice(0, Math.floor(keys.length * 0.3));
            keysToDelete.forEach(key => this.canvasCache.delete(key));
        }
        
        // 强制垃圾回收（如果可用）
        if (window.gc) {
            window.gc();
        }
    }
    
    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = memory.usedJSHeapSize / 1024 / 1024;
                
                // 如果内存使用超过阈值，触发清理
                if (usedMB > 150) {
                    this.cleanupCaches();
                }
            }, 5000);
        }
    }
    
    setupResourceCleanup() {
        // 页面卸载时清理资源
        window.addEventListener('beforeunload', () => {
            this.cleanupAllResources();
        });
        
        // 页面隐藏时清理资源
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanupCaches();
            }
        });
    }
    
    cleanupAllResources() {
        // 清理所有缓存
        this.imageCache?.clear();
        this.canvasCache?.clear();
        
        // 终止Web Worker
        this.imageWorker?.terminate();
        
        // 清理事件监听器
        this.removeAllEventListeners();
    }
    
    removeAllEventListeners() {
        // 移除所有自定义事件监听器
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('input', this.handleInput);
    }
    
    // 6. 懒加载
    setupLazyLoading() {
        this.setupImageLazyLoading();
        this.setupScriptLazyLoading();
        this.setupContentLazyLoading();
    }
    
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // 降级处理
            images.forEach(img => this.loadImage(img));
        }
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('lazy-loaded');
        }
    }
    
    setupScriptLazyLoading() {
        // 延迟加载非关键脚本
        const scripts = document.querySelectorAll('script[data-lazy]');
        
        scripts.forEach(script => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadScript(script);
                        observer.unobserve(script);
                    }
                });
            });
            
            observer.observe(script);
        });
    }
    
    loadScript(script) {
        const newScript = document.createElement('script');
        newScript.src = script.dataset.src;
        newScript.async = true;
        document.head.appendChild(newScript);
    }
    
    setupContentLazyLoading() {
        const sections = document.querySelectorAll('.lazy-section');
        
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });
            
            sections.forEach(section => sectionObserver.observe(section));
        }
    }
    
    // 7. 虚拟滚动
    setupVirtualScrolling() {
        const longLists = document.querySelectorAll('.virtual-scroll');
        
        longLists.forEach(list => {
            this.implementVirtualScrolling(list);
        });
    }
    
    implementVirtualScrolling(container) {
        const items = Array.from(container.children);
        const itemHeight = 50;
        const containerHeight = container.offsetHeight;
        const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
        
        let startIndex = 0;
        let endIndex = Math.min(startIndex + visibleCount, items.length);
        
        // 创建虚拟滚动容器
        const virtualContainer = document.createElement('div');
        virtualContainer.style.height = `${items.length * itemHeight}px`;
        virtualContainer.style.position = 'relative';
        
        // 创建可见项目容器
        const visibleContainer = document.createElement('div');
        visibleContainer.style.position = 'absolute';
        visibleContainer.style.top = '0';
        visibleContainer.style.left = '0';
        virtualContainer.appendChild(visibleContainer);
        
        // 替换原始容器
        container.parentNode.replaceChild(virtualContainer, container);
        
        const updateVisibleItems = () => {
            visibleContainer.innerHTML = '';
            visibleContainer.style.transform = `translateY(${startIndex * itemHeight}px)`;
            
            for (let i = startIndex; i < endIndex; i++) {
                if (items[i]) {
                    const item = items[i].cloneNode(true);
                    item.style.position = 'absolute';
                    item.style.top = `${(i - startIndex) * itemHeight}px`;
                    item.style.height = `${itemHeight}px`;
                    visibleContainer.appendChild(item);
                }
            }
        };
        
        // 监听滚动
        virtualContainer.addEventListener('scroll', () => {
            const scrollTop = virtualContainer.scrollTop;
            const newStartIndex = Math.floor(scrollTop / itemHeight);
            
            if (newStartIndex !== startIndex) {
                startIndex = newStartIndex;
                endIndex = Math.min(startIndex + visibleCount, items.length);
                updateVisibleItems();
            }
        });
        
        updateVisibleItems();
    }
    
    // 8. 移动端优化
    setupMobileOptimizations() {
        this.setupTouchOptimization();
        this.setupMobilePerformance();
        this.setupBatteryOptimization();
    }
    
    setupTouchOptimization() {
        // 优化触摸事件
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // 使用passive事件监听器
        document.addEventListener('touchmove', (e) => {
            // 处理触摸移动
        }, { passive: true });
    }
    
    setupMobilePerformance() {
        // 降低移动端的渲染质量以提高性能
        if (this.isMobile) {
            this.optimizationSettings.enableCanvasOptimization = false;
            this.optimizationSettings.enableVirtualScrolling = true;
        }
    }
    
    setupBatteryOptimization() {
        // 检测电池状态
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2) {
                    // 低电量时降低性能要求
                    this.enableLowPowerMode();
                }
            });
        }
    }
    
    enableLowPowerMode() {
        // 启用低功耗模式
        this.optimizationSettings.enableCanvasOptimization = false;
        this.optimizationSettings.enableImageLazyLoading = false;
        
        // 降低动画帧率
        this.targetFPS = 30;
    }
    
    // 9. 工具方法
    applyTheme(theme) {
        const memeContainer = document.querySelector('#meme-container');
        if (memeContainer) {
            memeContainer.classList.remove('theme-green', 'theme-black', 'theme-white', 'theme-blue');
            memeContainer.classList.add(`theme-${theme}`);
        }
    }
    
    applyColor(color, element) {
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
    
    updateText(text) {
        const textOverlay = document.querySelector('#text-overlay');
        if (textOverlay) {
            textOverlay.textContent = text;
        }
    }
    
    downloadImage() {
        // 优化的图片下载
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'brat-generator.png';
            link.href = canvas.toDataURL('image/png', 0.9);
            link.click();
        }
    }
}

// 初始化性能优化
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// 导出类供其他脚本使用
window.PerformanceOptimizer = PerformanceOptimizer;
