module.exports = {
    apps: [{
        name: 'mern-backend',
        script: 'server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 5000
        },
        error_file: 'err.log',
        out_file: 'out.log',
        log_file: 'combined.log',
        time: true
    }]
};