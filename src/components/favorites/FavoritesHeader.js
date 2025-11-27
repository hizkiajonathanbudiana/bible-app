"use client";
import { useRouter } from "next/navigation";

export default function FavoritesHeader({ count, onAdd, speed, setSpeed }) {
    const router = useRouter();

    return (
        <div className="bg-white shadow px-6 py-4 sticky top-0 z-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Vocabulary</h1>
                <p className="text-sm text-gray-500">{count} words collected</p>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
                {/* SPEED CONTROL */}
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Speed</span>
                    <input
                        type="range" min="0.1" max="2.0" step="0.1"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        className="w-20 md:w-24 accent-blue-600 h-1.5 bg-gray-300 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-bold text-blue-600 w-6 text-right font-mono">{speed}x</span>
                </div>

                <div className="h-6 w-[1px] bg-gray-300 hidden md:block"></div>

                <div className="flex gap-2">
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        Back
                    </button>
                    <button
                        onClick={onAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-sm"
                    >
                        <span>+</span> Add
                    </button>
                </div>
            </div>
        </div>
    );
}