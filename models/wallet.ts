export class Wallet {
  constructor(
    readonly cryptoName: string,
    readonly shortName: string,
    readonly amount: string,
    readonly percentage: number
  ) {}
}
