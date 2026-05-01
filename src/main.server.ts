import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config.server'; 

export default function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(App, appConfig, context);
}