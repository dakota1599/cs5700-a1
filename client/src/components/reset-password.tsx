import { useState } from 'react'
import { ResetPasswordDTO, SignProp } from '../types'
import { useForm } from 'react-hook-form'
import { parseErrors } from '../functions'
import { Http } from '../http/http'

export const ResetPassword = ({ toggleNewUser }: Omit<SignProp, 'onEnter'>) => {
    const [username, setUsername] = useState('')
    const [secQ, setSecQ] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordDTO>({
        defaultValues: {
            answer: '',
            password: '',
            password2: '',
        },
    })

    const onEnter = async () => {
        if (username.length < 3)
            return alert('Username must be at least 3 characters long.')

        const res = await Http.getSecurityQuestion(username)

        if (res.status == 200) {
            return setSecQ((await res.json()).question)
        }

        alert((await res.json()).message)
    }

    const onSubmit = async (info: ResetPasswordDTO) => {
        const res = await Http.resetPassword(
            username,
            info.answer,
            info.password
        )

        if (res.status == 200) {
            alert((await res.json()).message)
            toggleNewUser(0)
            return
        }

        alert((await res.json()).message)
    }
    return (
        <>
            <h2 className="w-full text-center">Password Reset</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full p-2 flex flex-col gap-4 border-cyan-900 border-4 rounded-md"
            >
                {secQ == '' ? (
                    <>
                        <input
                            type="text"
                            placeholder="Username"
                            className="text-box"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn w-full"
                            onClick={onEnter}
                        >
                            Enter
                        </button>
                    </>
                ) : (
                    <>
                        <h4>{secQ}</h4>
                        <input
                            type="text"
                            placeholder="Answer"
                            className="text-box"
                            {...register('answer', {
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
                        <button type="submit" className="btn w-full">
                            Enter
                        </button>
                    </>
                )}
            </form>
            <a className="link text-left" onClick={() => toggleNewUser(0)}>
                Back to Login
            </a>
            <div className="whitespace-pre text-red-800 text-left text-wrap">
                {parseErrors(errors)}
            </div>
        </>
    )
}
