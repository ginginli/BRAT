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
                themeGreen.classList.add('active');
                break;
            case 'black':
                memeImage.src = 'images/brat-bg-black.png';
                textOverlay.style.color = '#FFFFFF';
                themeBlack.classList.add('active');
                break;
            case 'white':
                memeImage.src = 'images/brat-bg-white.png';
                textOverlay.style.color = '#000000';
                themeWhite.classList.add('active');
                break;
            case 'blue':
                memeImage.src = 'images/brat-bg-blue.png';
                textOverlay.style.color = '#DE0100';
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
        html2canvas(document.getElementById('meme-container')).then(function(canvas) {
            const link = document.createElement('a');
            link.download = 'brat-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
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