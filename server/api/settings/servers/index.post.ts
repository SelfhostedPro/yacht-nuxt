import { newServerSchema } from "~~/types/forms/server"

export default eventHandler(async (event) => {
    const { name, options, keyname, copyToServer } = await readValidatedBody(event, (data) => newServerSchema.parse(data))
    return addServerToConfig(name, options, keyname, copyToServer)
})
