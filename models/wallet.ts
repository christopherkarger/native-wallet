import { ITransactions } from "~/db";
import { CryptoIcon } from "./crypto-icon";

export interface IWalletInput {
  readonly id: number;
  readonly name: string;
  readonly currency: string;
  readonly balance: number;
  readonly isCoinWallet: boolean;
  readonly isDemoAddress: boolean;
  readonly addedAt?: number;
  readonly coinPrice?: number;
  readonly address?: string;
  readonly lastFetched?: number;
  readonly transactions?: ITransactions[];
  readonly connectedToId?: number;
}

export class Wallet {
  readonly id: number;
  readonly name: string;
  readonly currency: string;
  readonly balance: number;
  readonly isCoinWallet: boolean;
  readonly isDemoAddress: boolean;
  readonly icon: CryptoIcon;
  readonly addedAt?: number;
  readonly coinPrice?: number;
  readonly address?: string;
  readonly lastFetched?: number;
  readonly transactions?: ITransactions[];
  readonly connectedToId?: number;

  constructor(x: IWalletInput) {
    this.id = x.id;
    this.name = x.name;
    this.currency = x.currency;
    this.balance = x.balance;
    this.lastFetched = x.lastFetched;
    this.isCoinWallet = x.isCoinWallet;
    this.addedAt = x.addedAt;
    this.coinPrice = x.coinPrice;
    this.address = x.address;
    this.transactions = x.transactions;
    this.isDemoAddress = x.isDemoAddress;
    this.connectedToId = x.connectedToId;
    this.icon = new CryptoIcon(this.name);
  }

  clone(): Wallet {
    return new Wallet({
      id: this.id,
      name: this.name,
      currency: this.currency,
      balance: this.balance,
      isCoinWallet: this.isCoinWallet,
      isDemoAddress: this.isDemoAddress,
      addedAt: this.addedAt,
      coinPrice: this.coinPrice,
      address: this.address,
      lastFetched: this.lastFetched,
      transactions: this.transactions?.map((t) => ({
        balance_change: t.balance_change,
        hash: t.hash,
        time: t.time,
      })),
      connectedToId: this.connectedToId,
    });
  }
}
