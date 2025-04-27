/**
 * FAQ部分处理器
 * 为FAQ卡片添加折叠/展开功能，在懒加载后自动初始化
 */
function initFaqFunctionality() {
  const faqCards = document.querySelectorAll('.faq-card');
  if (!faqCards.length) return;
  
  console.log(`Initializing FAQ functionality for ${faqCards.length} cards`);
  
  faqCards.forEach(card => {
    const question = card.querySelector('h3');
    const answer = card.querySelector('p');
    
    // 初始隐藏答案
    if (answer) answer.style.display = 'none';
    
    // 添加点击事件
    if (question) {
      question.addEventListener('click', () => {
        // 折叠其他所有卡片
        faqCards.forEach(otherCard => {
          if (otherCard !== card && otherCard.classList.contains('active')) {
            otherCard.classList.remove('active');
            const otherAnswer = otherCard.querySelector('p');
            if (otherAnswer) otherAnswer.style.display = 'none';
          }
        });
        
        // 切换当前卡片状态
        card.classList.toggle('active');
        if (answer) {
          if (card.classList.contains('active')) {
            answer.style.display = 'block';
            // 平滑滚动到卡片
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            answer.style.display = 'none';
          }
        }
      });
    }
  });
  
  // 为用户提供一个选项打开/关闭所有FAQ
  const faqSection = document.querySelector('.faq-section');
  if (faqSection && faqSection.querySelector('h2')) {
    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.className = 'toggle-all-btn';
    toggleAllBtn.textContent = 'Show All Answers';
    toggleAllBtn.style.marginLeft = '10px';
    toggleAllBtn.style.fontSize = '0.8em';
    toggleAllBtn.style.padding = '5px 10px';
    toggleAllBtn.style.background = '#f0f0f0';
    toggleAllBtn.style.border = 'none';
    toggleAllBtn.style.borderRadius = '4px';
    toggleAllBtn.style.cursor = 'pointer';
    
    // 跟踪当前状态
    let allOpen = false;
    
    toggleAllBtn.addEventListener('click', () => {
      allOpen = !allOpen;
      faqCards.forEach(card => {
        card.classList.toggle('active', allOpen);
        const answer = card.querySelector('p');
        if (answer) answer.style.display = allOpen ? 'block' : 'none';
      });
      toggleAllBtn.textContent = allOpen ? 'Hide All Answers' : 'Show All Answers';
    });
    
    // 将按钮添加到标题后面
    const heading = faqSection.querySelector('h2');
    heading.parentNode.insertBefore(toggleAllBtn, heading.nextSibling);
  }
}

// 监听新的懒加载事件名称
document.addEventListener('section-visible', function(e) {
  if (e.detail && e.detail.section.classList.contains('faq-section')) {
    // 短暂延迟以确保DOM已完全渲染
    setTimeout(() => {
      initFaqFunctionality();
    }, 100);
  }
});

// 同时保留对旧事件的支持
document.addEventListener('section-loaded', function(e) {
  if (e.detail && e.detail.section.classList.contains('faq-section')) {
    initFaqFunctionality();
  }
});

// 为非懒加载场景初始化
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const disableLazyLoad = urlParams.get('nolazyload') === 'true';
  
  if (disableLazyLoad) {
    // 如果禁用了懒加载，直接初始化FAQ
    setTimeout(initFaqFunctionality, 500);
  }
}); 