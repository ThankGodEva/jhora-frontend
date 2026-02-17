'use client';  // if using client-side features (optional but good)

export default function ChangePassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Change Password</h1>
        <p className="text-gray-600 mb-6">
          This page is under construction. Soon you'll be able to update your password here.
        </p>
        <a
          href="/"
          className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-700 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}