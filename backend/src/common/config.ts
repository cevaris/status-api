import fs from 'fs';
import yaml from 'js-yaml';

class YamlConfig {
  HOST_URL: string;

  AUTH_SESSION_SECRET: string;

  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;

  DROPBOX_ACCESS_TOKEN: string;
  DIGITAL_OCEAN_ACCESS_TOKEN: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  SLACK_CHANNEL: string;
  SLACK_TOKEN: string;
  PAGERDUTY_TOKEN: string;
  PAGERDUTY_FROM: string;
  PAGERDUTY_SERVICE: string;
  CLOUDFLARE_API_TOKEN: string;
  GITHUB_PERSONAL_ACCESS_TOKEN: string;

  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;

  RECAPTCHA_SECRET_KEY: string;
  EMAIL: string;
  EMAIL_STATUS_API: string;
  EMAIL_PASSWORD: string;

  constructor() {
    const filename = '.env.yaml';
    const yamlContents = fs.readFileSync(filename, 'utf-8');
    const yamlObj = yaml.load(yamlContents);

    if (!yamlObj || !yamlObj.env_variables) {
      throw Error(`could not parse ${filename}.`);
    }

    // https://stackoverflow.com/questions/36644438/how-to-convert-a-plain-object-into-an-es6-map
    const env = new Map(Object.entries(yamlObj.env_variables));

    this.HOST_URL = this.hostURL(this.required(env, 'NODE_ENV'));

    this.AUTH0_DOMAIN = this.required(env, 'AUTH0_DOMAIN');
    this.AUTH0_CLIENT_ID = this.required(env, 'AUTH0_CLIENT_ID');
    this.AUTH0_CLIENT_SECRET = this.required(env, 'AUTH0_CLIENT_SECRET');

    this.AUTH_SESSION_SECRET = this.required(env, 'AUTH_SESSION_SECRET');

    this.DROPBOX_ACCESS_TOKEN = this.required(env, 'DROPBOX_ACCESS_TOKEN');
    this.DIGITAL_OCEAN_ACCESS_TOKEN = this.required(env, 'DIGITAL_OCEAN_ACCESS_TOKEN');
    this.AWS_ACCESS_KEY_ID = this.required(env, 'AWS_ACCESS_KEY_ID');
    this.AWS_SECRET_ACCESS_KEY = this.required(env, 'AWS_SECRET_ACCESS_KEY');
    this.SLACK_TOKEN = this.required(env, 'SLACK_TOKEN');
    this.SLACK_CHANNEL = this.required(env, 'SLACK_CHANNEL');
    this.PAGERDUTY_TOKEN = this.required(env, 'PAGERDUTY_TOKEN');
    this.PAGERDUTY_FROM = this.required(env, 'PAGERDUTY_FROM');
    this.PAGERDUTY_SERVICE = this.required(env, 'PAGERDUTY_SERVICE');
    this.CLOUDFLARE_API_TOKEN = this.required(env, 'CLOUDFLARE_API_TOKEN');
    this.GITHUB_PERSONAL_ACCESS_TOKEN = this.required(
      env,
      'GITHUB_PERSONAL_ACCESS_TOKEN'
    );

    this.STRIPE_SECRET_KEY = this.required(env, 'STRIPE_SECRET_KEY');
    this.STRIPE_WEBHOOK_SECRET = this.required(env, 'STRIPE_WEBHOOK_SECRET');

    this.RECAPTCHA_SECRET_KEY = this.required(env, 'RECAPTCHA_SECRET_KEY');

    this.EMAIL = this.required(env, 'EMAIL');
    this.EMAIL_STATUS_API = this.required(env, 'EMAIL_STATUS_API');
    this.EMAIL_PASSWORD = this.required(env, 'EMAIL_PASSWORD');
  }

  private required(env: Map<string, any>, name: string): string {
    const value: string | undefined = env.get(name);
    if (value) {
      return value;
    } else {
      throw Error(`No value found for ${name} ENV variable`);
    }
  }

  public port(defaultValue: number): string {
    return process.env.PORT || defaultValue.toString();
  }

  private hostURL(nodeEnv: string): string {
    if (nodeEnv !== 'production') {
      return 'http://localhost:8100';
    } else {
      return 'https://status-api.com';
    }
  }
}

export const Config = new YamlConfig();
