
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import { GameMode } from './types';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  const handleGameModeSelect = (mode: GameMode) => {
    setGameMode(mode);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="blurry-bg-element text-7xl text-orange-400 top-1/4 left-10 transform -rotate-12">X</div>
      <div className="blurry-bg-element text-8xl text-blue-300 bottom-1/4 right-10 transform rotate-12">O</div>
      <div className="blurry-bg-element text-6xl text-orange-400 bottom-10 left-20 transform rotate-6">X</div>
      <div className="blurry-bg-element text-9xl text-blue-300 top-10 right-20 transform -rotate-6">O</div>

      <HashRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              gameMode ? (
                <Navigate to="/game" replace />
              ) : (
                <HomeScreen onSelectMode={handleGameModeSelect} />
              )
            } 
          />
          <Route 
            path="/game" 
            element={
              gameMode ? (
                <GameScreen gameMode={gameMode} onExit={() => setGameMode(null)} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
