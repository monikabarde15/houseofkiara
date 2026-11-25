import { useState } from "react";
import logo from "../assets/logo.png";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Calendar,
  Truck,
  RotateCcw,
  Wallet,
  Users,
  Package,
  Award,
  UserCheck,
  Grid,
  BarChart3,
  Percent,
  Mail,
  Bell,
  Settings,
  Home,
  FileText,
  Layers,
  Search,
  LogOut,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import {
  useTeamPermissions,
  computeInitials,
  getFirstName,
} from "./TeamPermissions";

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  siteName: string;
  isMobile?: boolean;
  onLogout: () => void;
  badges?: Record<string, number>;
}

const groups = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Operations",
    items: [
      { id: "orders", label: "Orders", icon: ShoppingBag },
      { id: "offers", label: "Offers", icon: Tag },
      { id: "enquiries", label: "Enquiries", icon: MessageSquare },
      { id: "calendar", label: "Rental Calendar", icon: Calendar },
      { id: "dispatch", label: "Dispatch Schedule", icon: Truck },
      { id: "returns", label: "Returns & Deposits", icon: RotateCcw },
      { id: "payouts", label: "Payouts to Listers", icon: Wallet },
      { id: "customers", label: "Customers", icon: Users },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { id: "categories", label: "Categories", icon: Tag },
      { id: "products", label: "Products", icon: Package },
      { id: "designers", label: "Designers", icon: Award },
      { id: "listers", label: "Listers", icon: UserCheck },
      { id: "lyp", label: "LYP Submissions", icon: Grid },
    ],
  },
  {
    title: "Growth",
    items: [
      { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
      { id: "promotions", label: "Promotions", icon: Percent },
      { id: "messaging", label: "Messaging", icon: Mail },
    ],
  },
  {
    title: "Site settings",
    items: [
      { id: "settings", label: "Site Settings", icon: Settings },
      { id: "homepage", label: "Homepage", icon: Home },
      { id: "pages", label: "Pages", icon: FileText },
      { id: "pages_editor", label: "Pages Editor", icon: FileText },
      { id: "platform_legal", label: "Platform & Legal", icon: FileText },
    ],
  },
  {
    title: "Configuration",
    items: [
      { id: "roles_permissions", label: "Team & Permissions", icon: ShieldCheck },
    ],
  },
];

export default function Sidebar({
  currentView,
  setView,
  isMobile,
  onLogout,
  badges = {},
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    roles,
    currentPerson,
    actualPermissions,
    effectivePermissions,
    canOpenSection,
    preview,
    stopPreview,
    setActiveTab,
    setSelectedPersonId,
  } = useTeamPermissions();

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const visibleGroups = groups
    .map((group) => {
      const items = group.items.filter((item) => {
        if (item.id === "roles_permissions") {
          if (!effectivePermissions.isFounder) return false;
        } else if (!canOpenSection(item.id)) {
          return false;
        }
        if (
          normalizedSearch &&
          !item.label.toLowerCase().includes(normalizedSearch)
        ) {
          return false;
        }
        return true;
      });
      return { ...group, items };
    })
    .filter((g) => g.items.length > 0);

  const activeRoleObj = roles.find(
    (r) => r.roleId === effectivePermissions.roleId,
  );
  const avatarColour = activeRoleObj?.colour || "#C6A05C";
  const footerDisplayName = preview.active
    ? preview.personFirstName
      ? `Previewing ${preview.personFirstName}`
      : "Previewing a role"
    : currentPerson?.shownOnRecordsAs ||
      getFirstName(currentPerson?.fullName || "Soumya");
  const footerSubtitle = preview.active
    ? `${effectivePermissions.roleName} · click to stop`
    : effectivePermissions.roleName || "Founder";
  const footerInitials = preview.active
    ? computeInitials(
        preview.personFirstName || effectivePermissions.roleName || "Role",
      )
    : computeInitials(
        currentPerson?.fullName || currentPerson?.shownOnRecordsAs || "Soumya",
      );

  const handleUserCardClick = () => {
    if (preview.active) {
      stopPreview();
      return;
    }
    if (actualPermissions.isFounder && currentPerson?.personId) {
      setActiveTab("team");
      setSelectedPersonId(currentPerson.personId);
      setView("roles_permissions");
    }
  };

  return (
    <aside
      className={`sidebar-reference ${isMobile ? "w-full" : "w-[230px] xl:w-[252px] 2xl:w-[272px]"} h-screen shrink-0 select-none`}
    >
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo-wrapper">
          <img
            src={logo}
            alt="House of Kaira Logo"
            className="sidebar-brand-logo"
          />
        </div>
        <div>
          <strong>House of Kaira</strong>
          <small>Admin</small>
        </div>
      </div>
      <div className="sidebar-search">
        <Search />
        <input
          aria-label="Search sections"
          placeholder="Search sections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <nav className="sidebar-nav">
        {visibleGroups.map((group) => (
          <div className="sidebar-group" key={group.title || "home"}>
            {group.title && <p>{group.title}</p>}
            {group.items.map((item, index) => {
              const Icon = item.icon;
              const active =
                currentView === item.id ||
                (item.id === "returns" &&
                  currentView.startsWith("returns:")) ||
                (item.id === "listers" &&
                  currentView.startsWith("lister_detail:")) ||
                (item.id === "orders" &&
                  currentView.startsWith("order_detail:")) ||
                (item.id === "products" &&
                  currentView.startsWith("product_detail:")) ||
                (item.id === "customers" &&
                  currentView.startsWith("customer_detail:"));
              return (
                <button
                  key={`${item.label}-${index}`}
                  onClick={() => setView(item.id)}
                  className={active ? "active" : ""}
                >
                  <Icon />
                  <span>{item.label}</span>
                  {(badges[item.id] ?? 0) > 0 && <b>{badges[item.id]}</b>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div
        className="sidebar-user"
        onClick={handleUserCardClick}
        style={{
          cursor:
            preview.active ||
            (actualPermissions.isFounder && currentPerson?.personId)
              ? "pointer"
              : "default",
        }}
        title={
          preview.active
            ? "Click to stop preview"
            : actualPermissions.isFounder
              ? "Manage your profile"
              : undefined
        }
      >
        <span style={{ backgroundColor: avatarColour, color: "#FFFFFF" }}>
          {footerInitials}
        </span>
        <div className="min-w-0 flex-1">
          <strong className="truncate">{footerDisplayName}</strong>
          <small className="truncate">{footerSubtitle}</small>
        </div>
        <button
          className="sidebar-logout"
          onClick={(e) => {
            e.stopPropagation();
            onLogout();
          }}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut />
        </button>
      </div>
    </aside>
  );
}
