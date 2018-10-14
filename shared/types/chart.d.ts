declare type ChartType = "histominute" | "histohour" | "histoday";

declare interface ChartParams {
  symbol: string;
  chartType: ChartType;
  limit?: number;
}

declare interface DataPoint {
  time: number;
  close: number;
  high: number;
  low: number;
  open: number;
  volumefrom: number;
  volumeto: number;
  symbol: string;
}

declare type ChartResult = DataPoint[];
