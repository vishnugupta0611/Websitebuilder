import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react'

function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyOTP, loading, error, clearError } = useAuth()
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef([])

  // Get email and name from navigation state
  const email = location.state?.email
  const name = location.state?.name

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/signup')
    }
  }, [email, navigate])

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, []) // Remove clearError from dependencies to prevent infinite loop

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Clear error when user starts typing
    if (error) {
      clearError()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    
    setOtp(newOtp)
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      return
    }

    setIsSubmitting(true)
    
    const result = await verifyOTP(email, otpString)
    
    if (result.success) {
      // Show success message briefly then redirect
      setTimeout(() => {
        navigate('/')
      }, 1500)
    }
    
    setIsSubmitting(false)
  }

  const handleResendOTP = () => {
    // Simulate resend OTP
    setResendCooldown(60)
    console.log('OTP resent to:', email)
    
    // Show success message
    alert('OTP has been resent to your email address')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600 mb-2">
              We've sent a 6-digit code to
            </p>
            <p className="text-purple-600 font-semibold">
              {email}
            </p>
          </div>

          {/* OTP Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {isSubmitting && !error && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-800 text-sm">Verification successful! Redirecting...</p>
                </div>
              )}

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter 6-digit code
                </label>
                <div className="flex space-x-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Enter the code sent to your email
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || otp.join('').length !== 6}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Verify Email'
                )}
              </Button>
            </form>

            {/* Resend OTP */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-3">
                Didn't receive the code?
              </p>
              {resendCooldown > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend code in {resendCooldown} seconds
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-purple-600 hover:text-purple-500 font-medium text-sm flex items-center justify-center mx-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Resend Code
                </button>
              )}
            </div>

            {/* Back to Signup */}
            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="text-gray-600 hover:text-gray-900 text-sm flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign Up
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              For demo purposes, enter any 6-digit number to verify
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP