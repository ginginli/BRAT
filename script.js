// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // 暂时注释掉 LanguageSwitcher 相关代码，因为类未定义，导致其他功能无法执行
    // const languageSwitcher = new LanguageSwitcher();
    // languageSwitcher.init();

    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const textOverlay = document.getElementById('text-overlay');
    const memeImage = document.getElementById('meme-image');
    const downloadBtn = document.getElementById('download-btn');
    const themeGreen = document.getElementById('theme-green');
    const themeBlack = document.getElementById('theme-black');
    const themeWhite = document.getElementById('theme-white');
    const themeBlue = document.getElementById('theme-blue');
    const autoWrapCheckbox = document.getElementById('auto-wrap');
    const fontSizeSlider = document.getElementById('font-size-slider');
    
    // 用户自定义字体大小系数
    let fontSizeFactor = 1.0;
    
    // Set initial text
    textOverlay.innerText = textInput.value;
    
    // 检查是否应该使用黑色主题
    function shouldUseBlackTheme() {
        const path = window.location.pathname;
        return path.includes('negro') || path.includes('fondo-negro');
    }
    
    // Set initial theme based on URL
    const defaultTheme = shouldUseBlackTheme() ? 'black' : 'green';
    setTheme(defaultTheme);
    
    // Text input event listener
    textInput.addEventListener('input', function() {
        textOverlay.innerText = this.value;
        fitText();
    });
    
    // Theme switching
    themeGreen.addEventListener('click', () => setTheme('green'));
    themeBlack.addEventListener('click', () => setTheme('black'));
    themeWhite.addEventListener('click', () => setTheme('white'));
    themeBlue.addEventListener('click', () => setTheme('blue'));
    
    // 自动换行切换
    autoWrapCheckbox.addEventListener('change', function() {
        textOverlay.style.whiteSpace = this.checked ? 'normal' : 'nowrap';
        fitText();
    });
    
    // 字体大小滑块
    fontSizeSlider.addEventListener('input', function() {
        fontSizeFactor = this.value / 100;
        fitText();
    });
    
    // Set theme function
    function setTheme(theme) {
        const memeContainer = document.getElementById('meme-container');
        
        // Remove all theme classes and active classes
        memeContainer.classList.remove('theme-green', 'theme-black', 'theme-white', 'theme-blue');
        themeGreen.classList.remove('active');
        themeBlack.classList.remove('active');
        themeWhite.classList.remove('active');
        themeBlue.classList.remove('active');
        
        // Add current theme class to meme container
        memeContainer.classList.add(`theme-${theme}`);
        
        // 使用相对路径
        const imagePath = 'images/';
        
        // Set different background images based on theme
        switch(theme) {
            case 'green':
                memeImage.src = `${imagePath}brat-bg-green.png`;
                themeGreen.classList.add('active');
                break;
            case 'black':
                memeImage.src = `${imagePath}brat-bg-black.png`;
                themeBlack.classList.add('active');
                break;
            case 'white':
                memeImage.src = `${imagePath}brat-bg-white.png`;
                themeWhite.classList.add('active');
                break;
            case 'blue':
                memeImage.src = `${imagePath}brat-bg-blue.png`;
                themeBlue.classList.add('active');
                break;
        }
        
        // Add theme class to text overlay
        textOverlay.className = `text-overlay theme-${theme}`;
        
        // Adjust text size to fit container
        fitText();
    }
    
    // Fit text function
    function fitText() {
        const container = document.getElementById('meme-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Reset font size
        textOverlay.style.fontSize = '120px';
        
        // Get text dimensions
        const textWidth = textOverlay.scrollWidth;
        const textHeight = textOverlay.scrollHeight;
        
        // Calculate scale factor
        const widthScale = (containerWidth * 0.8) / textWidth;
        const heightScale = (containerHeight * 0.8) / textHeight;
        const scale = Math.min(widthScale, heightScale) * fontSizeFactor;
        
        // Apply scale
        textOverlay.style.fontSize = `${120 * scale}px`;
    }
    
    // Initial fit
    fitText();
    
    // Download button event listener
    downloadBtn.addEventListener('click', function() {
        // Show loading animation
        const loadingAnimation = document.getElementById('loading-animation');
        if (loadingAnimation) {
            loadingAnimation.style.display = 'flex';
        }

        // 获取文字层元素
        const textOverlay = document.getElementById('text-overlay');
        // 保存原始显示状态
        const originalDisplay = textOverlay.style.display;
        // 临时隐藏文字层
        textOverlay.style.display = 'none';
        
        // Use html2canvas to capture the meme container
        html2canvas(document.getElementById('meme-container'), {
            scale: 2,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            // 恢复文字层显示
            textOverlay.style.display = originalDisplay;

            // 1. 获取当前的主题和文字样式
            const memeContainer = document.getElementById('meme-container');
            const computedStyle = window.getComputedStyle(textOverlay);
            
            // 2. 创建临时 canvas 用于文字层
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // 3. 获取当前的文字配置
            const text = textOverlay.innerText;
            const fontSize = computedStyle.fontSize;
            const fontFamily = "'Arial Narrow', Arial, sans-serif";
            const textColor = computedStyle.color;
            const isAutoWrap = document.getElementById('auto-wrap').checked;
            
            // 4. 设置文字渲染属性
            tempCtx.filter = 'blur(2px)';
            tempCtx.fillStyle = textColor;
            tempCtx.font = `normal ${fontSize} ${fontFamily}`;
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            
            // 5. 应用变换
            tempCtx.save();
            tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            tempCtx.scale(0.85, 1); // 应用 scaleX(0.85)
            
            // 6. 处理字母间距
            if (isAutoWrap) {
                const lines = [];
                const words = text.split(' ');
                let currentLine = '';
                
                for (let word of words) {
                    // 为每个字符添加 -2px 的间距
                    const letters = word.split('');
                    const spacedWord = letters.join('\u200B');  // 使用零宽空格
                    
                    const testLine = currentLine + (currentLine ? ' ' : '') + spacedWord;
                    const metrics = tempCtx.measureText(testLine);
                    
                    if (metrics.width > (tempCanvas.width * 0.8) / 0.85) { // 考虑 scale 影响
                        lines.push(currentLine);
                        currentLine = spacedWord;
                    } else {
                        currentLine = testLine;
                    }
                }
                lines.push(currentLine);
                
                // 绘制多行文字
                const lineHeight = parseInt(fontSize) * 1.2;
                const totalHeight = lines.length * lineHeight;
                const startY = -totalHeight / 2;
                
                lines.forEach((line, index) => {
                    tempCtx.fillText(line, 
                                   0,  // 因为已经平移了坐标系，所以x为0
                                   startY + (index * lineHeight) + lineHeight / 2);
                });
            } else {
                // 单行文字，添加字母间距
                const letters = text.split('');
                const spacedText = letters.join('\u200B');  // 使用零宽空格添加间距
                tempCtx.fillText(spacedText, 0, 0);
            }
            
            tempCtx.restore();
            
            // 7. 将背景和模糊文字组合
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = canvas.width;
            finalCanvas.height = canvas.height;
            const finalCtx = finalCanvas.getContext('2d');
            
            // 先绘制背景
            finalCtx.drawImage(canvas, 0, 0);
            // 再绘制模糊文字
            finalCtx.drawImage(tempCanvas, 0, 0);
            
            // 8. 导出最终图片
            const link = document.createElement('a');
            link.download = 'brat-generator.png';
            link.href = finalCanvas.toDataURL('image/png', 1.0);
            link.click();
            
            // Hide loading animation
            if (loadingAnimation) {
                loadingAnimation.style.display = 'none';
            }
        }).catch(error => {
            // 确保在出错时也恢复文字层显示
            textOverlay.style.display = originalDisplay;
            
            console.error('Error generating image:', error);
            // Hide loading animation in case of error
            if (loadingAnimation) {
                loadingAnimation.style.display = 'none';
            }
        });
    });
});

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