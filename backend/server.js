const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => {
    res.json({ message: 'B5 Vehicle API is running!' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');
        
        await sequelize.sync({ force: false });
        console.log('✅ Models synchronized');
        
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API Health: http://localhost:${PORT}/api/health`);

            // Self-test
            setTimeout(() => {
                const http = require('http');
                const options = {
                    hostname: 'localhost',
                    port: PORT,
                    path: '/api/health',
                    method: 'GET'
                };

                const req = http.request(options, (res) => {
                    console.log(`✅ Self-test: Status ${res.statusCode}`);
                });

                req.on('error', (error) => {
                    console.error('❌ Self-test failed:', error.message);
                });

                req.end();
            }, 1000);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
            } else {
                console.error('❌ Server error:', error);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error('❌ Server start failed:', error);
        process.exit(1);
    }
};

startServer();
