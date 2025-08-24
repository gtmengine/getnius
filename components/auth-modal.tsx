import React, { useState } from "react";
import { X, ArrowLeft, Loader2 } from "lucide-react";
import { mockSendEmailOTP, mockVerifyEmailOTP, saveToGoogleSheets } from "../lib/supabase";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [currentStep, setCurrentStep] = useState<'signin' | 'signup' | 'verify'>('signin');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [mockCode, setMockCode] = useState(''); // For demo purposes

    if (!isOpen) return null;

    const handleEmailSignIn = async () => {
        if (!email) return;
        
        setIsLoading(true);
        setError('');
        
        try {
            const result = await mockSendEmailOTP(email);
            if (result.success) {
                setMockCode(result.mockCode || ''); // For demo purposes
                setCurrentStep('verify');
            } else {
                setError('Failed to send verification code');
            }
        } catch (err) {
            setError('Failed to send verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            // Simulate Google sign-in
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Save to Google Sheets
            await saveToGoogleSheets({
                email: 'google-user@example.com', // This would come from Google OAuth
                firstName: 'Google',
                lastName: 'User'
            });
            
            onSuccess();
        } catch (err) {
            setError('Google sign-in failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !phone || !firstName || !lastName) return;
        
        setIsLoading(true);
        setError('');
        
        try {
            const result = await mockSendEmailOTP(email);
            if (result.success) {
                setMockCode(result.mockCode || ''); // For demo purposes
                setCurrentStep('verify');
            } else {
                setError('Failed to send verification code');
            }
        } catch (err) {
            setError('Failed to send verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerificationCodeChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);
            
            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`code-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleVerifyCode = async () => {
        const code = verificationCode.join('');
        if (code.length !== 6) return;
        
        setIsLoading(true);
        setError('');
        
        try {
            const result = await mockVerifyEmailOTP(email, code);
            if (result.success) {
                // Save user data to Google Sheets
                await saveToGoogleSheets({
                    email,
                    phone,
                    firstName,
                    lastName
                });
                
                onSuccess();
            } else {
                setError(result.error || 'Invalid verification code');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToSignIn = () => {
        setCurrentStep('signin');
        setVerificationCode(['', '', '', '', '', '']);
        setError('');
        setMockCode('');
    };

    const resetForm = () => {
        setEmail('');
        setPhone('');
        setFirstName('');
        setLastName('');
        setVerificationCode(['', '', '', '', '', '']);
        setError('');
        setMockCode('');
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black text-white rounded-lg p-8 w-full max-w-md mx-4 relative">
                <button
                    onClick={() => {
                        onClose();
                        resetForm();
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-black font-bold text-lg">GN</span>
                    </div>
                    
                    {currentStep === 'signin' && (
                        <>
                            <h2 className="text-3xl font-bold mb-2">Sign in to Getnius</h2>
                            <p className="text-gray-400">Sign in to Getnius using your account.</p>
                        </>
                    )}
                    
                    {currentStep === 'signup' && (
                        <>
                            <h2 className="text-3xl font-bold mb-2">Sign up to Getnius</h2>
                            <p className="text-gray-400">Create your Getnius account to get started.</p>
                        </>
                    )}
                    
                    {currentStep === 'verify' && (
                        <>
                            <h2 className="text-3xl font-bold mb-2">Sign in to Getnius</h2>
                            <p className="text-gray-400">Sign in to Getnius using your account.</p>
                        </>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Demo Code Display (for testing purposes) */}
                {mockCode && currentStep === 'verify' && (
                    <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
                        <p className="text-blue-400 text-sm">
                            <strong>Demo Code:</strong> {mockCode}
                        </p>
                        <p className="text-blue-400 text-xs mt-1">
                            (In production, this would be sent to your email)
                        </p>
                    </div>
                )}

                {currentStep === 'signin' && (
                    <div className="space-y-6">
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        
                        <button
                            onClick={handleEmailSignIn}
                            disabled={!email || isLoading}
                            className="w-full py-3 bg-white text-black rounded-lg hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Continue with Email
                        </button>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-black text-gray-400">or</span>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full py-3 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                        
                        <div className="text-center">
                            <span className="text-gray-400">Don't have an account? </span>
                            <button
                                onClick={() => setCurrentStep('signup')}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 'signup' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        
                        <button
                            onClick={handleSignUp}
                            disabled={!email || !phone || !firstName || !lastName || isLoading}
                            className="w-full py-3 bg-white text-black rounded-lg hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create Account
                        </button>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-black text-gray-400">or</span>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full py-3 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                        
                        <div className="text-center">
                            <span className="text-gray-400">Already have an account? </span>
                            <button
                                onClick={() => setCurrentStep('signin')}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 'verify' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-gray-400 mb-4">
                                If you have an account, we have sent a code to{' '}
                                <span className="text-white">{email}</span>. Enter it below.
                            </p>
                        </div>
                        
                        <div className="flex justify-center gap-2">
                            {verificationCode.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                                    className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-lg focus:outline-none focus:border-blue-500"
                                />
                            ))}
                        </div>
                        
                        <button
                            onClick={handleVerifyCode}
                            disabled={verificationCode.join('').length !== 6 || isLoading}
                            className="w-full py-3 bg-white text-black rounded-lg hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Verify Code
                        </button>
                        
                        <button
                            onClick={handleBackToSignIn}
                            className="w-full py-3 text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        
                        <div className="text-center">
                            <span className="text-gray-400">Don't have an account? </span>
                            <button
                                onClick={() => setCurrentStep('signup')}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
