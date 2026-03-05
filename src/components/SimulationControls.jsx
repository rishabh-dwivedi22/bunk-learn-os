import { Play, Pause, RotateCcw } from 'lucide-react';

export default function SimulationControls({
    onPlay,
    onPause,
    onReset,
    isPlaying,
    hasResults,
}) {
    const btnBase =
        'inline-flex items-center gap-1.5 border px-4 py-2 text-sm font-medium transition-colors rounded-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

    return (
        <div className="flex items-center gap-2">
            {!isPlaying ? (
                <button
                    onClick={onPlay}
                    disabled={!hasResults}
                    className={`${btnBase} border-accent bg-accent text-white hover:bg-accent-hover`}
                >
                    <Play size={14} />
                    Play
                </button>
            ) : (
                <button
                    onClick={onPause}
                    className={`${btnBase} border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                >
                    <Pause size={14} />
                    Pause
                </button>
            )}

            <button
                onClick={onReset}
                className={`${btnBase} border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
            >
                <RotateCcw size={14} />
                Reset
            </button>
        </div>
    );
}
