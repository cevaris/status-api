import expressSession from "express-session";
import passport from "passport";
import Auth0Strategy, { StrategyOption } from "passport-auth0";
import { Config } from "../../common/config";

export const register = (app: any) => {
    const session = {
        secret: Config.AuthSessionSecret,
        cookie: { secure: false },
        resave: false,
        proxy: false,
        saveUninitialized: false
    };

    if (app.get('env') === 'production') {
        // Serve secure cookies, requires HTTPS
        session.cookie.secure = true;
        session.proxy = true;
        app.set('trust proxy', 1);
    }

    app.use(expressSession(session));

    const options: StrategyOption = {
        domain: Config.Auth0Domain,
        clientID: Config.Auth0ClientId,
        clientSecret: Config.Auth0ClientSecret,
        callbackURL: `${Config.HostURL}/auth/callback`
    };

    const strategy = new Auth0Strategy(
        options,
        function (accessToken: string, refreshToken: string, extraParams: any, profile: any, done: any) {
            /**
             * Access tokens are used to authorize users to an API
             * (resource server)
             * accessToken is the token to call the Auth0 API
             * or a secured third-party API
             * extraParams.id_token has the JSON Web Token
             * profile has all the information from the user
             */
            return done(null, profile);
        }
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(strategy);
    app.use(passport.initialize());
    app.use(passport.session());
};


export function secured() {
    return function secured(req: any, res: any, next: any) {
        if (req.user) { return next(); }
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    };
};

export function setUserAsLocal() {
    return function (req: any, res: any, next: any) {
        res.locals.user = req.user;
        next();
    };
};