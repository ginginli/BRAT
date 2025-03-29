<<<<<<< HEAD
// 语言切换器组件
class LanguageSwitcher {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.languages = {
      en: {
        name: 'English',
        flag: '🇬🇧'
      },
      zh: {
        name: '中文',
        flag: '🇨🇳'
      }
    };
    this.translations = {};
    this.init();
  }

  async init() {
    // 加载语言文件
    try {
      const response = await fetch(`/locales/${this.currentLang}.json`);
      if (response.ok) {
        this.translations = await response.json();
        this.translatePage();
      } else {
        console.error('Failed to load language file');
      }
      
      // 针对特定页面加载额外的翻译
      const currentPage = this.getCurrentPage();
      if (currentPage !== 'index') {
        try {
          const pageResponse = await fetch(`/locales/${this.currentLang}-pages.json`);
          if (pageResponse.ok) {
            const pageTranslations = await pageResponse.json();
            this.translateSpecificPage(currentPage, pageTranslations);
          }
        } catch (error) {
          console.error('Error loading page-specific translations:', error);
        }
      }
    } catch (error) {
      console.error('Error loading language file:', error);
    }

    // 创建并挂载语言切换器
    this.render();
    // 初始设置HTML的lang属性
    document.documentElement.lang = this.currentLang;
  }

  async switchLanguage(lang) {
    if (lang === this.currentLang) return;
    
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (response.ok) {
        this.translations = await response.json();
        this.translatePage();
        
        // 针对特定页面重新加载翻译
        const currentPage = this.getCurrentPage();
        if (currentPage !== 'index') {
          try {
            const pageResponse = await fetch(`/locales/${lang}-pages.json`);
            if (pageResponse.ok) {
              const pageTranslations = await pageResponse.json();
              this.translateSpecificPage(currentPage, pageTranslations);
            }
          } catch (error) {
            console.error('Error loading page-specific translations:', error);
          }
        }
        
        this.updateSwitcher();
      } else {
        console.error('Failed to load language file');
      }
    } catch (error) {
      console.error('Error loading language file:', error);
    }
  }

  translatePage() {
    if (!this.translations) return;

    // 翻译标题和元数据
    document.title = this.translations.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = this.translations.meta.description;
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.content = this.translations.meta.keywords;
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = this.translations.seo.ogTitle;
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = this.translations.seo.ogDescription;

    // 翻译导航菜单
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '/') {
        link.textContent = this.translations.nav.home;
      } else if (href.includes('#generator')) {
        link.textContent = this.translations.nav.generator;
      } else if (href.includes('#how-it-works')) {
        link.textContent = this.translations.nav.howItWorks;
      } else if (href.includes('#gallery')) {
        link.textContent = this.translations.nav.gallery;
      } else if (href.includes('#faq')) {
        link.textContent = this.translations.nav.faq;
      } else if (href.includes('#about')) {
        link.textContent = this.translations.nav.about;
      }
    });

    // 翻译Hero区域
    const heroTitle = document.querySelector('.brat-title span');
    if (heroTitle) heroTitle.textContent = this.translations.hero.title;
    
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) subtitle.textContent = this.translations.hero.subtitle;

    // 翻译生成器区域
    const generatorTitle = document.querySelector('#generator h2');
    if (generatorTitle) generatorTitle.textContent = this.translations.generator.title;
    
    const textLabel = document.querySelector('label[for="text-input"]');
    if (textLabel) textLabel.textContent = this.translations.generator.enterText;
    
    const textInput = document.querySelector('#text-input');
    if (textInput) textInput.placeholder = this.translations.generator.textPlaceholder;
    
    const themeTitle = document.querySelector('.theme-selector h3');
    if (themeTitle) themeTitle.textContent = this.translations.generator.chooseTheme;
    
    const themeGreen = document.querySelector('#theme-green');
    if (themeGreen) themeGreen.textContent = this.translations.generator.green;
    
    const themeBlack = document.querySelector('#theme-black');
    if (themeBlack) themeBlack.textContent = this.translations.generator.black;
    
    const themeWhite = document.querySelector('#theme-white');
    if (themeWhite) themeWhite.textContent = this.translations.generator.white;
    
    const themeBlue = document.querySelector('#theme-blue');
    if (themeBlue) themeBlue.textContent = this.translations.generator.blue;
    
    const saveBtn = document.querySelector('#download-btn');
    if (saveBtn) saveBtn.textContent = this.translations.generator.saveImage;
    
    const tip = document.querySelector('.tip');
    if (tip) tip.textContent = this.translations.generator.tip;

    // 翻译How It Works区域
    const howTitle = document.querySelector('#how-it-works h2');
    if (howTitle) howTitle.textContent = this.translations.howItWorks.title;
    
    const steps = document.querySelectorAll('.step');
    if (steps.length >= 3) {
      const step1Title = steps[0].querySelector('h3');
      const step1Desc = steps[0].querySelector('p');
      if (step1Title) step1Title.textContent = this.translations.howItWorks.step1.title;
      if (step1Desc) step1Desc.textContent = this.translations.howItWorks.step1.description;
      
      const step2Title = steps[1].querySelector('h3');
      const step2Desc = steps[1].querySelector('p');
      if (step2Title) step2Title.textContent = this.translations.howItWorks.step2.title;
      if (step2Desc) step2Desc.textContent = this.translations.howItWorks.step2.description;
      
      const step3Title = steps[2].querySelector('h3');
      const step3Desc = steps[2].querySelector('p');
      if (step3Title) step3Title.textContent = this.translations.howItWorks.step3.title;
      if (step3Desc) step3Desc.textContent = this.translations.howItWorks.step3.description;
    }

    // 翻译Gallery区域
    const galleryTitle = document.querySelector('#gallery h2');
    if (galleryTitle) galleryTitle.textContent = this.translations.gallery.title;
    
    const galleryDesc = document.querySelector('.gallery-description');
    if (galleryDesc) galleryDesc.textContent = this.translations.gallery.description;
    
    const styleNames = document.querySelectorAll('.style-name');
    if (styleNames.length >= 4) {
      styleNames[0].textContent = this.translations.gallery.greenTheme;
      styleNames[1].textContent = this.translations.gallery.blackTheme;
      styleNames[2].textContent = this.translations.gallery.whiteTheme;
      styleNames[3].textContent = this.translations.gallery.blueTheme;
    }

    // 翻译FAQ区域
    const faqTitle = document.querySelector('#faq h2');
    if (faqTitle) faqTitle.textContent = this.translations.faq.title;
    
    const faqCards = document.querySelectorAll('.faq-card');
    if (faqCards.length > 0 && this.translations.faq.questions) {
      faqCards.forEach((card, index) => {
        if (this.translations.faq.questions[index]) {
          const question = card.querySelector('h3');
          const answer = card.querySelector('p');
          if (question) question.textContent = this.translations.faq.questions[index].question;
          if (answer) answer.textContent = this.translations.faq.questions[index].answer;
        }
      });
    }

    // 翻译About区域
    const aboutTitle = document.querySelector('#about h2');
    if (aboutTitle) aboutTitle.textContent = this.translations.about.title;
    
    const aboutParas = document.querySelectorAll('.about-content p');
    if (aboutParas.length >= 2) {
      aboutParas[0].textContent = this.translations.about.description1;
      aboutParas[1].textContent = this.translations.about.description2;
    }

    // 翻译Features区域
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0 && this.translations.features) {
      featureCards.forEach((card, index) => {
        if (this.translations.features[index]) {
          const title = card.querySelector('h3');
          const desc = card.querySelector('p');
          if (title) title.textContent = this.translations.features[index].title;
          if (desc) desc.textContent = this.translations.features[index].description;
        }
      });
    }

    // 翻译Footer区域
    const footerLinks = document.querySelector('.footer-links h3');
    if (footerLinks) footerLinks.textContent = this.translations.footer.links;
    
    const privacyLink = document.querySelector('.footer-links a[href="privacy.html"]');
    if (privacyLink) privacyLink.textContent = this.translations.footer.privacy;
    
    const termsLink = document.querySelector('.footer-links a[href="terms.html"]');
    if (termsLink) termsLink.textContent = this.translations.footer.terms;
    
    const contactLink = document.querySelector('.footer-links a[href="contact.html"]');
    if (contactLink) contactLink.textContent = this.translations.footer.contact;
    
    const followUs = document.querySelector('.social-links h3');
    if (followUs) followUs.textContent = this.translations.footer.followUs;
    
    const copyright = document.querySelector('.copyright p');
    if (copyright) {
      const year = new Date().getFullYear();
      copyright.textContent = `© ${year} Brat Generator. ${this.translations.footer.copyright}`;
    }
  }

  render() {
    // 创建语言切换器元素
    const container = document.createElement('div');
    container.className = 'language-switcher';
    
    const currentLang = document.createElement('div');
    currentLang.className = 'current-lang';
    currentLang.innerHTML = `${this.languages[this.currentLang].flag} ${this.languages[this.currentLang].name}`;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';
    
    // 添加语言选项
    Object.keys(this.languages).forEach(langCode => {
      const langOption = document.createElement('a');
      langOption.className = 'lang-option';
      langOption.dataset.lang = langCode;
      langOption.innerHTML = `${this.languages[langCode].flag} ${this.languages[langCode].name}`;
      
      langOption.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchLanguage(langCode);
      });
      
      dropdown.appendChild(langOption);
    });
    
    // 显示/隐藏下拉菜单
    currentLang.addEventListener('click', () => {
      dropdown.classList.toggle('show');
    });
    
    // 点击外部关闭下拉菜单
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
    
    container.appendChild(currentLang);
    container.appendChild(dropdown);
    
    // 添加到导航
    const nav = document.querySelector('header nav');
    if (nav) {
      nav.appendChild(container);
    }
    
    // 添加样式
    this.addStyles();
  }
  
  updateSwitcher() {
    const currentLang = document.querySelector('.current-lang');
    if (currentLang) {
      currentLang.innerHTML = `${this.languages[this.currentLang].flag} ${this.languages[this.currentLang].name}`;
    }
  }
  
  addStyles() {
    // 添加CSS样式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .language-switcher {
        position: relative;
        margin-left: 10px;
        cursor: pointer;
        z-index: 1000;
      }
      
      .current-lang {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: #f5f5f5;
        transition: background-color 0.3s ease;
      }
      
      .current-lang:hover {
        background-color: #e9e9e9;
      }
      
      .lang-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        width: 120px;
        display: none;
        flex-direction: column;
        margin-top: 5px;
      }
      
      .lang-dropdown.show {
        display: flex;
      }
      
      .lang-option {
        padding: 8px 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        text-decoration: none;
        color: #333;
      }
      
      .lang-option:hover {
        background-color: #f5f5f5;
      }
      
      @media (max-width: 768px) {
        .language-switcher {
          margin-top: 10px;
          align-self: flex-end;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  // 获取当前页面类型
  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('privacy.html')) {
      return 'privacy';
    } else if (path.includes('terms.html')) {
      return 'terms';
    } else if (path.includes('contact.html')) {
      return 'contact';
    }
    return 'index';
  }

  // 翻译特定页面
  translateSpecificPage(page, translations) {
    if (!translations || !translations[page]) return;
    
    const pageData = translations[page];
    
    // 更新页面标题
    document.title = pageData.title;
    
    // 更新页面主标题
    const heading = document.querySelector('.policy-section h1, .contact-section h1');
    if (heading) heading.textContent = pageData.heading;
    
    // 针对不同页面类型的特定翻译
    if (page === 'privacy' || page === 'terms') {
      const lastUpdated = document.querySelector('#current-date');
      if (lastUpdated) lastUpdated.textContent = pageData.lastUpdated;
      
      const intro = document.querySelector('.policy-content > p');
      if (intro) intro.textContent = pageData.intro;
      
      if (page === 'terms') {
        const agreement = document.querySelector('.policy-content > p:nth-child(3)');
        if (agreement) agreement.textContent = pageData.agreement;
      }
      
      // 翻译各节内容
      const sections = document.querySelectorAll('.policy-content h2');
      sections.forEach((section, index) => {
        if (pageData.sections && pageData.sections[index]) {
          section.textContent = pageData.sections[index].title;
          
          // 找到紧跟在h2后面的内容元素
          let contentElement = section.nextElementSibling;
          while (contentElement && contentElement.tagName !== 'H2') {
            if (contentElement.tagName === 'P' || contentElement.tagName === 'UL') {
              // 对于HTML内容，使用innerHTML
              contentElement.innerHTML = pageData.sections[index].content;
              break;
            }
            contentElement = contentElement.nextElementSibling;
          }
        }
      });
    } else if (page === 'contact') {
      // 翻译联系页面
      const intro = document.querySelector('.contact-content > p');
      if (intro) intro.textContent = pageData.intro;
      
      // 表单标签
      const nameLabel = document.querySelector('label[for="name"]');
      if (nameLabel) nameLabel.textContent = pageData.form.name;
      
      const emailLabel = document.querySelector('label[for="email"]');
      if (emailLabel) emailLabel.textContent = pageData.form.email;
      
      const subjectLabel = document.querySelector('label[for="subject"]');
      if (subjectLabel) subjectLabel.textContent = pageData.form.subject;
      
      const messageLabel = document.querySelector('label[for="message"]');
      if (messageLabel) messageLabel.textContent = pageData.form.message;
      
      // 表单占位符
      const nameInput = document.querySelector('#name');
      if (nameInput) nameInput.placeholder = pageData.form.placeholders.name;
      
      const emailInput = document.querySelector('#email');
      if (emailInput) emailInput.placeholder = pageData.form.placeholders.email;
      
      const subjectInput = document.querySelector('#subject');
      if (subjectInput) subjectInput.placeholder = pageData.form.placeholders.subject;
      
      const messageInput = document.querySelector('#message');
      if (messageInput) messageInput.placeholder = pageData.form.placeholders.message;
      
      // 提交按钮
      const submitButton = document.querySelector('.submit-button');
      if (submitButton) submitButton.textContent = pageData.form.send;
      
      // 联系信息
      const contactInfoTitle = document.querySelector('.contact-info h2');
      if (contactInfoTitle) contactInfoTitle.textContent = pageData.contactInfo.title;
      
      const emailTitle = document.querySelector('.contact-item:first-child h3');
      if (emailTitle) emailTitle.textContent = pageData.contactInfo.email;
      
      const socialTitle = document.querySelector('.contact-item:nth-child(2) h3');
      if (socialTitle) socialTitle.textContent = pageData.contactInfo.social;
      
      // FAQ部分
      const faqItems = document.querySelectorAll('.faq-item');
      if (faqItems.length > 0 && pageData.faq) {
        faqItems.forEach((item, index) => {
          if (pageData.faq.items && pageData.faq.items[index]) {
            const question = item.querySelector('h3');
            const answer = item.querySelector('p');
            if (question) question.textContent = pageData.faq.items[index].question;
            if (answer) answer.textContent = pageData.faq.items[index].answer;
          }
        });
      }
    }
  }
}

