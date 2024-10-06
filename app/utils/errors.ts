import { FetchError } from 'ofetch'
import type { CreateContainerForm } from '~/types/containers/create'
import type { Container } from '~/types/containers/yachtContainers'
import type { Notification } from '#imports'
interface ErrorContext {
    container?: Container,
    form?: CreateContainerForm,
    rest?: any
}

/** Standard format for generating error messages from strings. 
 * Docker doesn't provide a decent way of formatting errors so we get to have fun here.
 * 
 * Create a dictionary of status codes, 
 * if we have a match, loop through the patterns to see the first one with a match.
 * Specify the key of the data match we want to use (not required if message doesn't need to be dynamic)
 * Then, pass that match (insert) into the message callback function to get the string we want to return to the user.
 * Please someone put me out of my misery or tell me a better way to do this :'(
 */
interface Pattern {
    pattern: RegExp, title: string, key: number, message: ((insert: string) => string)
}

const errorPatterns: { [key: number]: { patterns: Pattern[] } } = {
    409: {
        patterns: [{ pattern: /(.*?)name "\/(.*?)" is already in use by container/, title: 'Name Conflict', key: 2, message: (insert) => `The container name '${insert}' is already in use by another container. Please remove or rename the existing container to reuse the name.` }]
    },
    500: {
        patterns: [{ pattern: /(.*?)'(.*?)'(.*?)/, title: 'Invalid Volume', key: 2, message: (insert) => `invalid mount path: ${insert}` }]
    }
}

export const handleDockerErrors = (e: FetchError, context?: ErrorContext): Notification => {
    if (e.statusCode && errorPatterns.hasOwnProperty(e.statusCode)) {
        for (const _pattern of errorPatterns[e.statusCode].patterns) {
            if (!e.message.match(_pattern.pattern)) continue
            else {
                const { pattern, key, message, title, } = _pattern
                const insert = e.message.match(pattern)
                console.log('matches', insert)
                if (insert !== null) {
                    const returnMessage = message(insert[key])
                    return { title, message: returnMessage, level: 'error' }
                } else return { title, message: e.message, level: 'error' }
            }
        }
        return { title: 'Unknown Error', message: e.message, level: 'error' }
    } else return {
        title: 'Unknown Error', message: e.message, level: 'error'
    }
}