/**
 * Google Indexing API Implementation
 * For programmatic indexing requests to Google
 */

class GoogleIndexingManager {
    constructor() {
        this.baseUrl = 'https://www.bratgenerator.com.cn';
        this.sitemapUrls = [
            `${this.baseUrl}/sitemap_index.xml`,
            `${this.baseUrl}/sitemap.xml`
        ];
        
        this.init();
    }
    
    init() {
        // Track page views for analytics
        this.trackPageView();
        
        // Setup structured data
        this.addStructuredData();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    /**
     * Track page views (helps with Google Analytics signals)
     */
    trackPageView() {
        // Add Google Analytics if not already present
        if (typeof gtag === 'undefined' && !document.querySelector('[src*="googletagmanager"]')) {
            console.log('Consider adding Google Analytics for better indexing signals');
        }
        
        // Send page view event
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }
    
    /**
     * Add structured data for better Google understanding
     */
    addStructuredData() {
        const existingStructuredData = document.querySelector('script[type="application/ld+json"]');
        if (existingStructuredData) return;
        
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Brat Generator",
            "description": "Create custom brat-style images with text overlays",
            "url": this.baseUrl,
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Web Browser",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "creator": {
                "@type": "Organization",
                "name": "Brat Generator"
            }
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
    
    /**
     * Preload critical resources for better Core Web Vitals
     */
    preloadResources() {
        const criticalResources = [
            '/styles.css',
            '/script.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
    
    /**
     * Generate sitemap ping URLs for manual submission
     */
    getSitemapPingUrls() {
        const sitemapUrl = encodeURIComponent(`${this.baseUrl}/sitemap_index.xml`);
        
        return {
            google: `https://www.google.com/ping?sitemap=${sitemapUrl}`,
            bing: `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
            yandex: `https://webmaster.yandex.com/ping?sitemap=${sitemapUrl}`
        };
    }
    
    /**
     * Check if page is indexable
     */
    checkIndexability() {
        const issues = [];
        
        // Check meta robots
        const metaRobots = document.querySelector('meta[name="robots"]');
        if (metaRobots && metaRobots.content.includes('noindex')) {
            issues.push('Page has noindex directive');
        }
        
        // Check canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            issues.push('Missing canonical URL');
        }
        
        // Check title
        if (!document.title || document.title.length < 10) {
            issues.push('Title too short or missing');
        }
        
        // Check meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc || metaDesc.content.length < 50) {
            issues.push('Meta description too short or missing');
        }
        
        return {
            indexable: issues.length === 0,
            issues: issues
        };
    }
    
    /**
     * Manual Google Search Console submission helper
     */
    getGSCSubmissionInfo() {
        return {
            message: 'To submit to Google Search Console:',
            steps: [
                '1. Go to https://search.google.com/search-console',
                '2. Add all domain variations:',
                '   - https://www.bratgenerator.com.cn',
                '   - https://bratgenerator.com.cn', 
                '   - http://www.bratgenerator.com.cn',
                '   - http://bratgenerator.com.cn',
                '3. Submit sitemap: /sitemap_index.xml',
                '4. Request indexing for key pages',
                '5. Monitor coverage reports'
            ],
            sitemaps: this.sitemapUrls
        };
    }
}

// Initialize Google indexing manager
let googleIndexingManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        googleIndexingManager = new GoogleIndexingManager();
    });
} else {
    googleIndexingManager = new GoogleIndexingManager();
}

// Expose to global scope
window.GoogleIndexing = {
    checkIndexability: () => googleIndexingManager?.checkIndexability(),
    getSitemapPings: () => googleIndexingManager?.getSitemapPingUrls(),
    getGSCInfo: () => googleIndexingManager?.getGSCSubmissionInfo()
};