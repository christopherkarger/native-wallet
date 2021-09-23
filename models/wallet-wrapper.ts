import { Wallet } from "./wallet";

export class WalletWrapper {
  constructor(readonly wallets: Wallet[]) {}
}
