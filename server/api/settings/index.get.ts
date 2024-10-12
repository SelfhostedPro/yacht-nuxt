export default eventHandler(async (event) => {
    const config = await useConfig()
    return config
})