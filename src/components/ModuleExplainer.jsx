import React, { useState } from 'react';

/**
 * ModuleExplainer — Reusable step-by-step explanation panel for all modules.
 * Takes an array of step objects: { reason, reasonHi, context: {...} }
 * and renders them with ENG/Hinglish toggle + PREV/NEXT nav.
 */
export default function ModuleExplainer({ steps, title = 'DECISION_LOG' }) {
    const [lang, setLang] = useState('en');
    const [currentIdx, setCurrentIdx] = useState(0);

    if (!steps || steps.length === 0) {
        return (
            <div className="border-2 border-slate-300 bg-white p-5 font-mono">
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                    {lang === 'en'
                        ? 'AWAITING_DATA — Run or configure the simulation to see explanations'
                        : 'AWAITING_DATA — Simulation chalao ya configure karo, toh yahan step-by-step samjhaayenge!'}
                </p>
            </div>
        );
    }

    const step = steps[currentIdx];
    const reasonText = lang === 'hi'
        ? (step.reasonHi || step.reason || 'No explanation available.')
        : (step.reason || 'No explanation available.');

    return (
        <div className="border-2 border-slate-900 bg-white font-mono overflow-hidden">
            {/* HEADER */}
            <div className="border-b-2 border-slate-900 bg-slate-100 px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-slate-900">
                        {title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">
                        STEP {currentIdx + 1} / {steps.length}
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
                    key={`${currentIdx}-${lang}`}
                    className="text-xs sm:text-sm leading-relaxed text-slate-800 animate-fade-slide-in break-words"
                    style={{ overflowWrap: 'anywhere' }}
                >
                    {reasonText}
                </p>
            </div>

            {/* CONTEXT BOX */}
            {step.context && (
                <div className="p-4 bg-slate-50 border-b-2 border-slate-300">
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">
                        {lang === 'en' ? 'CONTEXT' : 'CONTEXT'}
                    </p>
                    <div className="text-xs space-y-1 text-slate-700">
                        {Object.entries(step.context).map(([key, value]) => (
                            <p key={key}>
                                <span className="font-bold text-slate-900">{key}:</span>{' '}
                                {value}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* NAV */}
            <div className="p-4 flex flex-col sm:flex-row gap-2">
                <button
                    onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                    disabled={currentIdx <= 0}
                    aria-label="Previous step"
                    className="flex-1 border-2 border-slate-900 bg-white px-4 py-2 text-xs uppercase tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                >
                    ← PREV
                </button>
                <button
                    onClick={() => setCurrentIdx(Math.min(steps.length - 1, currentIdx + 1))}
                    disabled={currentIdx >= steps.length - 1}
                    aria-label="Next step"
                    className="flex-1 border-2 border-slate-900 bg-white px-4 py-2 text-xs uppercase tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                >
                    NEXT →
                </button>
            </div>
        </div>
    );
}
