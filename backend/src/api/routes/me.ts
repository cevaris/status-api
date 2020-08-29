import express from 'express';
import { renderJson } from '../../common/renderer';

const router = express.Router();

router.get('/me.json', (req: any, res) => {
    if (req.user) {
        res.type('json')
            .send(renderJson(req.user));
    } else {
        res.status(401).json({ ok: false, message: 'user not logged in' });
    }
});

module.exports = router;