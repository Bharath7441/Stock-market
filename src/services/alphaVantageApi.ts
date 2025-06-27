const API_KEY = 'HMIPY6KW3AI7QU36';
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
}

export interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockData {
  quote: StockQuote;
  timeSeries: TimeSeriesData[];
  name: string;
}

// Fetch real-time stock quote
export const fetchStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || 'API limit reached');
    }

    const quote = data['Global Quote'];
    if (!quote) {
      throw new Error('Invalid symbol or no data available');
    }

    const price = parseFloat(quote['05. price']);
    const change = parseFloat(quote['09. change']);
    const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));

    return {
      symbol: quote['01. symbol'],
      price,
      change,
      changePercent,
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close']),
      volume: parseInt(quote['06. volume']),
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
};

// Fetch historical data (daily time series)
export const fetchTimeSeriesDaily = async (symbol: string): Promise<TimeSeriesData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || 'API limit reached');
    }

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('No time series data available');
    }

    return Object.entries(timeSeries)
      .slice(0, 30) // Get last 30 days
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }))
      .reverse(); // Reverse to get chronological order
  } catch (error) {
    console.error('Error fetching time series:', error);
    throw error;
  }
};

// Fetch intraday data for real-time charts
export const fetchIntradayData = async (symbol: string, interval: string = '5min'): Promise<TimeSeriesData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || 'API limit reached');
    }

    const timeSeries = data[`Time Series (${interval})`];
    if (!timeSeries) {
      throw new Error('No intraday data available');
    }

    return Object.entries(timeSeries)
      .slice(0, 50) // Get last 50 data points
      .map(([datetime, values]: [string, any]) => ({
        date: datetime,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }))
      .reverse();
  } catch (error) {
    console.error('Error fetching intraday data:', error);
    throw error;
  }
};

// Search for stocks
export const searchStocks = async (keywords: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || 'API limit reached');
    }

    return data['bestMatches']?.slice(0, 10) || [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

// Get company overview
export const fetchCompanyOverview = async (symbol: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || 'API limit reached');
    }

    return data;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    throw error;
  }
};

// Fetch multiple stock quotes efficiently
export const fetchMultipleQuotes = async (symbols: string[]): Promise<StockQuote[]> => {
  const quotes = await Promise.allSettled(
    symbols.map(symbol => fetchStockQuote(symbol))
  );
  
  return quotes
    .filter((result): result is PromiseFulfilledResult<StockQuote> => result.status === 'fulfilled')
    .map(result => result.value);
};