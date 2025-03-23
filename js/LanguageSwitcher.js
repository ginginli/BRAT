class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en-US';
        this.translations = {};
        this.supportedLanguages = {
            'en-US': {
                name: 'English',
                flag: '🇺🇸',
                countryCode: 'US',
                fallback: 'en'
            },
            'es-MX': {
                name: 'Español (México)',
                flag: '🇲🇽',
                countryCode: 'MX',
                fallback: 'es'
            },
            'es-AR': {
                name: 'Español (Argentina)',
                flag: '🇦🇷',
                countryCode: 'AR',
                fallback: 'es'
            },
            'id': {
                name: 'Bahasa Indonesia',
                flag: '🇮🇩',
                countryCode: 'ID'
            },
            'tr': {
                name: 'Türkçe',
                flag: '🇹🇷',
                countryCode: 'TR'
            },
            'fil': {
                name: 'Filipino',
                flag: '🇵🇭',
                countryCode: 'PH',
                fallback: 'en'
            }
        };
    }

    async init() {
        // 检测用户语言
        this.currentLang = this.detectLanguage();
        
        // 加载翻译文件
        await this.loadTranslations();
        
        // 创建语言切换器UI
        this.createUI();
        
        // 应用翻译
        this.applyTranslations();
    }

    detectLanguage() {
        // 1. 检查 URL 参数
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && this.supportedLanguages[langParam]) {
            return langParam;
        }

        // 2. 检查 localStorage
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && this.supportedLanguages[savedLang]) {
            return savedLang;
        }

        // 3. 检查浏览器语言
        const browserLang = navigator.language;
        const shortLang = browserLang.split('-')[0];
        
        // 查找完全匹配
        if (this.supportedLanguages[browserLang]) {
            return browserLang;
        }
        
        // 查找语言代码匹配
        const matchingLang = Object.keys(this.supportedLanguages).find(lang => 
            lang.startsWith(shortLang)
        );
        
        if (matchingLang) {
            return matchingLang;
        }

        // 默认返回英语
        return 'en-US';
    }

    async loadTranslations() {
        try {
            const response = await fetch(`/locales/${this.currentLang}/translations.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // 如果加载失败，尝试加载回退语言
            const fallbackLang = this.supportedLanguages[this.currentLang].fallback || 'en-US';
            if (fallbackLang !== this.currentLang) {
                this.currentLang = fallbackLang;
                await this.loadTranslations();
            }
        }
    }

    createUI() {
        const container = document.createElement('div');
        container.className = 'language-switcher';
        container.innerHTML = `
            <div class="language-selector">
                <button class="language-button">
                    ${this.supportedLanguages[this.currentLang].flag}
                    ${this.supportedLanguages[this.currentLang].name}
                    <span class="arrow">▼</span>
                </button>
                <div class="language-dropdown">
                    ${Object.entries(this.supportedLanguages)
                        .map(([code, lang]) => `
                            <a href="#" data-lang="${code}" class="language-option">
                                ${lang.flag} ${lang.name}
                            </a>
                        `).join('')}
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .language-switcher {
                position: relative;
                display: inline-block;
                margin: 10px;
            }
            .language-button {
                padding: 8px 16px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .language-dropdown {
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                z-index: 1000;
            }
            .language-option {
                display: block;
                padding: 8px 16px;
                text-decoration: none;
                color: #333;
                white-space: nowrap;
            }
            .language-option:hover {
                background: #f5f5f5;
            }
            .language-switcher:hover .language-dropdown {
                display: block;
            }
        `;

        document.head.appendChild(style);
        document.querySelector('nav').appendChild(container);

        // 添加事件监听器
        container.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', async (e) => {
                e.preventDefault();
                const newLang = e.target.dataset.lang;
                await this.switchLanguage(newLang);
            });
        });
    }

    async switchLanguage(lang) {
        if (this.supportedLanguages[lang]) {
            this.currentLang = lang;
            localStorage.setItem('preferredLanguage', lang);
            await this.loadTranslations();
            this.applyTranslations();
            
            // 更新 URL
            const url = new URL(window.location);
            url.searchParams.set('lang', lang);
            window.history.pushState({}, '', url);
        }
    }

    applyTranslations() {
        // 更新 meta 标签
        document.title = this.translations.meta.title;
        document.querySelector('meta[name="description"]').content = this.translations.meta.description;
        document.querySelector('meta[name="keywords"]').content = this.translations.meta.keywords;

        // 更新导航
        const nav = this.translations.nav;
        document.querySelectorAll('nav a').forEach(link => {
            const key = link.getAttribute('data-nav-key');
            if (key && nav[key]) {
                link.textContent = nav[key];
            }
        });

        // 更新生成器部分
        const generator = this.translations.generator;
        document.querySelector('#generator-title').textContent = generator.title;
        document.querySelector('#text-input').placeholder = generator.enterText;
        document.querySelector('#theme-title').textContent = generator.themes.title;
        
        // 更新主题按钮
        Object.entries(generator.themes).forEach(([key, value]) => {
            if (key !== 'title') {
                document.querySelector(`#theme-${key}`).textContent = value;
            }
        });

        // 更新保存按钮和提示
        document.querySelector('#save-button').textContent = generator.saveImage;
        document.querySelector('#save-tip').textContent = generator.tip;

        // 更新页脚链接
        const footer = this.translations.footer;
        document.querySelector('a[href="/privacy.html"]').textContent = footer.privacy;
        document.querySelector('a[href="/terms.html"]').textContent = footer.terms;
        document.querySelector('a[href="/contact.html"]').textContent = footer.contact;
        document.querySelector('.copyright').textContent = footer.copyright;
    }
}

// 导出模块
export default LanguageSwitcher; 