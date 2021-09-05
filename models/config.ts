interface ICrypto {
  name: string;
  short: string;
}

interface ICryptoUrls {
  [key: string]: string;
}

export interface IConfig {
  supported: ICrypto[];
  urls: ICryptoUrls[];
}
