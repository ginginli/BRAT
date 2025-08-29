// 图片处理模块 - 使用Web Worker优化性能
export class ImageProcessor {
    constructor() {
        this.worker = null;
        this.initWorker();
    }
    
    initWorker() {
        if (typeof Worker !== 'undefined') {
            try {
                this.worker = new Worker('modules/image-worker.js');
            } catch (e) {
                console.warn('Web Worker not available, falling back to main thread');
                this.worker = null;
            }
        }
    }
    
    // 分批处理图片数据，避免长任务
    processImageData(imageData, options = {}) {
        const { batchSize = 10000, factor = 1.1 } = options;
        
        return new Promise((resolve) => {
            if (this.worker) {
                // 使用 Web Worker
                this.worker.postMessage({ 
                    imageData, 
                    batchSize, 
                    factor,
                    type: 'enhanceContrast'
                });
                
                this.worker.onmessage = (e) => {
                    resolve(e.data);
                };
            } else {
                // 回退到主线程，但使用分批处理
                this.processInMainThread(imageData, batchSize, factor, resolve);
            }
        });
    }
    
    processInMainThread(imageData, batchSize, factor, resolve) {
        const data = imageData.data;
        let currentIndex = 0;
        
        function processBatch() {
            const endIndex = Math.min(currentIndex + batchSize, data.length);
            
            for (let i = currentIndex; i < endIndex; i += 4) {
                const avgPixel = (data[i] + data[i+1] + data[i+2])/3;
                
                if (avgPixel < 128) {
                    data[i] = Math.max(0, Math.min(255, data[i] * factor));
                    data[i+1] = Math.max(0, Math.min(255, data[i+1] * factor));
                    data[i+2] = Math.max(0, Math.min(255, data[i+2] * factor));
                }
            }
            
            currentIndex = endIndex;
            
            if (currentIndex < data.length) {
                requestAnimationFrame(processBatch);
            } else {
                resolve(imageData);
            }
        }
        
        requestAnimationFrame(processBatch);
    }
    
    destroy() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}

export default ImageProcessor;
