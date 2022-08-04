const kCode = Symbol("code");
/**
 * Extend an error of some sort into a BitBotError
 */
export class CustomError extends Error {
		constructor(type: string, error: any) {
			super(error);
			(this as any)[kCode as unknown as string] = type;
			if (Error.captureStackTrace) Error.captureStackTrace(this, CustomError);
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
	};
