interface ICrypto {
  name: string;
  currency: string;
}

interface ICryptoUrls {
  [key: string]: string;
}

export interface IConfig {
  supported: ICrypto[];
  urls: ICryptoUrls;
}
