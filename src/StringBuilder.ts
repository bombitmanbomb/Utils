export class StringBuilder {
	private String: string[];
	constructor() {
		this.String = [];
	}
	public Append(str: string): void {
		for (const char of str) this.String.push(char);
	}
	public Insert(pos: number, str: string): void {
		this.String.splice(pos, 0, str);
	}
	public Set(pos: number, char: string): void {
		this.String[pos] = char;
	}
	toString(): string {
		return this.String.join("");
	}
	public get Length(): number {
		return this.String.length;
	}
	public Remove(startIndex: number, length: number): void {
		this.String.splice(startIndex, length);
	}
	public Clear(): void {
		this.String = [];
	}
}
