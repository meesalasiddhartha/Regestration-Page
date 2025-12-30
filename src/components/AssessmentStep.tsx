import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { AssessmentStepProps, Question, Answer, FormErrors } from '../types'

const AssessmentStep = ({ onSubmit, studentData }: AssessmentStepProps) => {
    const [questions, setQuestions] = useState<Question[]>([])
    const [answers, setAnswers] = useState<Answer>({})
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Timer: Ref to store start time (initialized on mount)
    const startTimeRef = useRef<number>(Date.now())

    // DEBUG: Verify component mount
    useEffect(() => {
        alert("System Update: Time tracking enabled.")
    }, [])

    // Fetch questions from Supabase on component mount
    useEffect(() => {
        // Reset start time when component actually mounts/effect runs
        startTimeRef.current = Date.now()

        const fetchQuestions = async (): Promise<void> => {
            try {
                console.log('Fetching questions from Supabase...')

                const { data, error } = await supabase
                    .from('questions')
                    .select('*')
                    .eq('is_active', true)
                    .order('question_number', { ascending: true })

                console.log('Questions response:', { data, error })

                if (error) {
                    console.error('Supabase error:', error)
                    throw error
                }

                if (!data || data.length === 0) {
                    console.warn('No questions found in database')
                    setErrors({ fetch: 'No questions found. Please add questions to the database.' })
                    setIsLoading(false)
                    return
                }

                console.log(`Loaded ${data.length} questions`)

                // Interleave questions: 3 MCQ followed by 2 Text
                const mcqs = data.filter(q => q.question_type === 'mcq')
                const texts = data.filter(q => q.question_type === 'text')

                const interleaved: Question[] = []
                let mcqIdx = 0
                let textIdx = 0

                while (mcqIdx < mcqs.length || textIdx < texts.length) {
                    // Add up to 3 MCQs
                    for (let i = 0; i < 3 && mcqIdx < mcqs.length; i++) {
                        interleaved.push(mcqs[mcqIdx++])
                    }
                    // Add up to 2 Text questions
                    for (let i = 0; i < 2 && textIdx < texts.length; i++) {
                        interleaved.push(texts[textIdx++])
                    }
                }

                setQuestions(interleaved)

                // Initialize answers object using interleaved list
                const initialAnswers: Answer = interleaved.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {})
                setAnswers(initialAnswers)
            } catch (error) {
                console.error('Error fetching questions:', error)
                setErrors({ fetch: `Failed to load questions: ${(error as Error).message}. Please check your database.` })
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuestions()
    }, [])

    const handleAnswerChange = (questionId: number, value: string): void => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }))

        // Clear error when user starts typing/selecting
        if (errors[questionId]) {
            setErrors(prev => ({
                ...prev,
                [questionId]: ''
            }))
        }
    }

    const validateAnswers = (): boolean => {
        const newErrors: FormErrors = {}

        questions.forEach(q => {
            const answer = answers[q.id]?.trim()

            if (!answer) {
                newErrors[q.id] = 'This question requires an answer'
            } else if (q.question_type === 'text' && answer.length < 50) {
                // Only text questions need minimum 50 characters
                newErrors[q.id] = 'Please provide a more detailed answer (minimum 50 characters)'
            }
            // MCQ questions just need a selection (already validated by !answer check above)
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        if (!validateAnswers()) {
            // Scroll to first error
            const firstErrorId = Object.keys(errors)[0]
            const element = document.getElementById(`ans_${firstErrorId}`)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            return
        }

        // Critical Check: Ensure we have a student ID to link answers to
        if (!studentData?.id) {
            console.error('CRITICAL ERROR: specific student ID is missing from state.', studentData)
            setErrors({
                submit: 'System Error: Student identification missing. Please refresh the page and register again.'
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        setIsSubmitting(true)
        console.log('Submitting assessment for Student ID:', studentData.id)

        try {
            // Calculate duration in seconds
            const now = Date.now()
            const start = startTimeRef.current
            let durationSeconds = Math.floor((now - start) / 1000)

            // Safety check
            if (isNaN(durationSeconds) || durationSeconds < 0) {
                durationSeconds = 0
            }

            // DEBUG ALERT (Remove in production)
            alert(`Debug: Submitting assessment.\\nTime taken: ${durationSeconds} seconds`)
            console.log(`Assessment duration: ${durationSeconds} seconds (Start: ${start}, End: ${now})`)

            // Step 1: Create submission record first
            const { data: submissionData, error: submissionError } = await supabase
                .from('submissions')
                .insert([{
                    student_id: studentData.id,
                    total_questions: questions.length,
                    duration_seconds: durationSeconds
                }])
                .select()
                .single()

            if (submissionError) {
                console.error('Submission table error:', submissionError)
                throw new Error(`Failed to create submission record: ${submissionError.message}`)
            }

            console.log('Submission created:', submissionData)

            // Step 2: Insert each answer
            const answerRows = questions.map((question) => {
                const baseRow: Record<string, any> = {
                    student_id: studentData.id,
                    question_id: question.id,
                    student_name: studentData.fullName || 'Unknown',
                    student_email: studentData.email || 'unknown@email.com',
                    question_number: question.question_number,
                    question_text: question.question_text,
                    answer_text: answers[question.id] || ''
                }

                // Add submission_id if available
                if (submissionData?.id) {
                    baseRow.submission_id = submissionData.id
                }

                return baseRow
            })

            console.log('Inserting answers batch:', answerRows.length, 'rows')

            const { error: answersError } = await supabase
                .from('student_answers')
                .insert(answerRows)

            if (answersError) {
                console.error('Student Answers table error:', answersError)
                throw new Error(`Failed to save answers: ${answersError.message}`)
            }

            console.log('Answers inserted successfully!')

            // Success - proceed to next step
            onSubmit(answers)
        } catch (error) {
            console.error('Error submitting assessment:', error)
            setErrors({
                submit: `Error: ${(error as Error).message}`
            })
            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const getAnsweredCount = (): number => {
        return Object.values(answers).filter(a => a.trim().length > 0).length
    }

    // Show loading state while fetching questions
    if (isLoading) {
        return (
            <div className="animate-fadeIn">
                <div className="card max-w-4xl mx-auto text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-gray-600">Loading questions...</p>
                </div>
            </div>
        )
    }

    // Show error if questions failed to load
    if (errors.fetch) {
        return (
            <div className="animate-fadeIn">
                <div className="card max-w-4xl mx-auto text-center py-12">
                    <p className="text-red-600 mb-4">{errors.fetch}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fadeIn">
            <div className="card max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Entrance Assessment (Timed)
                    </h2>

                    {/* Warning Note */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 font-medium">
                                    Don't refresh the page as your responses may be lost. Maintain a stable network connection throughout the exam.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                        Welcome, <span className="font-semibold text-primary-700">{studentData?.fullName || 'Student'}</span>!
                        Please answer the following questions thoughtfully. Your responses will be manually reviewed by our team.
                        <br />
                        <br />
                        For text questions, write 5-10 sentences if possible.
                        <br />
                        <br />
                        We care more about "how you think" than what you know.
                        <br />
                        <br />
                        Try to answer according to "STAR" method:
                        <br />
                        • S: Situation (Specific situation you were in)
                        <br />
                        • T: Task (What is your task in that situation)
                        <br />
                        • A: Action (what action/approach you did)
                        <br />
                        • R: Result (Output whether it is success or failure, what you learnt)
                    </p>
                    <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 mb-4 shadow-md">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-base text-red-700 font-bold">
                                Do not refresh the page as your responses may be lost. And maintain a stable network throughout the test.
                            </p>
                        </div>
                    </div>
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary-900">
                                Progress: {getAnsweredCount()} of {questions.length} questions answered
                            </span>
                            <span className="text-sm text-primary-700">
                                {Math.round((getAnsweredCount() / questions.length) * 100)}%
                            </span>
                        </div>
                        <div className="mt-2 w-full bg-primary-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(getAnsweredCount() / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-primary-300 transition-colors duration-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor={`ans_${question.id}`}
                                        className="block text-base font-semibold text-gray-900 mb-3"
                                    >
                                        {question.question_text}
                                        {question.question_type === 'text' && (
                                            <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                Text Answer
                                            </span>
                                        )}
                                    </label>

                                    {/* Render MCQ options or text area based on question type */}
                                    {question.question_type === 'mcq' && question.mcq_options ? (
                                        <div className="space-y-3">
                                            {question.mcq_options.map((option, optionIndex) => (
                                                <label
                                                    key={optionIndex}
                                                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${answers[question.id] === option
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-gray-300 hover:border-primary-300 bg-white'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        id={`ans_${question.id}_${optionIndex}`}
                                                        name={`answer_${question.id}`}
                                                        value={option}
                                                        checked={answers[question.id] === option}
                                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                        className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <span className="ml-3 text-gray-700">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <textarea
                                                id={`ans_${question.id}`}
                                                name={`answer_${question.id}`}
                                                value={answers[question.id]}
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                className={`textarea-field min-h-[150px] ${errors[question.id] ? 'border-red-500' : ''
                                                    }`}
                                                placeholder="Type your answer here... Be specific and thoughtful in your response."
                                            />
                                            <div className="flex items-center justify-between mt-2">
                                                {errors[question.id] && (
                                                    <p className="error-text">{errors[question.id]}</p>
                                                )}
                                                <span
                                                    className={`text-sm ml-auto ${answers[question.id]?.length >= 50
                                                        ? 'text-green-600'
                                                        : 'text-gray-400'
                                                        }`}
                                                >
                                                    {answers[question.id]?.length || 0} characters
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    {/* Show error for MCQ questions */}
                                    {question.question_type === 'mcq' && errors[question.id] && (
                                        <p className="error-text mt-2">{errors[question.id]}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* General Error Message */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                            <p className="text-red-700 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-6 flex gap-4">
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={getAnsweredCount() === 0 || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="inline-block mr-2 w-5 h-5 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Assessment
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
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Please review your answers before submitting.
                            Your responses will be manually evaluated by our team, and we'll contact you via email.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AssessmentStep
