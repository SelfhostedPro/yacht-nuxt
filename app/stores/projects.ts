// Import necessary modules and types
import { defineStore } from 'pinia';
import type { Dree } from 'dree';
import type { FileInfo } from '~~/types/files';
import { join } from 'path';

// Define the store for managing projects
export const useProjectsStore = defineStore({
    id: 'projectsStore',
    state: () => ({
        // State properties
        currentPath: [] as string[], // Current directory path
        dir: {} as Dree, // Current directory information
        dirTree: [] as Dree[], // Directory tree
        activeFile: {} as FileInfo, // Active file information
        filter: undefined as string | undefined, // Filter for file listing
        showHidden: false as boolean, // Flag to show hidden files
        loading: [] as string[], // Loading states
    }),
    getters: {
        // Getter for the current path query
        pathquery: (state) => state.currentPath.join(""),
    },
    actions: {
        // Action to start loading a process
        async startLoading(name: string) { this.loading.push(name); },

        // Action to stop loading a process
        async stopLoading(name: string) { this.loading = this.loading.filter((item) => item !== name); },

        // Action to fetch the current directory
        async getFolder() {
            this.startLoading('tree');
            const data = await $fetch<Dree>(`/api/projects`, { query: { depth: 1, relative: true, path: this.pathquery, hidden: this.showHidden } });
            const { children, ...parent } = data;
            if (!data) throw createError('no data returned from api.');
            this.dir = parent;
            if (children && children.length > 0) {
                this.dirTree = children;
            } else {
                this.dirTree = [];
            }
            this.stopLoading('tree');
            return { data };
        },

        // Action to fetch children of a directory item
        async getChildren(item: Dree, path: string) {
            this.startLoading(item.name);
            const data = await $fetch<Dree>('/api/projects', {
                query: {
                    path: `${join(this.currentPath.join(""), path, item.relativePath)}`,
                    depth: 1,
                    relative: true,
                    hidden: this.showHidden
                }
            });
            // Recursive function to find the parent and update its children
            const findAndUpdateParent = (nodes: Dree[], itemName: string): boolean => {
                for (const node of nodes) {
                    if (node.name === itemName) {
                        // If the current node is the parent, update its children
                        if (data.children) {
                            node.children = [...(node.children || []), ...data.children];
                        }
                        return true; // Found and updated the parent
                    }
                    if (node.children) {
                        // If the current node has children, recursively search through them
                        if (findAndUpdateParent(node.children, itemName)) {
                            return true; // Found and updated the parent, stop searching
                        }
                    }
                }
                return false; // Parent not found in this branch
            };
            findAndUpdateParent(this.dirTree, item.name);
            this.stopLoading(item.name);
        },

        // Action to change the current directory
        async changeDirectory(path: string) {
            if (path === "..") this.currentPath.splice(this.currentPath.length - 1, 1);
            else {
                if (path.includes('/')) {
                    // Separate it out so when going to ".." it correctly removes just the current directory.
                    path.split('/').map((path) => {
                        // If there's an empty string (because of the initial '/') then don't push it.
                        if (path !== "") this.currentPath.push(`/${path}`);
                    });
                } else this.currentPath.push(`/${path}`);
            }
            return this.currentPath.join("");
        },

        // Action to set the active file
        async setActiveFile(path: string) {
            this.startLoading('file');
            const { data, error } = await $fetch<FileInfo>('/api/projects/file', { cache: 'no-cache', query: { path } })
                .then((file) => ({ data: file, error: undefined }))
                .catch((e) => ({ data: undefined, error: e }));

            if (data) {
                this.activeFile = data;
            } else {
                console.log(data);
            }

            if (error) console.error(error.statusMessage);
            this.stopLoading('file');
        }
    }
});