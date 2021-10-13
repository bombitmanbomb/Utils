import { CancellationTokenSource } from "./CancellationTokenSource";
export class TaskCompletionSource<TResult> {
	public Status: string;
	public Task: Promise<TResult>;
	private res!: (response: TResult | PromiseLike<TResult>) => void;
	private rej!: (error?: Error | string) => void;
	public SetCanceled(cancellationToken?: CancellationTokenSource): void {
		if (
			this.Status == "Canceled" ||
			this.Status == "Faulted" ||
			this.Status == "RanToCompletion"
		)
			throw new Error("InvalidOperationException");
		if (cancellationToken != null) {
			cancellationToken.signal.addEventListener(
				"abort",
				() => {
					this.Status = "Canceled";
					this.rej();
				},
				true
			);
		} else {
			this.Status = "Cancelled";
			this.rej();
		}
	}
	public SetException(error: string | Error): void {
		this.Status = "Faulted";
		this.rej(error);
	}
	public SetResult(result: TResult): void {
		if (
			this.Status == "RanToCompletion" ||
			this.Status == "Faulted" ||
			this.Status == "Canceled"
		)
			throw new Error("InvalidOperationException");
		this.Status = "RanToCompletion";
		this.res(result);
	}
	public TrySetCanceled(cancellationToken?: CancellationTokenSource): boolean {
		try {
			this.SetCanceled(cancellationToken);
			return true;
		} catch (error) {
			return false;
		}
	}
	public TrySetException(error: string | Error): boolean {
		try {
			this.SetException(error);
			return true;
		} catch (error) {
			return false;
		}
	}
	public TrySetResult(result: TResult): boolean {
		try {
			this.SetResult(result);
			return true;
		} catch (error) {
			return false;
		}
	}
	constructor(state?: string) {
		this.Status = state ?? "WaitingForActivation";
		this.Task = new Promise((response, reject) => {
			this.res = response;
			this.rej = reject;
		});
	}
}
