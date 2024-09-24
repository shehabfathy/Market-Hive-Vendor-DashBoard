// import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
const { confirm } = Modal;
export const showDeleteConfirm = (recordId, vendorId) => {
  confirm({
    title: 'Are you sure you want to delete this product?',
    // icon: <ExclamationCircleFilled />,
    content: 'This action will permanently remove the product from the database.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: async () => {
      console.log('Deleted');
      await deleteDoc(doc(db, 'Products', recordId));
      await updateDoc(doc(db, 'Stores', vendorId), {
        products: arrayRemove(recordId)
      });
    },
    onCancel() {
      console.log('Cancel');
    }
  });
};
