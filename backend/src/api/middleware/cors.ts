import express from 'express';

const allowedOrigins = [
    'http://localhost:8100',
    'https://status-api-dev.web.app',
    'https://status-api.com',
];

export const register = (app: express.Application) => {
    function allowCrossDomain(req: any, res: any, next: any) {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Credentials', true);

        var origin = req.headers.origin;
        if (allowedOrigins.indexOf(origin) >= 0) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }

        if (req.method === 'OPTIONS') {
            res.send(200);
        } else {
            next();
        }
    }

    app.use(allowCrossDomain);
};