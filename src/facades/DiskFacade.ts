import * as fs from 'fs/promises';
import { err, ok, Result } from 'neverthrow';
import { scriptLogger } from '../logger';

export class DiskFacade {
  public async loadFromDisk(filePath: string): Promise<Result<string, undefined>> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return ok(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      scriptLogger.error(`Failed to read file`, { errorMessage, filePath });
      return err(undefined);
    }
  }

  public async saveToDisk(filePath: string, data: string): Promise<Result<void, undefined>> {
    try {
      await fs.writeFile(filePath, data, 'utf-8');
      return ok(undefined);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      scriptLogger.error(`Failed to save file`, { errorMessage, filePath });
      return err(undefined);
    }
  }
}
