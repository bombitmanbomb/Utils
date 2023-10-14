import { Out } from "./Out";
import { Enumerator } from "./Enumerator";
import { CustomError } from "./CustomError";
/** Dictionary Hash List
 * @class Dictionary
 * @extends {Array}
 */
export class Dictionary<T, A> extends Map<T, A> {
	private hash!: Map<T, number>;
	constructor(dict: Iterable<readonly [T, A]> | null | undefined = void 0) {
		super(dict);
	}
	/**
	 * Add a key to the Dictionary.
	 */
	public Add(Key: T, Value: A): boolean {
		if (Key == null) return false;
		if (this.has(Key))
			throw new CustomError(
				"ArgumentException",
				"An element with the same key already exists",
			);
		this.set(Key, Value);
		return true;
	}

	*IteratorList() {
		for (const Key of this.keys()) yield { Key, Value: this.get(Key) as A };
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
		this.clear();
	}
	/**
	 * Check if a key exists.
	 */
	public ContainsKey(Key: T): boolean {
		if (Key == null) return false;
		if (this.has(Key)) return true;
		return false;
	}

	/**
	 * Check how many items match a predicate.
	 */
	public CheckCount(
		predicate: (value: any, index: number, array: any[]) => unknown,
	): number {
		if (predicate == null) return this.size;
		return Array.from(this.entries()).filter(predicate).length;
	}
	/**
	 * Replace the value in a key
	 */
	public Replace(Key: T, Value: A): boolean {
		if (!this.ContainsKey(Key)) return false;
		this.set(Key, Value);
		return true;
	}

	/**
	 * Check if the dictionary contains a Value
	 */
	public ContainsValue(Value: A): boolean {
		return Array.from(this.values()).some((v) => v == Value);
	}

	/**
	 * Remove a value by Key
	 */
	public Remove(Key: T, out: Out<A> = new Out()): boolean {
		if (!this.ContainsKey(Key)) return false;
		out.Out = this.get(Key) as A;
		this.delete(Key);
		return true;
	}

	/**
	 * Try and remove a value
	 */
	public TryRemove(Key: T, out: Out<A> = new Out()): boolean {
		return this.Remove(Key, out);
	}
	/**
	 * The Item Count
	 */
	public get Count(): number {
		return this.size;
	}

	/**
	 * Get an item.
	 */
	public Get(Key: T, out: Out<A> = new Out()): boolean {
		if (!this.ContainsKey(Key)) return false;
		out.Out = this.get(Key) as A;
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
		constructor: any,
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
		ReplaceFunc: (Key: T, OldValue: A) => A,
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
		const response: any = {};
		for (const property of this.entries()) {
			try {
				response[property[0]] = (property[1] as any).toJSON();
			} catch (error) {
				response[property[0]] = property[1];
			}
		}
		return response;
	}
}
