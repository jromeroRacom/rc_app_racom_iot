export const environment = {
  production: true,
  secToIdle: 900,
  secToCloseIdle: 15,
  apiHost: 'https://api.racom-iot.com',
  apiPort: 443,
  apiPath: 'api/v1',
  apiKey: 'ced63a03-82c1-4f43-923e-51274ca1d009',
  httpTimeoutMs: 10000,
  apiHostSupport: 'https://apisupport.racom-iot.com',
  apiPortSupport: 443,
  apiPathSupport: 'api/cuestions',
  mqtt: {
    host: 'racom-iot.com',
    protocol: 'wss',
    port: 8084,
    path: '/mqtt'
  }
};
