function CountdownInterval(interval, steps, onStep) {
    this.interval = interval;
    this.steps = steps;
    this.expected = null;
    this.timeout = null;

    this.start = () => {
        this.expected = Date.now() + this.interval;
        this.timeout = setTimeout(this.step, this.interval);
    };

    this.clear = () => {
        clearTimeout(this.timeout);
    };

    this.step = () => {
        --this.steps;
        if (this.steps < 0) {
            this.clear();
            return;
        }

        const drift = Date.now() - this.expected;
        if (drift > this.interval) {
            this.clear();
            return;
        }
        onStep(this.steps);
        this.expected += this.interval;
        this.timeout = setTimeout(this.step, Math.max(0, this.interval - drift));
    };
}

export default CountdownInterval;
