interface StopwatchResults {
    startDate: Date
    endDate: Date
    latencyMs: number
}

export class Stopwatch {
    private startDate?: Date
    private endDate?: Date

    start(): void {
        this.startDate = new Date();
    }

    stop(): void {
        this.endDate = new Date();
    }

    results(): StopwatchResults {
        if (this.startDate && this.endDate) {
            return {
                latencyMs: +this.endDate - +this.startDate,
                startDate: this.startDate,
                endDate: this.endDate
            }
        } else {
            throw Error('Stopwatch was never started/started');
        }
    }
}