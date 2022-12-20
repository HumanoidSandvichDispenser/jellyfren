import UserDto from "./user-dto";

export default interface Credentials {
    protocol: string;
    address: string;
    port: number;
    username?: string;
    accessToken?: string;
    user?: UserDto;
};
