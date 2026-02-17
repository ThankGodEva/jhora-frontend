import BuyerLayout from '@/components/BuyerLayout';

export default function Returns() {
  return (
    <BuyerLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Return Requests</h1>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Requests</h2>
          {[1,2].map(i => (
            <div key={i} className="border-b py-4 last:border-b-0">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Order #JH-1384516</p>
                  <p className="text-sm text-gray-600">Manik mini bag</p>
                </div>
                <span className="text-yellow-600">Pending</span>
              </div>
              <p className="mt-2 text-sm">Reason: Item damaged during delivery</p>
              <button className="mt-3 text-orange-600 hover:underline text-sm">
                Track Return Status →
              </button>
            </div>
          ))}
        </div>

        <button className="w-full bg-orange-600 text-white py-4 rounded-xl font-medium hover:bg-orange-700">
          Request New Return
        </button>
      </div>
    </BuyerLayout>
  );
}