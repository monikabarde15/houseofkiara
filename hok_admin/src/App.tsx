import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import OrdersView from './components/OrdersView';
import OrderDetailView from './components/OrderDetailView';
import OffersView from './components/OffersView';
// import CalendarView from './components/CalendarView';
import RentalCalendarView from './components/RentalCalendar/tsx';
// import DispatchView from './components/Dispatch/jsx/DispatchView';
import DispatchView from './components/DispatchView';
import ReturnsView from './components/ReturnsView';
// import PayoutsView from './components/PayoutsView';
import PayoutsView from './components/payouts/PayoutsView';
import CustomersView from './components/CustomersView';
// import ProductsView from './components/ProductsView';
import ProductsView from './components/products/ProductsView';
import DesignersView from './components/Designers/tsx';
// import ListersView from './components/ListersView';
import ListersView from './components/Listers/ListersView';
// import OccasionsView from './components/OccasionsView';
import LYPSubmissionsView from './components/LYP';
import ReportsView from './components/ReportsView';
// import PromotionsView from './components/PromotionsView';
import { PromotionsView } from './components/Promotions';
import { MessagingView } from './components/Messaging/MessagingView';
import { mockMessages } from './components/Messaging/data/mockMessages';
import { Message } from './components/Messaging/types/messaging.types';
import NotificationsView from './components/NotificationsView';
// import SettingsView from './components/SettingsView';
import SiteSettingsView from './components/SettingsView';

// import HomepageView from './components/HomepageView';
import HomepageView from "./components/Homepage/HomepageView";
import PagesView from './components/PagesView';

import { 
  initialCustomers, 
  initialProducts, 
  initialOrders, 
  initialDesigners, 
  initialListers, 
  initialListerSubmissions, 
  initialPromoCodes, 
  initialEmailTemplates, 
  initialSiteSettings, 
  initialHomepage 
} from './data';

import { Customer, Product, Order, Offer, Designer, Lister, ListerSubmission, PromoCode, EmailTemplate, SiteSettings, HomepageEditor } from './types';

