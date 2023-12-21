export interface IrcState {
    channels: string[],
    users: string[],
    messages: string[],
    currentChannel: string,

}

export interface IrcConnection {
    username: string,
    password: string,
    address: string,
    port: number,
    name: string,
}
