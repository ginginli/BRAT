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
            
            // 重置变换
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            
            // 确保属性设置正确
            ctx.globalAlpha = 1.0;
            ctx.imageSmoothingEnabled = true;
            ctx.globalCompositeOperation = 'source-over';
            
            // 清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 绘制背景
            ctx.fillStyle = themeColors[theme];
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 如果没有文字，直接返回
            if (!text) return;
            
            // 计算基础字体大小
            let fontSize = 120 * fontSizeFactor;
            
            // 检测设备类型和像素比
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const pixelRatio = window.devicePixelRatio || 1;
            
            // 根据设备类型和像素比调整模糊参数
            let blurSize = 2; // 默认模糊值
            
            if (isMobile) {
                // 移动设备上调整模糊值 - 增加模糊强度
                if (pixelRatio >= 3) {
                    blurSize = 2.5; // 超高DPI设备增加模糊值
                    console.log(`High DPI mobile device (${pixelRatio}x), increasing blur to: ${blurSize}`);
                } else if (pixelRatio >= 2) {
                    blurSize = 2.8; // 高DPI设备进一步提高模糊值
                    console.log(`Medium-high DPI mobile device (${pixelRatio}x), increasing blur to: ${blurSize}`);
                } else {
                    blurSize = 3.0; // 标准DPI移动设备也增加模糊
                    console.log(`Standard DPI mobile device, using higher blur: ${blurSize}`);
                }
                
                // 检测特定移动设备
                const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                const isAndroid = /Android/i.test(navigator.userAgent);
                
                if (isIOS) {
                    // iOS设备额外增加模糊值
                    blurSize *= 1.2;
                    console.log(`iOS device detected, further increasing blur to: ${blurSize}`);
                } else if (isAndroid) {
                    // Android设备稍微不同的调整
                    blurSize *= 1.1;
                    console.log(`Android device detected, adjusting blur to: ${blurSize}`);
                }
            } else {
                // 桌面设备上保持原有的模糊值
                blurSize = 2;
                console.log(`Desktop device detected, using standard blur: ${blurSize}`);
            }
            
            // 尝试使用CSS样式的模糊效果
            let useCanvasFilter = true;
            
            try {
                // 测试Canvas滤镜支持
                ctx.filter = `blur(${blurSize}px)`;
                
                // 检查是否真正支持滤镜（某些浏览器会忽略不支持的属性而不报错）
                if (ctx.filter !== `blur(${blurSize}px)` && 
                    ctx.filter !== 'blur('+blurSize+'px)' && 
                    ctx.filter !== 'blur(2px)') {
                    console.warn('Canvas filter not fully supported, fallback to manual blur');
                    useCanvasFilter = false;
                }
            } catch (e) {
                console.warn('Canvas filter not supported:', e);
                useCanvasFilter = false;
            }
            
            ctx.fillStyle = textColors[theme];
            ctx.font = `normal ${fontSize}px 'Arial Narrow', Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 应用变换
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(0.85, 1);
            
            // 创建离屏Canvas用于手动模糊效果
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = canvas.width;
            offscreenCanvas.height = canvas.height;
            const offCtx = offscreenCanvas.getContext('2d');
            offCtx.fillStyle = textColors[theme];
            offCtx.font = ctx.font;
            offCtx.textAlign = ctx.textAlign;
            offCtx.textBaseline = ctx.textBaseline;
            offCtx.setTransform(ctx.getTransform());
            
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
                    offCtx.font = ctx.font;
                }
                
                // 绘制多行文字
                const adjustedLineHeight = fontSize * 1.2;
                const adjustedTotalHeight = lines.length * adjustedLineHeight;
                const startY = -adjustedTotalHeight / 2;
                
                // 是否使用Canvas滤镜
                if (useCanvasFilter) {
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
                    // 使用离屏Canvas绘制清晰文本
                    lines.forEach((line, index) => {
                        const letters = line.split('');
                        const spacedText = letters.join('\u200B');
                        offCtx.fillText(
                            spacedText,
                            0,
                            startY + (index * adjustedLineHeight) + adjustedLineHeight / 2
                        );
                    });
                }
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
                    offCtx.font = ctx.font;
                }
                
                // 是否使用Canvas滤镜
                if (useCanvasFilter) {
                    ctx.fillText(spacedText, 0, 0);
                } else {
                    offCtx.fillText(spacedText, 0, 0);
                }
            }
            
            // 如果不使用Canvas滤镜，则需要手动应用模糊效果
            if (!useCanvasFilter) {
                // 使用分层模糊技术
                const applyManualBlur = () => {
                    // 基础模糊配置
                    let blurPasses;
                    
                    if (isMobile) {
                        // 移动设备使用更强的模糊效果
                        blurPasses = [
                            { offsetRange: blurSize, alpha: 0.35, count: 8 },      // 主模糊层 - 增强透明度
                            { offsetRange: blurSize/1.5, alpha: 0.6, count: 6 },   // 中距离模糊层 - 增加数量和透明度
                            { offsetRange: blurSize/3, alpha: 0.7, count: 4 }      // 近距离模糊层 - 加强效果
                        ];
                        
                        // 检测iOS设备，可能需要特殊处理
                        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                            // 为iOS添加额外的中距离模糊，使效果更明显
                            blurPasses.push({ offsetRange: blurSize/2, alpha: 0.5, count: 6 });
                            console.log('Added extra blur pass for iOS device');
                        }
                    } else {
                        // 桌面设备保持原有的模糊效果
                        blurPasses = [
                            { offsetRange: blurSize, alpha: 0.3, count: 8 },     // 主模糊层
                            { offsetRange: blurSize/2, alpha: 0.5, count: 4 }    // 加强中心模糊
                        ];
                        
                        // 仅为高DPI桌面设备添加额外模糊
                        if (pixelRatio >= 2) {
                            blurPasses.push({ offsetRange: blurSize/4, alpha: 0.6, count: 4 });
                        }
                    }
                    
                    // 应用每组模糊效果
                    blurPasses.forEach(pass => {
                        // 生成平均分布的点，确保360度覆盖
                        const step = (Math.PI * 2) / pass.count;
                        for (let i = 0; i < pass.count; i++) {
                            const angle = i * step;
                            const offsetX = Math.cos(angle) * pass.offsetRange;
                            const offsetY = Math.sin(angle) * pass.offsetRange;
                            
                            ctx.globalAlpha = pass.alpha;
                            ctx.drawImage(offscreenCanvas, offsetX, offsetY);
                        }
                    });
                    
                    // 调整中心原始图像的透明度
                    const centerAlpha = isMobile ? 0.35 : 0.4; // 移动设备降低中心清晰度
                    ctx.globalAlpha = centerAlpha;
                    ctx.drawImage(offscreenCanvas, 0, 0);
                    
                    // 重置Alpha
                    ctx.globalAlpha = 1.0;
                };
                
                applyManualBlur();
            }
            
            ctx.restore();
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