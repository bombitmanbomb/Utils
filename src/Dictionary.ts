import { Out } from "./Out";
import { Enumerator } from "./Enumerator";
export class Dictionary<T extends string | number, A> extends Array {
	private hash: Hash;
	constructor() {
		super();
		this.hash = {};
	}

	public Add(Key: T, Value: A): boolean {
		if (this.ContainsKey(Key))
			throw new Error(
				"ArgumentException: An element with the same key already exists"
			);
		this.hash[Key.toString()] = this.push({ Key, Value }) - 1;
		return true;
	}

	public TryAdd(Key: T, Value: A): boolean {
		if (this.ContainsKey(Key)) return false;
		return this.Add(Key, Value);
	}

	public Clear(): void {
		this.splice(0, this.length);
		this.ValidateHash();
	}

	public ContainsKey(Key: T): boolean {
		if (this.hash[Key.toString()] != null) return true;
		return false;
	}

	public CheckCount(
		predicate: (value: any, index: number, array: any[]) => unknown
	): number {
		if (predicate == null) return this.length;
		return this.filter(predicate).length;
	}

	public Replace(Key: T, Value: A): boolean {
		if (!this.ContainsKey(Key)) return false;
		this[this.hash[Key.toString()]].Value = Value;
		return true;
	}

	public ContainsValue(Value: A): boolean {
		for (const object of this) {
			if (object.Value === Value) return true;
		}
		return false;
	}

	public RemoveAt(iIndex: number): Entry<T, A> {
		const vItem = this[iIndex];
		if (vItem) {
			this.splice(iIndex, 1);
		}
		this.ValidateHash();
		return vItem;
	}

	public Remove(Key: T): boolean {
		if (!this.ContainsKey(Key)) return false;
		this.RemoveAt(this.hash[Key.toString()]);
		return true;
	}

	public TryRemove(Key: T): boolean {
		if (!this.ContainsKey(Key)) return false;
		return this.Remove(Key);
	}

	public get Count(): number {
		return this.length;
	}

	public Get(Key: T, Out: Out<A>): boolean {
		if (!this.ContainsKey(Key)) return false;
		Out.Out = this[this.hash[Key.toString()]].Value;
		return true;
	}

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

	public static ToDictionary(obj: any): Dictionary<string, any> {
		const Dict: Dictionary<string, any> = new Dictionary();
		for (const key in obj) {
			Dict.Add(key, obj[key]);
		}
		return Dict;
	}

	public TryGetValue(Key: T, Out?: Out<A>): boolean {
		if (Key == null) return false;
		if (!this.ContainsKey(Key)) return false;
		if (Out) this.Get(Key, Out);
		return true;
	}

	public ReturnValue(Key: T, out: Out<A> = Out.Default()) {
		this.TryGetValue(Key, out);
		return out.Out;
	}

	public GetEnumerator() {
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
