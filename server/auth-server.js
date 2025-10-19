// 后端认证服务器 (Node.js/Express)
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// Google OAuth 配置
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// 验证Google ID Token
async function verifyGoogleToken(idToken) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            verified: true
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Invalid token');
    }
}

// 生成JWT token
function generateJWT(user) {
    return jwt.sign(
        {
            id: user.googleId,
            email: user.email,
            name: user.name,
            picture: user.picture
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// 验证JWT token
function verifyJWT(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

// 路由

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Google登录验证
app.post('/api/auth/google', async (req, res) => {
    try {
        const { idToken } = req.body;
        
        if (!idToken) {
            return res.status(400).json({ error: 'ID token is required' });
        }

        // 验证Google token
        const user = await verifyGoogleToken(idToken);
        
        // 生成JWT token
        const jwtToken = generateJWT(user);
        
        res.json({
            success: true,
            user: {
                id: user.googleId,
                email: user.email,
                name: user.name,
                picture: user.picture
            },
            token: jwtToken
        });
        
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ 
            success: false, 
            error: error.message || 'Authentication failed' 
        });
    }
});

// 验证JWT token
app.post('/api/auth/verify', (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const user = verifyJWT(token);
        
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture
            }
        });
        
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            error: error.message || 'Token verification failed' 
        });
    }
});

// 登出（客户端处理，这里只是记录）
app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

// 获取用户信息
app.get('/api/user/profile', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const user = verifyJWT(token);
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture
            }
        });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            error: error.message || 'Token verification failed' 
        });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
