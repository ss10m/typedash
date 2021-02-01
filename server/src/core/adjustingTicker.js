function AdjustingTicker(interval, steps, onStep, onSuccess, onError) {
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
        if (!this.steps) {
            if (onSuccess) onSuccess();
            this.clear();
            return;
        }

        const drift = Date.now() - this.expected;
        //console.log(drift);
        if (drift > this.interval) {
            if (onError) onError();
            this.clear();
            return;
        }
        if (onStep) onStep(this.steps);
        this.expected += this.interval;
        this.timeout = setTimeout(this.step, Math.max(0, this.interval - drift));
    };
}

export default AdjustingTicker;
