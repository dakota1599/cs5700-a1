import { useForm } from 'react-hook-form'
import { SignInDTO, SignUpDTO, SignProp } from '../types'
import { parseErrors } from '../functions'

/**
 * @returns ReactNode
 * Sign in component
 */
export const SignIn = ({ toggleNewUser, onEnter }: SignProp) => {
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
                <a className="link text-left" onClick={() => toggleNewUser(2)}>
                    Forgot Password?
                </a>
                -
                <a className="link text-right" onClick={() => toggleNewUser(1)}>
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
export const SignUp = ({ toggleNewUser, onEnter }: SignProp) => {
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
                        minLength: 15,
                    })}
                />
                <button type="submit" className="btn w-full">
                    Enter
                </button>
            </form>
            <a className="link text-center" onClick={() => toggleNewUser(0)}>
                Already a User?
            </a>
            <div className="whitespace-pre text-left text-red-800">
                {parseErrors(errors)}
            </div>
        </>
    )
}
