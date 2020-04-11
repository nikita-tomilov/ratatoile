import React from 'react'
import Button from '@material-ui/core/Button'
import { getAuthService } from '../services/authService'
const authService = getAuthService()

export class Workspace extends React.PureComponent {
    render(): React.ReactNode {
        return <div>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={authService.logout}
            >
                Logout
            </Button>
        </div>
    }
}