// 页面加载时初始化语言切换器
document.addEventListener('DOMContentLoaded', () => {
  window.langSwitcher = new LanguageSwitcher();
=======
// 语言切换器组件
class LanguageSwitcher {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.languages = {
      en: {
        name: 'English',
        flag: '🇬🇧'
      },
      zh: {
        name: '中文',
        flag: '🇨🇳'
      }
    };
    this.translations = {};
    this.init();
  }

  async init() {
    // 加载语言文件
    try {
      const response = await fetch(`/locales/${this.currentLang}.json`);
      if (response.ok) {
        this.translations = await response.json();
        this.translatePage();
      } else {
        console.error('Failed to load language file');
      }
      
      // 针对特定页面加载额外的翻译
      const currentPage = this.getCurrentPage();
      if (currentPage !== 'index') {
        try {
          const pageResponse = await fetch(`/locales/${this.currentLang}-pages.json`);
          if (pageResponse.ok) {
            const pageTranslations = await pageResponse.json();
            this.translateSpecificPage(currentPage, pageTranslations);
          }
        } catch (error) {
          console.error('Error loading page-specific translations:', error);
        }
      }
    } catch (error) {
      console.error('Error loading language file:', error);
    }

    // 创建并挂载语言切换器
    this.render();
    // 初始设置HTML的lang属性
    document.documentElement.lang = this.currentLang;
  }

  async switchLanguage(lang) {
    if (lang === this.currentLang) return;
    
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (response.ok) {
        this.translations = await response.json();
        this.translatePage();
        
        // 针对特定页面重新加载翻译
        const currentPage = this.getCurrentPage();
        if (currentPage !== 'index') {
          try {
            const pageResponse = await fetch(`/locales/${lang}-pages.json`);
            if (pageResponse.ok) {
              const pageTranslations = await pageResponse.json();
              this.translateSpecificPage(currentPage, pageTranslations);
            }
          } catch (error) {
            console.error('Error loading page-specific translations:', error);
          }
        }
        
        this.updateSwitcher();
      } else {
        console.error('Failed to load language file');
      }
    } catch (error) {
      console.error('Error loading language file:', error);
    }
  }

  translatePage() {
    if (!this.translations) return;

    // 翻译标题和元数据
    document.title = this.translations.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = this.translations.meta.description;
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.content = this.translations.meta.keywords;
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = this.translations.seo.ogTitle;
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = this.translations.seo.ogDescription;

    // 翻译导航菜单
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '/') {
        link.textContent = this.translations.nav.home;
      } else if (href.includes('#generator')) {
        link.textContent = this.translations.nav.generator;
      } else if (href.includes('#how-it-works')) {
        link.textContent = this.translations.nav.howItWorks;
      } else if (href.includes('#gallery')) {
        link.textContent = this.translations.nav.gallery;
      } else if (href.includes('#faq')) {
        link.textContent = this.translations.nav.faq;
      } else if (href.includes('#about')) {
        link.textContent = this.translations.nav.about;
      }
    });

    // 翻译Hero区域
    const heroTitle = document.querySelector('.brat-title span');
    if (heroTitle) heroTitle.textContent = this.translations.hero.title;
    
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) subtitle.textContent = this.translations.hero.subtitle;

    // 翻译生成器区域
    const generatorTitle = document.querySelector('#generator h2');
    if (generatorTitle) generatorTitle.textContent = this.translations.generator.title;
    
    const textLabel = document.querySelector('label[for="text-input"]');
    if (textLabel) textLabel.textContent = this.translations.generator.enterText;
    
    const textInput = document.querySelector('#text-input');
    if (textInput) textInput.placeholder = this.translations.generator.textPlaceholder;
    
    const themeTitle = document.querySelector('.theme-selector h3');
    if (themeTitle) themeTitle.textContent = this.translations.generator.chooseTheme;
    
    const themeGreen = document.querySelector('#theme-green');
    if (themeGreen) themeGreen.textContent = this.translations.generator.green;
    
    const themeBlack = document.querySelector('#theme-black');
    if (themeBlack) themeBlack.textContent = this.translations.generator.black;
    
    const themeWhite = document.querySelector('#theme-white');
    if (themeWhite) themeWhite.textContent = this.translations.generator.white;
    
    const themeBlue = document.querySelector('#theme-blue');
    if (themeBlue) themeBlue.textContent = this.translations.generator.blue;
    
    const saveBtn = document.querySelector('#download-btn');
    if (saveBtn) saveBtn.textContent = this.translations.generator.saveImage;
    
    const tip = document.querySelector('.tip');
    if (tip) tip.textContent = this.translations.generator.tip;

    // 翻译How It Works区域
    const howTitle = document.querySelector('#how-it-works h2');
    if (howTitle) howTitle.textContent = this.translations.howItWorks.title;
    
    const steps = document.querySelectorAll('.step');
    if (steps.length >= 3) {
      const step1Title = steps[0].querySelector('h3');
      const step1Desc = steps[0].querySelector('p');
      if (step1Title) step1Title.textContent = this.translations.howItWorks.step1.title;
      if (step1Desc) step1Desc.textContent = this.translations.howItWorks.step1.description;
      
      const step2Title = steps[1].querySelector('h3');
      const step2Desc = steps[1].querySelector('p');
      if (step2Title) step2Title.textContent = this.translations.howItWorks.step2.title;
      if (step2Desc) step2Desc.textContent = this.translations.howItWorks.step2.description;
      
      const step3Title = steps[2].querySelector('h3');
      const step3Desc = steps[2].querySelector('p');
      if (step3Title) step3Title.textContent = this.translations.howItWorks.step3.title;
      if (step3Desc) step3Desc.textContent = this.translations.howItWorks.step3.description;
    }

    // 翻译Gallery区域
    const galleryTitle = document.querySelector('#gallery h2');
    if (galleryTitle) galleryTitle.textContent = this.translations.gallery.title;
    
    const galleryDesc = document.querySelector('.gallery-description');
    if (galleryDesc) galleryDesc.textContent = this.translations.gallery.description;
    
    const styleNames = document.querySelectorAll('.style-name');
    if (styleNames.length >= 4) {
      styleNames[0].textContent = this.translations.gallery.greenTheme;
      styleNames[1].textContent = this.translations.gallery.blackTheme;
      styleNames[2].textContent = this.translations.gallery.whiteTheme;
      styleNames[3].textContent = this.translations.gallery.blueTheme;
    }

    // 翻译FAQ区域
    const faqTitle = document.querySelector('#faq h2');
    if (faqTitle) faqTitle.textContent = this.translations.faq.title;
    
    const faqCards = document.querySelectorAll('.faq-card');
    if (faqCards.length > 0 && this.translations.faq.questions) {
      faqCards.forEach((card, index) => {
        if (this.translations.faq.questions[index]) {
          const question = card.querySelector('h3');
          const answer = card.querySelector('p');
          if (question) question.textContent = this.translations.faq.questions[index].question;
          if (answer) answer.textContent = this.translations.faq.questions[index].answer;
        }
      });
    }

    // 翻译About区域
    const aboutTitle = document.querySelector('#about h2');
    if (aboutTitle) aboutTitle.textContent = this.translations.about.title;
    
    const aboutParas = document.querySelectorAll('.about-content p');
    if (aboutParas.length >= 2) {
      aboutParas[0].textContent = this.translations.about.description1;
      aboutParas[1].textContent = this.translations.about.description2;
    }

    // 翻译Features区域
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0 && this.translations.features) {
      featureCards.forEach((card, index) => {
        if (this.translations.features[index]) {
          const title = card.querySelector('h3');
          const desc = card.querySelector('p');
          if (title) title.textContent = this.translations.features[index].title;
          if (desc) desc.textContent = this.translations.features[index].description;
        }
      });
    }

    // 翻译Footer区域
    const footerLinks = document.querySelector('.footer-links h3');
    if (footerLinks) footerLinks.textContent = this.translations.footer.links;
    
    const privacyLink = document.querySelector('.footer-links a[href="privacy.html"]');
    if (privacyLink) privacyLink.textContent = this.translations.footer.privacy;
    
    const termsLink = document.querySelector('.footer-links a[href="terms.html"]');
    if (termsLink) termsLink.textContent = this.translations.footer.terms;
    
    const contactLink = document.querySelector('.footer-links a[href="contact.html"]');
    if (contactLink) contactLink.textContent = this.translations.footer.contact;
    
    const followUs = document.querySelector('.social-links h3');
    if (followUs) followUs.textContent = this.translations.footer.followUs;
    
    const copyright = document.querySelector('.copyright p');
    if (copyright) {
      const year = new Date().getFullYear();
      copyright.textContent = `© ${year} Brat Generator. ${this.translations.footer.copyright}`;
    }
  }

  render() {
    // 创建语言切换器元素
    const container = document.createElement('div');
    container.className = 'language-switcher';
    
    const currentLang = document.createElement('div');
    currentLang.className = 'current-lang';
    currentLang.innerHTML = `${this.languages[this.currentLang].flag} ${this.languages[this.currentLang].name}`;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';
    
    // 添加语言选项
    Object.keys(this.languages).forEach(langCode => {
      const langOption = document.createElement('a');
      langOption.className = 'lang-option';
      langOption.dataset.lang = langCode;
      langOption.innerHTML = `${this.languages[langCode].flag} ${this.languages[langCode].name}`;
      
      langOption.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchLanguage(langCode);
      });
      
      dropdown.appendChild(langOption);
    });
    
    // 显示/隐藏下拉菜单
    currentLang.addEventListener('click', () => {
      dropdown.classList.toggle('show');
    });
    
    // 点击外部关闭下拉菜单
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
    
    container.appendChild(currentLang);
    container.appendChild(dropdown);
    
    // 添加到导航
    const nav = document.querySelector('header nav');
    if (nav) {
      nav.appendChild(container);
    }
    
    // 添加样式
    this.addStyles();
  }
  
  updateSwitcher() {
    const currentLang = document.querySelector('.current-lang');
    if (currentLang) {
      currentLang.innerHTML = `${this.languages[this.currentLang].flag} ${this.languages[this.currentLang].name}`;
    }
  }
  
  addStyles() {
    // 添加CSS样式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .language-switcher {
        position: relative;
        margin-left: 10px;
        cursor: pointer;
        z-index: 1000;
      }
      
      .current-lang {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: #f5f5f5;
        transition: background-color 0.3s ease;
      }
      
      .current-lang:hover {
        background-color: #e9e9e9;
      }
      
      .lang-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        width: 120px;
        display: none;
        flex-direction: column;
        margin-top: 5px;
      }
      
      .lang-dropdown.show {
        display: flex;
      }
      
      .lang-option {
        padding: 8px 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        text-decoration: none;
        color: #333;
      }
      
      .lang-option:hover {
        background-color: #f5f5f5;
      }
      
      @media (max-width: 768px) {
        .language-switcher {
          margin-top: 10px;
          align-self: flex-end;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  // 获取当前页面类型
  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('privacy.html')) {
      return 'privacy';
    } else if (path.includes('terms.html')) {
      return 'terms';
    } else if (path.includes('contact.html')) {
      return 'contact';
    }
    return 'index';
  }

  // 翻译特定页面
  translateSpecificPage(page, translations) {
    if (!translations || !translations[page]) return;
    
    const pageData = translations[page];
    
    // 更新页面标题
    document.title = pageData.title;
    
    // 更新页面主标题
    const heading = document.querySelector('.policy-section h1, .contact-section h1');
    if (heading) heading.textContent = pageData.heading;
    
    // 针对不同页面类型的特定翻译
    if (page === 'privacy' || page === 'terms') {
      const lastUpdated = document.querySelector('#current-date');
      if (lastUpdated) lastUpdated.textContent = pageData.lastUpdated;
      
      const intro = document.querySelector('.policy-content > p');
      if (intro) intro.textContent = pageData.intro;
      
      if (page === 'terms') {
        const agreement = document.querySelector('.policy-content > p:nth-child(3)');
        if (agreement) agreement.textContent = pageData.agreement;
      }
      
      // 翻译各节内容
      const sections = document.querySelectorAll('.policy-content h2');
      sections.forEach((section, index) => {
        if (pageData.sections && pageData.sections[index]) {
          section.textContent = pageData.sections[index].title;
          
          // 找到紧跟在h2后面的内容元素
          let contentElement = section.nextElementSibling;
          while (contentElement && contentElement.tagName !== 'H2') {
            if (contentElement.tagName === 'P' || contentElement.tagName === 'UL') {
              // 对于HTML内容，使用innerHTML
              contentElement.innerHTML = pageData.sections[index].content;
              break;
            }
            contentElement = contentElement.nextElementSibling;
          }
        }
      });
    } else if (page === 'contact') {
      // 翻译联系页面
      const intro = document.querySelector('.contact-content > p');
      if (intro) intro.textContent = pageData.intro;
      
      // 表单标签
      const nameLabel = document.querySelector('label[for="name"]');
      if (nameLabel) nameLabel.textContent = pageData.form.name;
      
      const emailLabel = document.querySelector('label[for="email"]');
      if (emailLabel) emailLabel.textContent = pageData.form.email;
      
      const subjectLabel = document.querySelector('label[for="subject"]');
      if (subjectLabel) subjectLabel.textContent = pageData.form.subject;
      
      const messageLabel = document.querySelector('label[for="message"]');
      if (messageLabel) messageLabel.textContent = pageData.form.message;
      
      // 表单占位符
      const nameInput = document.querySelector('#name');
      if (nameInput) nameInput.placeholder = pageData.form.placeholders.name;
      
      const emailInput = document.querySelector('#email');
      if (emailInput) emailInput.placeholder = pageData.form.placeholders.email;
      
      const subjectInput = document.querySelector('#subject');
      if (subjectInput) subjectInput.placeholder = pageData.form.placeholders.subject;
      
      const messageInput = document.querySelector('#message');
      if (messageInput) messageInput.placeholder = pageData.form.placeholders.message;
      
      // 提交按钮
      const submitButton = document.querySelector('.submit-button');
      if (submitButton) submitButton.textContent = pageData.form.send;
      
      // 联系信息
      const contactInfoTitle = document.querySelector('.contact-info h2');
      if (contactInfoTitle) contactInfoTitle.textContent = pageData.contactInfo.title;
      
      const emailTitle = document.querySelector('.contact-item:first-child h3');
      if (emailTitle) emailTitle.textContent = pageData.contactInfo.email;
      
      const socialTitle = document.querySelector('.contact-item:nth-child(2) h3');
      if (socialTitle) socialTitle.textContent = pageData.contactInfo.social;
      
      // FAQ部分
      const faqItems = document.querySelectorAll('.faq-item');
      if (faqItems.length > 0 && pageData.faq) {
        faqItems.forEach((item, index) => {
          if (pageData.faq.items && pageData.faq.items[index]) {
            const question = item.querySelector('h3');
            const answer = item.querySelector('p');
            if (question) question.textContent = pageData.faq.items[index].question;
            if (answer) answer.textContent = pageData.faq.items[index].answer;
          }
        });
      }
    }
  }
}

// 页面加载时初始化语言切换器
document.addEventListener('DOMContentLoaded', () => {
  window.langSwitcher = new LanguageSwitcher();
>>>>>>> b45925e (更新网站为Charli XCX Brat Text Generator)
}); 