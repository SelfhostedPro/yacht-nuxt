import { simpleGit, type SimpleGitProgressEvent } from 'simple-git'
import { ensureDir, mkdirp, pathExists, createFile } from 'fs-extra'
import { join, dirname } from 'path'
import { spawn } from 'node:child_process'
import { sseHooks } from '#core/server/utils/sse'

const dataDir = useRuntimeConfig().yacht.configOptions.dataPath

export const newFolder = async (path: string, name: string) => {
    const folder = join(path, name)
    await ensureDir(folder)
    return `${folder} created.`
}

export const newFile = async (path: string, name: string) => {
    const file = join(path, name)
    await ensureDir(join(file, '..'))
    await createFile(file)
    return `${file} created.`
}
export const cloneGitRepo = async (path: string, url: string) => {
    console.log('cloning git repo: ', path, url)
    // Add trailing slash if it doesn't exist
    if (!path.endsWith('/')) path = path + '/'

    sseHooks.callHook("sse:progress", {
        id: url,
        title: `Cloning ${url} to ${path}`
    })

    const progress = ({ method, stage, progress, processed, total }: SimpleGitProgressEvent) => {
        sseHooks.callHook("sse:progress", {
            id: url,
            item: {
                id: url,
                status: stage,
                current: processed,
                total: total
            }
        })
        console.log(`git.${method} ${stage} stage ${progress}% complete`);
    }

    // Get folder paths
    const projectFolder = join(dataDir, path)
    const parentFolder = join(projectFolder, '../')

    console.log(projectFolder)

    // Create parent folder if it doesn't exist
    if (!await pathExists(parentFolder)) {
        await mkdirp(parentFolder)
    }

    // Clone repo to the project folder
    const git = simpleGit(projectFolder, { progress })
    const result = await git.clone(url, {}, (err, data) => {
        if (err) throw err
        return data
    })
    return result
}

// export const getProjectFile = (path: string) => {

// }

export const projectAction = async (path: string, action: 'up' | 'down') => {
    console.log(join(dataDir, dirname(path)))
    const composeCommand: Promise<{ code?: number | null, error?: unknown }> = new Promise((res) => {
        const compose = spawn('docker', ['compose', action, '-d'], { cwd: join(dataDir, dirname(path)), env: process.env, shell: true })
        compose.stdout.on('data', (data) => {
            console.log('data', data.toString())
        })
        compose.stderr.on('data', (data) => {
            console.error('error', data.toString())
        })
        compose.on('close', (code) => {
            console.log(`exited with code: ${code}`)
            res({ code: code })
        })
        compose.on('error', (error) => {
            console.log('error', error)
            res({ error: error })
        })
    })
    return await composeCommand
}