import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Target, Eye, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { fetchMultipleQuotes } from '../services/alphaVantageApi';

export const Home: React.FC = () => {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketOverview = async () => {
      try {
        // Fetch major market indices (using ETFs as proxies)
        const symbols = ['SPY', 'QQQ', 'DIA']; // S&P 500, NASDAQ, DOW ETFs
        const quotes = await fetchMultipleQuotes(symbols);
        
        const marketOverview = quotes.map(quote => {
          let name = '';
          switch (quote.symbol) {
            case 'SPY':
              name = 'S&P 500';
              break;
            case 'QQQ':
              name = 'NASDAQ';
              break;
            case 'DIA':
              name = 'DOW';
              break;
            default:
              name = quote.symbol;
          }
          
          return {
            name,
            symbol: quote.symbol,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
          };
        });
        
        setMarketData(marketOverview);
      } catch (error) {
        console.error('Error fetching market overview:', error);
        // Fallback to mock data if API fails
        setMarketData([
          { name: 'S&P 500', symbol: 'SPY', price: 432.50, change: 2.4, changePercent: 0.56 },
          { name: 'NASDAQ', symbol: 'QQQ', price: 354.20, change: -1.2, changePercent: -0.34 },
          { name: 'DOW', symbol: 'DIA', price: 345.80, change: 0.8, changePercent: 0.23 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketOverview();
  }, []);

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-400" />,
      title: 'Live Market Tracking',
      description: 'Real-time stock prices, volume analysis, and market movements with instant updates.',
    },
    {
      icon: <Target className="h-8 w-8 text-green-400" />,
      title: 'AI-Powered Predictions',
      description: 'Advanced LSTM and Prophet models provide accurate forecasts with confidence intervals.',
    },
    {
      icon: <Eye className="h-8 w-8 text-purple-400" />,
      title: 'Smart Watchlists',
      description: 'Curate and monitor your favorite stocks with personalized alerts and insights.',
    },
  ];

  const stats = [
    { label: 'Stocks Tracked', value: '10,000+' },
    { label: 'Predictions Made', value: '1M+' },
    { label: 'Active Users', value: '50K+' },
    { label: 'Accuracy Rate', value: '94%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-sm font-medium mb-6 border border-blue-400/30">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Market Intelligence
          </div>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Track & Predict
          </span>
          <br />
          <span className="text-gray-800 dark:text-white">Stock Markets</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Harness the power of artificial intelligence to make informed investment decisions. 
          Get live market data, intelligent forecasts, and comprehensive visual analysis.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/track">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/predict">
            <Button variant="secondary" size="lg">
              View Predictions
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, index) => (
          <GlassCard key={stat.label} className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
            <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {features.map((feature, index) => (
          <GlassCard key={feature.title} className="text-center group hover:scale-105 opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.9 + index * 0.1}s` }}>
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 mb-6 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
          </GlassCard>
        ))}
      </div>

      {/* Market Overview Preview */}
      <GlassCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Market Overview</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Live Data</span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {marketData.map((market) => (
                <div key={market.symbol} className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    market.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {market.change >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">{market.name}</div>
                  <div className="text-sm text-gray-500">${market.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20 dark:border-blue-300/20">
              <Link to="/track">
                <Button className="w-full">
                  View Detailed Analysis
                  <BarChart3 className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </GlassCard>

      {/* Trust Indicators */}
      <div className="mt-20 text-center">
        <div className="flex justify-center items-center space-x-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-sm">Enterprise Security</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Globe className="h-5 w-5 text-blue-400" />
            <span className="text-sm">Global Markets</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Zap className="h-5 w-5 text-purple-400" />
            <span className="text-sm">Real-time Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};