import { List } from "./List";
import { Dictionary } from "./Dictionary";
/**
 * Enumerator. Used to loop through a Dictionary or List
 * @class Enumerator
 * @template T
 */
export class Enumerator<T extends Dictionary<any, any> | List<any>> {
  Struct: T;
  Position: number;
  /**
	 * Current Value
	 * @type {*}
	 * @memberof Enumerator
	 */
  Current: any;
  constructor(dict: T) {
    this.Struct = dict;
    this.Position = -1;

    this.Current = null;
  }
  /**
	 * Move counter next
	 * @returns {boolean} Is there a value in Current
	 */
  public MoveNext(): boolean {
    this.Position++;
    if (this.Position >= this.Struct.Count) {
      this.Current = null;
      return false;
    }
    if (this.Struct instanceof List) {
      this.Current = this.Struct[this.Position];
    } else if (this.Struct instanceof Dictionary) {
      this.Current = Array.from(this.Struct.entries())[this.Position][1]; //Dislike
    } else {
      this.Current = null;
      return false;
    }
    return true;
  }
}
