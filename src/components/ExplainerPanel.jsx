import React, { useState } from 'react';

export default function ExplainerPanel({
    results,
    revealedCount,
    onStepChange,
    isPlaying
}) {
    const [lang, setLang] = useState('en'); // 'en' or 'hi'

    const totalSteps = results.length;
    const currentStep = revealedCount > 0 ? revealedCount - 1 : -1;
    const currentBlock = currentStep >= 0 ? results[currentStep] : null;

    if (!currentBlock) {
        return (
            <div className="border-2 border-slate-300 bg-white p-5 font-mono">
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                    {lang === 'en'
                        ? 'SIMULATION_IDLE — Start simulation to see step-by-step explanations'
                        : 'SIMULATION_IDLE — Simulation start karo toh step-by-step samjhaayenge!'}
                </p>
            </div>
        );
    }

    const reasonText = lang === 'hi'
        ? (currentBlock.reasonHi || currentBlock.reason || 'No explanation available.')
        : (currentBlock.reason || 'No explanation available.');

    return (
        <div className="border-2 border-slate-900 bg-white font-mono overflow-hidden">
            {/* HEADER */}
            <div className="border-b-2 border-slate-900 bg-slate-100 px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-slate-900">
                        DECISION_LOG
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">
                        STEP {currentStep + 1} / {totalSteps}
                    </span>
                </div>

                {/* LANGUAGE TOGGLE */}
                <div className="flex border-2 border-slate-900 shrink-0">
                    <button
                        onClick={() => setLang('en')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                            lang === 'en'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        ENG
                    </button>
                    <button
                        onClick={() => setLang('hi')}
                        className={`px-3 py-1 text-[10px] font-bold tracking-widest border-l-2 border-slate-900 transition-colors cursor-pointer ${
                            lang === 'hi'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        हिंग्लिश
                    </button>
                </div>
            </div>

            {/* REASON TEXT */}
            <div className="p-3 sm:p-4 border-b-2 border-slate-300">
                <p
                    key={`${currentStep}-${lang}`}
                    className="text-xs sm:text-sm leading-relaxed text-slate-800 animate-fade-slide-in break-words"
                    style={{ overflowWrap: 'anywhere' }}
                >
                    {reasonText}
                </p>
            </div>

            {/* CONTEXT BOX */}
            <div className="p-4 bg-slate-50 border-b-2 border-slate-300">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">
                    {lang === 'en' ? `CONTEXT AT t=${currentBlock.startTime}` : `CONTEXT — TIME t=${currentBlock.startTime}`}
                </p>
                <div className="text-xs space-y-1 text-slate-700">
                    <p>
                        <span className="font-bold text-slate-900">
                            {lang === 'en' ? 'EXECUTING:' : 'CHAL RAHA HAI:'}
                        </span>{' '}
                        {currentBlock.isIdle
                            ? (lang === 'en' ? 'None (CPU idle)' : 'Koi nahi (CPU free hai)')
                            : currentBlock.id}
                    </p>
                    <p>
                        <span className="font-bold text-slate-900">TIME_RANGE:</span>{' '}
                        t={currentBlock.startTime} → t={currentBlock.completionTime}
                    </p>
                    {currentBlock.burstTime !== undefined && (
                        <p>
                            <span className="font-bold text-slate-900">
                                {lang === 'en' ? 'DURATION:' : 'KITNI DER:'}
                            </span>{' '}
                            {currentBlock.executionTime || currentBlock.burstTime} unit{(currentBlock.executionTime || currentBlock.burstTime) !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </div>

            {/* NAVIGATION CONTROLS */}
            <div className="p-4 flex flex-col sm:flex-row gap-2">
                <button
                    onClick={() => onStepChange(Math.max(1, revealedCount - 1))}
                    disabled={revealedCount <= 1}
                    aria-label="Previous step"
                    className="flex-1 border-2 border-slate-900 bg-white px-4 py-2 text-xs uppercase tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                >
                    ← PREV
                </button>
                <button
                    onClick={() => onStepChange(Math.min(totalSteps, revealedCount + 1))}
                    disabled={revealedCount >= totalSteps}
                    aria-label="Next step"
                    className="flex-1 border-2 border-slate-900 bg-white px-4 py-2 text-xs uppercase tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                >
                    NEXT →
                </button>
            </div>
        </div>
    );
}
