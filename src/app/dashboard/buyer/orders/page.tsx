import BuyerLayout from '@/components/BuyerLayout';

export default function Orders() {
  return (
    <BuyerLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">My Orders</h1>

        <div className="flex overflow-x-auto gap-4 pb-4">
          {['All', 'Ongoing', 'Completed', 'Cancelled', 'Returned'].map(tab => (
            <button key={tab} className="px-6 py-2 rounded-full border border-gray-300 whitespace-nowrap hover:border-orange-600">
              {tab}
            </button>
          ))}
        </div>

        {/* Order Cards */}
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-medium">#JH-1384516</p>
                  <p className="text-sm text-gray-600">Feb 11, 2026</p>
                </div>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-4">
                <img src="https://via.placeholder.com/80" alt="" className="w-20 h-20 object-cover rounded" />
                <div>
                  <p className="font-medium">Manik mini bag</p>
                  <p className="text-orange-600">₦48,000</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button className="flex-1 border border-orange-600 text-orange-600 py-2 rounded-lg hover:bg-orange-50">
                  View Details
                </button>
                <button className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
}