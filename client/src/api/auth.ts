import { route } from './url'
import { Method } from '../services/types'
import { getAuthService } from '../services/authService'

const request = require('request')

const user = 'oauth2-client'
const pass = 'oauth2-client-password'

export const getToken = (body: string): any => {
    makeRequest(body);
}

const makeRequest = (body: string) => {
    request(
        {
            url: `${route}/oauth/token`,
            method: Method.POST,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
            auth: {
                user,
                pass,
            },
            strictSSL: false,
        },
        callback,
    )
};

const callback = (error: any, response: any, body: any) => {
    const ans = JSON.parse(body)
    if(ans.error) {
        getAuthService().setAuthError(ans.error_description);
        return
    }

    const token = ans.access_token
    getAuthService().setUserToken(token)
}
