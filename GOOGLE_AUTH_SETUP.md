# 谷歌登录集成设置指南

## 概述
本指南将帮助您完成Brat Generator网站的谷歌登录功能集成。

## 1. Google Cloud Console 设置

### 1.1 创建项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API 和 Google Identity API

### 1.2 配置OAuth同意屏幕
1. 转到 "APIs & Services" > "OAuth consent screen"
2. 选择 "External" 用户类型
3. 填写应用信息：
   - 应用名称：Brat Generator
   - 用户支持邮箱：您的邮箱
   - 开发者联系信息：您的邮箱
4. 添加作用域：
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`

### 1.3 创建OAuth 2.0凭据
1. 转到 "APIs & Services" > "Credentials"
2. 点击 "Create Credentials" > "OAuth 2.0 Client IDs"
3. 应用类型选择 "Web application"
4. 添加授权的重定向URI：
   - `http://localhost:3000/auth/callback.html` (开发环境)
   - `https://yourdomain.com/auth/callback.html` (生产环境)

### 1.4 获取客户端ID和密钥
复制生成的客户端ID和客户端密钥，稍后需要用到。

## 2. 后端服务器设置

### 2.1 安装依赖
```bash
cd server
npm install
```

### 2.2 配置环境变量
1. 复制 `env.example` 为 `.env`
2. 填入您的配置：
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 2.3 启动服务器
```bash
npm start
# 或开发模式
npm run dev
```

## 3. 前端配置

### 3.1 更新客户端ID
编辑 `js/google-auth.js` 文件，将 `YOUR_GOOGLE_CLIENT_ID` 替换为您的实际客户端ID：

```javascript
this.clientId = 'your_actual_google_client_id';
```

### 3.2 配置API端点
如果后端服务器运行在不同端口，需要更新API端点：

```javascript
// 在 js/google-auth.js 中添加
const API_BASE_URL = 'http://localhost:3001'; // 或您的服务器地址
```

## 4. 部署到生产环境

### 4.1 更新重定向URI
在Google Cloud Console中添加生产环境的回调URL：
- `https://yourdomain.com/auth/callback.html`

### 4.2 更新环境变量
```env
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
JWT_SECRET=your_production_jwt_secret
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### 4.3 部署选项

#### 选项1：Vercel部署
1. 将前端文件部署到Vercel
2. 将后端部署到Vercel Functions或单独服务器
3. 更新CORS设置

#### 选项2：Netlify部署
1. 前端部署到Netlify
2. 后端部署到Netlify Functions或外部服务器

#### 选项3：传统服务器
1. 将文件上传到您的服务器
2. 配置Nginx或Apache
3. 确保HTTPS证书有效

## 5. 测试

### 5.1 本地测试
1. 启动后端服务器：`npm start`
2. 在浏览器中打开前端页面
3. 点击"Sign in with Google"按钮
4. 完成OAuth流程
5. 验证用户信息显示正确

### 5.2 生产环境测试
1. 确保所有URL配置正确
2. 测试登录和登出功能
3. 验证用户会话持久化
4. 检查移动端兼容性

## 6. 故障排除

### 常见问题

#### 6.1 "Invalid client" 错误
- 检查客户端ID是否正确
- 确认重定向URI配置正确

#### 6.2 CORS错误
- 检查后端CORS配置
- 确认前端URL在允许列表中

#### 6.3 Token验证失败
- 检查JWT密钥配置
- 确认token未过期

#### 6.4 移动端登录问题
- 检查移动端重定向URI
- 确认响应式设计正确

### 调试技巧
1. 打开浏览器开发者工具
2. 查看Console错误信息
3. 检查Network请求状态
4. 验证localStorage中的用户数据

## 7. 安全注意事项

1. **保护密钥**：永远不要在前端代码中暴露客户端密钥
2. **HTTPS**：生产环境必须使用HTTPS
3. **JWT密钥**：使用强随机密钥
4. **定期更新**：定期轮换密钥和token
5. **监控**：监控异常登录活动

## 8. 功能扩展

### 8.1 用户数据存储
- 可以添加数据库存储用户信息
- 实现用户偏好设置保存

### 8.2 权限管理
- 添加用户角色系统
- 实现功能访问控制

### 8.3 社交功能
- 添加用户生成内容分享
- 实现用户作品展示

## 支持

如果遇到问题，请检查：
1. Google Cloud Console配置
2. 网络连接和防火墙设置
3. 浏览器控制台错误信息
4. 服务器日志

---

**注意**：这是一个完整的OAuth 2.0集成方案，请根据您的具体需求进行调整。
