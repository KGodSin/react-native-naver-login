import { NativeModules, Platform } from 'react-native';

const { IosNaverLogin, RNNaverLogin } = NativeModules; // 여기 이름은 달라야 함.

// const getNaverProfile = {}

export interface ICallback<T> {
  (error: Error | undefined, result: T | undefined): void;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

export interface GetProfileResponse {
  resultcode: string;
  message: string;
  response: {
    id: string;
    profile_image: string | null;
    email: string;
    name: string;
    birthday: string | null;
  };
}

export interface ConfigParam {
    kConsumerKey: string;
    kConsumerSecret: string;
    kServiceAppName: string;

    /** Only for iOS */
    kServiceAppUrlScheme?: string;
}

const NaverLoginIos = {
  login(param: ConfigParam): Promise<TokenResponse> {
    return new Promise<TokenResponse>((resolve, reject) => {
      IosNaverLogin.login(param, (error: Error | undefined, result: TokenResponse | undefined) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  },
  logout(): void {
    IosNaverLogin.logout();
  },
};

const RNNaverLoginAndr = {
  login(param: ConfigParam): Promise<TokenResponse> {
    return new Promise<TokenResponse>((resolve, reject) => {
      RNNaverLogin.login(param, (error: Error | undefined, result: TokenResponse | undefined) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  },
  logout(): void {
    RNNaverLogin.logout();
  },
};

export const getProfile = (token: string): Promise<GetProfileResponse> => {
  return fetch('https://openapi.naver.com/v1/nid/me', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((err) => {
      console.log('getProfile err');
      console.log(err);
    });
};

export const NaverLogin =
  Platform.OS === 'ios' ? NaverLoginIos : RNNaverLoginAndr;
