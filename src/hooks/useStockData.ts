import { useState, useEffect } from 'react';
import { fetchStockQuote, fetchTimeSeriesDaily, fetchIntradayData, StockQuote, TimeSeriesData } from '../services/alphaVantageApi';

export const useStockData = (symbol: string, timeframe: string = '1D') => {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch quote data
        const quoteData = await fetchStockQuote(symbol);
        setQuote(quoteData);

        // Fetch time series based on timeframe
        let timeSeriesData: TimeSeriesData[] = [];
        
        if (timeframe === '1D') {
          timeSeriesData = await fetchIntradayData(symbol, '5min');
        } else {
          timeSeriesData = await fetchTimeSeriesDaily(symbol);
        }

        setTimeSeries(timeSeriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
        console.error('Stock data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeframe]);

  return { quote, timeSeries, loading, error };
};

export const useMultipleStocks = (symbols: string[]) => {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbols.length === 0) return;

    const fetchMultipleStocks = async () => {
      setLoading(true);
      setError(null);

      try {
        const stockPromises = symbols.map(symbol => fetchStockQuote(symbol));
        const results = await Promise.allSettled(stockPromises);
        
        const successfulResults = results
          .filter((result): result is PromiseFulfilledResult<StockQuote> => result.status === 'fulfilled')
          .map(result => result.value);

        setStocks(successfulResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchMultipleStocks();
  }, [symbols.join(',')]);

  return { stocks, loading, error };
};