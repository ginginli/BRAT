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
        'nav.about': 'About'
      },
      'es-MX': {
        'nav.generator': 'Generador',
        'nav.features': 'Características',
        'nav.whatIs': 'Qué Es',
        'nav.howItWorks': 'Cómo Funciona',
        'nav.why': 'Por Qué',
        'nav.gallery': 'Galería',
        'nav.faq': 'Preguntas Frecuentes',
        'nav.about': 'Acerca de'
      },
      'zh-CN': {
        'nav.generator': '生成器',
        'nav.features': '功能特点',
        'nav.whatIs': '什么是Brat',
        'nav.howItWorks': '使用方法',
        'nav.why': '为什么使用',
        'nav.gallery': '作品展示',
        'nav.faq': '常见问题',
        'nav.about': '关于我们'
      }
    };
  }

  init() {
    this.setupLanguageSwitcher();
    this.updateNavigation();
  }

  setupLanguageSwitcher() {
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    console.log('Setting up language switcher:', {
      langBtn: !!langBtn,
      langDropdown: !!langDropdown
    });
    
    if (langBtn && langDropdown) {
      // 更新当前语言按钮文本
      this.updateLanguageButton();
      
      // 标记当前语言选项
      const currentLangItem = langDropdown.querySelector(`[href*="${this.currentLang}"]`);
      if (currentLangItem) {
        currentLangItem.classList.add('active');
      }

      // 点击按钮时切换下拉菜单
      langBtn.addEventListener('click', (e) => {
        console.log('Language button clicked');
        e.stopPropagation();
        langDropdown.classList.toggle('show');
        console.log('Dropdown visibility:', langDropdown.classList.contains('show'));
      });

      // 点击页面其他地方时关闭下拉菜单
      document.addEventListener('click', () => {
        console.log('Document clicked');
        if (langDropdown.classList.contains('show')) {
          langDropdown.classList.remove('show');
        }
      });

      // 防止点击下拉菜单时关闭
      langDropdown.addEventListener('click', (e) => {
        console.log('Dropdown clicked');
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
    const navItems = document.querySelectorAll('[data-i18n^="nav."]');
    navItems.forEach(item => {
      const key = item.getAttribute('data-i18n');
      if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
        item.textContent = this.translations[this.currentLang][key];
      }
    });
  }
}

// 页面加载时初始化语言切换器
document.addEventListener('DOMContentLoaded', () => {
  const langSwitcher = new LanguageSwitcher();
  langSwitcher.init();
  window.langSwitcher = langSwitcher;
}); 