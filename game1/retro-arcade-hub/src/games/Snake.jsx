import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ls } from '../utils/storage';

const CELL = 20;
const COLS = 20;
const ROWS = 20;
const CANVAS_SIZE = CELL * COLS; // 400

const DIRS = {
  ArrowUp:    { x: 0, y: -1 },
  ArrowDown:  { x: 0, y:  1 },
  ArrowLeft:  { x: -1, y: 0 },
  ArrowRight: { x:  1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y:  1 },
  a: { x: -1, y: 0 },
  d: { x:  1, y: 0 },
};

function randomFood(snake) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function initState() {
  const snake = [{ x: 10, y: 10 }];
  return { snake, dir: { x: 1, y: 0 }, food: randomFood(snake), score: 0, alive: true };
}

export default function Snake() {
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const gameRef = useRef(initState());
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const pendingDirRef = useRef(null);
  const gameLoopRef = useRef(null); // always holds the latest gameLoop fn

  const [phase, setPhase] = useState('idle'); // idle | playing | gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => ls.get('snake_best', 0));
  const highScoreRef = useRef(highScore);
  useEffect(() => { highScoreRef.current = highScore; }, [highScore]);

  const updateHighScore = useCallback((val) => {
    ls.set('snake_best', val);
    setHighScore(val);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { snake, food } = gameRef.current;

    // Background
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid
    ctx.strokeStyle = 'rgba(0,255,255,0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, CANVAS_SIZE); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(CANVAS_SIZE, y * CELL); ctx.stroke();
    }

    // Food
    ctx.shadowColor = '#ff0080';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ff0080';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const ratio = 1 - (i / snake.length) * 0.7;
      ctx.shadowColor = isHead ? '#00ffff' : '#00cc88';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.fillStyle = isHead
        ? `rgba(0, 255, 255, ${ratio})`
        : `rgba(0, ${Math.floor(180 * ratio)}, ${Math.floor(136 * ratio)}, ${ratio})`;
      const pad = isHead ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, isHead ? 5 : 3);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Eyes on head
    const head = snake[0];
    const { x: dx, y: dy } = gameRef.current.dir;
    ctx.fillStyle = '#000';
    const eyeOffX = dy !== 0 ? 4 : (dx > 0 ? 12 : 4);
    const eyeOffY = dx !== 0 ? 4 : (dy > 0 ? 12 : 4);
    ctx.beginPath();
    ctx.arc(head.x * CELL + eyeOffX, head.y * CELL + eyeOffY, 2.5, 0, Math.PI * 2);
    ctx.arc(head.x * CELL + (CELL - eyeOffX), head.y * CELL + (CELL - eyeOffY), 2.5, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const getSpeed = (s) => Math.max(80, 200 - Math.floor(s / 5) * 20);

  // useCallback so the function identity is stable; RAF calls it via
  // gameLoopRef so we never hold a stale reference.
  const gameLoop = useCallback((timestamp) => {
    const g = gameRef.current;
    if (!g.alive) return;

    const speed = getSpeed(g.score);
    if (timestamp - lastTimeRef.current >= speed) {
      lastTimeRef.current = timestamp;

      // Apply pending direction change
      if (pendingDirRef.current) {
        const nd = pendingDirRef.current;
        // Prevent 180° reversal
        if (!(nd.x === -g.dir.x && nd.y === -g.dir.y)) {
          g.dir = nd;
        }
        pendingDirRef.current = null;
      }

      // Move snake
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        g.alive = false;
        setPhase('gameover');
        if (g.score > highScoreRef.current) updateHighScore(g.score);
        draw();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        return;
      }

      // Self collision
      if (g.snake.some(s => s.x === head.x && s.y === head.y)) {
        g.alive = false;
        setPhase('gameover');
        if (g.score > highScoreRef.current) updateHighScore(g.score);
        draw();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        return;
      }

      const newSnake = [head, ...g.snake];

      // Food
      if (head.x === g.food.x && head.y === g.food.y) {
        g.score += 1;
        setScore(g.score);
        g.food = randomFood(newSnake);
      } else {
        newSnake.pop();
      }

      g.snake = newSnake;
    }

    draw();
    // Always call the latest version via ref — breaks the stale-closure cycle
    rafRef.current = requestAnimationFrame(gameLoopRef.current);
  }, [draw, updateHighScore]);

  // Sync ref after every render so RAF always calls the latest gameLoop
  useEffect(() => {
    gameLoopRef.current = gameLoop;
  }, [gameLoop]);

  const startGame = useCallback((initialDir = null) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    gameRef.current = initState();
    lastTimeRef.current = 0;
    pendingDirRef.current = initialDir;
    setScore(0);
    setPhase('playing');
    rafRef.current = requestAnimationFrame(gameLoopRef.current);
  }, [gameLoop]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e) => {
      if (DIRS[e.key]) {
        e.preventDefault();
        if (phase === 'idle' || phase === 'gameover') {
          startGame(DIRS[e.key]);
        } else {
          pendingDirRef.current = DIRS[e.key];
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, startGame]);

  // Cleanup on unmount
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // Draw idle screen
  useEffect(() => {
    if (phase === 'idle') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0a0a1f';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = 'rgba(0,255,255,0.08)';
      for (let x = 0; x <= COLS; x++) ctx.fillRect(x * CELL, 0, 0.5, CANVAS_SIZE);
      for (let y = 0; y <= ROWS; y++) ctx.fillRect(0, y * CELL, CANVAS_SIZE, 0.5);
      ctx.fillStyle = '#00ffff';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS START', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 10);
      ctx.font = '11px monospace';
      ctx.fillStyle = 'rgba(0,255,255,0.5)';
      ctx.fillText('OR USE ARROW KEYS', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
      ctx.shadowBlur = 0;
    }
  }, [phase]);

  const handleDpad = (dir) => {
    if (phase === 'idle' || phase === 'gameover') {
      startGame(DIRS[dir]);
    } else {
      pendingDirRef.current = DIRS[dir];
    }
  };

  return (
    <div style={styles.layout}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← BACK</button>
        <h1 style={styles.title}>🐍 SNAKE</h1>
        <div style={styles.scoreBar}>
          <div style={styles.scoreItem}>
            <span style={styles.scoreVal}>{score}</span>
            <span style={styles.scoreLabel}>SCORE</span>
          </div>
          <div style={styles.scoreItem}>
            <span style={styles.scoreVal}>{highScore}</span>
            <span style={styles.scoreLabel}>BEST</span>
          </div>
          <div style={styles.scoreItem}>
            <span style={styles.scoreVal}>{Math.floor(score / 5) + 1}</span>
            <span style={styles.scoreLabel}>LEVEL</span>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div style={styles.board}>
        <canvas
          ref={canvasRef}
          id="snake-canvas"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={styles.canvas}
        />

        {/* D-Pad for mobile */}
        <div style={styles.dpad} aria-label="D-pad controls">
          <button style={{ ...styles.dpadBtn, gridColumn: 2, gridRow: 1 }} onClick={() => handleDpad('ArrowUp')}    aria-label="Up">↑</button>
          <button style={{ ...styles.dpadBtn, gridColumn: 1, gridRow: 2 }} onClick={() => handleDpad('ArrowLeft')}  aria-label="Left">←</button>
          <button style={{ ...styles.dpadBtn, gridColumn: 2, gridRow: 2 }} onClick={() => handleDpad('ArrowDown')}  aria-label="Down">↓</button>
          <button style={{ ...styles.dpadBtn, gridColumn: 3, gridRow: 2 }} onClick={() => handleDpad('ArrowRight')} aria-label="Right">→</button>
        </div>

        {phase === 'idle' && (
          <button style={styles.startBtn} onClick={() => startGame()} id="snake-start-btn">
            ▶ START GAME
          </button>
        )}

        {phase === 'gameover' && (
          <div style={styles.modalBackdrop}>
            <div style={styles.modal}>
              <span style={{ fontSize: 48 }}>💀</span>
              <h2 style={{ color: '#ff4466', margin: '8px 0', letterSpacing: 2 }}>GAME OVER!</h2>
              <p style={{ color: '#ccc', margin: '4px 0' }}>
                Score: <strong style={{ color: '#ffff00' }}>{score}</strong>
              </p>
              <p style={{ color: '#aaa', fontSize: 13, margin: '4px 0' }}>
                HIGH SCORE: <strong style={{ color: '#00ffff' }}>{highScore}</strong>
              </p>
              <button style={styles.startBtn} onClick={() => startGame()} id="snake-retry-btn">
                ↺ TRY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Inline styles (no external CSS needed) ── */
const styles = {
  layout: {
    minHeight: '100vh',
    background: '#0a0a1f',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'monospace',
    padding: '16px',
    boxSizing: 'border-box',
  },
  header: {
    width: '100%',
    maxWidth: 440,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  backBtn: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: '1px solid rgba(0,255,255,0.4)',
    color: '#00ffff',
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 13,
    letterSpacing: 1,
  },
  title: {
    color: '#00ffff',
    margin: 0,
    fontSize: 22,
    letterSpacing: 4,
    textShadow: '0 0 16px #00ffff',
  },
  scoreBar: {
    display: 'flex',
    gap: 24,
    background: 'rgba(0,255,255,0.05)',
    border: '1px solid rgba(0,255,255,0.15)',
    borderRadius: 10,
    padding: '8px 24px',
  },
  scoreItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  scoreVal: {
    color: '#00ffff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadow: '0 0 8px #00ffff',
  },
  scoreLabel: {
    color: 'rgba(0,255,255,0.5)',
    fontSize: 10,
    letterSpacing: 2,
  },
  board: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  canvas: {
    display: 'block',
    border: '2px solid rgba(0,255,255,0.3)',
    borderRadius: 8,
    boxShadow: '0 0 30px rgba(0,255,255,0.15)',
  },
  dpad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 44px)',
    gridTemplateRows: 'repeat(2, 44px)',
    gap: 4,
  },
  dpadBtn: {
    background: 'rgba(0,255,255,0.1)',
    border: '1px solid rgba(0,255,255,0.3)',
    color: '#00ffff',
    borderRadius: 8,
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtn: {
    background: 'linear-gradient(135deg, #00ffff22, #00ffff44)',
    border: '2px solid #00ffff',
    color: '#00ffff',
    padding: '12px 32px',
    borderRadius: 10,
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 15,
    letterSpacing: 2,
    fontWeight: 'bold',
    boxShadow: '0 0 20px rgba(0,255,255,0.3)',
    marginTop: 8,
  },
  modalBackdrop: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  modal: {
    background: '#0d0d2b',
    border: '2px solid rgba(0,255,255,0.3)',
    borderRadius: 16,
    padding: '32px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 0 40px rgba(0,255,255,0.2)',
  },
};