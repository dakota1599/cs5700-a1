import { useEffect, useState } from 'react'
import { isActiveSession } from './http/session'
import { HomeScreen } from './screens/home-screen'
import { LoginScreen } from './screens/login-screen'

function App() {
    const [isActive, setIsActive] = useState(false)
    useEffect(() => {
        isActiveSession().then((res) => {
            setIsActive(res)
        })
    }, [])

    return (
        <div className="flex flex-col w-full h-full items-center">
            {isActive ? <HomeScreen /> : <LoginScreen />}
        </div>
    )
}

export default App
