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
    
    // Set theme function
    function setTheme(theme) {
        // Remove all theme classes
        document.body.classList.remove('theme-green', 'theme-black', 'theme-white', 'theme-blue');
        // Add current theme class
        document.body.classList.add(`theme-${theme}`);
        
        // Set different background images and text styles based on theme
        switch(theme) {
            case 'green':
                memeImage.src = 'images/brat-bg-green.png';
                textOverlay.style.color = '#000000';
                textOverlay.style.filter = 'blur(1.8px)';
                textOverlay.style.fontWeight = 'normal';
                themeGreen.classList.add('active');
                break;
            case 'black':
                memeImage.src = 'images/brat-bg-black.png';
                textOverlay.style.color = '#FFFFFF';
                textOverlay.style.filter = 'blur(1.8px)';
                textOverlay.style.fontWeight = 'normal';
                themeBlack.classList.add('active');
                break;
            case 'white':
                memeImage.src = 'images/brat-bg-white.png';
                textOverlay.style.color = '#000000';
                textOverlay.style.filter = 'blur(1.8px)';
                textOverlay.style.fontWeight = 'normal';
                themeWhite.classList.add('active');
                break;
            case 'blue':
                memeImage.src = 'images/brat-bg-blue.png';
                textOverlay.style.color = '#DE0100';
                textOverlay.style.filter = 'blur(1.8px)';
                textOverlay.style.fontWeight = 'normal';
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
        
        // Initial font size
        let fontSize = 140;
        textOverlay.style.fontSize = `${fontSize}px`;
        
        // Adjust font size until text fits container
        while ((textOverlay.offsetWidth > containerWidth * 0.85 || textOverlay.offsetHeight > containerHeight * 0.75) && fontSize > 10) {
            fontSize -= 5;
            textOverlay.style.fontSize = `${fontSize}px`;
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
            
            // 简化方法：直接绘制文本，不尝试手动实现字母间距
            // 保存当前上下文状态
            ctx.save();
            
            // 应用水平缩放到整个文本
            ctx.translate(width/2, height/2);
            ctx.scale(0.85, 1); // 应用水平缩放
            ctx.translate(-width/2, -height/2);
            
            // 直接绘制文本（居中）
            ctx.fillText(text, width/2, height/2);
            
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
        "name": "Brat Generator",
        "description": "Create your own Brat style images, easily generate personalized Brat memes",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
}