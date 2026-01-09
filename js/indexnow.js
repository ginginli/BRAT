/**
 * IndexNow Implementation for Brat Generator
 * Automatically notifies search engines when content is updated
 */

class IndexNowManager {
    constructor() {
        this.apiKey = 'f92e9497ed1359346b43b75a5438842e05f7d9b9aa030c3ddd947ddce21db1c6';
        this.host = 'www.bratgenerator.com.cn';
        this.keyLocation = `https://${this.host}/${this.apiKey}.txt`;
        
        // IndexNow endpoints
        this.endpoints = [
            'https://api.indexnow.org/indexnow',
            'https://www.bing.com/indexnow',
            'https://yandex.com/indexnow'
        ];
        
        this.init();
    }
    
    init() {
        // Auto-submit current page on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.submitCurrentPage();
            });
        } else {
            this.submitCurrentPage();
        }
        
        // Submit when user interacts with the generator
        this.setupGeneratorTracking();
    }
    
    /**
     * Submit a single URL to IndexNow
     */
    async submitUrl(url) {
        const payload = {
            host: this.host,
            key: this.apiKey,
            keyLocation: this.keyLocation,
            urlList: [url]
        };
        
        const results = [];
        
        for (const endpoint of this.endpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                results.push({
                    endpoint: endpoint,
                    status: response.status,
                    success: response.ok
                });
                
                if (response.ok) {
                    console.log(`✅ IndexNow: Successfully submitted ${url} to ${endpoint}`);
                } else {
                    console.warn(`⚠️ IndexNow: Failed to submit to ${endpoint}, status: ${response.status}`);
                }
            } catch (error) {
                console.error(`❌ IndexNow: Error submitting to ${endpoint}:`, error);
                results.push({
                    endpoint: endpoint,
                    error: error.message,
                    success: false
                });
            }
        }
        
        return results;
    }
    
    /**
     * Submit multiple URLs to IndexNow
     */
    async submitUrls(urls) {
        const payload = {
            host: this.host,
            key: this.apiKey,
            keyLocation: this.keyLocation,
            urlList: urls
        };
        
        const results = [];
        
        for (const endpoint of this.endpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                results.push({
                    endpoint: endpoint,
                    status: response.status,
                    success: response.ok,
                    urlCount: urls.length
                });
                
                if (response.ok) {
                    console.log(`✅ IndexNow: Successfully submitted ${urls.length} URLs to ${endpoint}`);
                } else {
                    console.warn(`⚠️ IndexNow: Failed to submit to ${endpoint}, status: ${response.status}`);
                }
            } catch (error) {
                console.error(`❌ IndexNow: Error submitting to ${endpoint}:`, error);
                results.push({
                    endpoint: endpoint,
                    error: error.message,
                    success: false
                });
            }
        }
        
        return results;
    }
    
    /**
     * Submit the current page
     */
    async submitCurrentPage() {
        const currentUrl = window.location.href;
        return await this.submitUrl(currentUrl);
    }
    
    /**
     * Submit all pages from sitemap
     */
    async submitAllPages() {
        try {
            // Extract URLs from your sitemap
            const sitemapUrls = [
                `https://${this.host}/`,
                `https://${this.host}/bratgreen/`,
                `https://${this.host}/privacy.html`,
                `https://${this.host}/terms.html`,
                `https://${this.host}/contact.html`,
                `https://${this.host}/zh-CN/`,
                `https://${this.host}/en-US/`,
                `https://${this.host}/es-MX/`,
                `https://${this.host}/es-AR/`,
                `https://${this.host}/id/`,
                `https://${this.host}/tr/`,
                `https://${this.host}/fil/`,
                `https://${this.host}/ja-JP/`,
                `https://${this.host}/ko-KR/`,
                `https://${this.host}/brat-generator-negro/`,
                `https://${this.host}/create-blue-bg.html`,
                `https://${this.host}/blue-bg-generator.html`,
                `https://${this.host}/generate-backgrounds.html`
            ];
            
            return await this.submitUrls(sitemapUrls);
        } catch (error) {
            console.error('❌ IndexNow: Error submitting all pages:', error);
            return [];
        }
    }
    
    /**
     * Track generator usage and submit pages when users interact
     */
    setupGeneratorTracking() {
        // Track when users generate images
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                // Delay submission to avoid interfering with user experience
                setTimeout(() => {
                    this.submitCurrentPage();
                }, 2000);
            });
        }
        
        // Track theme changes
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    this.submitCurrentPage();
                }, 3000);
            });
        });
        
        // Track language switches
        const langItems = document.querySelectorAll('.lang-item');
        langItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetUrl = e.target.href;
                if (targetUrl) {
                    setTimeout(() => {
                        this.submitUrl(targetUrl);
                    }, 1000);
                }
            });
        });
    }
    
    /**
     * Manual submission method for admin use
     */
    async manualSubmit(urls = null) {
        if (urls) {
            return await this.submitUrls(Array.isArray(urls) ? urls : [urls]);
        } else {
            return await this.submitCurrentPage();
        }
    }
}

// Initialize IndexNow when DOM is ready
let indexNowManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        indexNowManager = new IndexNowManager();
    });
} else {
    indexNowManager = new IndexNowManager();
}

// Expose to global scope for manual use
window.IndexNow = {
    submit: (urls) => indexNowManager?.manualSubmit(urls),
    submitAll: () => indexNowManager?.submitAllPages(),
    submitCurrent: () => indexNowManager?.submitCurrentPage()
};