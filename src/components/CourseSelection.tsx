import { useState } from 'react'

interface CourseSelectionProps {
    onSelect: (type: 'cohort' | 'ondemand' | 'workshop') => void
}

const CourseSelection = ({ onSelect }: CourseSelectionProps) => {
    const [selected, setSelected] = useState<'cohort' | 'ondemand' | 'workshop'>('cohort')

    const handleSubmit = () => {
        onSelect(selected)
    }

    return (
        <div className="animate-fadeIn">
            <div className="card max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Select Your Program
                    </h2>
                    <p className="text-gray-600">
                        Choose the learning path that best fits your goals
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Cohort Option */}
                    <div
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-indigo-400 ${selected === 'cohort' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                        onClick={() => setSelected('cohort')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-bold ${selected === 'cohort' ? 'text-indigo-900' : 'text-gray-900'}`}>Cohort Program</h3>
                                <p className={`text-sm ${selected === 'cohort' ? 'text-indigo-700' : 'text-gray-500'}`}>Live sessions, mentorship, and peer learning.</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === 'cohort' ? 'border-indigo-600' : 'border-gray-400'}`}>
                                {selected === 'cohort' && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                            </div>
                        </div>
                    </div>

                    {/* On-Demand Option */}
                    <div
                        className={`p-6 rounded-xl border-2 transition-all cursor-not-allowed border-gray-200 bg-gray-50 opacity-60 grayscale`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-gray-500">On-Demand Learning</h3>
                                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
                                </div>
                                <p className="text-sm text-gray-400">Learn at your own pace with recorded content.</p>
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            </div>
                        </div>
                    </div>

                    {/* Workshop Option */}
                    <div
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-indigo-400 ${selected === 'workshop' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                        onClick={() => setSelected('workshop')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-bold ${selected === 'workshop' ? 'text-indigo-900' : 'text-gray-900'}`}>Workshop</h3>
                                <p className={`text-sm ${selected === 'workshop' ? 'text-indigo-700' : 'text-gray-500'}`}>Intensive short-term learning sessions.</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === 'workshop' ? 'border-indigo-600' : 'border-gray-400'}`}>
                                {selected === 'workshop' && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleSubmit}
                        className="btn-primary w-full"
                    >
                        Continue
                        <svg
                            className="inline-block ml-2 w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CourseSelection
