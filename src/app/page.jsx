"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const XenxoLanding = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-inter overflow-x-hidden relative">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-teal-900/20 pointer-events-none"></div>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center px-6">
        <div className={`max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Now Live</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-teal-200 bg-clip-text text-transparent leading-tight">
                Xenxo
              </h1>
              <h2 className="text-2xl lg:text-3xl font-light text-slate-300">
                Tic‑Tac‑Toe, <span className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text">Reimagined</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto lg:mx-0">
                Experience the classic game with modern AI, seamless multiplayer, and stunning visuals. Challenge friends or test your skills against an unbeatable opponent.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Start Playing button with real link */}
              <Link href="/game/ai" passHref legacyBehavior>
                <a
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" rel="noopener noreferrer"
                >
                  <span className="relative z-10">Start Playing</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-teal-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </Link>

              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Local Play</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span>AI Opponent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                <span>Online Rooms</span>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Game Board */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-teal-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Live Preview</div>
                  <div className="text-sm text-slate-300 mt-1">Interactive Demo</div>
                </div>

                <InteractiveBoard />

                <div className="mt-6 text-center">
                  <div className="text-xs text-slate-400">Click to play!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need for the perfect Tic-Tac-Toe experience, from casual games to competitive matches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
                isActive={activeFeature === index}
                onHover={() => setActiveFeature(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="relative py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Unbeatable AI Engine</h2>
              <p className="text-slate-400 mb-8">
                Our AI uses advanced minimax algorithm with alpha-beta pruning to provide the perfect challenge.
                Every move is calculated to perfection.
              </p>

              <div className="space-y-4">
                {aiFeatures.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full"></div>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-slate-500">minimax.js</span>
                </div>
                <pre className="text-slate-300">
                  {`function minimax(board, depth, alpha, beta, maximizing) {
  if (terminal(board) || depth === 0) 
    return score(board)
    
  if (maximizing) {
    let best = -Infinity
    for (let move of moves(board)) {
      apply(move)
      best = Math.max(best, 
        minimax(board, depth-1, alpha, beta, false))
      undo(move)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break // Alpha-beta pruning
    }
    return best
  } else {
    // ... minimizing logic
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Built with Modern Tech</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {techStack.map((tech, index) => (
              <div key={index} className="group p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-3">{tech.icon}</div>
                <div className="font-semibold">{tech.name}</div>
                <div className="text-sm text-slate-400 mt-1">{tech.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-teal-600/20 rounded-3xl p-12 border border-purple-500/20">
            <h2 className="text-4xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of players already enjoying the most advanced Tic-Tac-Toe experience ever created.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Play Now button with real link */}
              <Link href="/game/local" passHref legacyBehavior>
                <a
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl font-semibold text-white hover:scale-105 transition-transform duration-300" rel="noopener noreferrer"
                >
                  Play Now - It's Free
                </a>
              </Link>
              {/* View on GitHub button with real link */}
              <Link href="https://github.com/sajidmehmoodtariq-dev/xenxo" passHref legacyBehavior>
                <a
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                  target="_blank" rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-teal-600 rounded-lg"></div>
            <span className="font-bold text-xl">Xenxo</span>
          </div>
          <div className="text-slate-400 text-center">
            Made with ❤️ using Next.js, NextAuth & MongoDB
          </div>
        </div>
      </footer>
    </div>
  );
};

const InteractiveBoard = () => {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const handleCellClick = (index) => {
    if (board[index] === '') {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 w-48 h-48 mx-auto">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className="w-14 h-14 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 flex items-center justify-center text-xl font-bold transition-all duration-200 hover:scale-105"
          >
            <span className={cell === 'X' ? 'text-purple-400' : cell === 'O' ? 'text-teal-400' : ''}>
              {cell}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={resetBoard}
        className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm transition-all duration-200 mx-auto block"
      >
        Reset Game
      </button>
    </div>
  );
};

const FeatureCard = ({ feature, index, isActive, onHover }) => (
  <div
    className={`group p-8 rounded-2xl border transition-all duration-300 cursor-pointer ${isActive
        ? 'bg-gradient-to-br from-purple-600/20 to-teal-600/20 border-purple-500/50 scale-105'
        : 'bg-slate-800/40 border-slate-700/50 hover:border-purple-500/30'
      }`}
    onMouseEnter={onHover}
  >
    <div className={`text-4xl mb-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
      {feature.icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
    <p className="text-slate-400">{feature.description}</p>
    <div className={`mt-6 text-sm font-medium transition-all duration-300 ${isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-400'
      }`}>
      {feature.detail}
    </div>
  </div>
);

const features = [
  {
    icon: '🎮',
    title: 'Local Multiplayer',
    description: 'Challenge friends on the same device with persistent scoring.',
    detail: 'Perfect for face-to-face competitions'
  },
  {
    icon: '🤖',
    title: 'Unbeatable AI',
    description: 'Advanced minimax algorithm with alpha-beta pruning.',
    detail: 'Never loses, perfect for practice'
  },
  {
    icon: '🌐',
    title: 'Online Rooms',
    description: 'Create private rooms and invite friends to play remotely.',
    detail: 'Secure authentication via GitHub/Google'
  }
];

const aiFeatures = [
  'Minimax algorithm with alpha-beta pruning',
  'Perfect play - never makes a mistake',
  'Instant response time',
  'Adjustable difficulty levels',
  'Educational move explanations'
];

const techStack = [
  { icon: '⚛️', name: 'Next.js', description: 'React Framework' },
  { icon: '🔐', name: 'NextAuth', description: 'Authentication' },
  { icon: '🍃', name: 'MongoDB', description: 'Database' },
  { icon: '🎨', name: 'Tailwind', description: 'Styling' }
];

export default XenxoLanding;