import type { FileInfo } from "~/types/files";


export const useProjectsCWD = () => useState('projects-cwd', () =>
    ''
)

export const useOpenProjectsFile = () => useState<FileInfo | undefined>('projects-file', () => undefined)
export const openProjectsFile = async (path: string) => {
    const file = useOpenProjectsFile()
    file.value = await $fetch<FileInfo>(`/api/projects/file`, {
        query: {
            path: path,
        },
        cache: "no-cache",
        //   onRequest() {
        //     loading.value = true;
        //   },
        //   onRequestError() {
        //     loading.value = false;
        //   },
        //   onResponse() {
        //     loading.value = false;
        //   },
        //   onResponseError(e) {
        //     useNotificationsStore().pushToast({
        //       message: e.response._data.message || `Error fetching tree`,
        //     });
        //     console.log(e);
        //     loading.value = false;
        //   },
    });
    return file
}