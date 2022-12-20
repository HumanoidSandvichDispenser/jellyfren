import Song from "../song";
import AuthenticationResult from "./authentication-result";
import Credentials from "./credentials";
import UserDto from "./user-dto";

export default class Client {
    public protocol: string;
    public address: string;
    public port: number;

    public user?: UserDto;
    private username?: string;
    private authInfo?: AuthenticationResult = undefined;
    private accessToken?: string = undefined;

    private xEmbyAuthorization = [
        'MediaBrowser Client="Jellyfren"',
        'Device="Jellyfren"',
        'DeviceId="tauri"',
        'Version="0.0.0"',
        'Token=""'
    ].join(", ");

    public constructor(
        protocol: string,
        address: string,
        port: number,
        accessToken?: string,
        user?: UserDto
    ) {
        this.protocol = protocol;
        this.address = address;
        this.port = port;
        this.accessToken = accessToken;
        this.user = user;
    }

    /**
     * An object consisting of login information inteded to be used by
     * `window.localStorage` or some other object store
     */
    public get credentials(): Credentials {
        console.log("user = " + this.user);
        return {
            protocol: this.protocol,
            address: this.address,
            port: this.port,
            username: this.username,
            accessToken: this.accessToken,
            user: this.user
        }
    }

    public get headers(): Headers {
        const headers = {
            "Content-Type": "application/json",
            "Content-Encoding": "br",
            "x-emby-authorization": this.xEmbyAuthorization,
            "X-Emby-Token": this.accessToken ?? ""
        };
        return new Headers(headers);
    }

    public get serverURL(): string {
        const url = new URL(`${this.protocol}://${this.address}`);
        url.port = this.port.toString();
        return url.toString().replace(/\/+$/, "");
    }

    public setAccessToken(value?: string) {
        this.accessToken = value;
    }

    public async api(
        method: string,
        path: string,
        body?: {}
    ): Promise<Response> {
        return fetch(this.serverURL + path, this.getRequest(
            method,
            body
        ));
    }

    public getRequest(method: string, body?: {}): RequestInit {
        return {
            method: method,
            mode: "cors",
            headers: this.headers,
            body: JSON.stringify(body)
        }
    }

    public async login(username: string, password: string): Promise<void> {
        const res = await this.api(
            "POST",
            "/Users/AuthenticateByName",
            {
                Username: username,
                Pw: password
            },
        );
        const json = await res.json();
        const authInfo = json as AuthenticationResult;
        console.log(authInfo);
        this.accessToken = authInfo.AccessToken;
        this.user = authInfo.User;
        this.username = username;
    }

    public async getSessions(withinSeconds?: number): Promise<Response> {
        let path = "/Sessions";
        if (withinSeconds != undefined) {
            path += "?ActiveWithinSeconds=" + withinSeconds;
        }
        return this.api("GET", path);
    }

    public async favoriteItem(itemId: string): Promise<void> {
        const res = await this.api(
            "POST",
            `/Users/${this.user?.Id}/FavoriteItems/${itemId}`
        );
    }

    public async fetchItems(): Promise<any> {
        return (await this.api(
            "GET",
            `/Users/${this.user?.Id}/Items`,
        )).json();
    }

    public async fetchSongs(library: string): Promise<Song[]> {
        return [];
    }
}
