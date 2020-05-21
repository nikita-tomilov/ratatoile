export enum Method {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
}

export interface IAuthService {
    login: (username: string, password: string) => void
    logout: () => void
    setUserToken: (token: string) => void
    setAuthError: (error: string) => void
}
