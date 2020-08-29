require('dotenv').config();

class ServerConfig {
    HostURL: string

    AuthSessionSecret: string;

    Auth0Domain: string;
    Auth0ClientId: string;
    Auth0ClientSecret: string;

    DROPBOX_ACCESS_TOKEN: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    STRIPE_SECRET_KEY: string;

    constructor() {
        this.HostURL = this.required('HOST_URL');

        this.Auth0Domain = this.required('AUTH0_DOMAIN');
        this.Auth0ClientId = this.required('AUTH0_CLIENT_ID');
        this.Auth0ClientSecret = this.required('AUTH0_CLIENT_SECRET');

        this.AuthSessionSecret = this.required('AUTH_SESSION_SECRET');

        this.DROPBOX_ACCESS_TOKEN = this.required('DROPBOX_ACCESS_TOKEN');
        this.AWS_ACCESS_KEY_ID = this.required('AWS_ACCESS_KEY_ID');
        this.AWS_SECRET_ACCESS_KEY = this.required('AWS_SECRET_ACCESS_KEY');
        this.STRIPE_SECRET_KEY = this.required('STRIPE_SECRET_KEY');
    }

    private required(name: string): string {
        const value: string | undefined = process.env[name];
        if (value) {
            return value;
        } else {
            throw Error(`No value found for ${name} ENV variable`);
        }
    }

    public port(defaultValue: number): string {
        return process.env.PORT || defaultValue.toString();
    }
}

export const Config = new ServerConfig();