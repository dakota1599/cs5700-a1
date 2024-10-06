import { useState } from 'react'
import { SignInDTO, SignUpDTO } from '../types'
import { Http } from '../http/http'
import { saveSession } from '../http/session'
import { SignIn, SignUp } from '../components/sign'
import { ResetPassword } from '../components/reset-password'

/**
 * @returns ReactNode
 * Login screen component
 */
export const LoginScreen = () => {
    const [selection, setSelection] = useState(0)
    const onSignIn = async (info: SignInDTO) => {
        const response = await Http.login(info)

        if (response.status == 200) {
            saveSession((await response.json()).token)
            location.reload()
            return
        }

        alert((await response.json()).message)
    }
    const onSignUp = async (info: SignUpDTO) => {
        const response = await Http.register(info)

        if (response.status == 201) {
            setSelection(0)
        }

        alert((await response.json()).message)
    }

    const getSelection = () => {
        switch (selection) {
            case 0:
                return (
                    <SignIn
                        toggleNewUser={(val) => setSelection(val)}
                        onEnter={(e) => onSignIn(e as SignInDTO)}
                    />
                )
            case 1:
                return (
                    <SignUp
                        toggleNewUser={(val) => setSelection(val)}
                        onEnter={(e) => onSignUp(e as SignUpDTO)}
                    />
                )
            case 2:
                return (
                    <ResetPassword toggleNewUser={(val) => setSelection(val)} />
                )
            default:
                return (
                    <SignIn
                        toggleNewUser={(val) => setSelection(val)}
                        onEnter={(e) => onSignIn(e as SignInDTO)}
                    />
                )
        }
    }

    return (
        <div className="w-1/2 h-full flex flex-col justify-center">
            {getSelection()}
        </div>
    )
}
