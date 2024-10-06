import { useEffect, useState } from 'react'
import { BasicUserInfo } from '../types'
import { Http } from '../http/http'
import { Section } from './section'
import React from 'react'

/**
 * @returns ReactNode
 * The component for managing users.  Though it is read only and exists to mimic that funcitonality.
 */
export const ManageUsers = () => {
    const [users, setUsers] = useState<BasicUserInfo[]>([])

    useEffect(() => {
        Http.getAllUsers().then(async (res) => {
            if (res.status == 200) {
                setUsers((await res.json()) as BasicUserInfo[])
                return
            }

            alert(res.statusText)
        })
    }, [])

    return (
        <Section title="View Users">
            {users.map((u, i) => (
                <React.Fragment key={i}>
                    <div className="flex flex-row w-full justify-around">
                        <input
                            type="text"
                            className="text-box w-[40%]"
                            disabled
                            value={u.username}
                        />
                        <input
                            type="text"
                            className="text-box w-[40%]"
                            disabled
                            value={u.name}
                        />
                    </div>
                    {i != users.length - 1 ? (
                        <hr className="w-1/2 border-t-cyan-900 self-center" />
                    ) : (
                        <></>
                    )}
                </React.Fragment>
            ))}
        </Section>
    )
}
