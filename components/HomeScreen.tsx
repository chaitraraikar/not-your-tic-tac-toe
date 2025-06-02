import React, { useState } from 'react';
import { GameMode } from '../types';
import RobotIcon from './icons/RobotIcon';
import UsersIcon from './icons/UsersIcon';
import ControllerIcon from './icons/ControllerIcon';

interface HomeScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

const HowToPlayModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
    onClick={onClose}
    aria-modal="true"
    role="dialog"
  >
    <div 
      className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full text-white relative transform transition-all duration-300 scale-100"
      onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
    >
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 text-2xl leading-none"
        aria-label="Close how to play"
      >
        &times;
      </button>
      <h3 className="game-title text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
        How to Play
      </h3>
      <div className="space-y-3 text-slate-300 text-sm md:text-base">
        <p><strong>Objective:</strong> Be the first player to align 3 of your pieces in a row, column, or diagonally.</p>
        <div>
          <h4 className="font-semibold text-slate-100">Setup:</h4>
          <ul className="list-disc list-inside ml-4">
            <li>Played on a 3x3 grid of 9 dots with connecting lines.</li>
            <li>Each of the 2 players (X and O) gets 3 pieces.</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-100">Game Phases:</h4>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>
              <strong>Placement Phase:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Players take turns placing one piece on any empty dot.</li>
                <li>Continues until all 6 pieces (3 per player) are placed.</li>
              </ul>
            </li>
            <li>
              <strong>Movement Phase:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>After all pieces are on board, players take turns moving one of their own pieces.</li>
                <li>A piece can only move to an adjacent empty dot (connected by a line).</li>
              </ul>
            </li>
          </ol>
        </div>
        <p><strong>Winning:</strong> The first player to align their three pieces (horizontally, vertically, or diagonally) wins!</p>
      </div>
      <button
        onClick={onClose}
        className="mt-6 w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-300"
      >
        Got it!
      </button>
    </div>
  </div>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center p-8 bg-black bg-opacity-20 backdrop-blur-sm rounded-xl shadow-2xl z-10 w-full max-w-md">
        <h1 className="game-title text-6xl md:text-7xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          TIC TAC TOE
        </h1>
        <p className="text-sm mb-8 text-slate-200">Not Your Average Game!</p>

        <h2 className="text-3xl font-semibold mb-2 text-white">Select Game</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mb-6 rounded-full"></div>

        <div className="space-y-4 w-full">
          <button
            onClick={() => onSelectMode(GameMode.SINGLE_PLAYER)}
            className="w-full flex items-center justify-center text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 px-6 rounded-xl shadow-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            <RobotIcon className="w-7 h-7 mr-3" />
            Single Player
          </button>
          <div className="relative w-full flex items-center justify-center">
            <button
              onClick={() => onSelectMode(GameMode.TWO_PLAYERS)}
              className="w-full flex items-center justify-center text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-xl shadow-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              <UsersIcon className="w-7 h-7 mr-3" />
              Two Players
            </button>
            <ControllerIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 text-purple-200 opacity-70 -rotate-12" />
          </div>
          <button
            onClick={() => setShowHowToPlay(true)}
            aria-label="How to Play"
            className="w-full text-lg font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white py-3 px-6 rounded-xl shadow-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300 mt-2"
          >
            How to Play
          </button>
        </div>
      </div>
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
    </>
  );
};

export default HomeScreen;
