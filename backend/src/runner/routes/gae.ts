import express from 'express';


const router = express.Router();

router.get('/_ah/start', function (req: express.Request, res: express.Response) {
    console.log('receiving traffic');
    res.status(200).json();
});

router.get('/_ah/stop', function (req: express.Request, res: express.Response) {
    console.log('shutting down');
    res.status(200).json();
});

module.exports = router;