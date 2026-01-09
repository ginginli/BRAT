#!/usr/bin/env node

/**
 * Server-side IndexNow submission script
 * Usage: node scripts/indexnow-submit.js [url1] [url2] ...
 * Or: node scripts/indexnow-submit.js --all
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class IndexNowSubmitter {
    constructor() {
        this.apiKey = 'f92e9497ed1359346b43b75a5438842e05f7d9b9aa030c3ddd947ddce21db1c6';
        this.host = 'www.bratgenerator.com.cn';
        this.keyLocation = `https://${this.host}/${this.apiKey}.txt`;
        
        this.endpoints = [
            'api.indexnow.org',
            'www.bing.com',
            'yandex.com'
        ];
        
        this.allUrls = [
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
    }
    
    async submitUrls(urls) {
        const payload = JSON.stringify({
            host: this.host,
            key: this.apiKey,
            keyLocation: this.keyLocation,
            urlList: urls
        });
        
        console.log(`📤 Submitting ${urls.length} URLs to IndexNow...`);
        console.log('URLs:', urls.join(', '));
        console.log('');
        
        const results = [];
        
        for (const endpoint of this.endpoints) {
            try {
                const result = await this.makeRequest(endpoint, payload);
                results.push({
                    endpoint,
                    success: result.success,
                    status: result.status,
                    error: result.error
                });
                
                if (result.success) {
                    console.log(`✅ ${endpoint}: Success (${result.status})`);
                } else {
                    console.log(`❌ ${endpoint}: Failed (${result.status}) - ${result.error || 'Unknown error'}`);
                }
            } catch (error) {
                console.log(`❌ ${endpoint}: Error - ${error.message}`);
                results.push({
                    endpoint,
                    success: false,
                    error: error.message
                });
            }
        }
        
        const successCount = results.filter(r => r.success).length;
        console.log(`\n📊 Summary: ${successCount}/${results.length} endpoints successful`);
        
        return results;
    }
    
    makeRequest(hostname, payload) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname,
                port: 443,
                path: '/indexnow',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload)
                }
            };
            
            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    resolve({
                        success: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        data: data,
                        error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : null
                    });
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
            
            req.write(payload);
            req.end();
        });
    }
    
    async run() {
        const args = process.argv.slice(2);
        
        if (args.length === 0) {
            console.log('Usage:');
            console.log('  node scripts/indexnow-submit.js --all');
            console.log('  node scripts/indexnow-submit.js <url1> [url2] ...');
            console.log('');
            console.log('Examples:');
            console.log('  node scripts/indexnow-submit.js --all');
            console.log('  node scripts/indexnow-submit.js https://www.bratgenerator.com.cn/');
            console.log('  node scripts/indexnow-submit.js https://www.bratgenerator.com.cn/ https://www.bratgenerator.com.cn/zh-CN/');
            return;
        }
        
        let urls;
        
        if (args[0] === '--all') {
            urls = this.allUrls;
        } else {
            urls = args.filter(arg => arg.startsWith('http'));
            if (urls.length === 0) {
                console.error('❌ No valid URLs provided');
                return;
            }
        }
        
        try {
            await this.submitUrls(urls);
        } catch (error) {
            console.error('❌ Submission failed:', error.message);
            process.exit(1);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const submitter = new IndexNowSubmitter();
    submitter.run().catch(console.error);
}

module.exports = IndexNowSubmitter;