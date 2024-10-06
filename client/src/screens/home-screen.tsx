import { ManageUsers } from '../components/manager-users'
import { clearSession } from '../http/session'

export const HomeScreen = () => {
    const logout = () => {
        clearSession()
        location.reload()
    }
    return (
        <div className="w-3/4 h-full flex flex-col justify-center">
            <h1 className="text-cyan-800 text-center">Congratulations!</h1>
            <h3 className="text-cyan-600 text-center">
                You have been successfully logged into{' '}
                <i>
                    <strong>The System</strong>
                </i>
                .
            </h3>

            <br />

            <h6>Here are your options:</h6>
            <div className="w-full border-2 border-cyan-700 rounded-lg p-4">
                <button onClick={logout} className="btn w-full">
                    Log Out
                </button>
            </div>

            <br />

            <ManageUsers />
        </div>
    )
}
