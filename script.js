// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
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
        // Remove all theme classes and active classes
        document.body.classList.remove('theme-green', 'theme-black', 'theme-white', 'theme-blue');
        themeGreen.classList.remove('active');
        themeBlack.classList.remove('active');
        themeWhite.classList.remove('active');
        themeBlue.classList.remove('active');
        
        // Add current theme class
        document.body.classList.add(`theme-${theme}`);
        
        // Get the correct image path based on current page location
        const isRootPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
        const imagePath = isRootPage ? 'images/' : '../images/';
        
        // Set different background images and text styles based on theme
        switch(theme) {
            case 'green':
                memeImage.src = `${imagePath}brat-bg-green.png`;
                textOverlay.style.color = '#000000';
                textOverlay.style.filter = 'blur(2.5px)';
                textOverlay.style.fontWeight = 'normal';
                textOverlay.style.transform = 'translate(-50%, -50%) scaleX(0.85)';
                themeGreen.classList.add('active');
                break;
            case 'black':
                memeImage.src = `${imagePath}brat-bg-black.png`;
                textOverlay.style.color = '#FFFFFF';
                textOverlay.style.filter = 'blur(1.8px)';
                textOverlay.style.fontWeight = 'normal';
                textOverlay.style.transform = 'translate(-50%, -50%) scaleX(0.85)';
                themeBlack.classList.add('active');
                break;
            case 'white':
                memeImage.src = `${imagePath}brat-bg-white.png`;
                textOverlay.style.color = '#000000';
                textOverlay.style.filter = 'blur(1.8px)';
                textOverlay.style.fontWeight = 'normal';
                textOverlay.style.transform = 'translate(-50%, -50%) scaleX(0.85)';
                themeWhite.classList.add('active');
                break;
            case 'blue':
                memeImage.src = `${imagePath}brat-bg-blue.png`;
                textOverlay.style.color = '#DE0100';
                textOverlay.style.filter = 'blur(1.8px)';
                textOverlay.style.fontWeight = 'normal';
                textOverlay.style.transform = 'translate(-50%, -50%) scaleX(0.85)';
                themeBlue.classList.add('active');
                break;
        }
        
        // Adjust text size to fit container
        fitText();
    }
    
    // Text size auto-adjustment function
    function fitText() {
        const container = document.getElementById('meme-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // 设置初始字体大小，绿色主题使用更大字体
        let baseSize = 120;
        if(document.body.classList.contains('theme-green')) {
            baseSize = 140;
        }
        
        // 应用用户自定义字体大小系数
        let fontSize = baseSize * fontSizeFactor;
        
        textOverlay.style.fontSize = `${fontSize}px`;
        
        // 确保保留水平缩放效果
        const currentTransform = textOverlay.style.transform;
        if(!currentTransform || !currentTransform.includes('scaleX')) {
            textOverlay.style.transform = 'translate(-50%, -50%) scaleX(0.85)';
        }
        
        // 根据是否自动换行调整元素样式
        textOverlay.style.whiteSpace = autoWrapCheckbox.checked ? 'normal' : 'nowrap';
        
        // 如果不自动换行，需要缩小字体以适应一行
        if (!autoWrapCheckbox.checked) {
            // Adjust font size until text fits container width
            while (textOverlay.scrollWidth > containerWidth * 0.85 && fontSize > 10) {
                fontSize -= 5;
                textOverlay.style.fontSize = `${fontSize}px`;
            }
        } else {
            // 如果自动换行，确保文本高度不超过容器高度
            while ((textOverlay.scrollHeight > containerHeight * 0.8 || 
                  textOverlay.scrollWidth > containerWidth * 0.8) && 
                  fontSize > 10) {
                fontSize -= 5;
                textOverlay.style.fontSize = `${fontSize}px`;
            }
        }
    }
    
    // Download image functionality
    downloadBtn.addEventListener('click', function() {
        const container = document.getElementById('meme-container');
        const text = textOverlay.innerText;
        const textColor = textOverlay.style.color;
        const fontSize = parseInt(textOverlay.style.fontSize);
        const blurAmount = 3; // 增加模糊效果从1.8px到3px
        
        // 创建一个新的Canvas元素
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置Canvas大小与预览容器相同
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        canvas.width = width * 2; // 提高分辨率
        canvas.height = height * 2; // 提高分辨率
        ctx.scale(2, 2); // 缩放上下文以匹配分辨率
        
        // 加载背景图片
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function() {
            // 绘制背景图片
            ctx.drawImage(img, 0, 0, width, height);
            
            // 设置文本样式
            ctx.font = `normal ${fontSize}px 'Arial Narrow', Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 应用更强的模糊效果
            ctx.filter = `blur(${blurAmount}px)`;
            
            // 设置文本颜色
            ctx.fillStyle = textColor;
            
            // 保存当前上下文状态
            ctx.save();
            
            // 应用水平缩放到整个文本
            ctx.translate(width/2, height/2);
            ctx.scale(0.85, 1); // 应用水平缩放
            ctx.translate(-width/2, -height/2);
            
            // 处理多行文本
            if (autoWrapCheckbox.checked) {
                const lineHeight = fontSize * 1.2;
                const maxWidth = width * 0.8; // 最大宽度为容器的80%
                const lines = getLines(ctx, text, maxWidth);
                
                // 计算总高度
                const totalHeight = lines.length * lineHeight;
                // 计算起始Y位置，使文本垂直居中
                let y = height/2 - (totalHeight / 2) + lineHeight/2;
                
                // 绘制每一行文本
                for (let i = 0; i < lines.length; i++) {
                    ctx.fillText(lines[i], width/2, y);
                    y += lineHeight;
                }
            } else {
                // 单行文本居中绘制
                ctx.fillText(text, width/2, height/2);
            }
            
            // 恢复上下文状态
            ctx.restore();
            
            // 创建下载链接
            const link = document.createElement('a');
            link.download = 'brat-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        
        // 设置图片源
        img.src = memeImage.src;
    });
    
    // 辅助函数：分割文本为多行
    function getLines(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        
        lines.push(currentLine);
        return lines;
    }
    
    // Initial text size adjustment
    fitText();
    
    // Readjust text size when window is resized
    window.addEventListener('resize', fitText);
    
    // Set default theme (green) with the new style
    setTheme('green');
    
    // Add structured data to improve SEO
    addStructuredData();
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