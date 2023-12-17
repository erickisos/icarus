export interface IrcState {
    channels: string[],
    users: string[],
    messages: string[],
    currentChannel: string,

}

export interface IrcConnection {
    username: string,
    password: string,
    server: string,
    port: number,
}
