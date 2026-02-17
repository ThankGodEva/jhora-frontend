'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import BuyerLayout from '@/components/BuyerLayout';

export default function Checkout() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <BuyerLayout>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress */}
        <div className="flex justify-between mb-8">
          {['Cart', 'Address', 'Payment', 'Confirmation'].map((s, i) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                step > i+1 ? 'bg-green-500' :
                step === i+1 ? 'bg-orange-600' : 'bg-gray-300'
              }`}>
                {step > i+1 ? <CheckCircle size={20} /> : i+1}
              </div>
              <p className={`text-xs mt-2 ${step >= i+1 ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                {s}
              </p>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
            {/* Cart items summary - similar to cart page */}
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              {/* Item rows */}
              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total</span>
                <span className="text-orange-600">₦53,000</span>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg md:static md:shadow-none">
              <button
                onClick={nextStep}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition"
              >
                Continue to Address
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Delivery Address</h1>
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Teniola Matthews</p>
                    <p className="text-gray-600 mt-1">123 Lagos Street, Ikeja, Lagos</p>
                    <p className="text-gray-600 mt-1">+234 802 446 8093</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="text-orange-600">Edit</button>
                    <input type="radio" name="address" checked className="accent-orange-600" />
                  </div>
                </div>
              </div>

              <button className="w-full border border-orange-600 text-orange-600 py-4 rounded-xl font-medium hover:bg-orange-50 transition">
                + Add New Address
              </button>
            </div>

            <div className="flex gap-4 mt-8 fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg md:static md:shadow-none">
              <button onClick={prevStep} className="flex-1 border border-gray-300 py-4 rounded-xl">
                Back
              </button>
              <button onClick={nextStep} className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-bold">
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Payment</h1>
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="radio" name="payment" className="accent-orange-600" defaultChecked />
                  <span className="font-medium">Bank Transfer</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="payment" className="accent-orange-600" />
                  <span className="font-medium">Paystack</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="payment" className="accent-orange-600" />
                  <span className="font-medium">Flutterwave</span>
                </label>
              </div>

              <div className="border-t pt-6">
                <p className="font-medium mb-2">Order Summary</p>
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₦48,000</span>
                </div>
                <div className="flex justify-between text-gray-700 mt-2">
                  <span>Shipping</span>
                  <span>₦5,000</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span className="text-orange-600">₦53,000</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg md:static md:shadow-none">
              <button onClick={prevStep} className="flex-1 border border-gray-300 py-4 rounded-xl">
                Back
              </button>
              <button onClick={nextStep} className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-bold">
                Pay Now
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">Your order has been placed successfully</p>

            <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto text-left">
              <p className="font-medium mb-2">Order Number</p>
              <p className="text-orange-600 mb-6">#JH1384516</p>

              <p className="font-medium mb-2">Estimated Delivery</p>
              <p className="mb-6">3 - 5 days</p>

              <Link href="/dashboard/buyer/orders" className="block w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition text-center">
                Track Your Order
              </Link>
            </div>

            <Link href="/" className="mt-8 inline-block text-orange-600 hover:underline">
              Continue Shopping →
            </Link>
          </div>
        )}
      </div>
      </div>
    </BuyerLayout>
  );
}