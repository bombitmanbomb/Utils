/**
 * Time Util Class
 */
export class TimeSpan {
	msecs: number;
	constructor(num: number) {
		this.msecs = num != null ? num : 0;
	}
	/**
	 * Create a TimeSpan object set at num seconds
	 */
	public static fromSeconds(num: number): TimeSpan {
		return new TimeSpan(num * 1000);
	}
	/**
	 * Create a TimeSpan object set at num minutes
	 */
	public static fromMinutes(num: number): TimeSpan {
		return new TimeSpan(num * 60000);
	}
	/**
	 * Return a promise that will resolve after TimeSeconds
	 */
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
