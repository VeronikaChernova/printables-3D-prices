import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideStore} from '@ngxs/store';
import {NgxsStoragePluginModule, StorageOption, withNgxsStoragePlugin} from '@ngxs/storage-plugin';
import {CoreState} from './core/ngrx-store/core/core.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(
      [CoreState],
      withNgxsStoragePlugin({
        keys: ['core'],
        storage: StorageOption.LocalStorage,
      })
    )
  ]
};
