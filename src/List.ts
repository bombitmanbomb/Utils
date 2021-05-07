import { Out } from "./Out";
import { Enumerator } from "./Enumerator";

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

	public Add(Value: T): number {
		return this.push(Value);
	}

	public static ToList(Props: any[]): List<any> {
		const t: List<any> = new List();
		for (const item of Props) {
			t.Add(item);
		}
		return t;
	}

	public Clear(): void {
		this.splice(0, this.length);
	}

	public Contains(item: T): boolean {
		return this.includes(item);
	}

	public get Count(): number {
		return this.length;
	}

	public Remove(iValue: number): number {
		const iIndex = this.indexOf(iValue);
		if (~iIndex) {
			this.RemoveAt(iIndex);
		}
		return iIndex;
	}

	public RemoveAt(iIndex: number): T {
		const vItem = this[iIndex];
		if (vItem) {
			this.splice(iIndex, 1);
		}
		return vItem;
	}

	public TryGetValue(Value: T, out: Out<T>): boolean {
		if (Value == null) return false;
		if (this.includes(Value)) return false;
		if (out) out.Out = Value;
		return true;
	}

	public TakeRandom(): T {
		return this.RemoveAt(~~(Math.random() * this.Count));
	}

	public GetEnumerator(): Enumerator<List<T>> {
		return new Enumerator(this);
	}
}
