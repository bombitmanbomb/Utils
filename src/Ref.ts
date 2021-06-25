export class Ref<T> extends Array<T>{
	Value?: T;
	constructor($b?: T) {
    super()
		this.Value = $b;
	}
}
