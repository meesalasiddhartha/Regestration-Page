import { ProgressBarProps } from '../types'

interface Step {
    number: number
    label: string
}

const ProgressBar = ({ currentStep }: ProgressBarProps) => {
    const steps: Step[] = [
        { number: 1, label: 'Registration' },
        { number: 2, label: 'Assessment' },
        { number: 3, label: 'Completed' }
    ]

    return (
        <div className="w-full">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${currentStep >= step.number
                                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg scale-110'
                                    : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {currentStep > step.number ? (
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span
                                className={`mt-2 text-sm font-semibold transition-colors duration-300 ${currentStep >= step.number
                                    ? 'text-primary-700'
                                    : 'text-gray-400'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-1 mx-2 mb-8">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${currentStep > step.number
                                        ? 'bg-gradient-to-r from-primary-600 to-primary-700'
                                        : 'bg-gray-200'
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-700 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />
            </div>
        </div>
    )
}

export default ProgressBar
