import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Track } from './pages/Track';
import { Predict } from './pages/Predict';
import { Watchlist } from './pages/Watchlist';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/track" element={<Track />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;