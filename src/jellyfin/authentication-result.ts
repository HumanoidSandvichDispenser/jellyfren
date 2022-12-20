import SessionInfo from "./session-info";
import UserDto from "./user-dto";

export default interface AuthenticationResult {
    User: UserDto;
    SessionInfo: SessionInfo;
    AccessToken: string;
    ServerId: string;
};
