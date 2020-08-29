export class Metrics {
    private counters: Map<string, number>;

    private static instance: Metrics;

    private constructor() {
        this.counters = new Map();
     }

    public static getInstance(): Metrics {
        if (!Metrics.instance) {
            Metrics.instance = new Metrics();
        }

        return Metrics.instance;
    }

    public count(key: string, increment: number = 1) {
        const curr = this.counters.get(key);
        if (curr) {
            this.counters.set(key, curr + increment)
        } else {
            this.counters.set(key, increment)
        }
        console.log(this.counters);
    }
}