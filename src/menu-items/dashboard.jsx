// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },

    {
      id: 'products',
      title: 'Products',
      type: 'item',
      url: '/products',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'add-products',
      title: 'Add Products',
      type: 'item',
      url: '/add-product',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'customers',
      title: 'Customers',
      type: 'item',
      url: '/customers',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
