import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Play, RotateCcw, Award } from 'lucide-react';

export default function SnakeGameApp() {
  const GRID_SIZE = 14;
  const INITIAL_SPEED = 200;

  const [snake, setSnake] = useState<[number, number][]>([[5, 5], [5, 6], [5, 7]]);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP');
  const [food, setFood] = useState<[number, number]>([3, 3]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'OVER'>('IDLE');
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load HighScore
  useEffect(() => {
    const raw = localStorage.getItem('adv_calc_snake_high_score');
    if (raw) {
      setHighScore(parseInt(raw) || 0);
    }
  }, []);

  const generateFood = (currentSnake: [number, number][]): [number, number] => {
    while (true) {
      const rx = Math.floor(Math.random() * GRID_SIZE);
      const ry = Math.floor(Math.random() * GRID_SIZE);
      const onSnake = currentSnake.some(([sx, sy]) => sx === rx && sy === ry);
      if (!onSnake) {
        return [rx, ry];
      }
    }
  };

  const handleStart = () => {
    setSnake([[7, 7], [7, 8], [7, 9]]);
    setDirection('UP');
    const firstFood = generateFood([[7, 7], [7, 8], [7, 9]]);
    setFood(firstFood);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState('PLAYING');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (gameState !== 'PLAYING') return;
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction, gameState]);

  const handleDPad = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameState !== 'PLAYING') return;
    if (dir === 'UP' && direction !== 'DOWN') setDirection('UP');
    if (dir === 'DOWN' && direction !== 'UP') setDirection('DOWN');
    if (dir === 'LEFT' && direction !== 'RIGHT') setDirection('LEFT');
    if (dir === 'RIGHT' && direction !== 'LEFT') setDirection('RIGHT');
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      return;
    }

    gameIntervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let nextHead: [number, number] = [head[0], head[1]];

        if (direction === 'UP') nextHead[1] -= 1;
        if (direction === 'DOWN') nextHead[1] += 1;
        if (direction === 'LEFT') nextHead[0] -= 1;
        if (direction === 'RIGHT') nextHead[0] += 1;

        // Check Wall Collisions
        if (
          nextHead[0] < 0 ||
          nextHead[0] >= GRID_SIZE ||
          nextHead[1] < 0 ||
          nextHead[1] >= GRID_SIZE
        ) {
          setGameState('OVER');
          return prevSnake;
        }

        // Check Self Collisions
        const hitSelf = prevSnake.some(([sx, sy]) => sx === nextHead[0] && sy === nextHead[1]);
        if (hitSelf) {
          setGameState('OVER');
          return prevSnake;
        }

        const newSnake = [nextHead, ...prevSnake];

        // Check Eat Food
        if (nextHead[0] === food[0] && nextHead[1] === food[1]) {
          setScore((prevScore) => {
            const nextScore = prevScore + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('adv_calc_snake_high_score', nextScore.toString());
            }
            return nextScore;
          });
          // Speed increase safely
          setSpeed((prevSpeed) => Math.max(90, prevSpeed - 8));
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [gameState, direction, food, speed, highScore]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans select-none">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-purple-400" />
          <span className="font-bold text-base tracking-tight">Viper Secret Game</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Score: <strong className="text-white font-bold">{score}</strong></span>
          <span className="text-slate-500">|</span>
          <span className="text-purple-400 flex items-center gap-0.5">
            <Award className="w-3 h-3" />
            H-Score: <strong className="font-bold">{highScore}</strong>
          </span>
        </div>
      </div>

      {/* Main Game Screen Board */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 max-h-[350px]">
        {gameState === 'PLAYING' ? (
          <div className="grid bg-slate-950 border-4 border-slate-800 rounded-xl overflow-hidden p-1 shadow-inner shadow-black relative"
               style={{
                 gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                 aspectRatio: '1',
                 width: '100%',
                 maxWidth: '240px'
               }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);
              const isSnakeHead = snake[0][0] === x && snake[0][1] === y;
              const isSnakeBody = snake.slice(1).some(([sx, sy]) => sx === x && sy === y);
              const isFood = food[0] === x && food[1] === y;

              let cellStyle = 'bg-slate-900 border border-slate-950/20';
              if (isSnakeHead) {
                cellStyle = 'bg-orange-500 rounded-sm scale-110 shadow-md z-10';
              } else if (isSnakeBody) {
                cellStyle = 'bg-emerald-500 rounded-xs scale-95';
              } else if (isFood) {
                cellStyle = 'bg-red-500 rounded-full scale-90 animate-pulse';
              }

              return <div key={idx} className={`${cellStyle} w-full h-full transition-all duration-75`}></div>;
            })}
          </div>
        ) : (
          <div className="w-full max-w-[240px] aspect-square bg-slate-950 border-4 border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4">
            {gameState === 'IDLE' ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest font-mono">Ready to stream?</h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Control the tactical node using keyboard Arrows or the analog tactile D-pad below.
                  </p>
                </div>
                <button
                  onClick={handleStart}
                  className="mx-auto flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs tracking-wider transition-colors shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  START STREAMING
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-red-400 font-mono tracking-widest">SYSTEM DECOMMISSIONED</h3>
                  <p className="text-xl font-bold text-white font-mono">{score} pts</p>
                  <p className="text-[10px] text-slate-500">Node collided. Security sweep completes successfully.</p>
                </div>
                <button
                  onClick={handleStart}
                  className="mx-auto flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-purple-400 font-bold rounded-lg text-xs tracking-wider transition-colors border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  REDEPLOY SYSTEM
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tactile D-Pad Controller */}
      <div className="bg-slate-950 p-4 border-t border-slate-850 flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
        {/* Up Row */}
        <button
          onClick={() => handleDPad('UP')}
          className="w-12 h-10 bg-slate-850 hover:bg-slate-750 hover:scale-105 active:scale-95 border border-slate-700 rounded-xl flex items-center justify-center text-lg active:bg-purple-900 transition-all shadow-md focus:outline-none"
        >
          ▲
        </button>

        {/* Mid Row */}
        <div className="flex gap-10">
          <button
            onClick={() => handleDPad('LEFT')}
            className="w-12 h-10 bg-slate-850 hover:bg-slate-750 hover:scale-105 active:scale-95 border border-slate-700 rounded-xl flex items-center justify-center text-lg active:bg-purple-900 transition-all shadow-md focus:outline-none"
          >
            ◀
          </button>
          <button
            onClick={() => handleDPad('RIGHT')}
            className="w-12 h-10 bg-slate-850 hover:bg-slate-750 hover:scale-105 active:scale-95 border border-slate-700 rounded-xl flex items-center justify-center text-lg active:bg-purple-900 transition-all shadow-md focus:outline-none"
          >
            ▶
          </button>
        </div>

        {/* Down Row */}
        <button
          onClick={() => handleDPad('DOWN')}
          className="w-12 h-10 bg-slate-850 hover:bg-slate-750 hover:scale-105 active:scale-95 border border-slate-700 rounded-xl flex items-center justify-center text-lg active:bg-purple-900 transition-all shadow-md focus:outline-none"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
