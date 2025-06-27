import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20">
      <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border-t border-white/20 dark:border-blue-300/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent mb-6"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Developed by{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Jangam Pundareekaksha Muni
              </span>{' '}
              &{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Pasam Bharath Kumar
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};