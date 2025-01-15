// assets
import { IconBox, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBox, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Products Management',
      type: 'item',
      url: '/products',
      icon: icons.IconBox,
      breadcrumbs: false
    }
  ]
};

export default other;
