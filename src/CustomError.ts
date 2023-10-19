const kCode = Symbol("code");
/**
 * Extend an error of some sort into a BitBotError
 */
export class CustomError extends Error {
	constructor(type: string, error: any) {
		super(error);
		(this as any)[kCode as unknown as string] = type;
		if ((Error as any).captureStackTrace)
			(Error as any).captureStackTrace(this, CustomError);
		this.raiseTrace();
	}

	get name() {
		return `[${(this as any)[kCode as unknown as string]}]`;
	}

	get code() {
		return (this as any)[kCode as unknown as string];
	}

	get message() {
		return super.message ?? "No Message";
	}

	public raiseTrace(amount: number = 1) {
		this.stack = this.stack
			?.split("\n")
			.filter(function (line, index) {
				return !(index > 0 && index <= amount);
			})
			.join("\n");
		return this;
	}
}
