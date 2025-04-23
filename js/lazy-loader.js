/**
 * 懒加载内容管理器
 * 使用Intersection Observer加载页面中的非关键内容区块
 */
document.addEventListener('DOMContentLoaded', function() {
  // 检查URL参数是否禁用懒加载
  const urlParams = new URLSearchParams(window.location.search);
  const disableLazyLoad = urlParams.get('nolazyload') === 'true';
  
  // 如果禁用懒加载，直接返回
  if (disableLazyLoad) {
    document.body.classList.add('no-lazy-load');
    console.log('Lazy loading disabled via URL parameter');
    return;
  }
  
  // 需要懒加载的部分
  const lazySections = document.querySelectorAll(
    '.features-section, .what-is-section, .how-it-works-section, ' +
    '.why-use-section, .gallery-section, .faq-section, .testimonials-section'
  );
  
  // 跳过生成器部分
  const skipSections = ['generator-section'];
  
  // 预处理部分 - 隐藏内容但保留结构
  lazySections.forEach(section => {
    // 检查是否应该跳过此部分
    const shouldSkip = skipSections.some(skipClass => section.classList.contains(skipClass));
    if (shouldSkip) {
      console.log(`Skipping section: ${section.className}`);
      return;
    }
    
    // 保存原始内容
    const originalContent = section.innerHTML;
    const sectionTitle = section.querySelector('h2') ? 
                         section.querySelector('h2').textContent : 
                         'Section Content';
    
    // 替换为占位内容
    section.innerHTML = `
      <div class="container">
        <h2>${sectionTitle}</h2>
        <div class="content-placeholder">
          <div class="loading-spinner" style="display: none;"></div>
        </div>
        <div class="original-content" style="display: none;">${originalContent}</div>
      </div>
    `;
    
    // 标记为未加载
    section.dataset.loaded = 'false';
  });
  
  // 创建 Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        
        // 检查是否已加载
        if (section.dataset.loaded === 'false') {
          loadSectionContent(section);
        }
        
        // 停止观察已加载的部分
        observer.unobserve(section);
      }
    });
  }, {
    // 提前200px触发加载
    rootMargin: '200px 0px',
    threshold: 0.1 // 当10%的元素可见时触发
  });
  
  // 开始观察懒加载区域
  lazySections.forEach(section => {
    // 检查是否应该跳过此部分
    const shouldSkip = skipSections.some(skipClass => section.classList.contains(skipClass));
    if (!shouldSkip) {
      observer.observe(section);
    }
  });
  
  /**
   * 加载部分内容
   */
  function loadSectionContent(section) {
    // 显示加载动画
    const spinner = section.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'block';
    
    // 模拟加载延迟（实际生产中可以删除）
    setTimeout(() => {
      // 获取原始内容
      const originalContent = section.querySelector('.original-content').innerHTML;
      section.innerHTML = originalContent;
      
      // 标记为已加载
      section.dataset.loaded = 'true';
      
      // 处理特殊区块的交互性
      initSectionFunctionality(section);
      
      // 触发自定义事件，通知其他脚本部分已加载
      const loadedEvent = new CustomEvent('section-loaded', {
        detail: {
          section: section,
          sectionId: section.id || null,
          sectionClass: section.className
        },
        bubbles: true
      });
      section.dispatchEvent(loadedEvent);
      
      console.log(`Loaded section: ${section.className}`);
    }, 100); // 100ms延迟，保持页面流畅同时模拟加载过程
  }
  
  /**
   * 初始化区块特定功能
   */
  function initSectionFunctionality(section) {
    // 为FAQ部分添加折叠/展开功能
    if (section.classList.contains('faq-section')) {
      const faqCards = section.querySelectorAll('.faq-card');
      faqCards.forEach(card => {
        const question = card.querySelector('h3');
        const answer = card.querySelector('p');
        
        // 初始隐藏答案
        if (answer) answer.style.display = 'none';
        
        // 添加点击事件
        if (question) {
          question.addEventListener('click', () => {
            card.classList.toggle('active');
            if (answer) {
              answer.style.display = card.classList.contains('active') ? 'block' : 'none';
            }
          });
        }
      });
    }
    
    // 为画廊部分添加特定功能
    if (section.classList.contains('gallery-section')) {
      // 画廊特定功能初始化
    }
  }
}); 