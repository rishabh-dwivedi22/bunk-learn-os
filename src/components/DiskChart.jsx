import React, { useMemo } from 'react';

// SSTF: Shortest Seek Time First
function calculateSSTF(initialHead, requests) {
    let currentPos = initialHead;
    const pending = [...requests];
    const sequence = [initialHead];
    let totalMovement = 0;

    while (pending.length > 0) {
        let closestIdx = -1;
        let minDistance = Infinity;

        for (let i = 0; i < pending.length; i++) {
            const dist = Math.abs(currentPos - pending[i]);
            if (dist < minDistance) {
                minDistance = dist;
                closestIdx = i;
            }
        }

        const nextTrack = pending.splice(closestIdx, 1)[0];
        totalMovement += minDistance;
        currentPos = nextTrack;
        sequence.push(currentPos);
    }

    return { sequence, totalMovement };
}

// SCAN: Elevator algorithm (moves in one direction until the end, then reverses)
// Assume direction = "up" (towards higher track numbers), maxTrack = 199.
function calculateSCAN(initialHead, requests, maxTrack = 199) {
    const sequence = [initialHead];
    let totalMovement = 0;

    // Sort requests
    const reqs = [...requests].sort((a, b) => a - b);

    // Split into left (smaller than head) and right (larger than head)
    const left = reqs.filter(r => r < initialHead).reverse(); // Visit largest first when going down
    const right = reqs.filter(r => r >= initialHead);

    // Moving "up" first
    let currentPos = initialHead;

    // Visit all right
    for (const track of right) {
        totalMovement += Math.abs(currentPos - track);
        currentPos = track;
        sequence.push(currentPos);
    }

    // Go to the end of the disk
    if (right.length > 0 || left.length > 0) { // Only if there's reason to scan
        if (currentPos !== maxTrack) {
            totalMovement += Math.abs(currentPos - maxTrack);
            currentPos = maxTrack;
            sequence.push(currentPos);
        }
    }

    // Reverse direction and visit left
    for (const track of left) {
        totalMovement += Math.abs(currentPos - track);
        currentPos = track;
        sequence.push(currentPos);
    }

    return { sequence, totalMovement };
}

export default function DiskChart({ initialHead, requests, algorithm }) {
    const { sequence, totalMovement, maxTrackDisplay } = useMemo(() => {
        if (!requests || requests.length === 0) return { sequence: [], totalMovement: 0, maxTrackDisplay: 200 };

        // Auto-detect a reasonable bounds for the chart max track
        const highestRequest = Math.max(...requests, initialHead);
        const maxTrack = highestRequest > 199 ? Math.ceil(highestRequest / 100) * 100 : 199;

        let res;
        if (algorithm === 'SSTF') {
            res = calculateSSTF(initialHead, requests);
        } else {
            res = calculateSCAN(initialHead, requests, maxTrack);
        }

        return { ...res, maxTrackDisplay: maxTrack };
    }, [initialHead, requests, algorithm]);

    if (!sequence.length) {
        return (
            <div className="flex h-32 items-center justify-center border border-slate-300 bg-white rounded-sm text-xs text-slate-400">
                Run a Disk Scheduling simulation to see the trace.
            </div>
        );
    }

    // SVG Drawing Metrics
    const height = 400;
    const paddingY = 40;
    const usableHeight = height - (paddingY * 2);
    const stepY = usableHeight / (sequence.length > 1 ? sequence.length - 1 : 1);

    // Convert track number to X percentage
    const getX = (track) => `${(track / maxTrackDisplay) * 100}%`;
    const getY = (index) => paddingY + (index * stepY);

    return (
        <div className="space-y-6">
            <div className="w-full border border-slate-300 bg-white p-6 rounded-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Disk Head Trace
                    </h3>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 border border-slate-200 rounded-sm">
                        Total Seek Movement: <span className="text-slate-900">{totalMovement}</span> tracks
                    </span>
                </div>

                <div className="relative w-full border border-slate-200 bg-slate-50/50 rounded-sm" style={{ height: `${height}px` }}>

                    {/* X-Axis Grid lines and labels (0, 50, 100, etc.) */}
                    {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                        const val = Math.round(pct * maxTrackDisplay);
                        return (
                            <div key={val} className="absolute top-0 bottom-0 border-l border-slate-200 border-dashed z-0" style={{ left: `${pct * 100}%` }}>
                                <span className="absolute -top-5 -translate-x-1/2 text-[10px] text-slate-400 font-mono bg-white px-1 leading-none">{val}</span>
                            </div>
                        )
                    })}

                    {/* SVG Line Trace */}
                    <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" style={{ pointerEvents: 'none' }}>
                        <polyline
                            fill="none"
                            stroke="#cbd5e1" // slate-300
                            strokeWidth="1"
                            points={sequence.map((track, i) => `${(track / maxTrackDisplay) * 100}%,${getY(i)}`).join(' ')}
                        />
                    </svg>

                    {/* Points and Tooltips rendered as HTML for exact positioning and z-index */}
                    {sequence.map((track, i) => (
                        <div
                            key={`point-${i}`}
                            className="absolute w-2 h-2 -ml-1 -mt-1 bg-slate-700 rounded-none z-20 group cursor-pointer" // Sharp corners: rounded-none
                            style={{ left: getX(track), top: `${getY(i)}px` }}
                        >
                            {/* Tooltip bubble on hover */}
                            <div className="absolute left-1/2 bottom-full mb-1 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-0.5 px-2 rounded-sm pointer-events-none whitespace-nowrap">
                                Step {i}: Track {track}
                            </div>

                            {/* Persistent number label for the points */}
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono font-medium pointer-events-none">
                                {track}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
