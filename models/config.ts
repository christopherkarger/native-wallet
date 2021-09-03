interface ICrypto {
  name: string;
  short: string;
}

export interface IConfig {
  supported: ICrypto[];
  urls: {
    ada: string;
    main: string;
  };
}
