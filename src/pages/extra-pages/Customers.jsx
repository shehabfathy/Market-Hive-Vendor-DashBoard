import { useFetchStore } from 'Custom Hooks/useFetchStore';
import { useFetchVendor } from 'Custom Hooks/useFetchVendor';
import React from 'react';
import { auth } from '../../../firebase';
import { useCustomerSnapshot } from 'Custom Hooks/useFetchCustomer';

function Customers() {
  const { vendor } = useFetchVendor(auth.currentUser.uid);
  const { store } = useFetchStore(vendor?.storeId);
  const { customer } = useCustomerSnapshot(store?.customers);
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Customer ID
            </th>
            <th scope="col" className="px-6 py-3">
              Full Name
            </th>
            <th scope="col" className="px-6 py-3">
              Phone Number
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Address
            </th>
            <th scope="col" className="px-6 py-3">
              Orders Count
            </th>
            <th scope="col" className="px-6 py-3">
              Registration Date
            </th>
          </tr>
        </thead>
        <tbody>
          {customer.map((item) => {
            const filterOrdersCount = item.orders.filter((id) => store.orders.includes(id));
            return (
              <tr key={item.id} className="bg-white border-b ">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.id}
                </th>
                <td className="px-6 py-4">
                  {item.firstName} {item.lastName}
                </td>
                <td className="px-6 py-4">{item.phoneNumber}</td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">
                  {item.address.streetAddress}, {item.address.city}
                </td>
                <td className="px-6 py-4">{filterOrdersCount.length}</td>
                <td className="px-6 py-4">
                  {item.registrationDate.toDate().toLocaleString('en-AU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour12: true,
                    minute: 'numeric',
                    hour: 'numeric'
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
