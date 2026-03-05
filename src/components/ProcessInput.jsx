import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function ProcessInput({ onAdd }) {
    const [name, setName] = useState('');
    const [arrival, setArrival] = useState('');
    const [burst, setBurst] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName || arrival === '' || burst === '') return;

        onAdd({
            id: Date.now(),
            name: trimmedName,
            arrival: Number(arrival),
            burst: Number(burst),
        });

        setName('');
        setArrival('');
        setBurst('');
    };

    const inputClass =
        'w-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-accent rounded-sm';

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Add Process
            </h2>

            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className="mb-1 block text-xs text-slate-500">Name</label>
                    <input
                        type="text"
                        placeholder="P1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-slate-500">Arrival</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={arrival}
                        onChange={(e) => setArrival(e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-slate-500">Burst</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="4"
                        value={burst}
                        onChange={(e) => setBurst(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>

            <button
                type="submit"
                className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100 rounded-sm cursor-pointer"
            >
                <Plus size={14} />
                Add Process
            </button>
        </form>
    );
}
