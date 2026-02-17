'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  useEffect(() => {
    // Fire confetti multiple times for a richer effect
    const duration = 5 * 1000; // 5 seconds
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF6200', '#FF8C42', '#FFB300', '#FF5722', '#F57C00'],
      });

      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF6200', '#FF8C42', '#FFD700', '#00C853', '#2979FF'],
      });

      confetti({
        particleCount: 150,
        startVelocity: 30,
        spread: 90,
        origin: { y: 0.6 },
        gravity: 0.6,
        scalar: 1.2,
        ticks: 400,
      });
    }, 250);

    // Final burst at the end
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        gravity: 0.5,
        scalar: 1.2,
        ticks: 300,
      });
    }, duration - 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Celebration Icon */}
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={64} className="text-green-600" />
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Congratulations!
        </h1>

        {/* Subheadline */}
        <p className="text-xl font-medium text-gray-800">
          Your shop is now live!
        </p>

        {/* Confirmation Message */}
        <p className="text-gray-600 text-lg leading-relaxed">
          You can now start listing items for sale and connect with customers.
          Your shop is ready to receive orders.
        </p>

        {/* CTA Button */}
        <Link
          href="/icreators/your-slug" // Replace with dynamic slug later
          className="inline-block w-full max-w-xs bg-orange-600 text-white py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition shadow-md"
        >
          Go to your shop
        </Link>

        {/* Secondary Link */}
        <div className="pt-4">
          <Link href="/" className="text-orange-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}