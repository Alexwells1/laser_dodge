import { useState } from "react";
import { GameMode } from "../systems/types";

interface Props {
  score: number;
  highScore: number;
  mode: GameMode;
  onRestart: () => void;
  onMenu: () => void;
}

export default function GameOverScreen({
  score,
  highScore,
  mode,
  onRestart,
  onMenu,
}: Props) {
  const isNew = score >= highScore && score > 0;
  const [restartPressed, setRestartPressed] = useState(false);
  const [menuHover, setMenuHover] = useState(false);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-6 py-10"
      style={{ background: "rgba(0,0,0,0.9)", zIndex: 50 }}
    >
      {/* Explosion background */}
      <div
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          background:
            "radial-gradient(circle, rgba(255,40,0,0.15) 0%, transparent 70%)",
          animation: "explosion 1.5s ease-out forwards",
        }}
      />

      <div
        className="relative justify-center w-full md:h-70 max-w-md flex flex-col items-center gap-6 rounded-2xl px-8 sm:px-12 py-10 "
        style={{
          background: "rgba(20,0,0,0.9)",
          border: "1px solid rgba(255,30,30,0.5)",
          boxShadow:
            "0 0 60px rgba(255,30,30,0.2), inset 0 0 30px rgba(255,0,0,0.08)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          className="text-3xl sm:text-4xl font-black tracking-widest text-center"
          style={{
            fontFamily: "'Orbitron', monospace",
            color: "#f00",
            textShadow: "0 0 20px #f00",
          }}
        >
          TERMINATED
        </div>

        {isNew && (
          <div
            className="text-sm tracking-widest font-bold text-center"
            style={{ color: "#ff0", textShadow: "0 0 10px #ff0" }}
          >
            ✦ NEW HIGH SCORE ✦
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <div
            className="text-4xl sm:text-5xl font-bold tracking-wider"
            style={{ color: "#fff", textShadow: "0 0 15px #fff5" }}
          >
            {score.toLocaleString()}
          </div>

          <div
            className="text-sm tracking-widest"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            BEST:{" "}
            <span style={{ color: "#ff0" }}>{highScore.toLocaleString()}</span>
          </div>

          <div
            className="text-xs tracking-widest mt-1"
            style={{ color: mode === "chaos" ? "#f0f" : "#0ff" }}
          >
            {mode.toUpperCase()} MODE
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center items-center flex-col sm:flex-row gap-4 w-full mt-6">
          <button
            onMouseDown={() => setRestartPressed(true)}
            onMouseUp={() => setRestartPressed(false)}
            onMouseLeave={() => setRestartPressed(false)}
            onClick={onRestart}
            className="w-full min-w-20 sm:w-auto px-16 py-4 text-lg tracking-widest rounded-lg transition-all duration-150"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              background: "linear-gradient(90deg, #0ff, #00c8)",
              color: "#000",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: restartPressed
                ? "0 0 12px #0ff, inset 0 0 8px #0ff8"
                : "0 0 24px #0ff, inset 0 0 12px #0ff2",
              transform: restartPressed ? "scale(0.96)" : "scale(1)",
            }}
          >
            RETRY
          </button>

          <button
            onMouseEnter={() => setMenuHover(true)}
            onMouseLeave={() => setMenuHover(false)}
            onClick={onMenu}
            className="w-full min-w-20 sm:w-auto px-16 py-4 text-lg tracking-widest rounded-lg transition-all duration-150"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              background: menuHover ? "rgba(255,255,255,0.15)" : "transparent",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: menuHover
                ? "0 0 20px rgba(255,255,255,0.3)"
                : "0 0 12px rgba(255,255,255,0.2)",
            }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
