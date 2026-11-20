import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import OrdersView from './components/OrdersView';
import OrderDetailView from './components/OrderDetailView';
import OffersView from './components/OffersView';
import EnquiriesView from './components/EnquiriesView';
import * as enquiryApi from './services/enquiryApi';
// import CalendarView from './components/CalendarView';
import RentalCalendarView from './components/RentalCalendar/tsx';
import DispatchView from './components/Dispatch/jsx/DispatchView';
import ReturnsView from './components/ReturnsView';
// import PayoutsView from './components/PayoutsView';
import PayoutsView from './components/payouts/PayoutsView';
import CustomersView from './components/CustomersView';
// import ProductsView from './components/ProductsView';
import ProductsView from './components/products/ProductsView';
import CategoriesView from './components/CategoriesView';
import DesignersView from './components/Designers/tsx';
// import ListersView from './components/ListersView';
import ListersView from './components/Listers/ListersView';
import OccasionsView from './components/OccasionsView';
import LYPSubmissionsView from './components/LYP';
import { submissionService } from './components/LYP/services/submissionService';
import ReportsView from './components/ReportsView';
// import PromotionsView from './components/PromotionsView';
import { PromotionsView } from './components/Promotions';
import { MessagingView } from './components/Messaging/MessagingView';
import { mockMessages } from './components/Messaging/data/mockMessages';
import { messageService } from './components/Messaging/services/messageService';
import { Message } from './components/Messaging/types/messaging.types';
import { NotificationsView } from './components/Notifications/NotificationsView';
import SiteSettingsView from './components/SiteSettings';

// import HomepageView from './components/HomepageView';
import HomepageView from "./components/Homepage/HomepageView";
import { PagesModule } from './components/Pages/PagesModule';

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
import { ArrowLeft, Bell, ExternalLink, Menu, Save, X } from 'lucide-react';
import { parseAdminRoute, syncRoute } from './utils/adminRouter';

