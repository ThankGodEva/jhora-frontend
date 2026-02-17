import Link from 'next/link';

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-600">JHORA</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>
        {children}
        <div className="text-center text-sm text-gray-600">
          <Link href="/" className="text-orange-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// export default function AuthLayout({ children, title }: { children: React.ReactNode; title: string }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
//       <div className="w-full max-w-md space-y-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-orange-600">JHORA</h1>
//           <h2 className="mt-6 text-2xl font-bold text-gray-900">{title}</h2>
//         </div>
//         {children}
//         <div className="text-center text-sm text-gray-600">
//           <Link href="/" className="text-orange-600 hover:underline">
//             ← Back to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }