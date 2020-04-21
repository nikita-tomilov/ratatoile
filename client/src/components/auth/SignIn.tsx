import React, { useCallback, useState } from 'react'
import './SignIn.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import {getAuthService} from "../../services/authService";
import {AppState} from "../../store/store";

const authService = getAuthService()

const SignIn = (props: { authFailMessage: string | null}): JSX.Element => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const onNameChange = useCallback((event) => {
        if (event.currentTarget && event.currentTarget.value)
            setName(event.currentTarget.value)
    }, [])


    const onPasswordChange = useCallback((event) => {
        if (event.currentTarget && event.currentTarget.value)
            setPassword(event.currentTarget.value)
    }, [])

    const onSignIn = useCallback(() => {
        authService.login(name, password);
    }, [name, password])

    const onKeyPress = useCallback((e: React.KeyboardEvent) => {
        if(e.which === 13) {
            onSignIn();
        }
    }, [onSignIn])

    return (
        <div className="SignInForm">
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="login"
                label="Login"
                name="login"
                autoComplete="login"
                autoFocus
                value={name}
                onChange={onNameChange}
                onKeyPress={onKeyPress}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={onPasswordChange}
                onKeyDown={onKeyPress}
            />
            {props.authFailMessage && <div className="error">{props.authFailMessage}</div>}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={onSignIn}
            >
                Sign In
            </Button>
        </div>
    )
}

const mapStateToProps = (store: AppState) => {
    return {
        authFailMessage: store.authFailMessage
    }
}

export default connect(mapStateToProps)(SignIn)