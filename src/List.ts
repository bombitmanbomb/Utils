import { Out } from "./Out";
import { Enumerator } from "./Enumerator";

/**
 * List Class
 */
export class List<T> extends Array {
	constructor(Capacity: number);
	constructor(...props: T[]);
	constructor(...props: T[]) {
		if (props.length === 0) {
			super();
			this.Capacity = 0;
			this.Filled = 0;
			return;
		}
		if (props.length === 1 && typeof props[0] == "number") {
			super((props[0] as unknown) as number);
			this.Capacity = (props[0] as unknown) as number;
			this.Filled = 0;
			return;
		}
		super();
		this.Capacity = 0;
		this.Filled = 0;
		for (const item of props) {
			this.Add(item);
		}
	}
	private _filled!: number;
	private _capacity!: number;

	public get Filled(): number {
		return this._filled ?? 0;
	}
	public set Filled(value: number) {
		Object.defineProperty(this, "_filled", {
			value,
			enumerable: false,
			writable: true,
		});
	}
	public get Capacity(): number {
		return this._capacity;
	}
	public set Capacity(value: number) {
		Object.defineProperty(this, "_capacity", {
			value,
			enumerable: false,
			writable: true,
		});
		this.EnsureCapacity();
	}
	/**
	 * Add a value
	 */
	public Add(Value: T): number {
		if (this.Filled >= this.Capacity) {
			const index = this.push(Value);
			this.Capacity++;
			this.Filled++;
			return index;
		}
		const index = this.NextFree();
		this[index] = Value;
		this.Filled++;
		return index;
	}
	/**
	 * Add a Unique value
	 */
	public AddUnique(Value: T): number {
		if (!this.Contains(Value)) return this.Add(Value);
		return -1;
	}
	/**
	 * Check if two arrays are equal
	 */
	public ElementWiseEquals<T>(other: List<T>): boolean {
		return this.every((item) => other.includes(item)); // Lazy Check, Misses Duplicates
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
	public RemoveRange(index: number, count: number): List<T> {
		const removed = this.splice(index, count) as List<T>;
		this.EnsureCapacity();
		this.Filled -= removed.length;
		return removed;
	}
	public Insert(index: number, item: T): void {
		this.splice(index, 0, item);
		this.Filled++;
		this.EnsureCapacity();
	}
	public CopyTo(other: Array<T>, arrayIndex = 0, length: number) {
		for (let i = 0; i < length ?? this.length; i++)
			other[i + arrayIndex] = this[i];
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
	private EnsureCapacity(): void {
		if (this.Filled > this.Capacity) {
			this.Capacity += this.Filled - this.Capacity;
		} else if (this.Capacity > this.length) {
			while (this.length < this.Capacity) this.push((void 0 as unknown) as T);
		} else
			while (this.Capacity < this.length) {
				const next = this.NextFree();
				if (next == -1) break;
				this.splice(next, 1);
			}
	}
	private NextFree(): number {
		return this.findIndex((v) => v == void 0);
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
		this.Capacity = 0;
		this.Filled = 0;
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
	public Remove(iValue: T): T {
		const iIndex = this.indexOf(iValue);
		if (~iIndex) {
			this.RemoveAt(iIndex);
		}
		this.EnsureCapacity();
		return iValue;
	}
	/**
	 * Remove a value at a given index
	 */
	public RemoveAt(iIndex: number): T {
		const vItem = this[iIndex];
		if (vItem) {
			this.splice(iIndex, 1);
			this.Filled--;
		}
		this.EnsureCapacity();
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
