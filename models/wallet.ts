import { CryptoIcon } from "./crypto-icon";

export class Wallet {
  readonly icon: CryptoIcon;
  readonly percentage?: number;

  constructor(
    readonly id: number,
    readonly name: string,
    readonly currency: string,
    readonly address: string,
    readonly balance: number,
    readonly fetchedDate: number,
    readonly connectedToId?: number
  ) {
    this.icon = new CryptoIcon(name);
  }

  clone(): Wallet {
    return new Wallet(
      this.id,
      this.name,
      this.currency,
      this.address,
      this.balance,
      this.fetchedDate,
      this.connectedToId
    );
  }
}
