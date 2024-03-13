// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  secToIdle: 6000,
  secToCloseIdle: 15,
  apiHost: 'http://localhost',
  apiPort: 3000,
  apiPath: 'api/v1',
  apiKey: 'ced63a03-82c1-4f43-923e-51274ca1d009',
  httpTimeoutMs: 5000,
  apiHostSupport: 'http://localhost',
  apiPortSupport: 8000,
  apiPathSupport: 'api/cuestions',
  mqtt: {
    host: 'racom-iot.com',
    protocol: 'ws',
    port: 8083,
    path: '/mqtt'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
