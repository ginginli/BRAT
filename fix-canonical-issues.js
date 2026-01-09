/**
 * 修复 Canonical 标签问题的脚本
 * 解决 "Duplicate without user-selected canonical" 问题
 */

const fs = require('fs');
const path = require('path');

// 页面配置映射
const pageConfigs = {
    // 主页面
    'index.html': {
        canonical: 'https://www.bratgenerator.com.cn/',
        title: 'Brat Generator - Free Online Charli XCX Brat Text Generator',
        description: 'Brat Generator is an online free tool that allows users to create customized brat style images resembling the album cover of Brat by Charli XCX.',
        ogUrl: 'https://www.bratgenerator.com.cn'
    },
    
    // Brat Green 页面
    'bratgreen/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/bratgreen/',
        title: 'Brat Green - #8ACF01 | Brat Generator',
        description: 'Explore the iconic Brat Green color #8ACF01 from Charli XCX\'s Brat album. Learn about the signature green shade and create your own brat-style content.',
        ogUrl: 'https://www.bratgenerator.com.cn/bratgreen/'
    },
    
    // 语言版本
    'zh-CN/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/zh-CN/',
        title: 'Brat 生成器 - 免费在线 Charli XCX Brat 文字生成器',
        description: 'Brat 生成器是一个免费的在线工具，允许用户创建模仿 Charli XCX 的 Brat 专辑封面风格的自定义文字图片。',
        ogUrl: 'https://www.bratgenerator.com.cn/zh-CN/'
    },
    
    'en-US/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/en-US/',
        title: 'Brat Generator - Free Online Charli XCX Brat Text Generator',
        description: 'Brat Generator is an online free tool that allows users to create customized brat style images resembling the album cover of Brat by Charli XCX.',
        ogUrl: 'https://www.bratgenerator.com.cn/en-US/'
    },
    
    'es-MX/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/es-MX/',
        title: 'Generador Brat - Generador de Texto Brat de Charli XCX Gratis',
        description: 'Generador Brat es una herramienta gratuita en línea que permite a los usuarios crear imágenes personalizadas estilo brat que se asemejan a la portada del álbum Brat de Charli XCX.',
        ogUrl: 'https://www.bratgenerator.com.cn/es-MX/'
    },
    
    'es-AR/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/es-AR/',
        title: 'Generador Brat - Generador de Texto Brat de Charli XCX Gratis',
        description: 'Generador Brat es una herramienta gratuita en línea que permite a los usuarios crear imágenes personalizadas estilo brat que se asemejan a la portada del álbum Brat de Charli XCX.',
        ogUrl: 'https://www.bratgenerator.com.cn/es-AR/'
    },
    
    'id/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/id/',
        title: 'Generator Brat - Generator Teks Brat Charli XCX Gratis Online',
        description: 'Generator Brat adalah alat online gratis yang memungkinkan pengguna membuat gambar gaya brat yang menyerupai sampul album Brat oleh Charli XCX.',
        ogUrl: 'https://www.bratgenerator.com.cn/id/'
    },
    
    'tr/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/tr/',
        title: 'Brat Üretici - Ücretsiz Çevrimiçi Charli XCX Brat Metin Üreticisi',
        description: 'Brat Üretici, kullanıcıların Charli XCX\'in Brat albüm kapağına benzeyen özelleştirilmiş brat tarzı görüntüler oluşturmasına olanak tanıyan ücretsiz bir çevrimiçi araçtır.',
        ogUrl: 'https://www.bratgenerator.com.cn/tr/'
    },
    
    'fil/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/fil/',
        title: 'Brat Generator - Libreng Online Charli XCX Brat Text Generator',
        description: 'Ang Brat Generator ay isang libreng online tool na nagbibigay-daan sa mga user na lumikha ng customized brat style na mga larawan na kahawig ng album cover ng Brat ni Charli XCX.',
        ogUrl: 'https://www.bratgenerator.com.cn/fil/'
    },
    
    'ja-JP/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/ja-JP/',
        title: 'Brat ジェネレーター - 無料オンライン Charli XCX Brat テキストジェネレーター',
        description: 'Brat ジェネレーターは、ユーザーが Charli XCX の Brat アルバムカバーに似たカスタマイズされた brat スタイルの画像を作成できる無料のオンラインツールです。',
        ogUrl: 'https://www.bratgenerator.com.cn/ja-JP/'
    },
    
    'ko-KR/index.html': {
        canonical: 'https://www.bratgenerator.com.cn/ko-KR/',
        title: 'Brat 생성기 - 무료 온라인 Charli XCX Brat 텍스트 생성기',
        description: 'Brat 생성기는 사용자가 Charli XCX의 Brat 앨범 커버와 유사한 맞춤형 brat 스타일 이미지를 만들 수 있는 무료 온라인 도구입니다.',
        ogUrl: 'https://www.bratgenerator.com.cn/ko-KR/'
    }
};

// 检查并修复 canonical 标签的函数
function checkAndFixCanonical(filePath, config) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ 文件不存在: ${filePath}`);
        return false;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // 检查是否有 canonical 标签
        const canonicalRegex = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i;
        const hasCanonical = canonicalRegex.test(content);
        
        if (!hasCanonical) {
            console.log(`⚠️ 缺少 canonical 标签: ${filePath}`);
            
            // 在 </head> 前添加 canonical 标签
            const canonicalTag = `    <link rel="canonical" href="${config.canonical}" />`;
            content = content.replace('</head>', `    ${canonicalTag}\n</head>`);
            modified = true;
        } else {
            // 检查 canonical URL 是否正确
            const match = content.match(canonicalRegex);
            if (match && !match[0].includes(config.canonical)) {
                console.log(`⚠️ canonical URL 不正确: ${filePath}`);
                content = content.replace(canonicalRegex, `<link rel="canonical" href="${config.canonical}" />`);
                modified = true;
            }
        }
        
        // 检查 og:url 是否正确
        const ogUrlRegex = /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i;
        const ogUrlMatch = content.match(ogUrlRegex);
        if (ogUrlMatch && !ogUrlMatch[0].includes(config.ogUrl)) {
            console.log(`⚠️ og:url 不正确: ${filePath}`);
            content = content.replace(ogUrlRegex, `<meta property="og:url" content="${config.ogUrl}">`);
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ 已修复: ${filePath}`);
            return true;
        } else {
            console.log(`✅ 无需修复: ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ 处理文件时出错 ${filePath}:`, error.message);
        return false;
    }
}

// 主函数
function main() {
    console.log('🔍 开始检查和修复 canonical 标签问题...\n');
    
    let totalFiles = 0;
    let fixedFiles = 0;
    
    for (const [filePath, config] of Object.entries(pageConfigs)) {
        totalFiles++;
        const wasFixed = checkAndFixCanonical(filePath, config);
        if (wasFixed) {
            fixedFiles++;
        }
    }
    
    console.log(`\n📊 总结:`);
    console.log(`   检查的文件: ${totalFiles}`);
    console.log(`   修复的文件: ${fixedFiles}`);
    console.log(`   无需修复: ${totalFiles - fixedFiles}`);
    
    if (fixedFiles > 0) {
        console.log(`\n✅ 修复完成！请重新提交这些页面到 Google Search Console。`);
    } else {
        console.log(`\n✅ 所有文件的 canonical 标签都是正确的。`);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { checkAndFixCanonical, pageConfigs };