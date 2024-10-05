import { isActiveSession } from './http/session'
import { HomeScreen } from './screens/home-screen'
import { LoginScreen } from './screens/login-screen'

function App() {
    return (
        <div className="flex flex-col w-full h-full items-center">
            {isActiveSession() ? <HomeScreen /> : <LoginScreen />}
        </div>
    )
}

export default App
