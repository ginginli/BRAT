// Web Worker for image processing
self.onmessage = function(e) {
    const { imageData, batchSize, factor, type } = e.data;
    
    if (type === 'enhanceContrast') {
        const result = enhanceContrast(imageData, factor, batchSize);
        self.postMessage(result);
    }
};

function enhanceContrast(imageData, factor, batchSize) {
    const data = imageData.data;
    
    // 分批处理像素
    for (let i = 0; i < data.length; i += 4) {
        const avgPixel = (data[i] + data[i+1] + data[i+2])/3;
        
        if (avgPixel < 128) {
            data[i] = Math.max(0, Math.min(255, data[i] * factor));
            data[i+1] = Math.max(0, Math.min(255, data[i+1] * factor));
            data[i+2] = Math.max(0, Math.min(255, data[i+2] * factor));
        }
    }
    
    return imageData;
}
