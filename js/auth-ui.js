// 认证UI组件
class AuthUI {
    constructor() {
        this.authContainer = null;
        this.userInfoContainer = null;
        this.isVisible = false;
    }

    // 创建登录按钮
    createSignInButton() {
        const button = document.createElement('button');
        button.id = 'google-signin-btn';
        button.className = 'google-signin-button';
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
        `;
        
        button.addEventListener('click', () => {
            this.handleSignIn();
        });
        
        return button;
    }

    // 创建用户信息显示
    createUserInfo(user) {
        const container = document.createElement('div');
        container.className = 'user-info-container';
        container.innerHTML = `
            <div class="user-avatar">
                <img src="${user.imageUrl}" alt="${user.name}" />
            </div>
            <div class="user-details">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
            </div>
            <button class="signout-btn" id="signout-btn">Sign Out</button>
        `;
        
        // 添加登出事件监听
        const signOutBtn = container.querySelector('#signout-btn');
        signOutBtn.addEventListener('click', () => {
            this.handleSignOut();
        });
        
        return container;
    }

    // 创建认证容器
    createAuthContainer() {
        const container = document.createElement('div');
        container.id = 'auth-container';
        container.className = 'auth-container';
        
        // 创建登录按钮
        const signInBtn = this.createSignInButton();
        container.appendChild(signInBtn);
        
        return container;
    }

    // 显示认证UI
    show() {
        if (this.isVisible) return;
        
        // 查找或创建认证容器
        this.authContainer = document.getElementById('auth-container');
        if (!this.authContainer) {
            this.authContainer = this.createAuthContainer();
            
            // 插入到页面中（在header之后）
            const header = document.querySelector('header');
            if (header) {
                header.insertAdjacentElement('afterend', this.authContainer);
            }
        }
        
        this.authContainer.style.display = 'block';
        this.isVisible = true;
    }

    // 隐藏认证UI
    hide() {
        if (this.authContainer) {
            this.authContainer.style.display = 'none';
        }
        this.isVisible = false;
    }

    // 更新UI状态
    updateUI(user) {
        if (user) {
            // 用户已登录，显示用户信息
            this.showUserInfo(user);
        } else {
            // 用户未登录，显示登录按钮
            this.showSignInButton();
        }
    }

    // 显示用户信息
    showUserInfo(user) {
        if (this.authContainer) {
            this.authContainer.innerHTML = '';
            const userInfo = this.createUserInfo(user);
            this.authContainer.appendChild(userInfo);
        }
    }

    // 显示登录按钮
    showSignInButton() {
        if (this.authContainer) {
            this.authContainer.innerHTML = '';
            const signInBtn = this.createSignInButton();
            this.authContainer.appendChild(signInBtn);
        }
    }

    // 处理登录
    async handleSignIn() {
        try {
            const user = await window.googleAuth.signIn();
            this.updateUI(user);
            this.showSuccessMessage('Successfully signed in!');
        } catch (error) {
            this.showErrorMessage('Sign in failed. Please try again.');
            console.error('Sign in error:', error);
        }
    }

    // 处理登出
    async handleSignOut() {
        try {
            await window.googleAuth.signOut();
            this.updateUI(null);
            this.showSuccessMessage('Successfully signed out!');
        } catch (error) {
            this.showErrorMessage('Sign out failed. Please try again.');
            console.error('Sign out error:', error);
        }
    }

    // 显示成功消息
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    // 显示错误消息
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    // 显示消息
    showMessage(message, type) {
        // 移除现有消息
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 创建新消息
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message auth-message-${type}`;
        messageDiv.textContent = message;
        
        // 添加到页面
        document.body.appendChild(messageDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
}

// 创建全局实例
window.authUI = new AuthUI();
