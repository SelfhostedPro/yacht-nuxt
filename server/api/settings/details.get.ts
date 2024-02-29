import { getUsers } from "~/server/services/auth/users/actions"


export default eventHandler(async (event) => {
    const existingUsers = (await getUsers()).length > 0
    const config = await useConfig()
    return {
        auth: config.auth,
        theme: config.theme,
        wizard: !existingUsers
    }
})