import { useEffect, useState } from 'react'
import { BasicUserInfo } from '../types'
import { Http } from '../http/http'

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
        <div className="w-full">
            <h3 className="text-center">View Users</h3>
            <div className="flex flex-col w-full border-cyan-800 rounded-lg border-2 p-3 gap-4">
                {users.map((u, i) => (
                    <>
                        <div
                            key={i}
                            className="flex flex-row w-full justify-around"
                        >
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
                    </>
                ))}
            </div>
        </div>
    )
}
