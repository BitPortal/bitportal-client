import { createSelector } from "reselect";

const dataSourceSelector = (state: RootState) => state.ticker.get("dataSource");
const exchangeFilterSelector = (state: RootState) => state.ticker.get("exchangeFilter");
const currencyFilterSelector = (state: RootState) => state.ticker.get("currencyFilter");
const quoteAssetFilterSelector = (state: RootState) => state.ticker.get("quoteAssetFilter");
const sortFilterListSelector = (state: RootState) => state.ticker.get("sortFilter");
const baseAssetSelector = (state: RootState) => state.ticker.get("baseAsset");
const searchTermSelector = (state: RootState) => state.ticker.get("searchTerm");

export const eosPriceSelector = (state: RootState) =>
  state.ticker.get("dataSource").get("OKEX_SPOT_EOS_USDT")
    ? state.ticker
        .get("dataSource")
        .get("OKEX_SPOT_EOS_USDT")
        .get("price_last")
    : 0;

export const sortFilterSelector = createSelector(
  sortFilterListSelector,
  exchangeFilterSelector,
  (sort: any, exchange: any) => sort.get(exchange)
);

export const tickerSelector = createSelector(
  dataSourceSelector,
  sortFilterSelector,
  searchTermSelector,

  (ticker: any, sortFilter: any, searchTerm: any) =>
    ticker
      .valueSeq()
      .filter(
        (item: any) =>
          searchTerm.trim() === ""
            ? item
            : item.get("symbol").includes(searchTerm.toUpperCase()) ||
              item
                .get("name")
                .toUpperCase()
                .includes(searchTerm.toUpperCase()) ||
              item
                .get("name")
                .toUpperCase()
                .replace(/ +/g, "")
                .includes(searchTerm.toUpperCase())
      )
      .sortBy((item: any) => {
        const result = exchangeTickerSortByHelper(sortFilter);
        return sortFilter.includes("low") ? +item.get(result) : -+item.get(result);
      })
);

export const exchangeTickerSelector = createSelector(
  dataSourceSelector,
  exchangeFilterSelector,
  quoteAssetFilterSelector,
  sortFilterSelector,
  searchTermSelector,
  (ticker: any, exchange: any, quote_asset: any, sortfilter: any, searchTerm: any) =>
    ticker
      .valueSeq()
      .filter((item: any) => item.get("exchange") === exchange)
      .filter((item: any) => item.get("quote_asset") === quote_asset)
      .filter(
        (item: any) =>
          searchTerm.trim() === ""
            ? item
            : item.get("base_asset").includes(searchTerm.toUpperCase())
      )
      .sortBy((item: any) => {
        const result = exchangeTickerSortByHelper(sortfilter);
        return sortfilter.includes("low") ? +item.get(result) : -+item.get(result);
      })
);

const exchangeTickerSortByHelper = (filter: any) => {
  const filters = {
    market_cap_usd: "market_cap_usd",
    price_change_percent_low: "percent_change_24h",
    price_change_percent_high: "percent_change_24h",
    current_price_low: "price_usd",
    current_price_high: "price_usd"
  };
  return filters[filter];
};

export const currencyTickerSelector = createSelector(
  dataSourceSelector,
  currencyFilterSelector,
  (ticker: any, currency: any) =>
    ticker.valueSeq().filter((item: any) => item.get("base_asset") === currency)
);

export const tokenTickerSelector = createSelector(
  dataSourceSelector,
  baseAssetSelector,
  (ticker: any, base_asset: any) =>
    ticker.valueSeq().filter((item: any) => item.get("base_asset") === base_asset)
);
