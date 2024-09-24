import { Button, Divider, Table } from 'antd';
import { useFetchStore } from 'Custom Hooks/useFetchStore';
import { useFetchVendor } from 'Custom Hooks/useFetchVendor';
import { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { showDeleteConfirm } from './Modal';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { auth } from '../../../firebase';
import { useFetchProds } from 'Custom Hooks/useFetchProds';

const ProductsList = () => {
  const [selectionType, setSelectionType] = useState('checkbox');
  const { vendor } = useFetchVendor(auth.currentUser.uid);
  const { store } = useFetchStore(vendor.storeId);
  const { product, isLoading } = useFetchProds(store?.products);
  console.log(product);
  const data = product;

  const navigate = useNavigate();

  // Edit product in list
  const handleEdit = (record) => {
    console.log(`Editing `, record);

    // Add your edit logic here
  };

  // Delete Product from list
  const handleDelete = async (record) => {
    showDeleteConfirm(record.id, vendor.storeId);
  };
  const columns = [
    {
      title: 'Products',
      dataIndex: 'images',
      key: 'image',
      render: (image) => <img src={image} alt="product" style={{ width: 80, height: 80 }} />
    },
    {
      // title: 'Product',
      dataIndex: 'title',
      render: (text) => <a>{text}</a>,
      onFilter: (value, record) => record.title.toLowerCase().indexOf(value.toLowerCase()) === 0,
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ['descend', 'ascend']
      // defaultSortOrder: 'acend'
    },
    {
      dataIndex: 'creationDate',
      key: 'image',
      sorter: (a, b) => b.creationDate - a.creationDate,
      sortDirections: ['descend', 'ascend']
      // defaultSortOrder: 'ascend'
    },
    {
      onFilter: (value, record) => record.price === value,
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['descend', 'ascend'],
      // defaultSortOrder: 'ascend',
      dataIndex: 'price',
      title: 'Price'
    },
    {
      onFilter: (value, record) => record.stockQuantity.toString().indexOf(value) === 0,
      sortDirections: ['descend', 'ascend'],
      // defaultSortOrder: 'acend',
      sorter: (a, b) => a.stockQuantity - b.stockQuantity,
      title: 'Quantity',
      dataIndex: 'stockQuantity'
    },
    {
      onFilter: (value, record) => record.discount === value,
      sorter: (a, b) => a.discount - b.discount,
      sortDirections: ['descend', 'ascend'],
      title: 'Discount',
      dataIndex: 'discount'
    },
    {
      title: 'description',
      dataIndex: 'description'
      // render: (text) => <a>active</a>
    },
    {
      // title: 'update',
      dataIndex: 'update',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link
            to="/add-product"
            state={{
              isEdite: true,
              record: record
            }}
          >
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              Edit
            </Button>
          </Link>
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger>
            Delete
          </Button>
        </span>
      )
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  };
  return (
    <div>
      <Button onClick={() => navigate('/add-product')}>
        <PlusOutlined /> Add Product
      </Button>
      <Divider />
      {isLoading ? (
        <div>
          <Skeleton avatar paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton avatar paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton avatar paragraph={{ rows: 4 }} />
          <Divider />
        </div>
      ) : (
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection
          }}
          columns={columns}
          dataSource={data}
          pagination={{
            defaultCurrent: 1,
            pageSize: 5
            //   total: 30
          }}
        />
      )}
    </div>
  );
};
export default ProductsList;
