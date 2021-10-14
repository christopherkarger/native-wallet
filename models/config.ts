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

export enum SupportedCryptos {
  Bitcoin = "Bitcoin",
  Ethereum = "Ethereum",
  Cardano = "Cardano",
  Dogecoin = "Dogecoin",
  Litecoin = "Litecoin",
  Dash = "Dash",
}
