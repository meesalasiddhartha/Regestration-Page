// ... (imports remain mostly same, adding useEffect)
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { RegistrationStepProps, RegistrationFormData, FormErrors } from '../types'

const RegistrationStep = ({ onSubmit }: RegistrationStepProps) => {
    const [formData, setFormData] = useState<RegistrationFormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        collegeName: '',
        yearOfPassing: '',
        branch: '',
        selectedSlot: ''
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [availableSlots, setAvailableSlots] = useState<string[]>([])

    // Fetch slots on mount
    useEffect(() => {
        const fetchSlots = async () => {
            const { data, error } = await supabase
                .from('alloted_timeslotes')
                .select('slot_name')
                .order('created_at', { ascending: true }) // Or arbitrary order if date parsing isn't easy

            if (data) {
                // If the DB has dates, we can map them.
                // Assuming DB returns objects like { slot_name: '5th January' }
                setAvailableSlots(data.map((s: any) => s.slot_name))
            } else if (error) {
                console.error('Error fetching slots:', error)
                // Fallback to hardcoded if DB fails or is empty, to keep UI working
                setAvailableSlots(['5th January', '19th January', '2nd February'])
            }
        }
        fetchSlots()
    }, [])

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const validatePhoneNumber = (phone: string): boolean => {
        // Validates 10-digit phone numbers with optional country code
        const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,5}[-\s.]?[0-9]{1,5}$/
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Name must be at least 2 characters'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
        } else if (!validatePhoneNumber(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number (at least 10 digits)'
        }

        if (!formData.collegeName.trim()) {
            newErrors.collegeName = 'College name is required'
        }

        if (!formData.yearOfPassing) {
            newErrors.yearOfPassing = 'Year of passing is required'
        }

        if (!formData.branch.trim()) {
            newErrors.branch = 'Branch is required'
        }

        if (!formData.selectedSlot) {
            newErrors.selectedSlot = 'Please select a slot'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name } = e.target
        setTouched(prev => ({
            ...prev,
            [name]: true
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        // Mark all fields as touched
        setTouched({
            fullName: true,
            email: true,
            phoneNumber: true,
            collegeName: true,
            yearOfPassing: true,
            branch: true,
            selectedSlot: true
        })

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            // 1. Insert student data into Supabase
            const { data, error } = await supabase
                .from('students')
                .insert([
                    {
                        full_name: formData.fullName,
                        email: formData.email,
                        phone_number: formData.phoneNumber,
                        college_name: formData.collegeName,
                        year_of_passing: formData.yearOfPassing,
                        branch: formData.branch,
                        selected_slot: formData.selectedSlot
                    }
                ])
                .select()
                .single()

            if (error) {
                // Handle duplicate email error
                if (error.code === '23505') {
                    setErrors({ email: 'This email is already registered' })
                    setIsSubmitting(false)
                    return
                }
                throw error
            }

            // 2. (Removed) We are no longer adding students to the 'alloted_timeslotes' array via RPC 
            // as per the latest requirements. The 'selected_slot' in the students table is sufficient.

            // Pass student data including ID to parent component
            onSubmit({ ...formData, id: data.id })
        } catch (error) {
            console.error('Error submitting registration:', error)
            setErrors({
                submit: 'An error occurred while submitting. Please try again.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="animate-fadeIn">
            <div className="card max-w-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Student Registration
                    </h2>
                    <p className="text-gray-600">
                        Please provide your information to begin the enrollment process
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="label">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`input-field ${touched.fullName && errors.fullName ? 'border-red-500' : ''
                                }`}
                            placeholder="Enter your full name"
                        />
                        {touched.fullName && errors.fullName && (
                            <p className="error-text">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="label">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`input-field ${touched.email && errors.email ? 'border-red-500' : ''
                                }`}
                            placeholder="your.email@example.com"
                        />
                        {touched.email && errors.email && (
                            <p className="error-text">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phoneNumber" className="label">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`input-field ${touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : ''
                                }`}
                            placeholder="+1 (555) 123-4567"
                        />
                        {touched.phoneNumber && errors.phoneNumber && (
                            <p className="error-text">{errors.phoneNumber}</p>
                        )}
                    </div>

                    {/* College Name */}
                    <div>
                        <label htmlFor="collegeName" className="label">
                            College Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="collegeName"
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`input-field ${touched.collegeName && errors.collegeName ? 'border-red-500' : ''
                                }`}
                            placeholder="Enter your college name"
                        />
                        {touched.collegeName && errors.collegeName && (
                            <p className="error-text">{errors.collegeName}</p>
                        )}
                    </div>

                    {/* Year of Passing */}
                    <div>
                        <label htmlFor="yearOfPassing" className="label">
                            Year of Passing <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="yearOfPassing"
                            name="yearOfPassing"
                            value={formData.yearOfPassing}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`input-field ${touched.yearOfPassing && errors.yearOfPassing ? 'border-red-500' : ''
                                }`}
                        >
                            <option value="">Select year</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                        {touched.yearOfPassing && errors.yearOfPassing && (
                            <p className="error-text">{errors.yearOfPassing}</p>
                        )}
                    </div>

                    {/* Majors/Specialization */}
                    <div>
                        <label htmlFor="branch" className="label">
                            Majors/Specialization <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="branch"
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`input-field ${touched.branch && errors.branch ? 'border-red-500' : ''
                                }`}
                        >
                            <option value="">Select your major</option>
                            <option value="Computer Science Engineering (CSE)">Computer Science Engineering (CSE)</option>
                            <option value="Artificial Intelligence & Machine Learning (AIML)">Artificial Intelligence & Machine Learning (AIML)</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Information Technology (IT)">Information Technology (IT)</option>
                            <option value="Electronics and Communication Engineering (ECE)">Electronics and Communication Engineering (ECE)</option>
                            <option value="Electrical Engineering (EE)">Electrical Engineering (EE)</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Chemical Engineering">Chemical Engineering</option>
                            <option value="Biotechnology">Biotechnology</option>
                            <option value="Aerospace Engineering">Aerospace Engineering</option>
                            <option value="Automobile Engineering">Automobile Engineering</option>
                            <option value="Industrial Engineering">Industrial Engineering</option>
                            <option value="Robotics Engineering">Robotics Engineering</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="Other">Other</option>
                        </select>
                        {touched.branch && errors.branch && (
                            <p className="error-text">{errors.branch}</p>
                        )}
                    </div>

                    {/* Select Slot to Start Course */}
                    <div>
                        <label htmlFor="selectedSlot" className="label">
                            Select Slot to Start Course <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="selectedSlot"
                            name="selectedSlot"
                            value={formData.selectedSlot}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`input-field ${touched.selectedSlot && errors.selectedSlot ? 'border-red-500' : ''
                                }`}
                        >
                            <option value="">Select your preferred slot</option>
                            {availableSlots.length > 0 ? (
                                availableSlots.map((slot) => (
                                    <option key={slot} value={slot}>
                                        {slot}
                                    </option>
                                ))
                            ) : (
                                // Fallback info if loading or empty
                                <>
                                    <option value="5th January">5th January</option>
                                    <option value="19th January">19th January</option>
                                    <option value="2nd February">2nd February</option>
                                </>
                            )}
                        </select>
                        {touched.selectedSlot && errors.selectedSlot && (
                            <p className="error-text">{errors.selectedSlot}</p>
                        )}
                    </div>

                    {/* General Error Message */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                            <p className="text-red-700 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={isSubmitting}
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
                                    Continue to Assessment
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
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegistrationStep
