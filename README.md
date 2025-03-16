# Brat Generator

一个简单而强大的网页应用，用于创建"Brat"风格的图片。用户可以输入自定义文本，选择不同的主题，并生成个性化的图片。

## 功能特点

- 实时文本预览
- 多种主题选择（绿色、黑色、白色、蓝色）
- 响应式设计，适配各种设备
- 图片保存功能
- SEO优化

## 文件结构

```
brat-generator/
├── index.html          # 主页
├── privacy.html        # 隐私政策页面
├── terms.html          # 使用条款页面（待创建）
├── contact.html        # 联系我们页面（待创建）
├── styles.css          # 样式表
├── script.js           # JavaScript脚本
├── images/             # 图片目录
│   ├── logo.png
│   ├── logo-footer.png
│   ├── brat-bg-green.png
│   ├── brat-bg-black.png
│   ├── brat-bg-white.png
│   ├── brat-bg-blue.png
│   ├── gallery-1.jpg
│   ├── gallery-2.jpg
│   ├── gallery-3.jpg
│   ├── gallery-4.jpg
│   ├── instagram.svg
│   ├── twitter.svg
│   └── facebook.svg
└── fonts/              # 字体目录
    └── arial-narrow.woff2
```

## 安装和使用

1. 克隆或下载此仓库
2. 确保所有图片和字体文件都放在正确的目录中
3. 在浏览器中打开 `index.html` 文件

或者，您可以将文件上传到您的网络服务器上。

## 自定义

### 添加新主题

1. 在 `styles.css` 中添加新的主题样式
2. 在 `index.html` 中添加新的主题按钮
3. 在 `script.js` 中更新 `setTheme` 函数以支持新主题

### 更改背景图片

1. 将新的背景图片添加到 `images` 目录
2. 在 `script.js` 中更新 `setTheme` 函数中的图片路径

## SEO优化

本网站已经进行了SEO优化，包括：

- 使用语义化HTML标签
- 添加适当的元标签
- 使用结构化数据
- 优化图片（添加alt文本和尺寸）
- 响应式设计
- 清晰的URL结构

## 浏览器兼容性

- Chrome（最新版本）
- Firefox（最新版本）
- Safari（最新版本）
- Edge（最新版本）

## 许可证

[MIT](LICENSE)

## 联系方式

如有任何问题或建议，请发送电子邮件至：contact@bratgenerator.com