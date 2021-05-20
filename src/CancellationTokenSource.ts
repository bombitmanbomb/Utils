import AbortController from "abort-controller";
import type { TimeSpan } from "./TimeSpan";

export class CancellationTokenSource {
	private _cancel: boolean;
	private controller: AbortController;
	constructor(timeout: number | TimeSpan | null = null) {
		this._cancel = false;
		this.controller = new AbortController();
		this.abort = this.abort.bind(this);
		if (timeout != null) {
			if (typeof timeout === "number") {
				setTimeout(this.abort, timeout);
			} else {
				setTimeout(this.abort, timeout.msecs);
			}
		}
	}
	abort(): void {
		this._cancel = true;
		this.controller.abort();
	}
	get Token(): CancellationTokenSource {
		return this;
	}
	get signal(): AbortSignal {
		return this.controller.signal;
	}
	get aborted(): boolean {
		return this._cancel;
	}
	Cancel(): void {
		this.abort();
	}
	IsCancellationRequested(): boolean {
		return this._cancel;
	}
}
