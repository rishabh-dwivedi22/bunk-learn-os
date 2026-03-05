import React, { useState, useEffect } from 'react';

// FirstFit: Allocates the first hole that is big enough.
function calculateFirstFit(partitions, requests) {
    const mem = [...partitions].map(p => ({ ...p, used: 0, allocations: [] }));
    const results = [];

    for (const req of requests) {
        let allocated = false;
        for (let i = 0; i < mem.length; i++) {
            if (mem[i].size - mem[i].used >= req.size) {
                mem[i].used += req.size;
                mem[i].allocations.push(req);
                results.push({ ...req, allocatedTo: mem[i].id, success: true });
                allocated = true;
                break;
            }
        }
        if (!allocated) {
            results.push({ ...req, allocatedTo: null, success: false });
        }
    }
    return { memory: mem, results };
}

// BestFit: Allocates the smallest hole that is big enough.
function calculateBestFit(partitions, requests) {
    const mem = [...partitions].map(p => ({ ...p, used: 0, allocations: [] }));
    const results = [];

    for (const req of requests) {
        let bestIdx = -1;
        let minDiff = Infinity;

        for (let i = 0; i < mem.length; i++) {
            const remaining = mem[i].size - mem[i].used;
            if (remaining >= req.size && remaining < minDiff) {
                minDiff = remaining;
                bestIdx = i;
            }
        }

        if (bestIdx !== -1) {
            mem[bestIdx].used += req.size;
            mem[bestIdx].allocations.push(req);
            results.push({ ...req, allocatedTo: mem[bestIdx].id, success: true });
        } else {
            results.push({ ...req, allocatedTo: null, success: false });
        }
    }
    return { memory: mem, results };
}

const COLORS = [
    'bg-emerald-600',
    'bg-blue-600',
    'bg-indigo-600',
    'bg-violet-600',
    'bg-fuchsia-600',
];

export default function MemoryGrid({ partitions, requests, algorithm }) {
    const [allocationData, setAllocationData] = useState({ memory: [], results: [] });

    useEffect(() => {
        if (!partitions.length || !requests.length) return;

        if (algorithm === 'FirstFit') {
            setAllocationData(calculateFirstFit(partitions, requests));
        } else {
            setAllocationData(calculateBestFit(partitions, requests));
        }
    }, [partitions, requests, algorithm]);

    const { memory, results } = allocationData;

    if (!memory.length) {
        return (
            <div className="flex h-32 items-center justify-center border border-slate-300 bg-white rounded-sm text-xs text-slate-400">
                Run a Memory Allocation simulation to see the blocks here.
            </div>
        );
    }

    // To draw blocks relative to total memory size
    const totalMemory = memory.reduce((sum, p) => sum + p.size, 0);

    return (
        <div className="space-y-6">
            <div className="w-full border border-slate-300 bg-white p-6 rounded-sm">
                <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    RAM Layout ({totalMemory} KB)
                </h3>

                <div className="flex w-full h-24 bg-slate-100 rounded-sm overflow-hidden border border-slate-300">
                    {memory.map((part, idx) => {
                        const widthPct = (part.size / totalMemory) * 100;
                        const remaining = part.size - part.used;

                        return (
                            <div
                                key={part.id}
                                className="relative flex flex-col border-r border-slate-300 bg-slate-200"
                                style={{ width: `${widthPct}%` }}
                            >
                                {/* Partition Header */}
                                <div className="absolute -top-6 w-full text-center text-[10px] text-slate-500 font-mono border-b border-transparent">
                                    {part.id} ({part.size}K)
                                </div>

                                {/* Allocated sections */}
                                {part.allocations.map((alloc, aIdx) => {
                                    const allocPct = (alloc.size / part.size) * 100;
                                    const color = COLORS[parseInt(alloc.id.replace('R', '')) % COLORS.length] || 'bg-slate-700';

                                    return (
                                        <div
                                            key={`${alloc.id}-${aIdx}`}
                                            className={`h-full ${color} text-white text-[10px] font-medium flex items-center justify-center border-r border-black/10`}
                                            style={{ width: `${allocPct}%`, position: 'absolute', left: `${(part.used - part.allocations.slice(aIdx).reduce((s, a) => s + a.size, 0)) / part.size * 100}%` }} // Approximate stacking 
                                            title={`${alloc.id}: ${alloc.size}KB`}
                                        >
                                            {alloc.id}
                                        </div>
                                    );
                                })}

                                {/* Visual hack for flex stacking within the absolute positioning above: We use standard flex columns to stack horizontally */}
                                <div className="flex w-full h-full">
                                    {part.allocations.map((alloc, aIdx) => {
                                        const allocPct = (alloc.size / part.size) * 100;
                                        const color = COLORS[parseInt(alloc.id.replace('R', '')) % COLORS.length] || 'bg-slate-700';

                                        return (
                                            <div
                                                key={`flex-${alloc.id}-${aIdx}`}
                                                className={`h-full ${color} text-white font-medium flex items-center justify-center border-r border-black/10 transition-all`}
                                                style={{ width: `${allocPct}%` }}
                                                title={`${alloc.id}: ${alloc.size}KB`}
                                            >
                                                <span className="text-[10px]">{alloc.id}</span>
                                            </div>
                                        )
                                    })}

                                    {/* Free space indicator */}
                                    {remaining > 0 && (
                                        <div
                                            className="h-full bg-transparent flex items-center justify-center transition-all"
                                            style={{ width: `${(remaining / part.size) * 100}%` }}
                                            title={`Free: ${remaining}KB`}
                                        >
                                            <span className="text-[10px] text-slate-400 italic">{remaining}K</span>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Allocation Status Table */}
            {results.length > 0 && (
                <div className="w-full border border-slate-300 bg-white p-6 rounded-sm">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Allocation Results
                    </h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                                <th className="py-2 pr-4">Request</th>
                                <th className="py-2 pr-4">Size (KB)</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2">Allocated To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r, i) => (
                                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-2 pr-4 font-medium text-slate-700">{r.id}</td>
                                    <td className="py-2 pr-4 text-slate-600">{r.size}</td>
                                    <td className="py-2 pr-4">
                                        {r.success ? (
                                            <span className="text-emerald-600 font-medium">Success</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Failed</span>
                                        )}
                                    </td>
                                    <td className="py-2 text-slate-600">
                                        {r.allocatedTo || <span className="text-slate-400 italic">Not fit</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
