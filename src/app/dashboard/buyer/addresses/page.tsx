import BuyerLayout from '@/components/BuyerLayout';

export default function Addresses() {
  return (
    <BuyerLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Address Book</h1>
          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
            + Add New Address
          </button>
        </div>

        <div className="space-y-6">
          {[1,2].map(i => (
            <div key={i} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Home</p>
                  <p className="text-gray-600 mt-1">
                    123 Lagos Street, Ikeja, Lagos
                  </p>
                  <p className="text-gray-600">Teniola Matthews • +234 802 446 8093</p>
                </div>
                <div className="flex gap-4">
                  <button className="text-orange-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-600" />
                <span className="text-sm text-gray-600">Set as default shipping address</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
}