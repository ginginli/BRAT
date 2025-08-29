// 性能测试脚本
console.log('🚀 Performance Test Script Loaded');

// 测试函数执行时间
function testFunctionPerformance(func, iterations = 1000) {
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
        func();
    }
    
    const end = performance.now();
    const duration = end - start;
    
    console.log(`⏱️ Function executed ${iterations} times in ${duration.toFixed(2)}ms`);
    console.log(`📊 Average time per execution: ${(duration / iterations).toFixed(4)}ms`);
    
    return duration;
}

// 测试长任务检测
function testLongTaskDetection() {
    console.log('🧪 Testing long task detection...');
    
    // 模拟一个长任务
    const start = performance.now();
    let result = 0;
    
    for (let i = 0; i < 10000000; i++) {
        result += Math.sqrt(i);
    }
    
    const duration = performance.now() - start;
    console.log(`🔍 Long task completed in ${duration.toFixed(2)}ms`);
    console.log(`📝 Result: ${result.toFixed(2)}`);
    
    return duration;
}

// 测试分批处理
function testBatchProcessing() {
    console.log('📦 Testing batch processing...');
    
    const data = new Array(100000).fill(0).map((_, i) => i);
    const batchSize = 1000;
    let processed = 0;
    
    function processBatch() {
        const end = Math.min(processed + batchSize, data.length);
        
        for (let i = processed; i < end; i++) {
            data[i] = Math.sqrt(data[i]);
        }
        
        processed = end;
        
        if (processed < data.length) {
            // 使用 requestIdleCallback 或 setTimeout
            if ('requestIdleCallback' in window) {
                requestIdleCallback(processBatch);
            } else {
                setTimeout(processBatch, 0);
            }
        } else {
            console.log('✅ Batch processing completed');
        }
    }
    
    processBatch();
}

// 测试防抖功能
function testDebounce() {
    console.log('🔄 Testing debounce functionality...');
    
    let callCount = 0;
    
    function debouncedFunction() {
        callCount++;
        console.log(`📞 Debounced function called ${callCount} times`);
    }
    
    const debounced = debounce(debouncedFunction, 100);
    
    // 快速调用多次
    for (let i = 0; i < 10; i++) {
        debounced();
    }
    
    // 等待防抖完成
    setTimeout(() => {
        console.log(`🎯 Final call count: ${callCount}`);
    }, 200);
}

// 防抖函数实现
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 运行所有测试
function runAllTests() {
    console.log('🧪 Starting Performance Tests...\n');
    
    // 测试1: 函数性能
    console.log('📋 Test 1: Function Performance');
    testFunctionPerformance(() => Math.random(), 10000);
    console.log('');
    
    // 测试2: 长任务检测
    console.log('📋 Test 2: Long Task Detection');
    testLongTaskDetection();
    console.log('');
    
    // 测试3: 分批处理
    console.log('📋 Test 3: Batch Processing');
    testBatchProcessing();
    console.log('');
    
    // 测试4: 防抖功能
    console.log('📋 Test 4: Debounce Functionality');
    testDebounce();
    console.log('');
    
    console.log('✅ All tests completed!');
}

// 自动运行测试（延迟执行，避免影响页面加载）
setTimeout(runAllTests, 2000);

// 导出测试函数供外部使用
window.performanceTests = {
    testFunctionPerformance,
    testLongTaskDetection,
    testBatchProcessing,
    testDebounce,
    runAllTests
};
