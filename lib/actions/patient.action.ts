"use client"

import { Query,ID } from "node-appwrite"
import { users } from "../appwrite.config"

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name)

        return newUser
    }catch(error: any) {
        if(error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal('email', [user.email])
            ])

            return existingUser?.users[0]
        }
        throw error;
    }
}