export default function App() {
  const [currentView, setCurrentView] = useState<string>(() => parseAdminRoute().view);
  const [isSectionEditing, setIsSectionEditing] = useState<boolean>(false);
  const setView = (view: string) => {
    setIsSectionEditing(false);
    setCurrentView(view);
    syncRoute(view);
  };

  useEffect(() => {
    // Keep URL in sync on initial mount
    const initial = parseAdminRoute();
    syncRoute(initial.view, true, initial.searchParams);

    const handlePopState = () => {
      const parsed = parseAdminRoute();
      setIsSectionEditing(false);
      setCurrentView(parsed.view);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [enquiryNavIntent, setEnquiryNavIntent] = useState<{
    enquiryId?: string;
    addPieceId?: string;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [adminSession, setAdminSession] = useState<any>(() => authApi.getSession());
  const [messagingActiveTab, setMessagingActiveTab] = useState('messages');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  useEffect(() => {
    messageService
      .getMessages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setMessages(data);
      })
      .catch(() => {});
  }, []);
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
  useEffect(() => { 
    const fetchAllProducts = () => {
      productApi.getProducts().then(setProducts).catch((error) => console.error('Unable to load products:', error)).finally(() => setProductsLoading(false)); 
    };
    fetchAllProducts();
    window.addEventListener('refreshProducts', fetchAllProducts);
    return () => window.removeEventListener('refreshProducts', fetchAllProducts);
  }, []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  useEffect(() => {
    orderApi
      .getOrders()
      .then(setOrders)
      .catch((error) => console.error('Unable to load orders:', error))
      .finally(() => setOrdersLoading(false));
  }, []);

  // Refresh orders & products when switching into operational/calendar views or when tab regains focus so newly placed web/admin orders appear immediately
  useEffect(() => {
    const refreshLiveOperations = () => {
      orderApi
        .getOrders()
        .then((list) => {
          if (Array.isArray(list)) setOrders(list);
        })
        .catch(() => {});
      productApi
        .getProducts()
        .then((list) => {
          if (Array.isArray(list)) setProducts(list);
        })
        .catch(() => {});
      customerApi
        .getCustomers()
        .then((list) => {
          if (Array.isArray(list)) setCustomers(list);
        })
        .catch(() => {});
    };

    if (
      currentView === 'orders' ||
      currentView === 'enquiries' ||
      currentView === 'offers' ||
      currentView === 'customers' ||
      currentView.startsWith('customer_detail:') ||
      currentView === 'dispatch' ||
      currentView === 'returns' ||
      currentView === 'calendar' ||
      currentView === 'products' ||
      currentView.startsWith('product_detail:') ||
      currentView === 'dashboard'
    ) {
      refreshLiveOperations();
    }

    window.addEventListener('focus', refreshLiveOperations);
    return () => window.removeEventListener('focus', refreshLiveOperations);
  }, [currentView]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  useEffect(() => {
    offerApi.getOffers()
      .then(setOffers)
      .catch((error) => console.error('Unable to load offers:', error))
      .finally(() => setOffersLoading(false));
  }, []);
  const [enquiries, setEnquiries] = useState<enquiryApi.Enquiry[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(true);
  useEffect(() => {
    const loadEnqs = () => {
      enquiryApi
        .getEnquiries()
        .then(setEnquiries)
        .catch(() => {})
        .finally(() => setEnquiriesLoading(false));
    };
    loadEnqs();
    if (currentView === 'enquiries' || currentView === 'dashboard') {
      loadEnqs();
    }
  }, [currentView]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [listers, setListers] = useState<any[]>([]);
  useEffect(() => { listerApi.getListers().then((data) => setListers(Array.isArray(data) ? data : [])).catch((error) => { console.error('Unable to load listers:', error); setListers([]); }); }, []);
  const [calendarTasks, setCalendarTasks] = useState<any[]>([]);
  useEffect(() => {
    taskApi.getTasks()
      .then(data => setCalendarTasks(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error('Unable to load tasks:', error);
        setCalendarTasks([]);
      });
  }, []);
  const [submissions, setSubmissions] = useState<any[]>([]);
  useEffect(() => {
    const loadSubs = () => {
      submissionService
        .getSubmissions()
        .then((res) => {
          if (res && Array.isArray(res.data)) setSubmissions(res.data);
        })
        .catch(() => {});
    };
    loadSubs();
    if (currentView === 'dashboard' || currentView === 'lyp') {
      loadSubs();
    }
  }, [currentView]);
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
    const formatted = {
      ...updated,
      id: updated.id || updated.customerId || (updated as any)._id
    };
    setCustomers(prev => {
      const exists = prev.some(c => c.id === formatted.id || (c.customerId && c.customerId === formatted.customerId));
      if (exists) {
        return prev.map(c => (c.id === formatted.id || (c.customerId && c.customerId === formatted.customerId)) ? { ...c, ...formatted } : c);
      }
      return [formatted, ...prev];
    });
  };

  const handleAddCustomer = (newCust: any) => {
    if (!newCust) return;
    const formatted = {
      ...newCust,
      id: newCust.id || newCust.customerId || newCust._id
    };
    setCustomers(prev => {
      const existsIdx = prev.findIndex(c => 
        (formatted.id && (c.id === formatted.id || c.customerId === formatted.id || c._id === formatted.id)) || 
        (formatted.phone && c.phone && c.phone === formatted.phone) ||
        (formatted.name && c.name && c.name.toLowerCase() === formatted.name.toLowerCase())
      );
      if (existsIdx >= 0) {
        const updated = [...prev];
        updated[existsIdx] = { ...updated[existsIdx], ...formatted };
        return updated;
      }
      return [formatted, ...prev];
    });

    customerApi.getCustomers()
      .then(res => {
        if (Array.isArray(res)) setCustomers(res);
      })
      .catch(() => {});
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id && c.customerId !== id));
    toast.success('Customer removed successfully!');
  };

  const handleAddOrder = (newOrder: any) => {
    if (!newOrder) return;
    const formatted = {
      ...newOrder,
      id: newOrder.id || newOrder.orderId || newOrder.orderNumber
    };
    setOrders(prev => {
      const exists = prev.some(o => o.id === formatted.id || (o as any).orderId === formatted.id);
      if (exists) return prev.map(o => (o.id === formatted.id || (o as any).orderId === formatted.id) ? { ...o, ...formatted } : o);
      return [formatted, ...prev];
    });

    orderApi.getOrders()
      .then(res => {
        if (Array.isArray(res)) setOrders(res);
      })
      .catch(() => {});

    customerApi.getCustomers()
      .then(res => {
        if (Array.isArray(res)) setCustomers(res);
      })
      .catch(() => {});
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
    const alreadySaved = Boolean((updated as any).__alreadySaved);
    const cleanUpdated: any = { ...updated };
    delete cleanUpdated.__alreadySaved;

    const targetId = String(
      cleanUpdated.id || cleanUpdated.orderId || cleanUpdated.orderNumber || cleanUpdated._id || '',
    );
    const matchesOrder = (o: any) =>
      o.id === targetId ||
      o.orderId === targetId ||
      o.orderNumber === targetId ||
      o._id === targetId;

    let savedOrder: Order = cleanUpdated;
    if (!alreadySaved) {
      try {
        savedOrder = await orderApi.updateOrder(targetId, cleanUpdated);
      } catch (error) {
        savedOrder = cleanUpdated;
      }
    }

    setOrders(current => {
      const exists = current.some(matchesOrder);
      return exists
        ? current.map(o => (matchesOrder(o) ? { ...o, ...savedOrder } : o))
        : [savedOrder, ...current];
    });

    // Sync product bookingHistory & payout status immediately across state
    setProducts(currentProducts => {
      return currentProducts.map(p => {
        let modified = false;
        const newHistory = (p.bookingHistory || []).map((b: any) => {
          if (b.orderId === targetId || b.orderId === (savedOrder as any).orderNumber || (!/^HOK-(REN|PRL|NEW)-/.test(String(targetId)) && `HOK-ORD-${String(b.orderId || '').replace(/[^0-9]/g, '').slice(-3)}` === `HOK-ORD-${String(targetId || '').replace(/[^0-9]/g, '').slice(-3)}`)) {
            modified = true;
            return { ...b, status: savedOrder.status };
          }
          return b;
        });

        const newExternal = (p.externalBookings || []).map((b: any) => {
          if (b.orderId === targetId || b.orderId === (savedOrder as any).orderNumber || (!/^HOK-(REN|PRL|NEW)-/.test(String(targetId)) && `HOK-ORD-${String(b.orderId || '').replace(/[^0-9]/g, '').slice(-3)}` === `HOK-ORD-${String(targetId || '').replace(/[^0-9]/g, '').slice(-3)}`)) {
            modified = true;
            return { ...b, status: savedOrder.status };
          }
          return b;
        });

        if (modified) {
          const rawId = targetId || (savedOrder as any).orderNumber;
          const displayId = rawId.startsWith('HOK-') ? rawId : `HOK-ORD-${String(rawId).replace(/[^0-9]/g, '').slice(-3) || '889'}`;
          const newActivityLog = [
            ...(p.activityLog || []),
            {
              action: `Order #${displayId} status updated to "${savedOrder.status}" by Admin`,
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

    if (!alreadySaved) {
      toast.success('Order updated successfully!');
    }
  };

  const handleUpdateOffer = async (id: string, updatedFields: Partial<Offer> & { amount?: number }) => {
    try {
      const currentOffer = offers.find((offer) => offer.id === id);
      const updated: any = updatedFields.status
        ? await offerApi.updateOfferStatus(id, updatedFields.status, currentOffer?.backendId, {
            mode: updatedFields.mode,
            rentalStartDate: updatedFields.rentalStartDate,
            rentalEndDate: updatedFields.rentalEndDate,
            address: updatedFields.address,
            amount: updatedFields.amount ?? updatedFields.offerPrice,
            createOrder: updatedFields.createOrder,
          })
        : await offerApi.updateOffer(id, updatedFields, currentOffer?.backendId);

      setOffers((current) =>
        current.map((o) =>
          o.id === id ? { ...o, ...updatedFields, ...updated } : o,
        ),
      );

      if (updated?.createdOrder) {
        handleAddOrder(updated.createdOrder);
        productApi.getProducts().then(setProducts).catch(() => {});
        toast.success(
          `Offer accepted & Order ${updated.createdOrder.orderId || updated.createdOrder.id} created!`,
        );
      } else {
        toast.success('Offer updated successfully!');
      }
    } catch (error) {
      console.error('Unable to update offer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update offer');
    }
  };

  const handleAddOffer = async (newOffer: Offer) => {
    try {
      const created: any = await offerApi.createOffer(newOffer);
      setOffers((current) => [created, ...current]);
      if (created.newCustomer) {
        setCustomers((curr) => {
          const exists = curr.some(
            (c) =>
              c.customerId === created.newCustomer.customerId ||
              c.id === created.newCustomer.id,
          );
          return exists ? curr : [created.newCustomer, ...curr];
        });
      }
      if (created.createdOrder) {
        handleAddOrder(created.createdOrder);
        productApi.getProducts().then(setProducts).catch(() => {});
        toast.success(
          `Order ${created.createdOrder.orderId || created.createdOrder.id} created & synced to Rental Calendar!`,
        );
      } else {
        toast.success('Offer / Enquiry added to list!');
      }
    } catch (error) {
      console.error('Unable to create offer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create offer');
    }
  };

  const handleAddProduct = async (newProd: Product) => {
    try {
      const created = await productApi.createProduct(newProd);
      setProducts((current) => [created, ...current]);
      toast.success('Product created successfully!');
      return created;
    } catch (error) {
      console.error('Unable to create product:', error);
      toast.error(error instanceof Error ? error.message : 'Unable to create product');
      throw error;
    }
  };

  const handleUpdateProduct = async (updated: Product) => {
    try {
      const saved = await productApi.updateProduct(updated);
      setProducts((current) =>
        current.map((p) => {
          const same =
            (p.productId && saved.productId && p.productId === saved.productId) ||
            (p.id && saved.id && p.id === saved.id) ||
            (p.id && updated.id && p.id === updated.id) ||
            ((p as any)._id &&
              (saved as any)._id &&
              String((p as any)._id) === String((saved as any)._id));
          return same ? saved : p;
        }),
      );
      toast.success('Product updated successfully!');
      return saved;
    } catch (error) {
      console.error('Unable to update product:', error);
      toast.error(error instanceof Error ? error.message : 'Unable to update product');
      throw error;
    }
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

  const handleApproveSubmission = async (id: string) => {
    const adminName = adminSession?.admin?.name || 'Soumya';
    try {
      await submissionService.approveSubmission(id, adminName);
      setSubmissions((prev) =>
        prev.map((s) =>
          (s.subid || s.id) === id
            ? {
                ...s,
                status: 'Approved',
                decision: { what: 'Approved', on: new Date().toISOString(), by: adminName, reason: null },
              }
            : s,
        ),
      );
      productApi.getProducts().then(setProducts).catch(() => {});
      toast.success('Submission approved!');
    } catch (err) {
      toast.error('Failed to approve submission');
    }
  };

  const handleRejectSubmission = async (id: string) => {
    const adminName = adminSession?.admin?.name || 'Soumya';
    try {
      await submissionService.rejectSubmission(id, adminName, 'OTHER', 'Declined from Dashboard');
      setSubmissions((prev) =>
        prev.map((s) =>
          (s.subid || s.id) === id
            ? {
                ...s,
                status: 'Rejected',
                decision: { what: 'Rejected', on: new Date().toISOString(), by: adminName, reason: 'Declined from Dashboard' },
              }
            : s,
        ),
      );
      toast.success('Submission marked as rejected.');
    } catch (err) {
      toast.error('Failed to reject submission');
    }
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
          customers={customers}
          listerSubmissions={submissions}
          activeListingsCount={products.filter(p => p.status !== 'Archived').length}
          adminName={adminSession?.admin?.name || 'Soumya'}
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
          customers={customers}
          setView={setView}
          setSelectedOrderId={setSelectedOrderId}
          onOrderCreated={(o: any) =>
            setOrders((current: any[]) => [o, ...current.filter((x: any) => x.id !== o.id)])
          }
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
            const formattedId = rawId.startsWith('HOK-')
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

      return (
        <OrderDetailView 
          orderId={orderId}
          order={matchedOrder ? undefined : undefined} // We want it to fetch via API if possible.
          onBack={() => setView('orders')}
          onUpdateOrder={handleUpdateOrder}
          onNavigateDispatch={() => setView('dispatch')}
        />
      );
    }

    if (currentView === 'offers') {
      return (
        <OffersView 
          offers={offers}
          products={products}
          customers={customers}
          listers={listers}
          currentAdminName={adminSession?.admin?.name || 'Soumya'}
          loading={offersLoading}
          onUpdateOffer={handleUpdateOffer}
          onAddOffer={handleAddOffer}
          onOfferRecordUpdated={(updatedOff) =>
            setOffers((curr) =>
              curr.map((o) => (o.id === updatedOff.id ? updatedOff : o)),
            )
          }
          onNavigateView={setView}
          onSelectOrder={(oid) => setView(`order_detail:${oid}`)}
          onCustomerCreated={(newCust) =>
            setCustomers((curr) => [newCust, ...curr])
          }
        />
      );
    }

    if (currentView === 'enquiries') {
      return (
        <EnquiriesView
          enquiries={enquiries}
          products={products}
          orders={orders}
          customers={customers}
          currentAdminName={adminSession?.admin?.name || 'Soumya'}
          loading={enquiriesLoading}
          initialEnquiryId={enquiryNavIntent?.enquiryId}
          initialAddPieceId={enquiryNavIntent?.addPieceId}
          onClearInitialIntent={() => setEnquiryNavIntent(null)}
          onEnquiriesChange={setEnquiries}
          onCustomerCreated={(newCust) => {
            handleAddCustomer(newCust);
          }}
          onOrderCreated={(newOrd) => {
            handleAddOrder(newOrd);
            productApi.getProducts().then(setProducts).catch(() => {});
          }}
          onOfferCreated={(newOff) => {
            if (newOff) {
              offerApi.getOffers().then(setOffers).catch(() => {});
            }
          }}
          onNavigateView={setView}
        />
      );
    }

    if (currentView === 'calendar') {
      return (
        <RentalCalendarView 
          orders={orders}
          products={products}
          tasks={calendarTasks}
          onAddTask={handleAddCalendarTask}
          onSelectOrder={(oid) => setView(`order_detail:${oid}`)}
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

    if (currentView === 'returns' || currentView === 'returns:ledger') {
      return (
        <ReturnsView 
          orders={orders}
          setView={setView}
          setSelectedOrderId={setSelectedOrderId}
          onUpdateOrder={handleUpdateOrder}
          initialTab={currentView === 'returns:ledger' ? 'ledger' : 'pipeline'}
        />
      );
    }

    if (currentView === 'payouts') {
      return (
        <PayoutsView
          orders={orders}
          products={products}
          listers={listers}
          onSelectOrder={(oid) => setView(`order_detail:${oid}`)}
          onSelectLister={(lid) => setView(`lister_detail:${lid}`)}
        />
      );
    }

    if (currentView === 'customers' || currentView.startsWith('customer_detail:')) {
      const initialCustomerId = currentView.startsWith('customer_detail:')
        ? currentView.slice('customer_detail:'.length)
        : undefined;
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
          initialCustomerId={initialCustomerId}
        />
      );
    }

    if (currentView === 'products' || currentView.startsWith('product_detail:')) {
      const initialProductId = currentView.startsWith('product_detail:')
        ? currentView.slice('product_detail:'.length)
        : undefined;
      return (
        <ProductsView
          products={products}
          orders={orders}
          offers={offers}
          enquiries={enquiries}
          promoCodes={promoCodes}
          loading={productsLoading}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          listers={listers}
          onEditingChange={setIsSectionEditing}
          onViewOrder={(orderId) => setView(`order_detail:${orderId}`)}
          onOpenEnquiry={(enquiryId) => {
            setEnquiryNavIntent({ enquiryId });
            setView('enquiries');
          }}
          onLogEnquiryForPiece={(prod) => {
            const pid = String(
              prod.productId || prod.id || (prod as any)._id || prod.name || '',
            );
            setEnquiryNavIntent({ addPieceId: pid });
            setView('enquiries');
          }}
          customers={customers}
          onAddCustomer={handleAddCustomer}
          onAddOrder={handleAddOrder}
          onDesignerCreated={(newDes) => {
            setDesigners((curr) => [newDes, ...curr]);
          }}
          onListerCreated={(newLis) => {
            setListers((curr) => {
              const uid = newLis?.listerId || newLis?.id || newLis?._id;
              const exists = curr.some(
                (l: any) => (l.listerId || l.id || l._id) === uid,
              );
              return exists ? curr : [newLis, ...curr];
            });
          }}
          initialProductId={initialProductId}
        />
      );
    }

    if (currentView === 'designers') {
      return (
        <DesignersView
          products={products}
          orders={orders}
          onEditingChange={setIsSectionEditing}
          setView={setView}
        />
      );
    }

    if (currentView === 'categories') {
      return <CategoriesView onEditingChange={setIsSectionEditing} />;
    }

    if (currentView === 'listers' || currentView.startsWith('lister_detail:')) {
      const initialListerId = currentView.startsWith('lister_detail:')
        ? currentView.slice('lister_detail:'.length)
        : undefined;
      return (
        <ListersView
          initialListerId={initialListerId}
          onEditingChange={setIsSectionEditing}
          setView={setView}
        />
      );
    }

    if (currentView === 'occasions') {
      return <OccasionsView />;
    }

    if (currentView === 'lyp') {
      return <LYPSubmissionsView onEditingChange={setIsSectionEditing} />;
    }

    if (currentView === 'reports') {
      return <ReportsView orders={orders} products={products} designers={designers} />;
    }

    if (currentView === 'promotions') {
      return (
        <PromotionsView 
          orders={orders}
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
          onSaveToServer={async (data) => {
            const api = await import('./services/siteSettingsApi');
            await api.updateSiteSettings(data);
          }}
          onBack={() => setView('homepage')}
          onNavigateNotifications={() => setView('notifications')}
        />
      );
    }
    if (currentView === 'homepage') {
      return (
        <HomepageView 
          homepage={homepage}
          onUpdateHomepage={setHomepage}
          onNavigateSiteSettings={() => setView('settings')}
          onNavigateToModule={(mod) => {
            const m = mod.toLowerCase();
            if (m === 'orders' || m === 'order') setView('orders');
            else if (m === 'products' || m === 'product' || m === 'catalogue') setView('products');
            else if (m === 'designers' || m === 'designer') setView('designers');
            else if (m === 'categories' || m === 'category') setView('categories');
            else if (m === 'occasions' || m === 'occasion') setView('occasions');
            else if (m === 'site settings' || m === 'settings') setView('settings');
            else setView(m as any);
          }}
        />
      );
    }

    if (currentView === 'pages' || currentView === 'platform_legal' || currentView === 'pages_editor') {
      return (
        <PagesModule
          key={currentView}
          initialSlug={currentView === 'platform_legal' ? '/terms' : null}
          initialTab={currentView === 'pages_editor' ? 'editor' : 'pages'}
          onBackToDashboard={() => setView('dashboard')}
        />
      );
    }

    return (
      <div className="p-8 text-center text-stone-500 font-sans">
        This view is currently under physical dry-clean clearance or configuration.
      </div>
    );
  };

  const handleLogout = () => { authApi.logoutAdmin(); setAdminSession(null); toast.success('Logged out successfully!'); };
  if (!adminSession) return <AdminAuth onLogin={(session) => { setAdminSession(session); toast.success('Logged in successfully!'); }} />;

  const pendingOffersBadge = offers.filter((o) => o.status === 'Pending').length;
  const openEnquiriesBadge = enquiries.filter((e) => {
    const isConv = Boolean(
      e.status === 'Converted' || e.linkedOrderId || e.linkedOfferId,
    );
    if (isConv) return false;
    if (e.status === 'New') return true;
    if (e.followUpDate && !['Converted', 'Closed'].includes(e.status)) {
      const todayKey = new Date().toISOString().slice(0, 10);
      return String(e.followUpDate).slice(0, 10) <= todayKey;
    }
    return false;
  }).length;
  const returnsActionBadge = orders.filter((o: any) => {
    const isRental = String(o.mode || '').toLowerCase() === 'rental' || Boolean(o.rentalStartDate);
    if (!isRental) return false;
    const st = String(o.status || '').toLowerCase();
    const depSt = String(o.depositDecision?.status || o.depositStatus || 'Pending').toLowerCase();
    if (st === 'returned' && depSt === 'pending' && Number(o.deposit || 0) > 0) return true;
    if (['dispatched', 'shipped', 'delivered', 'return sent', 'return due'].includes(st) && o.rentalEndDate) {
      const end = new Date(o.rentalEndDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return end < today;
    }
    return false;
  }).length;
  const pendingLypBadge = submissions.filter((s: any) => {
    if (s.decision && s.decision.what) {
      return s.decision.what === 'Pending' || s.decision.what === 'New' || s.decision.what === 'More Info';
    }
    const st = String(s.status || 'Pending').toLowerCase();
    return st === 'pending' || st === 'new';
  }).length;
  const totalNotifBadge = pendingOffersBadge + openEnquiriesBadge + returnsActionBadge + pendingLypBadge;

  const sidebarBadges: Record<string, number> = {
    notifications: totalNotifBadge,
    offers: pendingOffersBadge,
    enquiries: openEnquiriesBadge,
    returns: returnsActionBadge,
    lyp: pendingLypBadge,
  };

  const viewTitleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    notifications: 'Notifications',
    orders: 'Orders',
    offers: 'Offers',
    enquiries: 'Enquiries',
    calendar: 'Rental Calendar',
    dispatch: 'Dispatch Schedule',
    returns: 'Returns & Deposits',
    payouts: 'Payouts to Listers',
    customers: 'Customers',
    categories: 'Categories',
    products: 'Products',
    designers: 'Designers',
    listers: 'Listers',
    lyp: 'LYP Submissions',
    reports: 'Reports & Analytics',
    promotions: 'Promotions',
    messaging: 'Messaging',
  };

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
              badges={sidebarBadges}
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
          badges={sidebarBadges}
        />
      </div>

      {/* Main Content Workspace viewport */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
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
      {!isSectionEditing && currentView !== 'settings' && currentView !== 'homepage' && currentView !== 'pages' && currentView !== 'pages_editor' && !currentView.startsWith('lister_detail:') && (
          <header className="sticky top-0 z-40 hidden h-[52px] shrink-0 items-center justify-between border-b border-[#E8E0D6] bg-white px-6 lg:flex">
            <div className="flex items-center gap-3">
              {currentView === 'messaging' && messagingActiveTab === 'editor' ? (
                <button
                  onClick={() => {
                    setSelectedMessageId(null);
                    setMessagingActiveTab('messages');
                  }}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E5DDD3] bg-white px-3 text-[11.5px] font-medium text-[#6F675D] hover:bg-[#FAF8F5] transition cursor-pointer shadow-2xs mr-1"
                >
                  &lt; Back to Messages
                </button>
              ) : currentView !== 'dashboard' ? (
                <button
                  onClick={() => setView('dashboard')}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E5DDD3] bg-white px-3 text-[11.5px] font-medium text-[#38332D] hover:bg-[#FAF8F5] transition cursor-pointer shadow-2xs mr-1"
                >
                  &lt; Back to Dashboard
                </button>
              ) : null}
              <span className="text-[14px] font-semibold text-[#2C2926] font-sans">
                {currentView.startsWith('product_detail:')
                  ? 'Products'
                  : currentView.startsWith('customer_detail:')
                    ? 'Customers'
                    : currentView.startsWith('order_detail:')
                      ? 'Orders'
                      : viewTitleMap[currentView] || currentView.replace(/-/g, " ")}
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
                onClick={() => setView('notifications')}
                className="relative inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E5DDD3] bg-white px-3.5 text-[12px] font-medium text-[#38332D] hover:bg-[#FAF8F5] transition cursor-pointer shadow-2xs"
              >
                <Bell className="h-3.5 w-3.5 text-[#6F675D]" />
                <span>Notifications</span>
                {totalNotifBadge > 0 && (
                  <span className="ml-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#bf5b32] px-1 text-[10px] font-bold text-white">
                    {totalNotifBadge}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  const saveBtn = document.querySelector(".btn-gold, .btn-save, button[type='submit']") as HTMLButtonElement | null;
                  if (saveBtn) {
                    saveBtn.click();
                  } else {
                    toast.success("All changes are up to date!");
                  }
                }}
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
  currentView === 'pages' ||
  currentView === 'pages_editor' ||
  currentView === 'dispatch' ||
  isSectionEditing
    ? 'p-0'
    : 'p-4 sm:p-6'
}`}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
