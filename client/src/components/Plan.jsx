import React, { useState } from 'react'
import { Check, Zap, Crown, Rocket, Shield, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    icon: Shield,
    color: 'from-gray-500 to-slate-600',
    description: 'Get started with basic AI tools',
    features: [
      '10 AI generations / month',
      'Write articles & essays',
      'Generate blog titles',
      'Community access',
      'Standard support',
    ],
    notIncluded: [
      'Image generation',
      'Background removal',
      'Object removal',
      'Resume review',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: { monthly: 19, yearly: 15 },
    icon: Sparkles,
    color: 'from-blue-500 to-indigo-600',
    description: 'Everything you need to create amazing content',
    features: [
      '100 AI generations / month',
      'Write articles & essays',
      'Generate blog titles',
      'AI Image generation',
      'Background removal',
      'Object removal',
      'Community sharing',
      'Priority support',
    ],
    notIncluded: [
      'Team collaboration',
      'Custom integrations',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 49, yearly: 39 },
    icon: Rocket,
    color: 'from-purple-500 to-pink-600',
    description: 'Unlimited power for teams & businesses',
    features: [
      'Unlimited generations',
      'All Pro features',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 premium support',
      'SLA guarantee',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    popular: false,
  },
]

const Plan = () => {
  const [yearly, setYearly] = useState(false)
  const { user, openSignIn, backendUrl } = useAuth()

  const handlePlanClick = async (plan) => {
    if (!user) {
      openSignIn()
      return
    }
    if (plan.name === 'Free') return
    
    const loadingToast = toast.loading('Redirecting to Stripe Checkout...');
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/create-checkout-session`, {
        planId: plan.name.toLowerCase(),
        isYearly: yearly
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('ai_token')}` }
      });

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to connect to payment gateway');
    }
  }

  return (
    <div className='max-w-5xl mx-auto z-20 my-30 px-4'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>Choose Your Plan</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>
          Start for free, upgrade when you need more power. No hidden fees, cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className='flex items-center justify-center gap-4 mt-8'>
          <span className={`text-sm font-medium ${!yearly ? 'text-gray-800' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
              yearly ? 'bg-linear-to-r from-[#3C81F6] to-[#9234EA]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                yearly ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${yearly ? 'text-gray-800' : 'text-gray-400'}`}>
            Yearly
            <span className='ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold'>
              Save 20%
            </span>
          </span>
        </div>
      </div>

      <div className='mt-14 max-sm:mx-4 grid grid-cols-1 md:grid-cols-3 gap-6'>
        {plans.map((plan) => {
          const Icon = plan.icon
          const price = yearly ? plan.price.yearly : plan.price.monthly
          const isCurrentPlan = user?.plan === plan.name.toLowerCase()

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? 'border-blue-400 shadow-xl shadow-blue-100'
                  : 'border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#3C81F6] to-[#9234EA] text-white text-xs font-bold px-4 py-1 rounded-full'>
                  Most Popular
                </div>
              )}

              {/* Icon & Name */}
              <div className='flex items-center gap-3 mb-3'>
                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${plan.color} flex items-center justify-center`}>
                  <Icon className='w-5 h-5 text-white' />
                </div>
                <h3 className='text-lg font-bold text-slate-700'>{plan.name}</h3>
              </div>

              <p className='text-gray-400 text-sm mb-4'>{plan.description}</p>

              {/* Price */}
              <div className='mb-6'>
                <span className='text-4xl font-bold text-slate-800'>
                  {price === 0 ? 'Free' : `$${price}`}
                </span>
                {price > 0 && (
                  <span className='text-gray-400 text-sm ml-1'>
                    / {yearly ? 'mo (billed yearly)' : 'month'}
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanClick(plan)}
                disabled={isCurrentPlan}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer mb-6 ${
                  isCurrentPlan
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : plan.popular
                    ? 'bg-linear-to-r from-[#3C81F6] to-[#9234EA] text-white hover:opacity-90 active:scale-95'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : plan.cta}
              </button>

              {/* Features */}
              <ul className='space-y-2.5 flex-1'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-start gap-2 text-sm text-gray-600'>
                    <Check className='w-4 h-4 text-green-500 mt-0.5 shrink-0' />
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className='flex items-start gap-2 text-sm text-gray-400 line-through'>
                    <Check className='w-4 h-4 text-gray-300 mt-0.5 shrink-0' />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Plan
