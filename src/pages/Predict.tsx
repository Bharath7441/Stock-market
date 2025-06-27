import React, { useState } from 'react';
import { Search, Brain, TrendingUp, Activity, Target, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

export const Predict: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('LSTM');
  const [confidenceLevel, setConfidenceLevel] = useState(87);

  const models = ['LSTM', 'Prophet', 'ARIMA'];

  const predictionData = [
    { date: '2024-01-15', actual: 185.50, predicted: 185.50, confidence: 95 },
    { date: '2024-01-16', actual: 186.20, predicted: 186.10, confidence: 92 },
    { date: '2024-01-17', actual: 185.80, predicted: 186.25, confidence: 90 },
    { date: '2024-01-18', actual: 187.10, predicted: 186.80, confidence: 88 },
    { date: '2024-01-19', actual: 188.45, predicted: 187.90, confidence: 87 },
    { date: '2024-01-20', actual: null, predicted: 189.20, confidence: 85 },
    { date: '2024-01-21', actual: null, predicted: 190.15, confidence: 83 },
    { date: '2024-01-22', actual: null, predicted: 191.30, confidence: 81 },
    { date: '2024-01-23', actual: null, predicted: 192.45, confidence: 79 },
    { date: '2024-01-24', actual: null, predicted: 193.60, confidence: 77 },
  ];

  const confidenceData = [
    { model: 'LSTM', accuracy: 87 },
    { model: 'Prophet', accuracy: 82 },
    { model: 'ARIMA', accuracy: 75 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">AI Predictions</h1>
        <p className="text-gray-600 dark:text-gray-300">Advanced machine learning models for stock price forecasting</p>
      </div>

      {/* Search and Model Selection */}
      <GlassCard className="mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Symbol
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Enter stock symbol"
                defaultValue="AAPL"
                className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-blue-300/20 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 transition-all duration-300"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AI Model
            </label>
            <div className="flex space-x-1">
              {models.map((model) => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedModel === model
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/10 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Prediction Chart */}
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Price Predictions</h2>
                <p className="text-gray-600 dark:text-gray-300">Actual vs Predicted using {selectedModel} model</p>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">AI Analysis</span>
              </div>
            </div>

            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictionData}>
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fill="url(#actualGradient)"
                    dot={{ fill: '#22c55e', r: 4 }}
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#predictedGradient)"
                    strokeDasharray="5,5"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center space-x-8">
              <div className="flex items-center">
                <div className="w-4 h-1 bg-green-400 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Actual Price</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-blue-400 rounded mr-2" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 3px, transparent 3px, transparent 6px)' }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Predicted Price</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Prediction Summary */}
          <GlassCard>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Prediction Summary</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">$193.60</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">5-day target price</div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Expected Change</span>
                <span className="font-medium text-green-400">+2.30 (+1.20%)</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Confidence Level</span>
                <span className="font-medium text-blue-400">{confidenceLevel}%</span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${confidenceLevel}%` }}
                ></div>
              </div>
            </div>
          </GlassCard>

          {/* Model Performance */}
          <GlassCard>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Model Accuracy</h3>
            
            <div className="space-y-4">
              {confidenceData.map((model) => (
                <div key={model.model}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{model.model}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{model.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                        model.model === selectedModel ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-600'
                      }`}
                      style={{ width: `${model.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Risk Assessment */}
          <GlassCard>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Risk Assessment</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Volatility</span>
                </div>
                <span className="text-sm font-medium text-yellow-400">Medium</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Trend Strength</span>
                </div>
                <span className="text-sm font-medium text-blue-400">Strong</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Success Rate</span>
                </div>
                <span className="text-sm font-medium text-green-400">78%</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/20 dark:border-blue-300/20">
              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-400">
                    Predictions are based on historical data and should not be used as sole investment advice.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Actions */}
          <GlassCard>
            <div className="space-y-3">
              <Button className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="secondary" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Set Price Alert
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};