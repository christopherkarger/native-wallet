import { ITransactions } from "~/db";
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
    readonly lastFetched: number,
    readonly transactions: ITransactions[],
    readonly connectedToId?: number,
    readonly demoAddress?: boolean
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
      this.lastFetched,
      this.transactions.map((t) => ({
        balance_change: t.balance_change,
        hash: t.hash,
        time: t.time,
      })),
      this.connectedToId,
      this.demoAddress
    );
  }
}
