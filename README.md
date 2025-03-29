# Brat Generator

一个受Charli XCX的'Brat'专辑封面启发的在线文本生成工具。使用这个工具，用户可以创建自定义的具有Brat风格的图像，包括原版绿色背景和其他几种颜色选项。

## 特性

- 简单易用的界面
- 多种主题选项（绿色、黑色、白色、蓝色）
- 即时预览
- 一键下载图像
- 响应式设计，适用于所有设备

## 多语言支持

本项目实现了两级多语言支持方案，满足不同阶段的需求：

### 当前已实现：文件替换方式的多语言支持

现有实现采用了简单直接的静态文件方式：
- 为每种语言创建单独的子目录（如`/zh-CN/`）
- 每个语言版本包含独立的HTML文件副本
- 通过语言切换器在不同语言版本间导航
- 适合小型网站和支持少量语言的情况

**关键实现**:
- 目录结构：
  ```
  /               # 英文版(默认)
    index.html
    ...
  /zh-CN/         # 中文版
    index.html
    ...
  ```
- 语言切换器HTML:
  ```html
  <div class="language-switcher">
      <button class="lang-btn">🌐 Language</button>
      <div class="lang-dropdown">
          <a href="/" class="lang-item active">English</a>
          <a href="/zh-CN/" class="lang-item">中文</a>
      </div>
  </div>
  ```

### 未来扩展：内容翻译方式的多语言支持

项目中的`locales`文件夹和HTML中的`data-i18n`属性为未来实现更高级的多语言支持做了准备：
- 利用JSON文件存储各语言的翻译文本
- 使用JavaScript动态加载和应用翻译
- 维护一套HTML模板，内容通过翻译文件动态生成
- 更适合大型网站和支持多种语言的情况

**未来实现要点**:
- 开发一个i18n.js模块加载和应用翻译
- 利用现有的`data-i18n`属性标记需要翻译的元素
- 翻译文件结构示例:
  ```json
  {
    "nav": {
      "home": "首页",
      "generator": "生成器"
    },
    "hero": {
      "title": "Brat生成器",
      "subtitle": "创建你自己的Brat风格图片"
    }
  }
  ```

**为什么采用两阶段方案**:
1. 第一阶段方案简单直接，快速实现基本多语言支持
2. 第二阶段方案可在未来需要时实施，降低维护成本
3. 这种渐进式方案符合"先做简单有效的事"的原则

## 本地开发

1. 克隆仓库
2. 在浏览器中打开index.html文件
3. 进行修改，刷新浏览器查看效果

## 使用技术

- HTML5
- CSS3
- JavaScript (ES6+)
- 自定义字体
- HTML Canvas (用于图像生成)

## 合法信息

本工具仅供粉丝娱乐使用。"Brat"是Charli XCX的商标。本项目非官方，与Charli XCX或其管理团队无任何关联。

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