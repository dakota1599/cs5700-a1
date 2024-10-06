import { useEffect, useState } from 'react'
import { Section } from './section'
import { Http } from '../http/http'

/**
 * @returns ReactNode
 * Manages the user's security question
 */
export const ManageSecurity = () => {
    const [question, setQuestion] = useState<string>()
    const [answer, setAnswer] = useState('')
    useEffect(() => {
        Http.getSecurityQuestionFromToken().then((result) => {
            if (result.status == 200) {
                result.json().then((data) => setQuestion(data.question))
                return
            }

            result.json().then((data) => alert(data.message))
        })
    }, [])

    const onSubmit = () => {
        let errors = ''
        if (question == void 0 || question.length < 5)
            errors += 'Secuirty Question must be at least 5 characters long.\n'
        if (answer.length < 3)
            errors += 'Security Answer must be at least 3 characters long.\n'

        if (errors.length > 0) return alert(errors)

        Http.setSecurityQuestion(question!, answer).then((result) => {
            if (result.status == 200) {
                result.json().then((data) => {
                    setQuestion(data.question)
                    alert('Successfully created new security question.')
                })
                return
            }

            result.json().then((data) => alert(data.message))
        })
    }

    return (
        <Section title="Manage Secuirty Question">
            <input
                type="text"
                placeholder="Security Question"
                defaultValue={question}
                className="text-box w-full"
                onChange={(e) => setQuestion(e.target.value)}
            />
            <input
                type="text"
                placeholder="Security Answer"
                className="text-box w-full"
                onChange={(e) => setAnswer(e.target.value)}
            />
            <button className="btn w-full" onClick={onSubmit}>
                Save
            </button>
        </Section>
    )
}
