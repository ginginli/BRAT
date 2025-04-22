// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // 等待 LanguageSwitcher 初始化
    function waitForLanguageSwitcher(callback, maxAttempts = 10) {
        let attempts = 0;
        
        function checkLanguageSwitcher() {
            attempts++;
            console.log(`Checking for LanguageSwitcher (attempt ${attempts})`);
            
            if (window.langSwitcher) {
                console.log('LanguageSwitcher found, initializing app');
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(checkLanguageSwitcher, 100);
            } else {
                console.warn('LanguageSwitcher not found after timeout, initializing app anyway');
                callback();
            }
        }
        
        checkLanguageSwitcher();
    }
    
    waitForLanguageSwitcher(function() {
        // Initialize app
        initializeApp();
    });
    
    function initializeApp() {
        console.log('Initializing app...');
        
        // Get DOM elements
        const textInput = document.getElementById('text-input');
        const memeContainer = document.getElementById('meme-container');
        const downloadBtn = document.getElementById('download-btn');
        const themeGreen = document.getElementById('theme-green');
        const themeBlack = document.getElementById('theme-black');
        const themeWhite = document.getElementById('theme-white');
        const themeBlue = document.getElementById('theme-blue');
        const autoWrapCheckbox = document.getElementById('auto-wrap');
        const fontSizeSlider = document.getElementById('font-size-slider');
        
        // Log element status
        console.log('Elements found:', {
            textInput: !!textInput,
            memeContainer: !!memeContainer,
            downloadBtn: !!downloadBtn,
            themeGreen: !!themeGreen,
            themeBlack: !!themeBlack,
            themeWhite: !!themeWhite,
            themeBlue: !!themeBlue,
            autoWrapCheckbox: !!autoWrapCheckbox,
            fontSizeSlider: !!fontSizeSlider
        });

        // 确保所有必需的元素都存在
        if (!textInput || !memeContainer || !downloadBtn || 
            !themeGreen || !themeBlack || !themeWhite || !themeBlue || 
            !autoWrapCheckbox || !fontSizeSlider) {
            console.error('Some required elements are missing');
            return;
        }
        
        // 清空 memeContainer 中的原有元素
        while (memeContainer.firstChild) {
            memeContainer.removeChild(memeContainer.firstChild);
        }
        
        // 创建预览 Canvas
        const previewCanvas = document.createElement('canvas');
        
        // 设置 Canvas 尺寸为固定的 600x600
        const canvasWidth = 600;
        const canvasHeight = 600;
        previewCanvas.width = canvasWidth;
        previewCanvas.height = canvasHeight;
        
        // 设置显示尺寸
        previewCanvas.style.width = '100%';
        previewCanvas.style.height = 'auto';
        previewCanvas.style.maxWidth = canvasWidth + 'px';
        previewCanvas.style.display = 'block';
        previewCanvas.style.margin = '0 auto';
        
        // 将 Canvas 添加到容器
        memeContainer.appendChild(previewCanvas);
        
        // 主题颜色配置
        const themeColors = {
            'green': '#8ACF01',
            'black': '#000000',
            'white': '#FFFFFF',
            'blue': '#4D90CD'
        };
        
        // 文字颜色配置
        const textColors = {
            'green': '#000000',
            'black': '#FFFFFF',
            'white': '#000000',
            'blue': '#FF0000'
        };
        
        // 当前状态
        let currentTheme = 'green';
        let currentText = 'brat';
        let fontSizeFactor = 1.0;
        
        // 初始化文本输入框的值
        textInput.value = currentText;
        
        // 统一的渲染函数
        function renderBratCanvas(canvas, options) {
            const { text, theme, fontSizeFactor, isAutoWrap } = options;
            const ctx = canvas.getContext('2d');
            
            // 检测设备类型和像素比
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const pixelRatio = window.devicePixelRatio || 1;
            
            // 清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 绘制背景
            ctx.fillStyle = themeColors[theme];
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 如果没有文字，直接返回
            if (!text) return;
            
            // 对移动设备使用预渲染模糊方法，桌面设备使用原有方法
            if (isMobile) {
                // 移动设备使用预渲染模糊方法
                console.log("Using pre-rendered blur method for mobile device");
                renderPrerenderedBlurText(canvas, text, theme, fontSizeFactor, isAutoWrap);
            } else {
                // 桌面设备使用原有的Canvas滤镜方法
                console.log("Using standard Canvas filter blur for desktop device");
                renderStandardBlurText(canvas, text, theme, fontSizeFactor, isAutoWrap);
            }
        }
        
        // 桌面设备使用的标准Canvas滤镜方法
        function renderStandardBlurText(canvas, text, theme, fontSizeFactor, isAutoWrap) {
            const ctx = canvas.getContext('2d');
            
            // 重置变换
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            
            // 确保属性设置正确
            ctx.globalAlpha = 1.0;
            ctx.imageSmoothingEnabled = true;
            ctx.globalCompositeOperation = 'source-over';
            
            // 计算基础字体大小
            let fontSize = 120 * fontSizeFactor;
            
            // 设置文字渲染属性
            ctx.filter = 'blur(2px)';
            ctx.fillStyle = textColors[theme];
            ctx.font = `normal ${fontSize}px 'Arial Narrow', Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 应用变换
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(0.85, 1);
            
            // 处理文字自动换行
            if (isAutoWrap) {
                const maxWidth = (canvas.width * 0.8) / 0.85;
                const words = text.split('');
                let lines = [];
                let currentLine = '';
                
                for (let word of words) {
                    const testLine = currentLine + word;
                    const metrics = ctx.measureText(testLine);
                    
                    if (metrics.width > maxWidth && currentLine !== '') {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                }
                lines.push(currentLine);
                
                // 调整字体大小以适应容器
                const lineHeight = fontSize * 1.2;
                const totalHeight = lines.length * lineHeight;
                
                if (totalHeight > canvas.height * 0.8) {
                    const scale = (canvas.height * 0.8) / totalHeight;
                    fontSize *= scale;
                    ctx.font = `normal ${fontSize}px 'Arial Narrow', Arial, sans-serif`;
                }
                
                // 绘制多行文字
                const adjustedLineHeight = fontSize * 1.2;
                const adjustedTotalHeight = lines.length * adjustedLineHeight;
                const startY = -adjustedTotalHeight / 2;
                
                lines.forEach((line, index) => {
                    const letters = line.split('');
                    const spacedText = letters.join('\u200B');
                    ctx.fillText(
                        spacedText,
                        0,
                        startY + (index * adjustedLineHeight) + adjustedLineHeight / 2
                    );
                });
            } else {
                // 单行文字
                const letters = text.split('');
                const spacedText = letters.join('\u200B');
                const metrics = ctx.measureText(spacedText);
                
                // 调整字体大小以适应容器宽度
                if (metrics.width > canvas.width * 0.8) {
                    const scale = (canvas.width * 0.8) / metrics.width;
                    fontSize *= scale;
                    ctx.font = `normal ${fontSize}px 'Arial Narrow', Arial, sans-serif`;
                }
                
                ctx.fillText(spacedText, 0, 0);
            }
            
            ctx.restore();
        }
        
        // 移动设备使用的预渲染模糊方法
        function renderPrerenderedBlurText(canvas, text, theme, fontSizeFactor, isAutoWrap) {
            const ctx = canvas.getContext('2d');
            
            // 步骤1: 创建离屏Canvas，用于渲染清晰文本
            const clearTextCanvas = document.createElement('canvas');
            clearTextCanvas.width = canvas.width * 2; // 更高分辨率以获得更好的模糊效果
            clearTextCanvas.height = canvas.height * 2;
            const clearCtx = clearTextCanvas.getContext('2d');
            
            // 获取当前主题的文本颜色
            const textColor = textColors[theme];
            console.log(`Theme: ${theme}, Text color: ${textColor}`);
            
            // 步骤2: 先在高分辨率Canvas上渲染清晰文本
            const fontSize = 120 * fontSizeFactor * 2; // 由于Canvas尺寸加倍，字体也需要加倍
            clearCtx.fillStyle = textColor;
            clearCtx.font = `normal ${fontSize}px 'Arial Narrow', Arial, sans-serif`;
            clearCtx.textAlign = 'center';
            clearCtx.textBaseline = 'middle';
            clearCtx.save();
            clearCtx.translate(clearTextCanvas.width / 2, clearTextCanvas.height / 2);
            clearCtx.scale(0.85, 1);
            
            // 处理文字渲染
            let renderedWidth, renderedHeight;
            
            if (isAutoWrap) {
                const maxWidth = (clearTextCanvas.width * 0.8) / 0.85;
                const words = text.split('');
                let lines = [];
                let currentLine = '';
                
                for (let word of words) {
                    const testLine = currentLine + word;
                    const metrics = clearCtx.measureText(testLine);
                    
                    if (metrics.width > maxWidth && currentLine !== '') {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                }
                lines.push(currentLine);
                
                // 调整字体大小以适应容器
                let adjustedFontSize = fontSize;
                const lineHeight = fontSize * 1.2;
                const totalHeight = lines.length * lineHeight;
                
                if (totalHeight > clearTextCanvas.height * 0.8) {
                    const scale = (clearTextCanvas.height * 0.8) / totalHeight;
                    adjustedFontSize = fontSize * scale;
                    clearCtx.font = `normal ${adjustedFontSize}px 'Arial Narrow', Arial, sans-serif`;
                }
                
                // 绘制多行文字
                const adjustedLineHeight = adjustedFontSize * 1.2;
                const adjustedTotalHeight = lines.length * adjustedLineHeight;
                const startY = -adjustedTotalHeight / 2;
                
                renderedWidth = 0;
                lines.forEach((line, index) => {
                    const letters = line.split('');
                    const spacedText = letters.join('\u200B');
                    const metrics = clearCtx.measureText(spacedText);
                    renderedWidth = Math.max(renderedWidth, metrics.width);
                    
                    clearCtx.fillText(
                        spacedText,
                        0,
                        startY + (index * adjustedLineHeight) + adjustedLineHeight / 2
                    );
                });
                renderedHeight = adjustedTotalHeight;
            } else {
                // 单行文字
                const letters = text.split('');
                const spacedText = letters.join('\u200B');
                const metrics = clearCtx.measureText(spacedText);
                renderedWidth = metrics.width;
                renderedHeight = fontSize;
                
                // 调整字体大小以适应容器宽度
                if (metrics.width > clearTextCanvas.width * 0.8) {
                    const scale = (clearTextCanvas.width * 0.8) / metrics.width;
                    const adjustedFontSize = fontSize * scale;
                    clearCtx.font = `normal ${adjustedFontSize}px 'Arial Narrow', Arial, sans-serif`;
                    renderedHeight = adjustedFontSize;
                }
                
                clearCtx.fillText(spacedText, 0, 0);
            }
            
            clearCtx.restore();
            
            // 步骤3: 创建模糊Canvas
            const blurredCanvas = document.createElement('canvas');
            blurredCanvas.width = clearTextCanvas.width;
            blurredCanvas.height = clearTextCanvas.height;
            const blurCtx = blurredCanvas.getContext('2d');
            
            // 步骤4: 应用简单的模糊效果，保持原始颜色
            applySimpleBlur(clearTextCanvas, blurredCanvas);
            
            // 步骤5: 将处理后的模糊文本绘制到目标Canvas
            ctx.save();
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(
                blurredCanvas, 
                0, 0, blurredCanvas.width, blurredCanvas.height,
                0, 0, canvas.width, canvas.height
            );
            ctx.restore();
            
            // 简单模糊函数，保持原始颜色
            function applySimpleBlur(sourceCanvas, destCanvas) {
                const destCtx = destCanvas.getContext('2d');
                const width = destCanvas.width;
                const height = destCanvas.height;
                
                // 清空目标画布
                destCtx.clearRect(0, 0, width, height);
                
                // 创建临时画布
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const tempCtx = tempCanvas.getContext('2d');
                
                // 复制原始图像到临时Canvas
                tempCtx.drawImage(sourceCanvas, 0, 0);
                
                // 原始清晰图像保持较高权重
                destCtx.globalAlpha = 0.7; // 提高清晰图像的权重到0.7
                destCtx.drawImage(sourceCanvas, 0, 0);
                
                // 应用更强的模糊效果
                const blurRadius = 10; // 增加模糊半径到10px，观察极端情况
                const iterations = 8; // 保持迭代次数不变
                
                for (let i = 0; i < iterations; i++) {
                    const angle = (Math.PI * 2 * i) / iterations;
                    const dx = Math.cos(angle) * blurRadius;
                    const dy = Math.sin(angle) * blurRadius;
                    destCtx.globalAlpha = 0.04; // 保持模糊层的透明度不变
                    destCtx.drawImage(tempCanvas, dx, dy);
                }
                
                // 恢复Alpha
                destCtx.globalAlpha = 1.0;
            }
        }
        
        // 更新预览
        function updatePreview() {
            renderBratCanvas(previewCanvas, {
                text: currentText,
                theme: currentTheme,
                fontSizeFactor: fontSizeFactor,
                isAutoWrap: autoWrapCheckbox.checked
            });
        }
        
        // 事件监听器
        textInput.addEventListener('input', function() {
            currentText = this.value;
            updatePreview();
        });
        
        // Theme switching with error handling
        if (themeGreen) {
            themeGreen.addEventListener('click', () => {
                console.log('Green theme clicked');
                currentTheme = 'green';
                if (!currentText) {
                    currentText = 'brat';
                    textInput.value = currentText;
                }
                updatePreview();
                updateThemeButtons();
            });
        }
        
        if (themeBlack) {
            themeBlack.addEventListener('click', () => {
                console.log('Black theme clicked');
                currentTheme = 'black';
                if (!currentText) {
                    currentText = 'brat';
                    textInput.value = currentText;
                }
                updatePreview();
                updateThemeButtons();
            });
        }
        
        if (themeWhite) {
            themeWhite.addEventListener('click', () => {
                console.log('White theme clicked');
                currentTheme = 'white';
                if (!currentText) {
                    currentText = 'brat';
                    textInput.value = currentText;
                }
                updatePreview();
                updateThemeButtons();
            });
        }
        
        if (themeBlue) {
            themeBlue.addEventListener('click', () => {
                console.log('Blue theme clicked');
                currentTheme = 'blue';
                if (!currentText) {
                    currentText = 'brat';
                    textInput.value = currentText;
                }
                updatePreview();
                updateThemeButtons();
            });
        }
        
        // 更新主题按钮状态
        function updateThemeButtons() {
            [themeGreen, themeBlack, themeWhite, themeBlue].forEach(btn => {
                btn.classList.remove('active');
            });
            
            switch(currentTheme) {
                case 'green': themeGreen.classList.add('active'); break;
                case 'black': themeBlack.classList.add('active'); break;
                case 'white': themeWhite.classList.add('active'); break;
                case 'blue': themeBlue.classList.add('active'); break;
            }
        }
        
        // 自动换行切换
        autoWrapCheckbox.addEventListener('change', updatePreview);
        
        // 字体大小滑块
        fontSizeSlider.addEventListener('input', function() {
            fontSizeFactor = this.value / 100;
            updatePreview();
        });
        
        // Download button event listener
        downloadBtn.addEventListener('click', function() {
            // Show loading animation
            const loadingAnimation = document.getElementById('loading-animation');
            if (loadingAnimation) {
                loadingAnimation.style.display = 'flex';
            }
            
            // 创建导出用的 canvas，固定尺寸为 600x600
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = 600;
            exportCanvas.height = 600;
            
            // 使用相同的渲染逻辑
            renderBratCanvas(exportCanvas, {
                text: currentText,
                theme: currentTheme,
                fontSizeFactor: fontSizeFactor,
                isAutoWrap: autoWrapCheckbox.checked
            });
            
            // 导出图片
            const link = document.createElement('a');
            link.download = 'brat-generator.png';
            link.href = exportCanvas.toDataURL('image/png', 1.0);
            link.click();
            
            // Hide loading animation
            if (loadingAnimation) {
                loadingAnimation.style.display = 'none';
            }
        });
        
        // 初始化
        updateThemeButtons();
        updatePreview();
    }

    // Add structured data
    function addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Brat Generator - Free Online Charli XCX Brat Text Generator",
            "description": "Create customized text in the style of Charli XCX's Brat album cover with our free online generator",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        };
        
        const faqStructuredData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is the Brat Generator?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The Brat Generator is a free online tool that allows you to create text in the style of Charli XCX's 'Brat' album cover. You can customize the text and choose from multiple themes including the iconic green background from the album."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is Charli XCX's Brat album?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Brat is the sixth studio album by English singer-songwriter Charli XCX, released in 2023. The album features a distinctive minimalist green cover with blurred text, which has become an iconic visual style and internet phenomenon."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How does the Brat text generator work?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our Brat text generator lets you input your own text, select from different color themes (including the iconic green), and generate an image that mimics the style of Charli XCX's Brat album cover. The tool applies the right font, blur effect, and styling to match the album aesthetic."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Can I use the Brat text generator for social media?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes! The Brat Generator is perfect for creating social media posts, profile pictures, or any content where you want to embrace the Brat aesthetic. Simply download your created image and share it on your favorite platform."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Is the Brat Generator free to use?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, the Brat Generator is completely free to use. You can create as many images as you like with no cost or account registration required."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What themes are available in the Brat Generator?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We offer multiple themes including the iconic green (same as Charli XCX's album cover), black, white, and blue variations, allowing you to customize your Brat style text to match your personal preference."
                    }
                }
            ]
        };
        
        // 添加主应用结构化数据
        const appScript = document.createElement('script');
        appScript.type = 'application/ld+json';
        appScript.text = JSON.stringify(structuredData);
        document.head.appendChild(appScript);
        
        // 添加FAQ结构化数据
        const faqScript = document.createElement('script');
        faqScript.type = 'application/ld+json';
        faqScript.text = JSON.stringify(faqStructuredData);
        document.head.appendChild(faqScript);
    }

    addStructuredData();
});