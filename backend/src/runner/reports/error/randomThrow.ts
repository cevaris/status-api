import { ErrorsApi } from ".";
import { ApiRegion } from "..";
import { Report } from "../report";

const sleep = require('util').promisify(setTimeout)

class ErrorRandomThrowConfig extends Report {
    constructor() {
        super(ErrorsApi.Service, ApiRegion.Global, ErrorsApi.Name, ErrorsApi.Version, 'Random Throw');
        this.isDebug = true;
    }

    description(): string {
        return 'Sleeps for random time up to 500ms, then intentionally fails 50% of the time. For debugging purposes only.';
    }

    async run(): Promise<boolean> {
        // sleep for a duration less than global timeout
        await sleep(Math.floor(Math.random() * Math.floor(500)));

        // choose if should fail or not
        const randomChoice = Math.random() >= 0.5;
        if (randomChoice) {
            return Promise.reject(Error('this error is intentional'));
        }
        return Promise.resolve(true);
    }
}

export const ErrorRandomThrowRunner = [new ErrorRandomThrowConfig()];