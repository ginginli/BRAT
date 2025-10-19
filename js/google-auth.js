// Google OAuth 2.0 配置和认证处理
class GoogleAuth {
    constructor() {
        this.clientId = 'YOUR_GOOGLE_CLIENT_ID'; // 需要替换为您的实际Client ID
        this.redirectUri = window.location.origin + '/auth/callback.html';
        this.scope = 'openid email profile';
        this.isInitialized = false;
        this.user = null;
        this.callbacks = {
            onSignIn: null,
            onSignOut: null,
            onError: null
        };
    }

    // 初始化Google API
    async initialize() {
        if (this.isInitialized) return;

        try {
            // 动态加载Google API
            await this.loadGoogleAPI();
            
            // 初始化Google API客户端
            await window.gapi.load('auth2', () => {
                window.gapi.auth2.init({
                    client_id: this.clientId,
                    scope: this.scope
                }).then(() => {
                    this.isInitialized = true;
                    console.log('Google Auth initialized successfully');
                    this.checkAuthStatus();
                });
            });
        } catch (error) {
            console.error('Failed to initialize Google Auth:', error);
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
        }
    }

    // 动态加载Google API
    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 检查当前认证状态
    checkAuthStatus() {
        if (!this.isInitialized) return;

        const authInstance = window.gapi.auth2.getAuthInstance();
        const isSignedIn = authInstance.isSignedIn.get();
        
        if (isSignedIn) {
            const user = authInstance.currentUser.get();
            this.user = this.extractUserInfo(user);
            if (this.callbacks.onSignIn) {
                this.callbacks.onSignIn(this.user);
            }
        }
    }

    // 提取用户信息
    extractUserInfo(googleUser) {
        const profile = googleUser.getBasicProfile();
        return {
            id: profile.getId(),
            name: profile.getName(),
            email: profile.getEmail(),
            imageUrl: profile.getImageUrl(),
            idToken: googleUser.getAuthResponse().id_token
        };
    }

    // 登录
    async signIn() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const authInstance = window.gapi.auth2.getAuthInstance();
            const googleUser = await authInstance.signIn();
            
            this.user = this.extractUserInfo(googleUser);
            
            // 保存用户信息到localStorage
            localStorage.setItem('brat_generator_user', JSON.stringify(this.user));
            
            if (this.callbacks.onSignIn) {
                this.callbacks.onSignIn(this.user);
            }
            
            return this.user;
        } catch (error) {
            console.error('Sign in failed:', error);
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
            throw error;
        }
    }

    // 登出
    async signOut() {
        if (!this.isInitialized) return;

        try {
            const authInstance = window.gapi.auth2.getAuthInstance();
            await authInstance.signOut();
            
            this.user = null;
            localStorage.removeItem('brat_generator_user');
            
            if (this.callbacks.onSignOut) {
                this.callbacks.onSignOut();
            }
        } catch (error) {
            console.error('Sign out failed:', error);
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
        }
    }

    // 获取当前用户
    getCurrentUser() {
        return this.user;
    }

    // 检查是否已登录
    isSignedIn() {
        return this.user !== null;
    }

    // 设置回调函数
    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    // 从localStorage恢复用户信息
    restoreUser() {
        try {
            const savedUser = localStorage.getItem('brat_generator_user');
            if (savedUser) {
                this.user = JSON.parse(savedUser);
                return this.user;
            }
        } catch (error) {
            console.error('Failed to restore user:', error);
            localStorage.removeItem('brat_generator_user');
        }
        return null;
    }
}

// 创建全局实例
window.googleAuth = new GoogleAuth();

// 页面加载时自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.googleAuth.initialize();
});