import * as offerApi from './services/offerApi';
import * as authApi from './services/authApi';
import * as productApi from './services/productApi';
import * as orderApi from './services/orderApi';
import * as listerApi from './services/listerApi';
import * as customerApi from './services/customerApi';
import * as taskApi from './services/taskApi';
import AdminAuth from './components/AdminAuth';
import { ArrowLeft, ExternalLink, Menu, Save, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSectionEditing, setIsSectionEditing] = useState<boolean>(false);
  const setView = (view: string) => {
    setIsSectionEditing(false);
    setCurrentView(view);
  };
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [adminSession, setAdminSession] = useState<any>(() => authApi.getSession());
  const [messagingActiveTab, setMessagingActiveTab] = useState('messages');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  // const [productBackHandler, setProductBackHandler] = useState<(() => void) | null>(null);

  // Consolidated global state synced with real database API
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    customerApi.getCustomers()
      .then(data => {
        setCustomers(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Unable to load customers from API:", err));
  }, []);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  useEffect(() => { productApi.getProducts().then(setProducts).catch((error) => console.error('Unable to load products:', error)).finally(() => setProductsLoading(false)); }, []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  useEffect(() => { orderApi.getOrders().then(setOrders).catch((error) => console.error('Unable to load orders:', error)).finally(() => setOrdersLoading(false)); }, []);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  useEffect(() => {
    offerApi.getOffers()
      .then(setOffers)
      .catch((error) => console.error('Unable to load offers:', error))
      .finally(() => setOffersLoading(false));
  }, []);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [listers, setListers] = useState<any[]>([]);
  useEffect(() => { listerApi.getListers().then((data) => setListers(Array.isArray(data) ? data : [])).catch((error) => { console.error('Unable to load listers:', error); setListers([]); }); }, []);
  const [calendarTasks, setCalendarTasks] = useState<any[]>([]);
  useEffect(() => { taskApi.getTasks().then(setCalendarTasks).catch((error) => console.error('Unable to load tasks:', error)); }, []);
  const [submissions, setSubmissions] = useState<ListerSubmission[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  useEffect(() => {
    import('./services/siteSettingsApi').then(api => {
      api.getSiteSettings().then(data => {
        if (data) setSiteSettings(data);
      }).catch(() => {
        // Fallback gracefully without console error spam if API endpoint is starting
      });
    });
  }, []);
  const [homepage, setHomepage] = useState<HomepageEditor>(initialHomepage);
  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers(prev => {
      const exists = prev.some(c => c.id === updated.id || (c.customerId && c.customerId === updated.customerId));
      if (exists) {
        return prev.map(c => (c.id === updated.id || (c.customerId && c.customerId === updated.customerId)) ? updated : c);
      }
      return [updated, ...prev];
    });
    toast.success('Customer updated successfully!');
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id && c.customerId !== id));
    toast.success('Customer removed successfully!');
  };

  const handleAddPromoCode = (newCode: PromoCode) => {
    setPromoCodes([newCode, ...promoCodes]);
    toast.success('Promo code added successfully!');
  };

  const handleUpdatePromoCode = (updated: PromoCode) => {
    setPromoCodes(promoCodes.map(p => p.id === updated.id ? updated : p));
    toast.success('Promo code updated successfully!');
  };

  const handleDeletePromoCode = (id: string) => {
    setPromoCodes(promoCodes.filter(p => p.id !== id));
    toast.success('Promo code deleted!');
  };

  const handleUpdateOrder = async (updated: Order) => {
    let savedOrder = updated;
    try {
      savedOrder = await orderApi.updateOrder(updated.id, updated);
      setOrders(current => current.map(o => o.id === updated.id ? savedOrder : o));
    } catch (error) {
      setOrders(current => {
        const exists = current.some(o => o.id === updated.id);
        return exists ? current.map(o => o.id === updated.id ? updated : o) : [updated, ...current];
      });
    }

    // Sync product bookingHistory & payout status immediately across state
    setProducts(currentProducts => {
      return currentProducts.map(p => {
        let modified = false;
        const newHistory = (p.bookingHistory || []).map((b: any) => {
          if (b.orderId === updated.id || b.orderId === (updated as any).orderNumber || `HOK-ORD-${String(b.orderId || '').replace(/[^0-9]/g, '').slice(-3)}` === `HOK-ORD-${String(updated.id || '').replace(/[^0-9]/g, '').slice(-3)}`) {
            modified = true;
            return { ...b, status: updated.status };
          }
          return b;
        });

        const newExternal = (p.externalBookings || []).map((b: any) => {
          if (b.orderId === updated.id || b.orderId === (updated as any).orderNumber || `HOK-ORD-${String(b.orderId || '').replace(/[^0-9]/g, '').slice(-3)}` === `HOK-ORD-${String(updated.id || '').replace(/[^0-9]/g, '').slice(-3)}`) {
            modified = true;
            return { ...b, status: updated.status };
          }
          return b;
        });

        if (modified) {
          const rawId = updated.id || (updated as any).orderNumber;
          const displayId = rawId.startsWith('HOK-ORD-') ? rawId : `HOK-ORD-${String(rawId).replace(/[^0-9]/g, '').slice(-3) || '889'}`;
          const newActivityLog = [
            ...(p.activityLog || []),
            {
              action: `Order #${displayId} status updated to "${updated.status}" by Admin`,
              user: 'Admin',
              timestamp: new Date().toISOString(),
              type: 'rental'
            }
          ];

          return {
            ...p,
            bookingHistory: newHistory,
            externalBookings: newExternal,
            activityLog: newActivityLog
          };
        }
        return p;
      });
    });

    toast.success('Order updated successfully!');
  };

  const handleUpdateOffer = async (id: string, updatedFields: Partial<Offer>) => {
    try { const currentOffer = offers.find((offer) => offer.id === id); const updated = updatedFields.status ? await offerApi.updateOfferStatus(id, updatedFields.status, currentOffer?.backendId) : await offerApi.updateOffer(id, updatedFields, currentOffer?.backendId); setOffers(current => current.map(o => o.id === id ? { ...o, ...updated, ...updatedFields } : o)); toast.success('Offer updated successfully!'); }
    catch (error) { console.error('Unable to update offer:', error); toast.error('Failed to update offer'); }
  };

  const handleAddOffer = async (newOffer: Offer) => {
    try { const created = await offerApi.createOffer(newOffer); setOffers(current => [created, ...current]); toast.success('Offer created successfully!'); }
    catch (error) { console.error('Unable to create offer:', error); toast.error('Failed to create offer'); }
  };

  const handleAddProduct = async (newProd: Product) => {
    try { const created = await productApi.createProduct(newProd); setProducts(current => [created, ...current]); toast.success('Product created successfully!'); }
    catch (error) { console.error('Unable to create product:', error); toast.error(error instanceof Error ? error.message : 'Unable to create product'); }
  };

  const handleUpdateProduct = async (updated: Product) => {
    try { const saved = await productApi.updateProduct(updated); setProducts(current => current.map(p => p.id === updated.id ? saved : p)); toast.success('Product updated successfully!'); }
    catch (error) { console.error('Unable to update product:', error); toast.error(error instanceof Error ? error.message : 'Unable to update product'); }
  };

  const handleAddDesigner = (newDes: Designer) => {
    setDesigners([newDes, ...designers]);
    toast.success('Designer added successfully!');
  };

  const handleUpdateDesigner = (updated: Designer) => {
    setDesigners(designers.map(d => d.id === updated.id ? updated : d));
    toast.success('Designer updated successfully!');
  };

  const handleUpdateLister = (updated: any) => {
    setListers(listers.map(l => l.id === updated.id ? updated : l));
    toast.success('Lister profile updated successfully!');
  };

  const handleCreateLister = async (newLister: any) => {
    try {
      const created = await listerApi.createLister(newLister);
      setListers(current => [created, ...current]);
      toast.success('Lister created successfully!');
    } catch (error) {
      toast.error('Failed to create lister');
    }
  };

  const handleAddCalendarTask = async (task: any) => {
    try {
      const created = await taskApi.createTask(task);
      setCalendarTasks(current => [...current, created]);
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Unable to add task:', error);
      toast.error('Failed to add task');
    }
  };

  const handleUpdateSubmission = (updated: ListerSubmission) => {
    setSubmissions(submissions.map(s => s.id === updated.id ? updated : s));
    toast.success('Submission updated successfully!');
  };

  const handleApproveSubmission = (id: string) => {
    const sub = submissions.find(s => s.id === id);
    if (!sub) return;
    
    const newProd: Product = {
      id: "HOK-PRD-" + Math.floor(100 + Math.random() * 900),
      name: sub.productName,
      designer: sub.productName.split(' - ')[1] || "Sabyasachi",
      description: sub.description,
      category: sub.category,
      occasion: "Festive, Sangeet, Wedding",
      material: "Satin Silk",
      embellishments: "Hand embroidery",
      sizes: ["M"],
      listingModes: ["Rental"],
      condition: sub.condition,
      availability: "Available Now",
      status: "Live",
      rentalPrice: Math.round(sub.retailPrice * 0.08) || 5000,
      securityDeposit: Math.round(sub.retailPrice * 0.15) || 12000,
      listingPrice: sub.retailPrice,
      commissionRate: 25,
      minimumDurationDays: 4,
      extensionWindowDays: 2,
      cleaningBufferDays: 2,
      images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60"],
      blockedDates: []
    };

    setProducts([newProd, ...products]);
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'Approved' } : s));
    
    const matchingLister = listers.find(l => l.id === sub.listerId || l.name === sub.listerName);
    if (matchingLister) {
      handleUpdateLister({
        ...matchingLister,
        listingsCount: matchingLister.listingsCount + 1,
        verified: true
      });
    }

    toast.success(`Submission "${sub.productName}" approved! Piece is now Live.`);
  };

  const handleRejectSubmission = (id: string) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'Rejected' } : s));
    toast.success('Submission marked as rejected.');
  };

  const handleUpdateTemplate = (updated: EmailTemplate) => {
    setEmailTemplates(emailTemplates.map(t => t.id === updated.id ? updated : t));
    toast.success('Email template updated!');
  };

  // Render correct view block based on router currentView ID
  const renderContent = () => {
    if (currentView === 'dashboard') {
      return (
        <DashboardView 
          orders={orders}
          listerSubmissions={submissions}
          activeListingsCount={products.filter(p => p.status !== 'Archived').length || products.length || 1}
          setView={setView}
          setSelectedOrderId={setSelectedOrderId}
          onApproveSubmission={handleApproveSubmission}
          onRejectSubmission={handleRejectSubmission}
        />
      );
    }

    if (currentView === 'orders') {
      return (
        <OrdersView 
          orders={orders}
          setView={setView}
          setSelectedOrderId={setSelectedOrderId}
        />
      );
    }

    if (currentView.startsWith('order_detail:')) {
      const orderId = currentView.split(':')[1];

      // 1. Check orders array first
      let matchedOrder = orders.find(o => 
        o.id === orderId || 
        (o as any)._id === orderId ||
        o.orderNumber === orderId ||
        (o as any).orderId === orderId
      );

      // 2. If not in orders, search dynamically inside products.bookingHistory & externalBookings
      if (!matchedOrder) {
        for (const p of products) {
          const allBookings = [...(p.bookingHistory || []), ...(p.externalBookings || [])];
          const foundBooking: any = allBookings.find((b: any) => 
            b.orderId === orderId || 
            b.id === orderId ||
            (b.orderId && orderId && b.orderId.includes(orderId))
          );

          if (foundBooking) {
            const rawId = foundBooking.orderId || orderId;
            const formattedId = rawId.startsWith('HOK-ORD-')
              ? rawId
              : rawId.startsWith('EXT-')
              ? `HOK-ORD-${rawId.replace(/[^0-9]/g, '').slice(-3)}`
              : `HOK-ORD-${String(rawId).replace(/[^0-9]/g, '') || '929'}`;

            matchedOrder = {
              id: formattedId,
              orderNumber: formattedId,
              customerName: foundBooking.customerName || 'Renter',
              customerPhone: foundBooking.whatsappNumber || '9876543210',
              customerEmail: `${(foundBooking.customerName || 'renter').toLowerCase().replace(/\s+/g, '')}@houseofkaira.com`,
              productName: p.name || 'Lehenga Piece',
              designer: p.designer || 'House of Kaira',
              date: foundBooking.startDate || foundBooking.date || '2026-09-05',
              startDate: foundBooking.startDate || foundBooking.date || '2026-09-10',
              endDate: foundBooking.endDate || '2026-09-14',
              status: foundBooking.status || 'Confirmed',
              amount: Number(foundBooking.amount || p.rentalPrice || 8500),
              totalAmount: Number(foundBooking.amount || p.rentalPrice || 8500),
              grandTotal: Number(foundBooking.amount || p.rentalPrice || 8500),
              deposit: Number(p.securityDeposit || 0),
              depositStatus: 'Held',
              items: [
                {
                  productId: p.productId || p._id,
                  productName: p.name,
                  mode: 'Rental',
                  amount: Number(foundBooking.amount || p.rentalPrice || 8500),
                  startDate: foundBooking.startDate || '2026-09-10',
                  endDate: foundBooking.endDate || '2026-09-14'
                }
              ],
              logs: [
                {
                  date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                  message: `External reservation created for ${foundBooking.customerName || 'customer'}`,
                  user: 'Admin'
                }
              ]
            } as any;
            break;
          }
        }
      }

      const finalOrder = matchedOrder || ({
        id: orderId.startsWith('HOK-ORD-') ? orderId : `HOK-ORD-${String(orderId).replace(/[^0-9]/g, '').slice(-3) || '889'}`,
        orderNumber: orderId.startsWith('HOK-ORD-') ? orderId : `HOK-ORD-${String(orderId).replace(/[^0-9]/g, '').slice(-3) || '889'}`,
        customerName: 'Riya Sharma',
        customerPhone: '9876543210',
        customerEmail: 'riya.sharma@houseofkaira.com',
        productName: 'Crimson Zardozi Lehenga',
        designer: 'House of Kaira',
        date: '2026-09-05',
        startDate: '2026-09-10',
        endDate: '2026-09-14',
        status: 'Confirmed',
        amount: 8500,
        totalAmount: 8500,
        grandTotal: 8500,
        securityDeposit: 0,
        depositStatus: 'Held',
        items: [],
      } as any);

      return (
        <OrderDetailView 
          order={finalOrder}
          onBack={() => setView('orders')}
          onUpdateOrder={handleUpdateOrder}
        />
      );
    }

    if (currentView === 'offers') {
      return (
        <OffersView 
          offers={offers}
          loading={offersLoading}
          onUpdateOffer={handleUpdateOffer}
          onAddOffer={handleAddOffer}
        />
      );
    }

    if (currentView === 'calendar') {
  return (
    <RentalCalendarView 
      orders={orders} 
      tasks={calendarTasks}
      onAddTask={handleAddCalendarTask}
    />
  );
}

    if (currentView === 'dispatch') {
      return (
        <DispatchView 
          orders={orders}
          setView={setView}
          setSelectedOrderId={setSelectedOrderId}
          onUpdateOrder={handleUpdateOrder}
        />
      );
    }

    if (currentView === 'returns') {
      return (
        <ReturnsView 
          orders={orders}
          setView={setView}
          setSelectedOrderId={setSelectedOrderId}
          onUpdateOrder={handleUpdateOrder}
        />
      );
    }

    if (currentView === 'payouts') {
  return <PayoutsView />;
}

    if (currentView === 'customers') {
      return (
        <CustomersView 
          customers={customers}
          orders={orders}
          products={products}
          onUpdateCustomer={handleUpdateCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          setView={setView}
          setSelectedOrderId={setSelectedOrderId}
          onEditingChange={setIsSectionEditing}
        />
      );
    }

    if (currentView === 'products') {
      return (
        <ProductsView
          products={products}
          orders={orders}
          loading={productsLoading}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          listers={listers}
          onEditingChange={setIsSectionEditing}
          onViewOrder={(orderId) => setView(`order_detail:${orderId}`)}
        />
      );
    }

    if (currentView === 'designers') {
      return <DesignersView onEditingChange={setIsSectionEditing} />;
    }

    if (currentView === 'listers') {
      return <ListersView onEditingChange={setIsSectionEditing} />;
    }

    // if (currentView === 'occasions') {
    //   return <OccasionsView />;
    // }

    if (currentView === 'lyp') {
      return <LYPSubmissionsView onEditingChange={setIsSectionEditing} />;
    }

    if (currentView === 'reports') {
      return <ReportsView orders={orders} products={products} />;
    }

    if (currentView === 'promotions') {
      return (
        <PromotionsView 
          onEditingChange={setIsSectionEditing}
        />
      );
    }

    if (currentView === 'messaging') {
      return (
        <MessagingView 
          activeTab={messagingActiveTab}
          setActiveTab={setMessagingActiveTab}
          selectedMessageId={selectedMessageId}
          setSelectedMessageId={setSelectedMessageId}
          messages={messages}
          setMessages={setMessages}
        />
      );
    }

    if (currentView === 'notifications') {
      return <NotificationsView />;
    }

   if (currentView === 'settings') {
  return (
    <SiteSettingsView
      siteSettings={siteSettings}
      onUpdateSettings={setSiteSettings}
    />
  );
}
    if (currentView === 'homepage') {
      return (
        <HomepageView 
          homepage={homepage}
          onUpdateHomepage={setHomepage}
        />
      );
    }

    if (currentView === 'pages') {
      return <PagesView />;
    }

    return (
      <div className="p-8 text-center text-stone-500 font-sans">
        This view is currently under physical dry-clean clearance or configuration.
      </div>
    );
  };

  const handleLogout = () => { authApi.logoutAdmin(); setAdminSession(null); toast.success('Logged out successfully!'); };
  if (!adminSession) return <AdminAuth onLogin={(session) => { setAdminSession(session); toast.success('Logged in successfully!'); }} />;

  return (
    <div className="flex h-screen bg-[#fcf9f5] text-stone-800 overflow-hidden font-sans relative">
      {/* Mobile Sidebar drawer overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sliding panel content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#1e1412] transform transition-transform duration-300 ease-in-out shadow-2xl">
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 bg-[#2d1f1c] hover:bg-[#3d2c29] text-[#fcf9f5] rounded-full transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <Sidebar 
              currentView={currentView} 
              setView={(view) => {
                setView(view);
                setMobileMenuOpen(false);
              }} 
              siteName={siteSettings.siteName}
              onLogout={handleLogout}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar 
          currentView={currentView} 
          setView={setView} 
          siteName={siteSettings.siteName} 
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Workspace viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Navigation Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#1e1412] text-[#fcf9f5] border-b border-[#2d1f1c] shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="p-1.5 hover:bg-[#2d1f1c] rounded transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="font-serif text-sm font-bold tracking-widest text-[#fcf9f5] uppercase">
                {siteSettings.siteName || "House of Kaira"}
              </h1>
              <p className="text-[9px] uppercase tracking-widest text-[#c5a880] mt-0.5 font-sans font-semibold">
                Admin
              </p>
            </div>
          </div>
        </header>

        {/* Desktop Sticky Header */}
      {!isSectionEditing && currentView !== 'settings' && currentView !== 'homepage' && (
          <header className="sticky top-0 z-40 hidden h-[52px] shrink-0 items-center justify-between border-b border-[#E8E0D6] bg-white px-6 lg:flex">
            <div className="flex items-center gap-3">
              {currentView === 'messaging' && messagingActiveTab === 'editor' && (
                <button
                  onClick={() => {
                    setSelectedMessageId(null);
                    setMessagingActiveTab('messages');
                  }}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E5DDD3] bg-white px-3 text-[11.5px] font-medium text-[#6F675D] hover:bg-[#FAF8F5] transition cursor-pointer shadow-2xs mr-1"
                >
                  &lt; Back to Messages
                </button>
              )}
              <span className="text-[14px] font-semibold text-[#2C2926] font-sans capitalize">
                {currentView === "products" ? "Products" : currentView === "messaging" ? "Messaging" : currentView.replace(/-/g, " ")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open('/', '_blank')}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E5DDD3] bg-white px-3.5 text-[12px] font-medium text-[#38332D] hover:bg-[#FAF8F5] transition cursor-pointer shadow-2xs"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#6F675D]" />
                <span>View Live Site</span>
              </button>

              <button
                className="inline-flex h-8 items-center rounded-md bg-[#C7A55C] hover:bg-[#B9974B] px-4 text-[12px] font-semibold text-[#2A2118] transition cursor-pointer shadow-2xs"
              >
                Save Changes
              </button>
            </div>
          </header>
        )}

        {/* Content Box */}
        <main className="flex-1 overflow-y-auto bg-[#F8F6F2]">
      <div className={`w-full ${
  currentView === 'settings' ||
  currentView === 'homepage' ||
  isSectionEditing
    ? 'p-0'
    : 'p-6'
}`}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
