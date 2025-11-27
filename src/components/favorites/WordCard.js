export default function WordCard({ word, onPlay, onEdit, onDelete }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition relative group">
            <div className="flex justify-between items-start">
                <div className="w-full pr-10">
                    {/* Hanzi & Pinyin & Speaker */}
                    <div className="flex items-center gap-3 mb-2">
                        {/* Tombol Speaker */}
                        <button
                            onClick={() => onPlay(word.text)}
                            className="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-600 hover:text-white transition shadow-sm active:scale-95 flex-shrink-0"
                            title="Play Audio"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <div>
                            <h2
                                className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition"
                                onClick={() => onPlay(word.text)}
                            >
                                {word.text}
                            </h2>
                            <p className="text-blue-500 font-serif font-medium leading-none">{word.pinyin}</p>
                        </div>
                    </div>

                    {/* Main Translation */}
                    <p className="text-gray-800 text-lg font-serif mb-3 capitalize pl-1">
                        {word.translation || "No definition."}
                    </p>

                    {/* Details (Verb, Noun, etc) */}
                    {word.definitionDetails && word.definitionDetails.length > 0 && (
                        <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {word.definitionDetails.map((def, idx) => (
                                <div key={idx} className="text-sm">
                                    <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded mr-2 align-middle">
                                        {def.type}
                                    </span>
                                    <span className="text-gray-600">{def.meanings.join(", ")}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="text-xs text-gray-300 mt-3 pl-1">
                        {word.updatedAt ? "Updated" : "Saved"}: {new Date(word.updatedAt || word.savedAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Action Buttons (Absolute Top Right) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(word)}
                        className="text-gray-300 hover:text-blue-500 p-1.5 rounded-full hover:bg-blue-50 transition"
                        title="Edit Word"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete(word)}
                        className="text-gray-300 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition"
                        title="Remove Word"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}