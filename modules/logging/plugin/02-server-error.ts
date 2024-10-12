
export default defineNitroPlugin((nitroApp) => {
    // nitroApp.hooks.hook('error', (error) => {
    //     Logger.error(error)
    // })
    // nitroApp.captureError = (error, context) => {
    //     Logger.error(error, 'nitro')
    // }
    Logger.info(`Error handler initialized`)
})
