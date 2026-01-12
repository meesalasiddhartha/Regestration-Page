import { useState } from 'react'
import './index.css'
import ProgressBar from './components/ProgressBar'
import RegistrationStep from './components/RegistrationStep'
import AssessmentStep from './components/AssessmentStep'
import SuccessStep from './components/SuccessStep'
import { StudentData, Answer } from './types'

function App() {
    const [currentStep, setCurrentStep] = useState<number>(1)
    const [registrationData, setRegistrationData] = useState<StudentData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        collegeName: '',
        yearOfPassing: '',
        branch: '',
        selectedSlot: '',
        sessionTime: '',
        mode: ''
    })
    const [assessmentAnswers, setAssessmentAnswers] = useState<Answer>({})

    const handleRegistrationSubmit = (data: StudentData): void => {
        setRegistrationData(data)
        setCurrentStep(2)
    }

    const handleAssessmentSubmit = (answers: Answer): void => {
        setAssessmentAnswers(answers)
        setCurrentStep(3)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-rose-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        OttoLearn
                    </h1>
                    <p className="text-lg text-gray-600">
                        AI Native FullStack Developer
                    </p>
                </div>

                {/* Progress Bar */}
                <ProgressBar currentStep={currentStep} />

                {/* Step Content */}
                <div className="mt-12">
                    {currentStep === 1 && (
                        <RegistrationStep onSubmit={handleRegistrationSubmit} />
                    )}
                    {currentStep === 2 && (
                        <AssessmentStep
                            onSubmit={handleAssessmentSubmit}
                            studentData={registrationData}
                        />
                    )}
                    {currentStep === 3 && (
                        <SuccessStep studentData={registrationData} />
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-16 text-sm text-gray-500">
                    <p>© 2025 OttoLearn. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default App
