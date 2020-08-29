import fs from 'fs';
import path from 'path';

export class TempFile {
    readonly path: string;
    readonly filename: string;

    constructor() {
        const nowTime = new Date().getTime();

        this.filename = `${nowTime}.txt`;
        this.path = `/tmp/statusReport/${this.filename}.txt`;
    }

    async mk(): Promise<string> {
        const dirPath = path.dirname(this.path);
        if (!fs.existsSync(dirPath)) {
            await fs.promises.mkdir(dirPath);
        }

        await fs.promises.writeFile(this.path, 'example txt content');

        return this.path;
    }

    async cleanup(): Promise<void> {
        try {
            await fs.promises.unlink(this.path);
        } catch {
            // ignore failures
        }
    }
}