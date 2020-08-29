require('dotenv').config();

class ServerConfig {
    HOST_URL: string

    AUTH_SESSION_SECRET: string;

    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;

    DROPBOX_ACCESS_TOKEN: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    STRIPE_SECRET_KEY: string;

    constructor() {
        this.HOST_URL = this.required('HOST_URL');

        this.AUTH0_DOMAIN = this.required('AUTH0_DOMAIN');
        this.AUTH0_CLIENT_ID = this.required('AUTH0_CLIENT_ID');
        this.AUTH0_CLIENT_SECRET = this.required('AUTH0_CLIENT_SECRET');

        this.AUTH_SESSION_SECRET = this.required('AUTH_SESSION_SECRET');

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