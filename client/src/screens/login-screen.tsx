import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { SignInDTO, SignUpDTO } from '../types'
import { parseErrors } from '../functions'
import { Http } from '../http/http'
import { saveSession } from '../http/session'

/**
 * @returns ReactNode
 * Login screen component
 */
export const LoginScreen = () => {
    const [isNew, setIsNew] = useState(false)
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
            setIsNew(false)
        }

        alert((await response.json()).message)
    }
    return (
        <div className="w-1/2 h-full flex flex-col justify-center">
            {isNew ? (
                <SignUp
                    toggleNewUser={() => setIsNew(false)}
                    onEnter={(e) => onSignUp(e as SignUpDTO)}
                />
            ) : (
                <SignIn
                    toggleNewUser={() => setIsNew(true)}
                    onEnter={(e) => onSignIn(e as SignInDTO)}
                />
            )}
        </div>
    )
}

/**
 * The props used for both the Sign In and the Sign Up components.
 */
type SignProp = {
    toggleNewUser: () => void
    onEnter: (info: SignInDTO | SignUpDTO) => void
}

/**
 * @returns ReactNode
 * Sign in component
 */
const SignIn = ({ toggleNewUser, onEnter }: SignProp) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<SignInDTO>({
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const onSubmit = (info: SignInDTO) => {
        onEnter(info)
    }

    return (
        <>
            <h2 className="w-full text-center">Log in</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full p-2 flex flex-col gap-4 border-cyan-900 border-4 rounded-md"
            >
                <input
                    className="text-box"
                    type="text"
                    placeholder="Username"
                    {...register('username', {
                        required: true,
                        minLength: 3,
                    })}
                />
                <input
                    className="text-box"
                    type="password"
                    placeholder="Password"
                    {...register('password', {
                        required: true,
                        pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/,
                    })}
                />
                <button type="submit" className="btn w-full">
                    Enter
                </button>
            </form>
            <div className="flex flex-row justify-between">
                <a className="link text-left">Forgot Password?</a>-
                <a className="link text-right" onClick={toggleNewUser}>
                    New User?
                </a>
            </div>

            <div className="whitespace-pre text-red-800 text-left text-wrap">
                {parseErrors(errors)}
            </div>
        </>
    )
}

/**
 * @returns ReactNode
 * Sign up component
 */
const SignUp = ({ toggleNewUser, onEnter }: SignProp) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<SignUpDTO>({
        defaultValues: {
            name: '',
            password: '',
            password2: '',
            username: '',
            securityQuestion: '',
            securityAnswer: '',
        },
    })
    const onSubmit = (info: SignUpDTO) => {
        if (info.password != info.password2)
            return alert('Passwords do not match.')
        onEnter(info)
    }
    return (
        <>
            <h2 className="w-full text-center">Sign Up</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full p-2 flex flex-col gap-4 border-cyan-900 border-4 rounded-md"
            >
                <input
                    className="text-box"
                    type="text"
                    placeholder="Name"
                    {...register('name', {
                        required: true,
                        minLength: 2,
                    })}
                />
                <input
                    className="text-box"
                    type="text"
                    placeholder="Username"
                    {...register('username', {
                        required: true,
                        minLength: 3,
                    })}
                />
                <input
                    className="text-box"
                    type="password"
                    placeholder="Password"
                    {...register('password', {
                        required: true,
                        pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/,
                    })}
                />
                <input
                    className="text-box"
                    type="password"
                    placeholder="Confirm Password"
                    {...register('password2', {
                        required: true,
                        pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/,
                    })}
                />
                <hr className="w-1/2 border-t-cyan-900 self-center" />
                <input
                    className="text-box"
                    type="text"
                    placeholder="Security Question"
                    {...register('securityQuestion', {
                        required: true,
                        minLength: 5,
                    })}
                />
                <input
                    className="text-box"
                    type="text"
                    placeholder="Security Answer"
                    {...register('securityAnswer', {
                        required: true,
                        minLength: 3,
                    })}
                />
                <button type="submit" className="btn w-full">
                    Enter
                </button>
            </form>
            <a className="link text-center" onClick={toggleNewUser}>
                Already a User?
            </a>
            <div className="whitespace-pre text-left text-red-800">
                {parseErrors(errors)}
            </div>
        </>
    )
}
