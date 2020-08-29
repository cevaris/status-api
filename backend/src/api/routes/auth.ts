import express from 'express';
import passport from 'passport';
import querystring from 'querystring';
import url from 'url';
import util from 'util';
import { Config } from '../../common/utils/config';


const router = express.Router();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), function (req, res) {
    res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/auth/callback', function (req: any, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
        console.log(err, user, info);
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function (err: any) {
            if (err) { return next(err); }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/');
        });
    })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
    req.logout();

    const returnTo = Config.HostURL;
    var logoutURL = new url.URL(
        util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
    );
    var searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL.toString());
});

module.exports = router;