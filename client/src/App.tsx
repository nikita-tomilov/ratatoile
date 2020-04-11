import React  from 'react'
import './App.css'
import SignIn from './components/SignIn'
import { Workspace } from './components/Workspace'
import { connect } from 'react-redux'
import { AppState } from './store/reducers'

function App(props: any) {
    return (
        <div className="App">
            {props.token ? <Workspace/> : <SignIn/>}
        </div>
    )
}


const mapStateToProps = (store: AppState) => {
    return {
        token: store.userToken
    }
}

export default connect(mapStateToProps)(App)
