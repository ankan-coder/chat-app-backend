const errorHandler = (err, req, res, next) => {
    const errorLog = {
        timestamp: new Date().toISOString(),
        error: {
            message: err.message,
            stack: err.stack,
            status: err.status || 500
        },
        request: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        }
    };

    console.error('=== ERROR ===');
    console.error(JSON.stringify(errorLog, null, 2));
    console.error('=============');

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;

