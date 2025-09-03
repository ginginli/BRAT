// Web Worker for image processing

// 监听主线程消息
self.addEventListener('message', function(e) {
    const { type, data } = e.data;
    
    switch (type) {
        case 'process-image':
            processImage(data);
            break;
        case 'generate-meme':
            generateMeme(data);
            break;
        case 'apply-filter':
            applyFilter(data);
            break;
        default:
            self.postMessage({
                type: 'error',
                data: 'Unknown message type: ' + type
            });
    }
});

// 处理图片
function processImage(imageData) {
    try {
        // 创建OffscreenCanvas
        const canvas = new OffscreenCanvas(600, 600);
        const ctx = canvas.getContext('2d');
        
        // 创建图片对象
        const img = new Image();
        img.onload = function() {
            // 绘制图片
            ctx.drawImage(img, 0, 0, 600, 600);
            
            // 获取处理后的图片数据
            const processedData = canvas.transferToImageBitmap();
            
            // 发送结果回主线程
            self.postMessage({
                type: 'image-processed',
                data: processedData
            }, [processedData]);
        };
        
        img.src = imageData;
    } catch (error) {
        self.postMessage({
            type: 'error',
            data: error.message
        });
    }
}

// 生成表情包
function generateMeme(data) {
    try {
        const { text, theme, fontSize, blur, textColor, backgroundColor } = data;
        
        // 创建OffscreenCanvas
        const canvas = new OffscreenCanvas(600, 600);
        const ctx = canvas.getContext('2d');
        
        // 设置背景
        ctx.fillStyle = backgroundColor || '#8ACF01';
        ctx.fillRect(0, 0, 600, 600);
        
        // 设置文字样式
        ctx.fillStyle = textColor || '#000000';
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 应用模糊效果
        if (blur > 0) {
            ctx.filter = `blur(${blur}px)`;
        }
        
        // 绘制文字
        const lines = text.split('\n');
        const lineHeight = fontSize * 1.2;
        const startY = 300 - (lines.length - 1) * lineHeight / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, 300, startY + index * lineHeight);
        });
        
        // 重置滤镜
        ctx.filter = 'none';
        
        // 转换为图片数据
        const imageData = canvas.transferToImageBitmap();
        
        // 发送结果回主线程
        self.postMessage({
            type: 'meme-generated',
            data: imageData
        }, [imageData]);
        
    } catch (error) {
        self.postMessage({
            type: 'error',
            data: error.message
        });
    }
}

// 应用滤镜
function applyFilter(data) {
    try {
        const { imageData, filterType, filterParams } = data;
        
        // 创建OffscreenCanvas
        const canvas = new OffscreenCanvas(imageData.width, imageData.height);
        const ctx = canvas.getContext('2d');
        
        // 绘制原始图片
        ctx.drawImage(imageData, 0, 0);
        
        // 获取像素数据
        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageDataObj.data;
        
        // 应用滤镜
        switch (filterType) {
            case 'blur':
                applyBlurFilter(pixels, canvas.width, canvas.height, filterParams.radius);
                break;
            case 'brightness':
                applyBrightnessFilter(pixels, filterParams.value);
                break;
            case 'contrast':
                applyContrastFilter(pixels, filterParams.value);
                break;
            case 'saturate':
                applySaturateFilter(pixels, filterParams.value);
                break;
            default:
                throw new Error('Unknown filter type: ' + filterType);
        }
        
        // 将处理后的像素数据绘制回Canvas
        ctx.putImageData(imageDataObj, 0, 0);
        
        // 转换为图片数据
        const processedImageData = canvas.transferToImageBitmap();
        
        // 发送结果回主线程
        self.postMessage({
            type: 'filter-applied',
            data: processedImageData
        }, [processedImageData]);
        
    } catch (error) {
        self.postMessage({
            type: 'error',
            data: error.message
        });
    }
}

// 模糊滤镜
function applyBlurFilter(pixels, width, height, radius) {
    const tempPixels = new Uint8ClampedArray(pixels);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            let count = 0;
            
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const index = (ny * width + nx) * 4;
                        r += tempPixels[index];
                        g += tempPixels[index + 1];
                        b += tempPixels[index + 2];
                        a += tempPixels[index + 3];
                        count++;
                    }
                }
            }
            
            const index = (y * width + x) * 4;
            pixels[index] = r / count;
            pixels[index + 1] = g / count;
            pixels[index + 2] = b / count;
            pixels[index + 3] = a / count;
        }
    }
}

// 亮度滤镜
function applyBrightnessFilter(pixels, value) {
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = Math.max(0, Math.min(255, pixels[i] + value));     // R
        pixels[i + 1] = Math.max(0, Math.min(255, pixels[i + 1] + value)); // G
        pixels[i + 2] = Math.max(0, Math.min(255, pixels[i + 2] + value)); // B
    }
}

// 对比度滤镜
function applyContrastFilter(pixels, value) {
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = Math.max(0, Math.min(255, factor * (pixels[i] - 128) + 128));     // R
        pixels[i + 1] = Math.max(0, Math.min(255, factor * (pixels[i + 1] - 128) + 128)); // G
        pixels[i + 2] = Math.max(0, Math.min(255, factor * (pixels[i + 2] - 128) + 128)); // B
    }
}

// 饱和度滤镜
function applySaturateFilter(pixels, value) {
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // 转换为灰度
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // 应用饱和度
        pixels[i] = Math.max(0, Math.min(255, gray + value * (r - gray)));     // R
        pixels[i + 1] = Math.max(0, Math.min(255, gray + value * (g - gray))); // G
        pixels[i + 2] = Math.max(0, Math.min(255, gray + value * (b - gray))); // B
    }
}

// 错误处理
self.addEventListener('error', function(e) {
    self.postMessage({
        type: 'error',
        data: e.message
    });
});

self.addEventListener('unhandledrejection', function(e) {
    self.postMessage({
        type: 'error',
        data: e.reason
    });
});
