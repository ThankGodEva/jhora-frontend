export default function ForgetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Forgot Password</h1>
        <p className="text-gray-600 mb-6">
          Enter your email to reset your password. This feature is coming soon.
        </p>
        <a
          href="/login"
          className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-700 transition"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}