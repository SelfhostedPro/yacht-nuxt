export default eventHandler(async (event) => {
    const { name, removeRemoteKey, removeLocalKey } = await readBody<{ name: string, removeRemoteKey: boolean, removeLocalKey: boolean }>(event)
    return removeServer(name, removeRemoteKey, removeLocalKey)
})
