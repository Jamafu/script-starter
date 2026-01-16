import { Application } from './Application';

import { container } from './inversify.config';
import { scriptLogger } from './logger';

Application.startup(container)
  .then(() => {
    scriptLogger.info('Application started');
  })
  .catch(error => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    scriptLogger.error('Error while starting application. Application will terminate: ', {
      errorMessage,
      error,
    });
  });
