import { Trash2 } from 'lucide-react';

export default function ProcessTable({ processes, onDelete }) {
    if (processes.length === 0) {
        return (
            <p className="py-6 text-center text-xs text-slate-400">
                No processes added yet.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Arrival</th>
                        <th className="py-2 pr-4">Burst</th>
                        <th className="py-2 w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    {processes.map((proc) => (
                        <tr
                            key={proc.id}
                            className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                        >
                            <td className="py-2 pr-4 font-medium text-slate-700">
                                {proc.name}
                            </td>
                            <td className="py-2 pr-4 text-slate-600">{proc.arrival}</td>
                            <td className="py-2 pr-4 text-slate-600">{proc.burst}</td>
                            <td className="py-2">
                                <button
                                    onClick={() => onDelete(proc.id)}
                                    className="text-slate-300 transition-colors hover:text-red-500 cursor-pointer"
                                    aria-label={`Delete ${proc.name}`}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
