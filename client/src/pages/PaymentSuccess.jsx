import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, XCircle } from 'lucide-react'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { token, checkAuth, backendUrl } = useAuth()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id')
      const plan = searchParams.get('plan')

      if (!sessionId || !plan) {
        setStatus('failed')
        return
      }

      try {
        const { data } = await axios.post(`${backendUrl}/api/user/verify-payment`, {
          session_id: sessionId,
          plan: plan
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (data.success) {
          setStatus('success')
          await checkAuth() // Update user state globally
          setTimeout(() => navigate('/ai'), 3000)
        } else {
          setStatus('failed')
        }
      } catch (error) {
        console.error("Verification error:", error)
        setStatus('failed')
      }
    }

    if (token) {
      verifyPayment()
    }
  }, [token, searchParams])

  return (
    <div className='h-screen flex flex-col justify-center items-center bg-gray-50'>
      <div className='bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center max-w-sm w-full text-center'>
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className='text-xl font-bold text-gray-800'>Verifying Payment...</h2>
            <p className='text-gray-500 mt-2'>Please do not close this window.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className='w-16 h-16 text-green-500 mb-6' />
            <h2 className='text-xl font-bold text-gray-800'>Payment Successful!</h2>
            <p className='text-gray-500 mt-2'>Your plan has been upgraded. Enjoy your new features!</p>
            <p className='text-sm text-gray-400 mt-4'>Redirecting to dashboard...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className='w-16 h-16 text-red-500 mb-6' />
            <h2 className='text-xl font-bold text-gray-800'>Verification Failed</h2>
            <p className='text-gray-500 mt-2'>We couldn't verify your payment. If you were charged, please contact support.</p>
            <button 
              onClick={() => navigate('/')}
              className='mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700'
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentSuccess
