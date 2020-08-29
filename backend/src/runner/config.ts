import fs from 'fs';
import yaml from 'js-yaml';


class YamlConfig {
    env: Map<string, string>;

    constructor() {
        const yamlContents = fs.readFileSync('.env.yaml', 'utf-8');
        const yamlObj = yaml.load(yamlContents);

        if (typeof (yamlObj) === 'object') {
            // https://stackoverflow.com/questions/36644438/how-to-convert-a-plain-object-into-an-es6-map
            this.env = new Map(Object.entries(yamlObj.env_variables));
        } else {
            console.error('yaml not in expected object format')
            process.exit(-1);
        }
    }

    required(name: string): string {
        const value: string | undefined = this.env.get(name);
        if (value) {
            return value;
        } else {
            throw Error(`No value found for ${name} ENV variable`);
        }
    }
}

export const Config = new YamlConfig();