export interface IMarketDataItem {
  name: string;
  data: IMarketDataItemData;
}

interface IHistoryItem {
  date: number;
  price: number;
}

export interface IMarketDataItemData {
  history: IHistoryItem[];
  price: number;
  currency: string;
  rank: number;
}

export class MarketData {
  constructor(readonly items: IMarketDataItem[]) {}

  /**
   * Finds item by name
   */
  findItemByName(name: string): IMarketDataItem | undefined {
    return this.items.find((x) => x.name === name);
  }

  /**
   * return items by market cap
   */
  get itemsByMarketCap(): IMarketDataItem[] {
    return this.items.sort((a, b) => {
      return a.data.rank - b.data.rank;
    });
  }
}
