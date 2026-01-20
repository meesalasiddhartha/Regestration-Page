import { useState } from 'react'
import './index.css'
import ProgressBar from './components/ProgressBar'
import RegistrationStep from './components/RegistrationStep'
import AssessmentStep from './components/AssessmentStep'
import SuccessStep from './components/SuccessStep'
import CourseSelection from './components/CourseSelection'
import { StudentData, Answer } from './types'

function App() {
    const [currentStep, setCurrentStep] = useState<number>(0) // Start at 0 for selection
    const [programType, setProgramType] = useState<'cohort' | 'ondemand' | 'workshop'>('cohort')
    const [registrationData, setRegistrationData] = useState<StudentData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        collegeName: '',
        yearOfPassing: '',
        branch: '',
        selectedSlot: '',
        sessionTime: '',
        mode: '',
        programType: 'cohort' // Initial value
    })
    const [assessmentAnswers, setAssessmentAnswers] = useState<Answer>({})

    const handleCourseSelect = (type: 'cohort' | 'ondemand' | 'workshop') => {
        setProgramType(type)
        setRegistrationData(prev => ({ ...prev, programType: type }))
        setCurrentStep(1)
    }

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
                    <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-3">
                        OttoLearn
                    </h1>
                </div>

                {/* Progress Bar - Only show if currentStep > 0 */}
                {currentStep > 0 && <ProgressBar currentStep={currentStep} />}

                {/* Step Content */}
                <div className="mt-12">
                    {currentStep === 0 && (
                        <CourseSelection onSelect={handleCourseSelect} />
                    )}
                    {currentStep === 1 && (
                        <RegistrationStep
                            onSubmit={handleRegistrationSubmit}
                            programType={programType}
                        />
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
                    <p>© 2026 OttoLearn. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default App
