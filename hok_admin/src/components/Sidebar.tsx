import logo from '../assets/logo.png';
import { LayoutDashboard, ShoppingBag, Tag, Calendar, Truck, RotateCcw, Wallet, Users, Package, Award, UserCheck, Grid, BarChart3, Percent, Mail, Bell, Settings, Home, FileText, Layers, Search, LogOut } from 'lucide-react';

interface SidebarProps { currentView: string; setView: (view: string) => void; siteName: string; isMobile?: boolean; onLogout: () => void; }

const groups = [
  { title: '', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { title: 'Operations', items: [{ id: 'orders', label: 'Orders', icon: ShoppingBag }, { id: 'offers', label: 'Offers & Enquiries', icon: Tag }, { id: 'calendar', label: 'Rental Calendar', icon: Calendar }, { id: 'dispatch', label: 'Dispatch Schedule', icon: Truck }, { id: 'returns', label: 'Returns & Deposits', icon: RotateCcw }, { id: 'payouts', label: 'Payouts to Listers', icon: Wallet }, { id: 'customers', label: 'Customers', icon: Users }] },
  { title: 'Catalogue', items: [{ id: 'categories', label: 'Categories', icon: Tag }, { id: 'products', label: 'Products', icon: Package }, { id: 'designers', label: 'Designers', icon: Award }, { id: 'listers', label: 'Listers', icon: UserCheck }, { id: 'lyp', label: 'LYP Submissions', icon: Grid }, { id: 'occasions', label: 'Occasions & Sizes', icon: Grid }] },
  { title: 'Growth', items: [{ id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }, { id: 'promotions', label: 'Promotions', icon: Percent }, { id: 'messaging', label: 'Messaging', icon: Mail }, { id: 'notifications', label: 'Notifications', icon: Bell }] },
  { title: 'Site settings', items: [{ id: 'settings', label: 'Site Settings', icon: Settings }, { id: 'homepage', label: 'Homepage', icon: Home }, { id: 'pages', label: 'Pages', icon: FileText }, { id: 'circularity', label: 'Circularity', icon: Layers }, { id: 'platform_legal', label: 'Platform & Legal', icon: FileText }] },
  { title: 'Configuration', items: [{ id: 'master_data', label: 'Master Data', icon: Settings }, { id: 'roles_permissions', label: 'Roles & Permissions', icon: Users }] }
];

export default function Sidebar({ currentView, setView, isMobile, onLogout }: SidebarProps) {
  return <aside className={`sidebar-reference ${isMobile ? 'w-full' : 'w-[320px]'} h-screen shrink-0 select-none`}>
    <div className="sidebar-brand">
      <div className="sidebar-brand-logo-wrapper">
        <img src={logo} alt="House of Kaira Logo" className="sidebar-brand-logo" />
      </div>
      <div><strong>House of Kaira</strong><small>Admin</small></div>
    </div>
    <div className="sidebar-search"><Search /><input aria-label="Search sections" placeholder="Search sections..." /></div>
    <nav className="sidebar-nav">
      {groups.map((group) => <div className="sidebar-group" key={group.title || 'home'}>
        {group.title && <p>{group.title}</p>}
        {group.items.map((item, index) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return <button key={`${item.label}-${index}`} onClick={() => setView(item.id)} className={active ? 'active' : ''}>
            <Icon /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}
          </button>;
        })}
      </div>)}
    </nav>
    <div className="sidebar-user"><span>S</span><div className="min-w-0 flex-1"><strong>Soumya</strong><small>Platform Admin</small></div><button className="sidebar-logout" onClick={onLogout} title="Logout" aria-label="Logout"><LogOut /></button></div>
  </aside>;
}
