import { CancellationTokenSource } from "./CancellationTokenSource";
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
	public static Delay(
		timespan: TimeSpan | number,
		token?: CancellationTokenSource,
	): Promise<null> {
		let Time: TimeSpan;
		if (!(timespan instanceof TimeSpan)) {
			Time = new TimeSpan(timespan);
		} else {
			Time = timespan;
		}
		return new Promise((resolve) => {
			const abort = token as CancellationTokenSource;
			let listener: null | (() => void) = null;
			let resolved = false;
			const timeout = setTimeout(() => {
				if (resolved) return;
				resolved = true;
				resolve(null);
				if (listener != null && abort != null)
					abort.signal.removeEventListener("abort", listener);
			}, Time.msecs);
			listener = () => {
				if (resolved) return;
				resolved = true;
				clearTimeout(timeout);
				resolve(null);
			};
			if (abort != null) {
				abort.signal.addEventListener("abort", listener);
			}
		});
	}
}
