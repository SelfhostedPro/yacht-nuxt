import { H3Error } from 'h3'

const YachtError = (error: unknown) => {
    if (error instanceof H3Error) {
        YachtLog(error.data, error)
    } else {
        throw error
    }
}

export default YachtError