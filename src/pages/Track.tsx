import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Volume2, Clock, Target, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useStockData } from '../hooks/useStockData';

export const Track: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('AAPL');
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const { quote, timeSeries, loading, error } = useStockData(searchTerm, activeTimeframe);

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  const handleSearch = () => {
    // The useStockData hook will automatically refetch when searchTerm changes
  };

  // Transform time series data for charts
  const chartData = timeSeries.map((item, index) => ({
    time: activeTimeframe === '1D' 
      ? new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: item.close,
    volume: item.volume / 1000000, // Convert to millions
  }));

  const sentimentData = [
    { name: 'Buy', value: 45, color: '#22c55e' },
    { name: 'Hold', value: 35, color: '#eab308' },
    { name: 'Sell', value: 20, color: '#ef4444' },
  ];

  const volumeData = chartData.slice(-6).map(item => ({
    time: item.time,
    volume: item.volume,
  }));

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GlassCard className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Stock Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300">Monitor real-time stock data with advanced analytics</p>
      </div>

      {/* Search Bar */}
      <GlassCard className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-blue-300/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 transition-all duration-300"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Search Stock
          </Button>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <GlassCard>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : quote ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{quote.symbol}</h2>
                    <div className="flex items-center mt-2">
                      <span className="text-3xl font-bold text-gray-800 dark:text-white">${quote.price.toFixed(2)}</span>
                      <div className={`ml-4 flex items-center ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {quote.change >= 0 ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
                        <span className="font-medium">
                          {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1 mt-4 sm:mt-0">
                    {timeframes.map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => setActiveTimeframe(timeframe)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeTimeframe === timeframe
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5'
                        }`}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis 
                        dataKey="time" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        domain={['dataMin - 1', 'dataMax + 1']}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          color: '#ffffff',
                        }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke={quote.change >= 0 ? "#22c55e" : "#ef4444"} 
                        strokeWidth={3}
                        dot={false}
                        strokeDasharray="0"
                        className="animate-draw-line"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">High</div>
                    <div className="text-green-400 font-bold">${quote.high.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Low</div>
                    <div className="text-red-400 font-bold">${quote.low.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Volume</div>
                    <div className="text-blue-400 font-bold">{(quote.volume / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Open</div>
                    <div className="text-purple-400 font-bold">${quote.open.toFixed(2)}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">Enter a stock symbol to view data</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Live Stock Overview */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Market Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Live Data</span>
              </div>
            </div>
            
            {quote ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Open</span>
                  <span className="font-medium text-gray-800 dark:text-white">${quote.open.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Prev Close</span>
                  <span className="font-medium text-gray-800 dark:text-white">${quote.previousClose.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Day High</span>
                  <span className="font-medium text-green-400">${quote.high.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Day Low</span>
                  <span className="font-medium text-red-400">${quote.low.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">No data available</p>
              </div>
            )}
          </GlassCard>

          {/* Sentiment Analysis */}
          <GlassCard>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Market Sentiment</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    className="animate-spin-slow"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.name} {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Add to Watchlist
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Predictions
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Volume2 className="h-4 w-4 mr-2" />
                Set Price Alert
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Volume Analysis */}
      {volumeData.length > 0 && (
        <GlassCard className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Volume Analysis</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#ffffff',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}M`, 'Volume']}
                />
                <Bar 
                  dataKey="volume" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  className="animate-bar-fill"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}
    </div>
  );
};