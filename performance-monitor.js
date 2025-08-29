// 性能监控模块
export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            inp: [],
            longTasks: [],
            scriptCompileTime: 0,
            scriptExecuteTime: 0
        };
        
        this.initMonitoring();
    }
    
    initMonitoring() {
        // 监控 INP
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'interaction') {
                            this.recordINP(entry.duration);
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['interaction'] });
                console.log('INP monitoring enabled');
            } catch (e) {
                console.warn('Failed to enable INP monitoring:', e);
            }
        }
        
        // 监控长任务
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            this.recordLongTask(entry);
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['longtask'] });
                console.log('Long task monitoring enabled');
            } catch (e) {
                console.warn('Failed to enable long task monitoring:', e);
            }
        }
        
        // 监控脚本编译和执行时间
        this.monitorScriptPerformance();
    }
    
    recordINP(duration) {
        this.metrics.inp.push({
            timestamp: Date.now(),
            duration: duration
        });
        
        // 只保留最近 100 个记录
        if (this.metrics.inp.length > 100) {
            this.metrics.inp.shift();
        }
        
        // 如果 INP 过高，记录警告
        if (duration > 500) {
            console.warn(`High INP detected: ${duration}ms`);
            this.reportPerformanceIssue('high_inp', duration);
        }
    }
    
    recordLongTask(entry) {
        this.metrics.longTasks.push({
            timestamp: Date.now(),
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
        });
        
        // 只保留最近 50 个长任务记录
        if (this.metrics.longTasks.length > 50) {
            this.metrics.longTasks.shift();
        }
        
        console.warn(`Long task detected: ${entry.duration}ms - ${entry.name}`);
        this.reportPerformanceIssue('long_task', entry.duration, entry.name);
    }
    
    monitorScriptPerformance() {
        // 监控脚本加载时间
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const startTime = performance.now();
            
            script.addEventListener('load', () => {
                const loadTime = performance.now() - startTime;
                if (loadTime > 100) {
                    console.warn(`Slow script load: ${script.src} - ${loadTime.toFixed(2)}ms`);
                }
            });
        });
    }
    
    reportPerformanceIssue(type, duration, details = '') {
        // 可以发送到分析服务或记录到控制台
        const report = {
            type: type,
            duration: duration,
            details: details,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.log('Performance issue report:', report);
        
        // 这里可以添加发送到分析服务的代码
        // this.sendToAnalytics(report);
    }
    
    getMetrics() {
        const avgINP = this.metrics.inp.length > 0 
            ? this.metrics.inp.reduce((sum, item) => sum + item.duration, 0) / this.metrics.inp.length
            : 0;
            
        const longTaskCount = this.metrics.longTasks.length;
        
        return {
            averageINP: avgINP.toFixed(2),
            longTaskCount: longTaskCount,
            recentINP: this.metrics.inp.slice(-5).map(item => item.duration),
            recentLongTasks: this.metrics.longTasks.slice(-5).map(item => ({
                duration: item.duration,
                name: item.name
            }))
        };
    }
    
    // 手动记录性能数据
    recordCustomMetric(name, value) {
        if (!this.metrics[name]) {
            this.metrics[name] = [];
        }
        
        this.metrics[name].push({
            timestamp: Date.now(),
            value: value
        });
    }
}

export default PerformanceMonitor;
