import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

describe('errors', () => {
    it('errors:global:debug:random_throw', async () => {
        const key = 'errors:global:debug:random_throw';
        execute(key, 'Error: this error is intentional');
    });

    it('errors:global:debug:throw', async () => {
        const key = 'errors:global:debug:throw';
        execute(key, 'Error: this error is intentional');
    });

    it('errors:global:debug:timeout', async () => {
        const key = 'errors:global:debug:timeout';
        execute(key, /Error: Report runner timed-out, \d+ms/);
    }, 11000);
});

async function execute(key: string, failureMessage: string | RegExp) {
    const command = `node ./dist/src/runner/adhoc.js ${key}`;

    const response = await execPromise(command);
    const report = JSON.parse(response.stdout);

    expect(report['name']).toBe(key);
    expect(typeof report['ok']).toBe('boolean');
    expect(typeof report['latencyMs']).toBe('number');

    if (!report['ok']) {
        expect(report['message']).toMatch(failureMessage);
    }
}