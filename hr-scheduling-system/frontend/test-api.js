// API连接测试脚本
// 使用Node.js运行此脚本来测试后端API连接

import http from 'http';

console.log('========================================');
console.log('HR调度系统API连接测试');
console.log('========================================');
console.log('');

// 测试后端健康检查端点
function testHealthCheck() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/health',
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('请求超时'));
        });

        req.end();
    });
}

// 测试算法服务健康检查
function testAlgorithmHealth() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/api/v1/algorithms/health',
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('请求超时'));
        });

        req.end();
    });
}

// 运行测试
async function runTests() {
    console.log('1. 测试后端服务健康检查...');
    try {
        const healthResult = await testHealthCheck();
        if (healthResult.statusCode === 200) {
            console.log('   ✅ 后端服务连接成功');
            console.log('   响应:', healthResult.data);
        } else {
            console.log('   ❌ 后端服务响应异常，状态码:', healthResult.statusCode);
            console.log('   响应:', healthResult.data);
        }
    } catch (error) {
        console.log('   ❌ 后端服务连接失败:', error.message);
        console.log('   请确保后端服务在 http://localhost:8000 运行');
    }

    console.log('');
    console.log('2. 测试算法服务健康检查...');
    try {
        const algorithmResult = await testAlgorithmHealth();
        if (algorithmResult.statusCode === 200) {
            console.log('   ✅ 算法服务连接成功');
            console.log('   响应:', algorithmResult.data);
        } else {
            console.log('   ❌ 算法服务响应异常，状态码:', algorithmResult.statusCode);
            console.log('   响应:', algorithmResult.data);
        }
    } catch (error) {
        console.log('   ❌ 算法服务连接失败:', error.message);
    }

    console.log('');
    console.log('========================================');
    console.log('测试完成');
    console.log('');
    console.log('如果所有测试都通过，您可以启动前端应用：');
    console.log('  npm run dev');
    console.log('');
    console.log('前端应用将在 http://localhost:3000 启动');
    console.log('========================================');
}

runTests().catch(console.error);