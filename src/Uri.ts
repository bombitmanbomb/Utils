/**.
 * Uri Support Class for working with Url's much easier by converting it to a usable object
 */
export class Uri {
	public Segments: string[];
	public _raw: Component;
	public rawUrl: string;
	constructor(url: string) {
		this.rawUrl = "";
		this._raw = { path: "" };
		this.Segments = [];
		this.URL = url;
	}
	public set URL(value: string) {
		Object.defineProperties(this, {
			rawUrl: { value, enumerable: false },
			_raw: { value: uri_parse(value), enumerable: false },
		});
		this.Segments = [];
		const path = this._raw.path.split("/");
		path.forEach((value, index) => {
			this.Segments.push(index < path.length - 1 ? value + "/" : value);
		});
	}
	public get URL(): string {
		return this.rawUrl;
	}
	public get Host(): string {
		return this._raw.host as string;
	}
	public get Scheme(): string {
		return this._raw.scheme as string;
	}
	static EscapeDataString(dat: string): string {
		return encodeURI(dat);
	}
	public get Query(): string {
		return this._raw.query
			? "?" + this._raw.query
			: ((null as unknown) as string);
	}
}
function uri_parse(uriString: string): Component {
	const components: Component = { path: "" };
	const matches = uriString.match(
		/^(?:([^:/?#]+):)?(?:\/\/((?:([^/?#@]*)@)?(\[[^/?#\]]+\]|[^/?#:]*)(?::(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i
	);
	if (matches) {
		components.scheme = matches[1];
		components.userinfo = matches[3];
		components.host = matches[4];
		components.port = parseInt(matches[5], 10);
		components.path = matches[6] ?? "";
		components.query = matches[7];
		components.fragment = matches[8];
		if (isNaN(components.port)) {
			components.port = (matches[5] as unknown) as number;
		}
	} else {
		components.error = components.error ?? "URI can not be parsed.";
	}
	return components;
}

interface Component {
	scheme?: string;
	userinfo?: string;
	host?: string;
	port?: number;
	path: string;
	query?: string;
	fragment?: string;
	error?: string;
}
