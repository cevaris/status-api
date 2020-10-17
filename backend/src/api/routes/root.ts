import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Status API");
});

module.exports = router;