import { injectable } from 'inversify';
import { ok, Result } from 'neverthrow';
import { scriptLogger } from '../logger';

@injectable()
export class SampleService {
  public async exampleFunction(): Promise<Result<undefined, string>> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    scriptLogger.info('Example log from SampleService');
    return ok(undefined);
  }
}
