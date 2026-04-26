import Reactotron from 'reactotron-react-native';
import {isAxiosError} from 'axios';

import {githubClient} from '@shared/api/client';

if (__DEV__) {
  Reactotron.configure({name: 'GitExplorer'})
    .useReactNative({networking: false})
    .connect();

  githubClient.interceptors.response.use(
    response => {
      Reactotron.display?.({
        name: 'GITHUB API',
        preview: `${response.config.method?.toUpperCase()} ${response.config.url} => ${response.status}`,
        value: {
          request: {
            url: response.config.url,
            method: response.config.method,
            params: response.config.params,
          },
          response: {
            status: response.status,
            data: response.data,
          },
        },
      });
      return response;
    },
    (error: unknown) => {
      if (isAxiosError(error)) {
        Reactotron.display?.({
          name: 'GITHUB API ERROR',
          preview: `${error.config?.method?.toUpperCase()} ${error.config?.url} => ${error.response?.status}`,
          important: true,
          value: {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
          },
        });
      }
      return Promise.reject(error);
    },
  );
}
