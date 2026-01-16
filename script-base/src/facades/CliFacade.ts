import { ChildProcess, spawn } from 'node:child_process';
import { injectable } from 'inversify';
import { err, ok, Result } from 'neverthrow';

@injectable()
export class CliFacade {
  public async execute(
    command: string,
    args: string[],
    options?: { env?: Record<string, string> },
  ): Promise<Result<string, string>> {
    return new Promise(resolve => {
      const spawnOptions = options?.env ? { env: { ...process.env, ...options.env } } : {};

      const childProcess = spawn(command, args, spawnOptions);
      let stdout: string = '';
      let stderr: string = '';

      childProcess.stdout.on('data', data => {
        stdout += data.toString();
      });

      childProcess.stderr.on('data', data => {
        stderr += data.toString();
      });

      childProcess.on('error', error => {
        resolve(err(`Failed to execute command: ${error.message}`));
      });

      childProcess.on('close', code => {
        if (code !== 0) {
          resolve(err(stderr || `Command exited with code ${code}`));
        } else {
          resolve(ok(stdout));
        }
      });
    });
  }

  public executeAndForwardLogsDetached(command: string, args: string[]): ChildProcess {
    this.validateAwsCommandArgs(command, args);
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], detached: true });

    child.stdout.on('data', data => {
      process.stdout.write(data);
    });

    child.stderr.on('data', data => {
      process.stderr.write(data);
    });

    child.unref(); // Allow the parent to exit independently

    return child;
  }

  public async execPromise(command: string): Promise<{ stdout: string; stderr: string }> {
    this.validateAwsCommandArgs(command, []);
    const { exec } = require('child_process');
    const { promisify } = require('util');

    const execAsync = promisify(exec);
    return execAsync(command);
  }

  // better safe than sorry lol
  private validateAwsCommandArgs(command: string, args: string[]): void {
    const commandString = [command, ...args].join(' ');
    const isAwsCommand = commandString.startsWith('aws');
    if (!isAwsCommand) {
      return;
    }

    const endpointUrlRegex = /--endpoint-url=http:\/\/localhost:\d+/;
    const endpointPointsToLocalhost = endpointUrlRegex.test(commandString);
    if (!endpointPointsToLocalhost) {
      throw new Error('AWS CLI commands must point to LocalStack using --endpoint-url=http://localhost:<port>');
    }
  }
}
