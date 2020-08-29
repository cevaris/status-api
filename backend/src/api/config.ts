class ServerConfig {
    Port: string
    HostURL: string

    AuthSessionSecret: string;

    Auth0Domain: string;
    Auth0ClientId: string;
    Auth0ClientSecret: string;

    constructor() {
        this.Port = process.env.PORT || '8080';
        this.HostURL = this.required('HOST_URL');

        this.Auth0Domain = this.required('AUTH0_DOMAIN');
        this.Auth0ClientId = this.required('AUTH0_CLIENT_ID');
        this.Auth0ClientSecret = this.required('AUTH0_CLIENT_SECRET');

        this.AuthSessionSecret = this.required('AUTH_SESSION_SECRET');
    }

    private required(name: string): string {
        const value: string | undefined = process.env[name];
        if (value) {
            return value;
        } else {
            throw Error(`No value found for ${name} ENV variable`);
        }
    }
}

const Config = new ServerConfig();
export default Config;