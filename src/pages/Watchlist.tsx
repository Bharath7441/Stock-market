import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Eye, Search, Star, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useMultipleStocks } from '../hooks/useStockData';
import { fetchTimeSeriesDaily, TimeSeriesData } from '../services/alphaVantageApi';

interface WatchlistStock {
  symbol: string;
  name: string;
  data?: Array<{ value: number }>;
}

export const Watchlist: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [watchlistSymbols, setWatchlistSymbols] = useState<WatchlistStock[]>([
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
  ]);
  
  const { stocks, loading, error } = useMultipleStocks(watchlistSymbols.map(w => w.symbol));
  const [chartData, setChartData] = useState<{ [key: string]: Array<{ value: number }> }>({});

  // Fetch chart data for each stock
  useEffect(() => {
    const fetchChartData = async () => {
      const chartPromises = watchlistSymbols.map(async (stock) => {
        try {
          const timeSeries = await fetchTimeSeriesDaily(stock.symbol);
          const chartPoints = timeSeries.slice(-7).map(item => ({ value: item.close }));
          return { symbol: stock.symbol, data: chartPoints };
        } catch (error) {
          console.error(`Error fetching chart data for ${stock.symbol}:`, error);
          return { symbol: stock.symbol, data: [] };
        }
      });

      const results = await Promise.all(chartPromises);
      const chartDataMap = results.reduce((acc, { symbol, data }) => {
        acc[symbol] = data;
        return acc;
      }, {} as { [key: string]: Array<{ value: number }> });

      setChartData(chartDataMap);
    };

    if (watchlistSymbols.length > 0) {
      fetchChartData();
    }
  }, [watchlistSymbols]);

  const removeStock = (symbol: string) => {
    setWatchlistSymbols(watchlistSymbols.filter(stock => stock.symbol !== symbol));
  };

  const addStock = () => {
    const symbol = prompt('Enter stock symbol:')?.toUpperCase();
    if (symbol && !watchlistSymbols.find(s => s.symbol === symbol)) {
      setWatchlistSymbols([...watchlistSymbols, { symbol, name: `${symbol} Corp.` }]);
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GlassCard className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Error Loading Watchlist</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">My Watchlist</h1>
            <p className="text-gray-600 dark:text-gray-300">Track your favorite stocks in real-time</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{stocks.length} stocks tracked</span>
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <GlassCard className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-blue-300/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 transition-all duration-300"
            />
          </div>
          <Button onClick={addStock}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </GlassCard>

      {/* Loading State */}
      {loading && (
        <GlassCard className="text-center py-12">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading watchlist data...</p>
        </GlassCard>
      )}

      {/* Watchlist Grid */}
      {!loading && filteredStocks.length === 0 ? (
        <GlassCard className="text-center py-12">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            {searchTerm ? 'No stocks found' : 'Your watchlist is empty'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Add some stocks to start tracking their performance'
            }
          </p>
          {!searchTerm && (
            <Button onClick={addStock}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Stock
            </Button>
          )}
        </GlassCard>
      ) : (
        !loading && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStocks.map((stock, index) => (
              <GlassCard 
                key={stock.symbol} 
                className="group hover:scale-105 transition-transform duration-300 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {watchlistSymbols.find(w => w.symbol === stock.symbol)?.name || `${stock.symbol} Corp.`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeStock(stock.symbol)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stock.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </div>
                </div>

                {chartData[stock.symbol] && chartData[stock.symbol].length > 0 && (
                  <div className="h-16 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData[stock.symbol]}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={stock.change >= 0 ? '#22c55e' : '#ef4444'}
                          strokeWidth={2}
                          dot={false}
                          className="animate-draw-line"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Track
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Predict
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )
      )}

      {/* Portfolio Summary */}
      {!loading && stocks.length > 0 && (
        <GlassCard className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Portfolio Summary</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stocks.length}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Total Stocks</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {stocks.filter(stock => stock.change > 0).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Gainers</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {stocks.filter(stock => stock.change < 0).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Losers</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {stocks.length > 0 ? 
                  ((stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length)).toFixed(2) 
                  : '0.00'
                }%
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Avg Change</div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};