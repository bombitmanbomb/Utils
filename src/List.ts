import { Out } from "./Out";
import { Enumerator } from "./Enumerator";

/**
 * List Class
 */
export class List<T> extends Array {
	constructor(...props: T[]) {
		super();
		if (props.length === 0) {
			return;
		}
		for (const item of props) {
			this.Add(item);
		}
	}
	/**
	 * Add a value
	 */
	public Add(Value: T): number {
		return this.push(Value);
	}
	/**
	 * Add a range of values
	 */
	public AddRange(range: List<T>): number {
		if (range == null) throw new Error("ArgumentNullException");
		if (!(range instanceof List))
			throw new Error("AddRange: Expected type List");
		for (const item of range) {
			this.Add(item);
		}
		return this.Count - 1;
	}
	/**
	 * Turn an array into a list
	 */
	public static ToList(Props: any[]): List<any> {
		const t: List<any> = new List();
		if (!Props) return t;
		try {
			for (const item of Props) {
				t.Add(item);
			}
		} catch (error) {
			return t;
		}
		return t;
	}
	/**
	 * Turn an array into a list containing type Constructor
	 */
	public static ToListAs(Props: any[], constructor: any): List<any> {
		const t: List<any> = new List();
		if (!Props) return t;
		try {
			for (const item of Props) {
				try {
					t.Add(constructor(item));
				} catch (error) {
					t.Add(new constructor(item));
				}
			}
		} catch (error) {
			return t;
		}
		return t;
	}
	/**
	 * Clear the list
	 */
	public Clear(): void {
		this.splice(0, this.length);
	}
	/**
	 * Check if the list contains a value
	 */
	public Contains(item: T): boolean {
		return this.includes(item);
	}
	/**
	 * Get the count of items in the list.
	 */
	public get Count(): number {
		return this.length;
	}
	/**
	 * Remove the First instance of a value.
	 * if no value returns -1
	 */
	public Remove(iValue: number): number {
		const iIndex = this.indexOf(iValue);
		if (~iIndex) {
			this.RemoveAt(iIndex);
		}
		return iIndex;
	}
	/**
	 * Remove a value at a given index
	 */
	public RemoveAt(iIndex: number): T {
		const vItem = this[iIndex];
		if (vItem) {
			this.splice(iIndex, 1);
		}
		return vItem;
	}
	/**
	 * Attempt to get a given value.
	 * @deprecated This is useless, use ContainsValue
	 */
	public TryGetValue(Value: T, out: Out<T>): boolean {
		if (Value == null) return false;
		if (this.includes(Value)) return false;
		if (out) out.Out = Value;
		return true;
	}
	/**
	 * Remove and return a Random value
	 */
	public TakeRandom(): T {
		return this.RemoveAt(~~(Math.random() * this.Count));
	}
	/**
	 * Get a random value
	 */
	public GetRandom(): T {
		return this[~~(Math.random() * this.Count)];
	}
	/**
	 * Get the enumerator for the class
	 */
	public GetEnumerator(): Enumerator<List<T>> {
		return new Enumerator(this);
	}
	public toJSON(): T[] {
		const list = [] as T[];
		for (const item of this) {
			try {
				list.push(item.toJSON());
			} catch (error) {
				list.push(item);
			}
		}
		return list;
	}
}
