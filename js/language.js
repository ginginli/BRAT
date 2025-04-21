console.log('Language.js loaded');

// 简单的语言切换器实现
function initLanguageSwitcher() {
    console.log('Initializing language switcher');
    
    // 获取元素
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    console.log('Elements found:', {
        langBtn: langBtn ? 'yes' : 'no',
        langDropdown: langDropdown ? 'yes' : 'no'
    });
    
    if (!langBtn || !langDropdown) {
        console.warn('Language switcher elements not found');
        return;
    }
    
    // 设置初始状态
    langDropdown.style.display = 'none';
    
    // 点击按钮时切换下拉菜单
    langBtn.onclick = function(e) {
        console.log('Button clicked');
        e.preventDefault();
        e.stopPropagation();
        
        const isVisible = langDropdown.style.display === 'block';
        console.log('Current visibility:', isVisible);
        
        langDropdown.style.display = isVisible ? 'none' : 'block';
        console.log('New visibility:', !isVisible);
    };
    
    // 点击页面其他地方时关闭下拉菜单
    document.onclick = function(e) {
        if (e.target !== langBtn) {
            langDropdown.style.display = 'none';
        }
    };
    
    // 防止点击下拉菜单时关闭
    langDropdown.onclick = function(e) {
        e.stopPropagation();
    };
    
    console.log('Language switcher initialized');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
    initLanguageSwitcher();
} 