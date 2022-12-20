export default interface UserDto {
    Name: string;
    ServerId: string;
    ServerName: string;
    Id: string;
    PrimaryImageTag: string;
    HasPassword: boolean;
    HasConfiguredPassword: boolean;
    EnableAutoLogin: boolean;
    LastLoginDate: string;
    LastActivityDate: string;
}
