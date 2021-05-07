export class TimeSpan {
	msecs: number;
	constructor(num: number) {
		this.msecs = num != null ? num : 0;
	}
	public static fromSeconds(num: number): number {
		return num * 1000;
	}

	public static fromMinutes(num: number): number {
		return num * 60000;
	}

	public static Delay(timespan: TimeSpan | number): Promise<null> {
		let Time: TimeSpan;
		if (!(timespan instanceof TimeSpan)) {
			Time = new TimeSpan(timespan);
		} else {
			Time = timespan;
		}
		return new Promise((resolve) => setTimeout(resolve, Time.msecs));
	}
}
