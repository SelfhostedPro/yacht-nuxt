// Import required modules
import fs from 'fs-extra';
import path from 'path';

// Class for handling file operations
export class FileOperations {
  // Read the contents of a file
  static async readFile(filePath: string): Promise<string | null> {
    try {
      return await fs.readFile(filePath, { encoding: 'utf8' });
    } catch (error) {
      // Return null if there's an error (e.g., file not found)
      return null;
    }
  }

  // Write content to a file, creating directories if they don't exist
  static async writeFile(filePath: string, content: string): Promise<void> {
    // Ensure the directory exists
    await fs.ensureDir(path.dirname(filePath));
    // Write the content to the file
    await fs.writeFile(filePath, content);
  }

  // Remove a file or directory
  static async removeFile(filePath: string): Promise<void> {
    await fs.remove(filePath);
  }

  // Read and parse a JSON file
  static async readJSON<T>(filePath: string): Promise<T | null> {
    try {
      return await fs.readJSON(filePath);
    } catch (error) {
      // Return null if there's an error (e.g., file not found or invalid JSON)
      return null;
    }
  }

  // Write data to a JSON file, creating directories if they don't exist
  static async writeJSON(filePath: string, data: any): Promise<void> {
    await fs.outputJSON(filePath, data);
  }
}