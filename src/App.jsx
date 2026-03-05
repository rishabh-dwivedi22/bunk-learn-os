import { useState, useEffect, useRef, useCallback } from 'react';
import { Cpu, HardDrive, MemoryStick, Play, Pause, RotateCcw } from 'lucide-react';

import ProcessInput from './components/ProcessInput';
import ProcessTable from './components/ProcessTable';
import GanttChart from './components/GanttChart';
import MemoryGrid from './components/MemoryGrid';
import DiskChart from './components/DiskChart';

import {
    calculateFCFS,
    calculateSJF_NonPreemptive,
    calculateRoundRobin,
} from './utils/SchedulerLogic';

export default function App() {
    const [activeTab, setActiveTab] = useState('CPU');

    // --- CPU STATE ---
    const [processes, setProcesses] = useState([
        { id: 'P1', arrivalTime: 0, burstTime: 4 },
        { id: 'P2', arrivalTime: 1, burstTime: 3 },
        { id: 'P3', arrivalTime: 2, burstTime: 1 }
    ]);
    const [cpuAlgo, setCpuAlgo] = useState('FCFS');
    const [cpuResults, setCpuResults] = useState([]);
    const [revealedCount, setRevealedCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef(null);

    // --- MEMORY STATE ---
    const [partitions, setPartitions] = useState([
        { id: 'P1', size: 100 }, { id: 'P2', size: 500 }, { id: 'P3', size: 200 }, { id: 'P4', size: 300 }, { id: 'P5', size: 600 }
    ]);
    const [memRequests, setMemRequests] = useState([
        { id: 'R1', size: 212 }, { id: 'R2', size: 417 }, { id: 'R3', size: 112 }, { id: 'R4', size: 426 }
    ]);
    const [memAlgo, setMemAlgo] = useState('FirstFit');

    // --- DISK STATE ---
    const [initialHead, setInitialHead] = useState(50);
    const [trackRequests, setTrackRequests] = useState([98, 183, 37, 122, 14, 124, 65, 67]);
    const [diskAlgo, setDiskAlgo] = useState('SSTF');

    const [simResults, setSimResults] = useState(false);


    // CPU Simulation Effects
    useEffect(() => {
        if (processes.length > 0) {
            if (cpuAlgo === 'FCFS') setCpuResults(calculateFCFS(processes));
            else if (cpuAlgo === 'SJF') setCpuResults(calculateSJF_NonPreemptive(processes));
            else if (cpuAlgo === 'RR') setCpuResults(calculateRoundRobin(processes, 2));
        } else {
            setCpuResults([]);
        }
        handleReset();
    }, [processes, cpuAlgo]);

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setRevealedCount(prev => {
                    if (prev >= cpuResults.length) {
                        setIsPlaying(false);
                        clearInterval(timerRef.current);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 800);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, cpuResults.length]);

    const handlePlay = useCallback(() => {
        if (cpuResults.length > 0) setIsPlaying(true);
    }, [cpuResults]);

    const handlePause = useCallback(() => setIsPlaying(false), []);
    const handleReset = useCallback(() => {
        setIsPlaying(false);
        setRevealedCount(0);
        clearInterval(timerRef.current);
    }, []);

    const addProcess = (proc) => setProcesses((prev) => [...prev, { id: proc.name, arrivalTime: proc.arrival, burstTime: proc.burst }]);
    const deleteProcess = (id) => setProcesses((prev) => prev.filter((p) => p.id !== id));

    const TABS = [
        { id: 'CPU', label: 'CPU Scheduling', icon: <Cpu size={16} /> },
        { id: 'Memory', label: 'Memory Allocation', icon: <MemoryStick size={16} /> },
        { id: 'Disk', label: 'Disk Scheduling', icon: <HardDrive size={16} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
            {/* ── Top Nav ── */}
            <header className="flex items-center gap-4 border-b border-slate-300 bg-white px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-800 text-white flex items-center justify-center rounded-sm">
                        <Cpu size={18} />
                    </div>
                    <h1 className="text-sm font-semibold tracking-wide text-slate-900">
                        Bunk &amp; Learn OS
                    </h1>
                </div>

                {/* Tabs */}
                <nav className="ml-10 flex gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); handleReset(); }}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded-sm border ${activeTab === tab.id
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </header>

            {/* ── Main Workspace ── */}
            <main className="flex flex-1 flex-col lg:flex-row p-6 gap-6 max-w-7xl w-full mx-auto">

                {/* === CPU VIEW === */}
                {activeTab === 'CPU' && (
                    <>
                        <aside className="w-full lg:w-80 border border-slate-300 bg-white p-5 rounded-sm flex-shrink-0 self-start">
                            <div className="mb-6">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Algorithm</label>
                                <select
                                    value={cpuAlgo}
                                    onChange={e => setCpuAlgo(e.target.value)}
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 rounded-sm"
                                >
                                    <option value="FCFS">First-Come, First-Served (FCFS)</option>
                                    <option value="SJF">Shortest Job First (Non-Preemptive)</option>
                                    <option value="RR">Round Robin (TQ=2)</option>
                                </select>
                            </div>
                            <ProcessInput onAdd={addProcess} />
                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <ProcessTable processes={processes.map(p => ({ id: p.id, name: p.id, arrival: p.arrivalTime, burst: p.burstTime }))} onDelete={deleteProcess} />
                            </div>
                        </aside>

                        <section className="flex-1 space-y-6">
                            <div className="flex items-center justify-between border border-slate-300 bg-white p-4 rounded-sm">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Simulation Controls</h2>
                                <div className="flex gap-2">
                                    {!isPlaying ? (
                                        <button onClick={handlePlay} className="inline-flex items-center gap-1.5 border border-indigo-600 bg-indigo-600 text-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-indigo-700 transition-colors rounded-sm cursor-pointer disabled:opacity-50">
                                            <Play size={14} /> Play
                                        </button>
                                    ) : (
                                        <button onClick={handlePause} className="inline-flex items-center gap-1.5 border border-slate-300 bg-white text-slate-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 transition-colors rounded-sm cursor-pointer">
                                            <Pause size={14} /> Pause
                                        </button>
                                    )}
                                    <button onClick={handleReset} className="inline-flex items-center gap-1.5 border border-slate-300 bg-white text-slate-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 transition-colors rounded-sm cursor-pointer">
                                        <RotateCcw size={14} /> Reset
                                    </button>
                                </div>
                            </div>

                            <GanttChart results={cpuResults} revealedCount={revealedCount} />

                            {/* CPU Results Map */}
                            <div className="border border-slate-300 bg-white p-6 rounded-sm">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Final Turnaround & Waiting Times</h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                                            <th className="py-2 pr-4">Proc</th>
                                            <th className="py-2 pr-4">Arr</th>
                                            <th className="py-2 pr-4">Burst</th>
                                            <th className="py-2 pr-4">Comp</th>
                                            <th className="py-2 pr-4">TAT</th>
                                            <th className="py-2">WT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Reduce results to unique processes for the recap table */}
                                        {Object.values(cpuResults.reduce((acc, curr) => {
                                            if (!curr.isIdle) acc[curr.id] = curr; return acc;
                                        }, {})).map((r, i) => (
                                            <tr key={i} className="border-b border-slate-100">
                                                <td className="py-2 pr-4 font-medium text-slate-700">{r.id}</td>
                                                <td className="py-2 pr-4 text-slate-600">{r.arrivalTime}</td>
                                                <td className="py-2 pr-4 text-slate-600">{r.burstTime}</td>
                                                <td className="py-2 pr-4 text-slate-600">{r.finalCompletion || r.completionTime}</td>
                                                <td className="py-2 pr-4 text-slate-600 font-medium">{r.turnaroundTime}</td>
                                                <td className="py-2 text-slate-600 font-medium">{r.waitingTime}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}

                {/* === MEMORY VIEW === */}
                {activeTab === 'Memory' && (
                    <>
                        <aside className="w-full lg:w-80 border border-slate-300 bg-white p-5 rounded-sm flex-shrink-0 self-start">
                            <div className="mb-6">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Allocation Algorithm</label>
                                <select
                                    value={memAlgo}
                                    onChange={e => setMemAlgo(e.target.value)}
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 rounded-sm"
                                >
                                    <option value="FirstFit">First Fit</option>
                                    <option value="BestFit">Best Fit</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Memory Partitions (KB)</h3>
                                    <div className="text-sm font-mono text-slate-600 bg-slate-50 p-3 border border-slate-200 rounded-sm">
                                        {partitions.map(p => p.size).join(', ')}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Process Requests (KB)</h3>
                                    <div className="text-sm font-mono text-slate-600 bg-slate-50 p-3 border border-slate-200 rounded-sm">
                                        {memRequests.map(r => `${r.id}(${r.size})`).join(', ')}
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400 italic">
                                Note: Editing inputs dynamically will be supported in Phase 4. Using fixed dataset for visualization preview.
                            </p>
                        </aside>
                        <section className="flex-1">
                            <MemoryGrid partitions={partitions} requests={memRequests} algorithm={memAlgo} />
                        </section>
                    </>
                )}

                {/* === DISK VIEW === */}
                {activeTab === 'Disk' && (
                    <>
                        <aside className="w-full lg:w-80 border border-slate-300 bg-white p-5 rounded-sm flex-shrink-0 self-start">
                            <div className="mb-6">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Disk Algorithm</label>
                                <select
                                    value={diskAlgo}
                                    onChange={e => setDiskAlgo(e.target.value)}
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 rounded-sm"
                                >
                                    <option value="SSTF">Shortest Seek Time First (SSTF)</option>
                                    <option value="SCAN">SCAN (Elevator)</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Initial Head Position</h3>
                                    <div className="text-sm font-mono text-slate-600 bg-slate-50 p-3 border border-slate-200 rounded-sm">
                                        {initialHead}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Track Request Queue</h3>
                                    <div className="text-sm font-mono text-slate-600 bg-slate-50 p-3 border border-slate-200 rounded-sm">
                                        {trackRequests.join(' → ')}
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400 italic">
                                Note: Editing inputs dynamically will be supported in Phase 4. Using fixed dataset for visualization preview.
                            </p>
                        </aside>
                        <section className="flex-1">
                            <DiskChart initialHead={initialHead} requests={trackRequests} algorithm={diskAlgo} />
                        </section>
                    </>
                )}

            </main>
        </div>
    );
}
