import { CustomError } from "./CustomError";
import { List } from "./List";
/**
 * Enumerable Util Class (for Non TS)
 */
export class Enumerable<T extends string | number> extends Object {
	constructor(list: T[] | List<T>) {
		super();
		if (list instanceof List || list instanceof Array || Array.isArray(list)) {
			for (let i = 0; i < list.length; i++) {
				Object.defineProperty(this, list[i], { value: i });
			}
		} else if (list != null) {
			const keys = Object.keys(list);
			for (let i = 0; i < keys.length; i++) {
				Object.defineProperty(this, keys[i], { value: list[keys[i]] });
			}
		} else {
			throw new CustomError("InvalidConstructor", "Expected type: <Array, List, Object>");
		}
		Object.freeze(this);
	}
	/**
	 * Get Value Raw
	 */
	public GetValue(Key: T): string | number {
		const { [Key]: Identifier } = this;
		return Identifier as unknown as string | number;
	}

	public FromNumber(index: number): string | undefined {
		const keys = Object.keys(this);
		if (keys.length - 1 < index) throw Error("Index larger than Enum");
		const { [keys[index] as T]: Identifier } = this;
		if (Identifier != null) return keys[index];
	}
}
