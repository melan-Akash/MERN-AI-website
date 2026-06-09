import React, { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const AuthModal = () => {
  const { showAuthModal, closeSignIn, login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  if (!showAuthModal) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      const { data } = await axios.post(endpoint, form);

      if (data.success) {
        login(data.user, data.token)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={closeSignIn}
      />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden'>
        {/* Header gradient */}
        <div className='bg-gradient-to-r from-[#3C81F6] to-[#9234EA] p-6 text-white text-center'>
          <div className='flex justify-center mb-3'>
            <Sparkles className='w-8 h-8' />
          </div>
          <h2 className='text-2xl font-bold'>
            {isLogin ? 'Welcome back!' : 'Create account'}
          </h2>
          <p className='text-white/80 text-sm mt-1'>
            {isLogin
              ? 'Sign in to continue creating amazing content'
              : 'Start your AI-powered content journey'}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={closeSignIn}
          className='absolute top-4 right-4 text-white/80 hover:text-white transition'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {!isLogin && (
            <div className='relative'>
              <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              <input
                type='text'
                placeholder='Full Name'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required={!isLogin}
                className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-300 transition'
              />
            </div>
          )}

          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='email'
              placeholder='Email address'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-300 transition'
            />
          </div>

          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className='w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-300 transition'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>

          {error && (
            <p className='text-red-500 text-xs text-center'>{error}</p>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white py-2.5 rounded-lg text-sm font-medium
            hover:opacity-90 active:scale-95 transition disabled:opacity-60 cursor-pointer'
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <p className='text-center text-sm text-gray-500'>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type='button'
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className='text-blue-600 font-medium hover:underline cursor-pointer'
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default AuthModal
