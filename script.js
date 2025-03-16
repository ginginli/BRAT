// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const textOverlay = document.getElementById('text-overlay');
    const memeImage = document.getElementById('meme-image');
    const downloadBtn = document.getElementById('download-btn');
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Set initial text
    textOverlay.innerText = textInput.value;
    
    // Text input event listener
    textInput.addEventListener('input', function() {
        textOverlay.innerText = this.value;
        fitText();
    });
    
    // Theme switching
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            themeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to current button
            this.classList.add('active');
            
            // Get theme ID
            const themeId = this.id;
            
            // Set styles based on theme ID
            if (themeId === 'theme-green') {
                setTheme('green');
            } else if (themeId === 'theme-black') {
                setTheme('black');
            } else if (themeId === 'theme-white') {
                setTheme('white');
            } else if (themeId === 'theme-blue') {
                setTheme('blue');
            }
        });
    });
    
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
                textOverlay.style.color = '#000';
                textOverlay.style.filter = 'blur(1px)';
                textInput.maxLength = 20;
                if (textInput.value.length > 20) {
                    textInput.value = textInput.value.substring(0, 20);
                    textOverlay.innerText = textInput.value;
                }
                break;
            case 'black':
                memeImage.src = 'images/brat-bg-black.png';
                textOverlay.style.color = '#fff';
                textOverlay.style.filter = 'blur(1.5px)';
                textInput.maxLength = 100;
                break;
            case 'white':
                memeImage.src = 'images/brat-bg-white.png';
                textOverlay.style.color = '#000';
                textOverlay.style.filter = 'blur(1px)';
                textInput.maxLength = 100;
                break;
            case 'blue':
                memeImage.src = 'images/brat-bg-blue.png';
                textOverlay.style.color = '#DE0100';
                textOverlay.style.filter = 'none';
                textInput.maxLength = 20;
                if (textInput.value.length > 20) {
                    textInput.value = textInput.value.substring(0, 20);
                    textOverlay.innerText = textInput.value;
                }
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
        let fontSize = 100;
        textOverlay.style.fontSize = `${fontSize}px`;
        
        // Adjust font size until text fits container
        while ((textOverlay.offsetWidth > containerWidth * 0.9 || textOverlay.offsetHeight > containerHeight * 0.8) && fontSize > 10) {
            fontSize -= 5;
            textOverlay.style.fontSize = `${fontSize}px`;
        }
    }
    
    // Download image functionality
    downloadBtn.addEventListener('click', function() {
        // Create a new canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match preview container
        const container = document.getElementById('meme-container');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        // Draw background image
        const img = new Image();
        img.onload = function() {
            // Draw background image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Draw text
            ctx.font = textOverlay.style.fontSize + ' Arial Narrow';
            ctx.fillStyle = textOverlay.style.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Apply blur effect
            if (textOverlay.style.filter.includes('blur')) {
                ctx.filter = textOverlay.style.filter;
            }
            
            // Draw text
            ctx.fillText(textOverlay.innerText, canvas.width / 2, canvas.height / 2);
            
            // Create download link
            const link = document.createElement('a');
            link.download = 'brat-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = memeImage.src;
    });
    
    // Initial text size adjustment
    fitText();
    
    // Readjust text size when window is resized
    window.addEventListener('resize', fitText);
    
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