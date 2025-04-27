/**
 * 强化版懒加载工具
 * 使用Intersection Observer API高效地延迟加载页面内容和图片
 * 主要优势：
 * 1. 优化图片加载，只在需要时加载
 * 2. 保留页面结构避免CLS(累积布局偏移)
 * 3. 对搜索引擎更友好
 */

// 在DOM加载后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 检查浏览器是否支持Intersection Observer
  if (!('IntersectionObserver' in window)) {
    loadAllContent();
    return;
  }

  // 检查URL参数是否禁用懒加载
  const urlParams = new URLSearchParams(window.location.search);
  const disableLazyLoad = urlParams.get('nolazyload') === 'true';
  
  if (disableLazyLoad) {
    document.body.classList.add('no-lazy-load');
    loadAllContent();
    return;
  }

  // 1. 初始化部分懒加载
  initSectionLazyLoading();
  
  // 2. 初始化图片懒加载
  initImageLazyLoading();
});

/**
 * 延迟加载非关键页面部分
 */
function initSectionLazyLoading() {
  // 需要懒加载的部分
  const lazySections = document.querySelectorAll(
    '.features-section, .what-is-section, .how-it-works-section, ' +
    '.why-use-section, .gallery-section, .faq-section, .testimonials-section'
  );
  
  // 核心部分，不延迟加载
  const immediateSections = ['generator-section'];
  
  // 创建并保存占位符
  lazySections.forEach(section => {
    // 跳过核心部分
    if (immediateSections.some(cls => section.classList.contains(cls))) {
      return;
    }
    
    // 为非关键部分添加懒加载标记
    section.classList.add('lazy-section');
    
    // 保留元素高度以防止CLS
    const height = section.offsetHeight;
    if (height > 0) {
      section.style.minHeight = `${height}px`;
    } else {
      // 如果无法确定高度，使用默认值
      section.style.minHeight = '300px';
    }
    
    // 应用淡入效果的初始样式
    section.style.opacity = '0.2';
    section.style.transition = 'opacity 0.5s ease-in';
  });
  
  // 创建观察器
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        
        // 触发加载并展示内容
        section.style.opacity = '1';
        
        // 触发自定义加载事件
        const event = new CustomEvent('section-visible', {
          detail: { section },
          bubbles: true
        });
        section.dispatchEvent(event);
        
        // 停止观察已加载的部分
        sectionObserver.unobserve(section);
      }
    });
  }, {
    // 当元素距离可见区域300px时开始加载
    rootMargin: '300px 0px',
    threshold: 0
  });
  
  // 开始观察所有懒加载区域
  document.querySelectorAll('.lazy-section').forEach(section => {
    sectionObserver.observe(section);
  });
}

/**
 * 延迟加载图片
 */
function initImageLazyLoading() {
  // 查找所有具有data-src属性的图片
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  // 处理背景图片
  const lazyBackgrounds = document.querySelectorAll('[data-background]');
  
  // 如果没有懒加载图片，提前退出
  if (lazyImages.length === 0 && lazyBackgrounds.length === 0) return;
  
  // 创建图片观察器
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        if (target.tagName.toLowerCase() === 'img') {
          // 处理图片元素
          const src = target.getAttribute('data-src');
          if (src) {
            // 预加载图片
            const img = new Image();
            img.onload = () => {
              target.src = src;
              // 加载完成后淡入
              target.style.opacity = '1';
            };
            img.src = src;
            
            // 移除懒加载标记
            target.removeAttribute('data-src');
            target.classList.remove('lazy-image');
          }
        } 
        else {
          // 处理背景图片
          const bgUrl = target.getAttribute('data-background');
          if (bgUrl) {
            target.style.backgroundImage = `url(${bgUrl})`;
            target.removeAttribute('data-background');
          }
        }
        
        // 停止观察已加载的元素
        imageObserver.unobserve(target);
      }
    });
  }, {
    // 当图片距离可见区域100px时开始加载
    rootMargin: '100px 0px',
    threshold: 0
  });
  
  // 监视懒加载图片
  lazyImages.forEach(img => {
    // 添加占位符样式
    img.classList.add('lazy-image');
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s';
    
    // 观察图片
    imageObserver.observe(img);
  });
  
  // 监视懒加载背景
  lazyBackgrounds.forEach(element => {
    imageObserver.observe(element);
  });
}

/**
 * 立即加载所有内容的备用方法
 */
function loadAllContent() {
  // 加载所有图片
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src');
  });
  
  // 加载所有背景
  document.querySelectorAll('[data-background]').forEach(element => {
    element.style.backgroundImage = `url(${element.getAttribute('data-background')})`;
    element.removeAttribute('data-background');
  });
  
  // 显示所有区域
  document.querySelectorAll('.lazy-section').forEach(section => {
    section.style.opacity = '1';
    
    // 触发加载事件
    const event = new CustomEvent('section-visible', {
      detail: { section },
      bubbles: true
    });
    section.dispatchEvent(event);
  });
}

// 监听DOM变化，处理动态添加的元素
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // 检查并处理新添加的元素
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // 元素节点
          // 检查新添加的图片
          const newImages = node.querySelectorAll ? 
                            node.querySelectorAll('img[data-src]') : [];
          
          if (newImages.length > 0) {
            initImageLazyLoading();
          }
          
          // 检查新添加的区域
          if (node.classList && 
             (node.classList.contains('features-section') || 
              node.classList.contains('faq-section') ||
              node.classList.contains('gallery-section'))) {
            initSectionLazyLoading();
          }
        }
      });
    }
  });
});

// 观察文档变化
observer.observe(document.body, {
  childList: true,
  subtree: true
}); 