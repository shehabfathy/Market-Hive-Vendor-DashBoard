import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { Select } from 'antd';
import { doc, onSnapshot, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { useFetchVendor } from 'Custom Hooks/useFetchVendor';
import { auth } from '../../../firebase';

export default function OrderTable() {
  const [orderIds, setOrderIds] = useState([]);
  const [orders, setOrders] = useState([]);
  const { vendor } = useFetchVendor(auth.currentUser.uid);

  useEffect(() => {
    async function fetchOrderIds() {
      try {
        const docRef = doc(db, 'Stores', vendor.storeId);
        const docSnap = await getDoc(docRef);
        const storeData = docSnap.data();
        setOrderIds(storeData?.orders || []);
      } catch (error) {
        console.error('Error fetching order IDs: ', error);
      }
    }

    fetchOrderIds();
  }, [vendor.storeId]);

  useEffect(() => {
    if (orderIds.length === 0) return; // Do nothing if there are no order IDs

    const unsubscribeFns = orderIds.map((id) => {
      const orderDocRef = doc(db, 'Orders', id);
      return onSnapshot(orderDocRef, (snapshot) => {
        const data = { ...snapshot.data(), id: snapshot.id };
        setOrders((prevOrders) => {
          const orderExists = prevOrders.some((order) => order.id === data.id);
          if (orderExists) {
            return prevOrders.map((order) => (order.id === data.id ? data : order));
          } else {
            return [...prevOrders, data];
          }
        });
      });
    });

    return () => {
      unsubscribeFns.forEach((unsub) => unsub());
    };
  }, [orderIds]); // Only re-subscribe when orderIds change.

  async function handleStatusChange(orderId, newStatus) {
    try {
      const orderRef = doc(db, 'Orders', orderId);
      await updateDoc(orderRef, {
        orderHistory: arrayUnion({ orderStatus: newStatus, Date: new Date() })
      });
    } catch (error) {
      console.error('Error updating order status: ', error);
    }
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-center rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="py-3">
              Order ID
            </th>
            <th scope="col" className="py-3 px-3">
              Products
            </th>
            <th scope="col" className="py-3 px-4">
              Customer Name
            </th>
            <th scope="col" className="py-3 px-3">
              Address
            </th>
            <th scope="col" className="py-3 px-3">
              Order Status
            </th>
            <th scope="col" className="py-3 px-3">
              Payment Method
            </th>
            <th scope="col" className="py-3 px-3">
              Total Amount
            </th>
            <th scope="col" className="py-3 px-3">
              Update Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderRow({ order, onStatusChange }) {
  const [selectedStatus, setSelectedStatus] = useState(order.orderHistory[order.orderHistory.length - 1]?.orderStatus || 'pending');

  function handleChange(value) {
    setSelectedStatus(value);
    onStatusChange(order.id, value);
  }

  return (
    <tr className="bg-white border-b ">
      <th scope="row" className="px-1 py-4 font-medium text-gray-900 whitespace-nowrap ">
        {order.id}
      </th>
      <td>
        {order.products.map((item) => (
          <ProductsDetails key={item.prodId} productId={item.prodId} />
        ))}
      </td>
      <CustomerTd customerId={order.customerId} />
      <td className="py-3 px-3">{order.destinationAddress.streetAddress}</td>
      <td className="py-3 px-3">{order.orderHistory[order.orderHistory.length - 1]?.orderStatus}</td>
      <td className="py-3 px-3">{order.paymentMethod}</td>
      <td className="py-3 px-3">{order.totalAmount}</td>
      <td className="py-3 px-3">
        <Select value={selectedStatus} onChange={handleChange} style={{ width: 120 }}>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="shipped">Shipped</Select.Option>
          <Select.Option value="arrived">Arrived</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
          <Select.Option value="refund">Refund</Select.Option>
        </Select>
      </td>
    </tr>
  );
}

function CustomerTd({ customerId }) {
  const [customerDetails, setCustomerDetails] = useState(null);

  useEffect(() => {
    async function fetchCustomerDetails() {
      try {
        const docRef = doc(db, 'Customers', customerId);
        const docSnap = await getDoc(docRef);
        setCustomerDetails(docSnap.data());
      } catch (error) {
        console.error('Error fetching customer details: ', error);
      }
    }
    fetchCustomerDetails();
  }, [customerId]);

  return <td className="py-3 px-3">{customerDetails?.firstName + ' ' + customerDetails?.lastName}</td>;
}

function ProductsDetails({ productId }) {
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const docRef = doc(db, 'Products', productId);
        const docSnap = await getDoc(docRef);
        setProductDetails(docSnap.data());
      } catch (error) {
        console.error('Error fetching product details: ', error);
      }
    }
    fetchProductDetails();
  }, [productId]);

  return <div className="py-1 px-3">{productDetails?.title}</div>;
}
