import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import OrdersView from './components/OrdersView';
import OrderDetailView from './components/OrderDetailView';
import OffersView from './components/OffersView';
// import CalendarView from './components/CalendarView';
import RentalCalendarView from './components/RentalCalendar/tsx';
import DispatchView from './components/Dispatch/jsx/DispatchView';
// import DispatchView from './components/DispatchView';
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
import SettingsView from './components/SettingsView';
import HomepageView from './components/HomepageView';
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
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  // const [productBackHandler, setProductBackHandler] = useState<(() => void) | null>(null);

  // Consolidated global state synced with initial data structures
  const [customers, setCustomers] = useState<Customer[]>(() => JSON.parse(localStorage.getItem('hok_customers') || 'null') || initialCustomers);
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
  const [designers, setDesigners] = useState<Designer[]>(initialDesigners);
  const [listers, setListers] = useState<any[]>([]);
  useEffect(() => { listerApi.getListers().then((data) => setListers(Array.isArray(data) ? data : [])).catch((error) => { console.error('Unable to load listers:', error); setListers([]); }); }, []);
  const [submissions, setSubmissions] = useState<ListerSubmission[]>(initialListerSubmissions);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(initialEmailTemplates);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => JSON.parse(localStorage.getItem('hok_site_settings') || 'null') || initialSiteSettings);
  const [homepage, setHomepage] = useState<HomepageEditor>(() => JSON.parse(localStorage.getItem('hok_homepage') || 'null') || initialHomepage);
  useEffect(() => { localStorage.setItem('hok_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('hok_site_settings', JSON.stringify(siteSettings)); }, [siteSettings]);
  useEffect(() => { localStorage.setItem('hok_homepage', JSON.stringify(homepage)); }, [homepage]);

  // Callbacks for CRUD actions across different segments
  const handleUpdateOrder = async (updated: Order) => {
    try { const saved = await orderApi.updateOrder(updated.id, updated); setOrders(current => current.map(o => o.id === updated.id ? saved : o)); }
    catch (error) { console.error('Unable to update order:', error); }
  };

  const handleUpdateOffer = async (id: string, updatedFields: Partial<Offer>) => {
    try { const currentOffer = offers.find((offer) => offer.id === id); const updated = updatedFields.status ? await offerApi.updateOfferStatus(id, updatedFields.status, currentOffer?.backendId) : await offerApi.updateOffer(id, updatedFields, currentOffer?.backendId); setOffers(current => current.map(o => o.id === id ? { ...o, ...updated, ...updatedFields } : o)); }
    catch (error) { console.error('Unable to update offer:', error); }
  };

  const handleAddOffer = async (newOffer: Offer) => {
    try { const created = await offerApi.createOffer(newOffer); setOffers(current => [created, ...current]); }
    catch (error) { console.error('Unable to create offer:', error); }
  };

  const handleAddProduct = async (newProd: Product) => {
    try { const created = await productApi.createProduct(newProd); setProducts(current => [created, ...current]); }
    catch (error) { console.error('Unable to create product:', error); alert(error instanceof Error ? error.message : 'Unable to create product'); }
  };

  const handleUpdateProduct = async (updated: Product) => {
    try { const saved = await productApi.updateProduct(updated); setProducts(current => current.map(p => p.id === updated.id ? saved : p)); }
    catch (error) { console.error('Unable to update product:', error); alert(error instanceof Error ? error.message : 'Unable to update product'); }
  };

  const handleAddDesigner = (newDes: Designer) => {
    setDesigners([newDes, ...designers]);
  };

  const handleUpdateDesigner = (updated: Designer) => {
    setDesigners(designers.map(d => d.id === updated.id ? updated : d));
  };

  const handleUpdateLister = (updated: any) => {
    setListers(listers.map(l => l.id === updated.id ? updated : l));
  };
  const handleCreateLister = async (newLister: any) => {
    const created = await listerApi.createLister(newLister);
    setListers(current => [created, ...current]);
  };

  const handleUpdateSubmission = (updated: ListerSubmission) => {
    setSubmissions(submissions.map(s => s.id === updated.id ? updated : s));
  };

  const handleApproveSubmission = (id: string) => {
    const sub = submissions.find(s => s.id === id);
    if (!sub) return;
    
    // Create actual Product record based on approved submission specs
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
    
    // Add positive total earnings offset to lister profile matching verified status
    const matchingLister = listers.find(l => l.id === sub.listerId || l.name === sub.listerName);
    if (matchingLister) {
      handleUpdateLister({
        ...matchingLister,
        listingsCount: matchingLister.listingsCount + 1,
        verified: true
      });
    }

    alert(`Submission "${sub.productName}" approved! Piece is now Live on the storefront.`);
  };

  const handleRejectSubmission = (id: string) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'Rejected' } : s));
    alert("Submission marked as rejected.");
  };

  useEffect(() => {
    customerApi.getCustomers()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
        }
      })
      .catch(err => console.error("Unable to load customers from API:", err));
  }, []);

  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers(prev => {
      const exists = prev.some(c => c.id === updated.id || (c.customerId && c.customerId === updated.customerId));
      if (exists) {
        return prev.map(c => (c.id === updated.id || (c.customerId && c.customerId === updated.customerId)) ? updated : c);
      }
      return [updated, ...prev];
    });
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id && c.customerId !== id));
  };

  const handleAddPromoCode = (newCode: PromoCode) => {
    setPromoCodes([newCode, ...promoCodes]);
  };

  const handleUpdatePromoCode = (updated: PromoCode) => {
    setPromoCodes(promoCodes.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeletePromoCode = (id: string) => {
    setPromoCodes(promoCodes.filter(p => p.id !== id));
  };

  const handleUpdateTemplate = (updated: EmailTemplate) => {
    setEmailTemplates(emailTemplates.map(t => t.id === updated.id ? updated : t));
  };

  // Render correct view block based on router currentView ID
  const renderContent = () => {
    if (currentView === 'dashboard') {
      return (
        <DashboardView 
          orders={orders}
          listerSubmissions={submissions}
          activeListingsCount={products.filter(p => p.status === 'Live').length}
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
      const selectedOrder = orders.find(o => o.id === orderId);
      if (selectedOrder) {
        return (
          <OrderDetailView 
            order={selectedOrder}
            onBack={() => setView('orders')}
            onUpdateOrder={handleUpdateOrder}
          />
        );
      }
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
    // <CalendarView 
    //   orders={orders}
    //   products={products}
    //   setView={setView}
    //   setSelectedOrderId={setSelectedOrderId}
    // />
    <RentalCalendarView />
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
          loading={productsLoading}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          listers={listers}
          onEditingChange={setIsSectionEditing}
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
        <SettingsView 
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

  const handleLogout = () => { authApi.logoutAdmin(); setAdminSession(null); };
  if (!adminSession) return <AdminAuth onLogin={setAdminSession} />;

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
        {/* Active Announcement Bar banner rendering at the absolute top of layout */}
        {siteSettings.announcementBar?.enabled && (
          <div 
            className="px-6 py-2.5 text-center text-[10.5px] font-semibold tracking-wider transition-all duration-300 shrink-0 font-sans"
            style={{ 
              backgroundColor: siteSettings.announcementBar.backgroundColor, 
              color: siteSettings.announcementBar.textColor 
            }}
          >
            {siteSettings.announcementBar.text}
          </div>
        )}

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
        {!isSectionEditing && (
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
          <div className={`w-full ${isSectionEditing ? 'p-0' : 'p-6'}`}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
