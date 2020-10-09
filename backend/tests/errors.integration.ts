import { exec } from 'child_process';
import { json } from 'express';
import { join } from 'path';
import { promisify } from 'util';
const execPromise = promisify(exec);

describe('errors', () => {
    it('errors:global:debug:random_throw', async () => {
        const key = 'errors:global:debug:random_throw';
        const command = `node ./dist/src/runner/adhoc.js ${key}`;

        const response = await execPromise(command);
        const report = JSON.parse(response.stdout);

        expect(report['name']).toBe(key);
        expect(typeof report['ok']).toBe('boolean');
        expect(typeof report['latencyMs']).toBe('number');

        if (!report['ok']) {
            expect(report['message']).toBe('Error: this error is intentional');
        }
    });
});