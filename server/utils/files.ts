import { join, extname, basename } from 'node:path'
import { mkdirp, pathExists, outputFile } from 'fs-extra/esm'
import { readFile } from 'fs/promises'
import dree from 'dree';
import type { CallbackAsync, Dree, ScanOptions, } from 'dree';
import { useRuntimeConfig } from '#imports';

export const dataDir = useRuntimeConfig().yacht.configOptions.dataPath

export const initData = async () => {
    const dataExists = await pathExists(dataDir)
    if (!dataExists) {
        mkdirp(dataDir)
        console.log('creating data dir')
    }
}
interface GetTreeRootProps {
    options?: ScanOptions,
    path?: string,
    relative?: boolean,
    onFile?: CallbackAsync<Dree>,
    onDir?: CallbackAsync<Dree>
}

export const getTreeRoot = async ({ path, options, onFile, onDir, relative }: GetTreeRootProps) => {
    await initData()
    let rootPath = relative ? join(dataDir, path || '') : path
    if (rootPath && !rootPath.startsWith(dataDir)) {
        throw createError({
            statusCode: 403,
            message: `Access denied: ${path} is outside of the data directory`
        })
    }
    return await dree.scanAsync(rootPath || dataDir, options, onFile, onDir)
}

export const getFile = async (path: string) => {
    await initData()
    if (!path.startsWith(dataDir)) {
        throw createError({
            statusCode: 403,
            message: `Access denied: ${path} is outside of the data directory`
        })
    }
    const content = await readFile(path, { encoding: 'utf-8' })
    return {
        name: basename(path),
        extension: extname(path),
        path,
        content: content.toString()
    }
}

export const saveFile = async (path: string, content: string) => {
    await initData()
    const filePath = join(dataDir, path)
    if (!filePath.startsWith(dataDir)) {
        throw createError({
            statusCode: 403,
            message: `Access denied: ${filePath} is outside of the data directory`
        })
    }
    await outputFile(filePath, content)
    Logger.success(`File ${path} saved!`, 'lvfiles - saveFile', {
        message: `File ${path} saved!`,
        level: 'success',
        timeout: 3000,
        title: 'Saved!'
    })
    return getFile(filePath)
}
