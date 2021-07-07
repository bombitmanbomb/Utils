import { Out } from "./Out";
import { Enumerator } from "./Enumerator";
/** Dictionary Hash List
 * @class Dictionary
 * @extends {Array}
 */
export class Dictionary<T, A> extends Array {
	private hash!: Map<T, number>
	constructor() {
		super();
		Object.defineProperty(this, "hash", { value: new Map, enumerable: false });
	}
	/**
	 * Add a key to the Dictionary.
	 */
	public Add(Key: T, Value: A): boolean {
		if (Key == null) return false;
		if (this.ContainsKey(Key))
			throw new Error(
				"ArgumentException: An element with the same key already exists"
			);
		this.hash.set(Key, this.push({ Key, Value }) - 1)
		return true;
	}

	/**
	 * Attempt to add a key.
	 * Will not error if key exists.
	 */
	public TryAdd(Key: T, Value: A): boolean {
		if (this.ContainsKey(Key)) return false;
		return this.Add(Key, Value);
	}

	/**
	 * Clear the Dictionary.
	 */
	public Clear(): void {
		this.splice(0, this.length);
		this.ValidateHash();
	}
	/**
	 * Check if a key exists.
	 */
	public ContainsKey(Key: T): boolean {
		if (Key == null) return false;
		if (this.hash.has(Key)) return true;
		return false;
	}

	/**
	 * Check how many items match a predicate.
	 */
	public CheckCount(
		predicate: (value: any, index: number, array: any[]) => unknown
	): number {
		if (predicate == null) return this.length;
		return this.filter(predicate).length;
	}
	/**
	 * Replace the value in a key
	 */
	public Replace(Key: T, Value: A): boolean {
		if (!this.ContainsKey(Key)) return false;
		this[this.hash.get(Key) as number].Value = Value;
		return true;
	}

	/**
	 * Check if the dictionary contains a Value
	 */
	public ContainsValue(Value: A): boolean {
		for (const object of this) {
			if (object.Value === Value) return true;
		}
		return false;
	}

	/**
	 * Remove an Index
	 */
	private RemoveAt(iIndex: number): Entry<T, A> {
		const vItem = this[iIndex];
		if (vItem) {
			this.splice(iIndex, 1);
		}
		this.ValidateHash();
		return vItem;
	}
	/**
	 * Remove a value by Key
	 */
	public Remove(Key: T, out: Out<A> = []): boolean {
		if (!this.ContainsKey(Key)) return false;
		out.Out = this.RemoveAt(this.hash.get(Key) as number).Value;
		return true;
	}

	/**
	 * Try and remove a value
	 */
	public TryRemove(Key: T, out: Out<A> = []): boolean {
		if (!this.ContainsKey(Key)) return false;
		out.Out = this.RemoveAt(this.hash.get(Key) as number).Value;
		return this.Remove(Key);
	}
	/**
	 * The Item Count
	 */
	public get Count(): number {
		return this.length;
	}

	/**
	 * Get an item.
	 */
	public Get(Key: T, Out: Out<A>): boolean {
		if (!this.ContainsKey(Key)) return false;
		Out.Out = this[this.hash.get(Key) as number].Value;
		return true;
	}

	/**
	 * Validate and Update the internal hash.
	 * Only use this if you know what you're doing
	 */
	public ValidateHash(): true {
		this.hash = new Map
		for (let i = 0; i < this.Count; i++) {
			const key = this[i]?.Key?.toString();
			if (key == null) continue;
			this.hash.set(key, i);
		}
		return true;
	}

	/**
	 * Create a dictionary from an object
	 */
	public static ToDictionary(obj: {
		[prop: string]: any;
		[prop: number]: any;
	}): Dictionary<string, any> {
		const Dict: Dictionary<string, any> = new Dictionary();
		try {
			for (const key in obj) {
				Dict.Add(key.toString(), obj[key]);
			}
		} catch (error) {
			return Dict;
		}
		return Dict;
	}
	/**
	 * Create a dictionary from an object containing object constructor
	 */
	public static ToDictionaryAs(
		obj: {
			[prop: string]: any;
			[prop: number]: any;
		},
		constructor: any
	): Dictionary<string, any> {
		const Dict: Dictionary<string, any> = new Dictionary();
		try {
			for (const key in obj) {
				try {
					Dict.Add(key.toString(), constructor(obj[key]));
				} catch (error) {
					Dict.Add(key.toString(), new constructor(obj[key]));
				}
			}
		} catch (error) {
			return Dict;
		}

		return Dict;
	}
	/**
	 * Add an item or update a matching item
	 */
	public AddOrUpdate(
		Key: T,
		Value: A,
		ReplaceFunc: (Key: T, OldValue: A) => A
	): A {
		if (!this.ContainsKey(Key)) {
			this.TryAdd(Key, Value);
			return Value as A;
		}
		if (ReplaceFunc == null) {
			this.Replace(Key, Value);
			return Value as A;
		}
		const OldValue = new Out() as Out<A>;
		this.Get(Key, OldValue);
		const newValue = ReplaceFunc(Key, OldValue.Out as A);
		this.Replace(Key, newValue);
		return newValue as A;
	}
	/**
	 * Try and get a value
	 */
	public TryGetValue(Key: T, Out?: Out<A>): boolean {
		if (Key == null) return false;
		if (!this.ContainsKey(Key)) return false;
		if (Out) this.Get(Key, Out);
		return true;
	}
	/**
	 * Get a value and return it
	 */
	public ReturnValue(Key: T, out: Out<A> = Out.Default() as Out<A>): A {
		this.TryGetValue(Key, out);
		return out.Out as A;
	}

	/**
	 * Get the struct enumerator.
	 * Only use this if you know what you're doing.
	 */
	public GetEnumerator(): Enumerator<Dictionary<T, A>> {
		return new Enumerator(this);
	}

	public toJSON(): { [prop: string]: A } {
		const response = {};
		for (const property of this) {
			Object.defineProperty(response, property.Key, { value: property.Value });
		}
		return response;
	}
}

interface Entry<T, A> {
	Key: T;
	Value: A;
	Error?: true;
}
