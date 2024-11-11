import { getUsers } from "../../utils/users"
export default eventHandler(async (event) => {
    const testusers = await getUsers()
    const existingUsers = (await getUsers()).length > 0
    console.log('existingUsers', existingUsers)
    console.log(testusers)
    return {
        auth: event.context.details.auth,
        theme: event.context.details.theme,
        name: event.context.details.name,
        wizard: !existingUsers
    }
})