import { Container, injectable } from 'inversify';
import { scriptLogger } from './logger';
import { SampleService } from './services/SampleService';

@injectable()
export class Application {
  constructor(private readonly sampleService: SampleService) {}

  // Don't move this method to index.ts, it will be executed whenever you import it.
  public static async startup(applicationContainer: Container): Promise<Application> {
    const application = applicationContainer.get<Application>(Application);
    try {
      await application.start();
      return application;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      scriptLogger.error('Application startup failed', { errorMessage });
      throw error;
    }
  }

  public async start(): Promise<void> {
    await this.sampleService.exampleFunction();
  }
}
