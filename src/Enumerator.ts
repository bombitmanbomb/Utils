import { List } from "./List";
import { Dictionary } from "./Dictionary";

export class Enumerator<T extends Dictionary<any, any> | List<any>> {
	Struct: T;
	Position: number;
	Current: any;
	constructor(dict: T) {
		this.Struct = dict;
		this.Position = -1;
		this.Current = null;
	}

	public MoveNext(): boolean {
		this.Position++;
		if (this.Position >= this.Struct.Count) {
			this.Current = null;
			return false;
		}
		if (this.Struct instanceof List) {
			this.Current = this.Struct[this.Position];
		} else if (this.Struct instanceof Dictionary) {
			this.Current = this.Struct[this.Position].Value;
		} else {
			this.Current = null;
			return false;
		}
		return true;
	}
}
