// 语言切换器组件
class LanguageSwitcher {
  constructor() {
    this.currentLang = document.documentElement.lang || 'en';
    this.translations = {
      'en': {
        'nav.generator': 'Generator',
        'nav.features': 'Features',
        'nav.whatIs': 'What Is',
        'nav.howItWorks': 'How It Works',
        'nav.why': 'Why',
        'nav.gallery': 'Gallery',
        'nav.faq': 'FAQ',
        'nav.about': 'About',
        'footer.blogCollection': 'Blog Collection',
        'footer.themesTools': 'Themes & Tools',
        'footer.getStarted': 'Get Started'
      },
      'es-MX': {
        'nav.generator': 'Generador',
        'nav.features': 'Características',
        'nav.whatIs': 'Qué Es',
        'nav.howItWorks': 'Cómo Funciona',
        'nav.why': 'Por Qué',
        'nav.gallery': 'Galería',
        'nav.faq': 'Preguntas Frecuentes',
        'nav.about': 'Acerca de',
        'footer.blogCollection': 'Colección de Blog',
        'footer.themesTools': 'Temas y Herramientas',
        'footer.getStarted': 'Comenzar'
      },
      'zh-CN': {
        'nav.generator': '生成器',
        'nav.features': '功能特点',
        'nav.whatIs': '什么是Brat',
        'nav.howItWorks': '使用方法',
        'nav.why': '为什么使用',
        'nav.gallery': '作品展示',
        'nav.faq': '常见问题',
        'nav.about': '关于我们',
        'footer.blogCollection': '博客合集',
        'footer.themesTools': '主题与工具',
        'footer.getStarted': '开始使用'
      }
    };
    console.log('LanguageSwitcher constructed');
  }

  init() {
    console.log('LanguageSwitcher initializing');
    this.setupLanguageSwitcher();
    this.updateNavigation();
    console.log('LanguageSwitcher initialization complete');
  }

  setupLanguageSwitcher() {
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    console.log('Setting up language switcher:', {
      langBtn: !!langBtn,
      langDropdown: !!langDropdown,
      btnText: langBtn ? langBtn.textContent : null,
      dropdownVisible: langDropdown ? langDropdown.classList.contains('show') : null
    });
    
    if (langBtn && langDropdown) {
      // 更新当前语言按钮文本
      this.updateLanguageButton();
      
      // 标记当前语言选项
      const currentLangItem = langDropdown.querySelector(`[href*="${this.currentLang}"]`);
      if (currentLangItem) {
        currentLangItem.classList.add('active');
      }

      // 移除现有的事件监听器（如果有的话）
      const newLangBtn = langBtn.cloneNode(true);
      langBtn.parentNode.replaceChild(newLangBtn, langBtn);
      
      const newLangDropdown = langDropdown.cloneNode(true);
      langDropdown.parentNode.replaceChild(newLangDropdown, langDropdown);

      // 重新添加事件监听器
      newLangBtn.addEventListener('click', (e) => {
        console.log('Language button clicked');
        e.stopPropagation();
        const isVisible = newLangDropdown.classList.contains('show');
        console.log('Current dropdown state:', isVisible);
        newLangDropdown.classList.toggle('show');
        console.log('New dropdown state:', newLangDropdown.classList.contains('show'));
      });

      document.addEventListener('click', (e) => {
        console.log('Document clicked, target:', e.target.tagName, e.target.className);
        if (newLangDropdown.classList.contains('show')) {
          console.log('Closing dropdown');
          newLangDropdown.classList.remove('show');
        }
      });

      newLangDropdown.addEventListener('click', (e) => {
        console.log('Dropdown clicked, target:', e.target.tagName, e.target.className);
        e.stopPropagation();
      });
    }
  }

  updateLanguageButton() {
    const langBtn = document.querySelector('.lang-btn');
    if (langBtn) {
      switch (this.currentLang) {
        case 'zh-CN':
          langBtn.textContent = '🌐 语言';
          break;
        case 'es-MX':
        case 'es-AR':
          langBtn.textContent = '🌐 Idioma';
          break;
        case 'tr':
          langBtn.textContent = '🌐 Dil';
          break;
        case 'fil':
          langBtn.textContent = '🌐 Wika';
          break;
        case 'id':
          langBtn.textContent = '🌐 Bahasa';
          break;
        default:
          langBtn.textContent = '🌐 Language';
      }
    }
  }

  updateNavigation() {
    // 处理所有带data-i18n属性的元素，不仅仅是导航项
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(item => {
      const key = item.getAttribute('data-i18n');
      if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
        item.textContent = this.translations[this.currentLang][key];
      }
    });
  }
}

// 页面加载时初始化语言切换器
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, creating LanguageSwitcher');
  const langSwitcher = new LanguageSwitcher();
  langSwitcher.init();
  window.langSwitcher = langSwitcher;
}); 