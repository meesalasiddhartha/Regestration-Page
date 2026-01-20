import { SuccessStepProps } from '../types'

const SuccessStep = ({ studentData }: SuccessStepProps) => {
    return (
        <div className="animate-fadeIn">
            <div className="card max-w-2xl mx-auto text-center">
                {/* Success Icon */}
                <div className="mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce-slow">
                        <svg
                            className="w-12 h-12 text-white"
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
                    </div>
                </div>

                {/* Success Message */}
                {studentData.programType === 'cohort' ? (
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Assessment Submitted Successfully!
                    </h2>
                ) : (
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Registration Completed Successfully!
                    </h2>
                )}

                {studentData.programType === 'cohort' ? (
                    <p className="text-lg text-gray-600 mb-8">
                        Thank you, <span className="font-semibold text-primary-700">{studentData.fullName}</span>, for completing the entrance assessment.
                    </p>
                ) : (
                    <p className="text-lg text-gray-600 mb-8">
                        Thank you, <span className="font-semibold text-primary-700">{studentData.fullName}</span>, for completing your registration.
                    </p>
                )}

                {/* Information Card */}
                {studentData.programType === 'cohort' ? (
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8 text-left">
                        <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center">
                            <svg
                                className="w-6 h-6 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            What Happens Next?
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <svg
                                    className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Our team will carefully review your responses</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>You'll receive an email at <strong>{studentData.email}</strong> within 3-5 business days</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586..."
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>If selected, you'll receive enrollment instructions and next steps</span>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8 text-left">
                        <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center">
                            <svg
                                className="w-6 h-6 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            What Happens Next?
                        </h3>
                        <p className="text-gray-700">You’ll receive enrollment instructions and next steps.</p>
                    </div>
                )}

                {/* Reassurance Message */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-6 mb-8">
                    <p className="text-lg font-semibold mb-2">
                        We're Excited to Review Your Application!
                    </p>
                    <p className="text-primary-100">
                        Your thoughtful responses help us understand your goals and ensure
                        this course is the right fit for your learning journey.
                    </p>
                </div>

                {/* Additional Information */}
                <div className="text-sm text-gray-500 space-y-2">
                    <p>
                        <strong>Tip:</strong> Check your spam folder if you don't see our email in your inbox.
                    </p>

                </div>



            </div>
        </div>
    )
}

export default SuccessStep
