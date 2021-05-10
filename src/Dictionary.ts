import { Out } from "./Out";
import { Enumerator } from "./Enumerator";
/** Dictionary Hash List
 * @class Dictionary
 * @extends {Array}
 */
export class Dictionary<T extends string | number, A> extends Array {
	private hash: Hash;
	constructor() {
		super();
		this.hash = {};
	}
	/**
	 * Add a key to the Dictionary.
	 */
	public Add(Key: T, Value: A): boolean {
		if (this.ContainsKey(Key))
			throw new Error(
				"ArgumentException: An element with the same key already exists"
			);
		this.hash[Key.toString()] = this.push({ Key, Value }) - 1;
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
		if (this.hash[Key.toString()] != null) return true;
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
		this[this.hash[Key.toString()]].Value = Value;
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
	public Remove(Key: T): boolean {
		if (!this.ContainsKey(Key)) return false;
		this.RemoveAt(this.hash[Key.toString()]);
		return true;
	}

	/**
	 * Try and remove a value
	 */
	public TryRemove(Key: T): boolean {
		if (!this.ContainsKey(Key)) return false;
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
		Out.Out = this[this.hash[Key.toString()]].Value;
		return true;
	}

	/**
	 * Validate and Update the internal hash.
	 * Only use this if you know what you're doing
	 */
	public ValidateHash(): true {
		let keys = 0;
		for (const key in this.hash) {
			let flag: Entry<T, A> | null = null;
			const looseValues: { [prop: string]: boolean } = {};
			for (const object of this) {
				if (looseValues[object.Key.toString()] == null)
					looseValues[object.Key.toString()] = false;
				if (object.Key.toString() === key) {
					flag = object;
					break;
				}
				if (flag !== null) {
					keys++;
					looseValues[flag["Key"]] = true;
					this.hash[key] = this.indexOf(flag);
				} else {
					delete this.hash[key];
				}
			}
		}
		if (this.Count != keys) {
			for (let i = 0; i < this.Count; i++) {
				if (this.hash[this[i].Key] == null) this.hash[this[i].Key] = i;
			}
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
		for (const key in obj) {
			Dict.Add(key.toString(), obj[key]);
		}
		return Dict;
	}

	/**
	 * Add an item or update a matching item
	 */
	public AddOrUpdate(Key:T, Value:A, ReplaceFunc:(Key:T,OldValue:A)=>A): A {
		if (!this.ContainsKey(Key)){
			this.TryAdd(Key, Value)
			return Value as A
		}
		if (ReplaceFunc==null){
			this.Replace(Key, Value)
			return Value as A
		}
		let OldValue = new Out() as Out<A>
		this.Get(Key, OldValue)
		let newValue = ReplaceFunc(Key, OldValue.Out as A);
		this.Replace(Key, newValue)
		return newValue as A
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
}
interface Hash {
	[prop: string]: number;
}

interface Entry<T, A> {
	Key: T;
	Value: A;
	Error?: true;
}
