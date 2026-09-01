import { Customer, Product, Order, Offer, Designer, Lister, ListerSubmission, PromoCode, EmailTemplate, SiteSettings, HomepageEditor } from './types';

export const initialCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Priya Rathore",
    email: "priya.r@gmail.com",
    phone: "+91 98765 11234",
    location: "Mumbai",
    ordersCount: 3,
    lifetimeValue: 23500,
    lastOrderDate: "15 Mar 2024",
    wishlistCount: 7,
    joinedDate: "10 Jan 2024",
    status: "Active",
    address: "Flat 4B, Sea View Apartments, Bandra West, Mumbai - 400050",
    gstin: "27AAAAA1111A1Z1",
    instagram: "@priya_rathore",
    birthDate: "1995-04-12",
    referrer: "Instagram Ad",
    preferences: {
      preferredSize: "S, M",
      preferredSilhouettes: "Lehenga, Anarkali",
      newsletter: true,
      whatsappNotifications: true
    },
    internalNotes: "VIP customer. 3 orders completed. Always returns on time in pristine condition."
  },
  {
    id: "CUST-002",
    name: "Neha Kulkarni",
    email: "neha.k@yahoo.com",
    phone: "+91 98200 54321",
    location: "Pune",
    ordersCount: 5,
    lifetimeValue: 48000,
    lastOrderDate: "22 Mar 2024",
    wishlistCount: 12,
    joinedDate: "15 Dec 2023",
    status: "Active",
    address: "Bunglow No. 8, Koregaon Park, Lane 3, Pune - 411001",
    instagram: "@neha_kulkarni_pune",
    birthDate: "1992-08-24",
    referrer: "Friend Referral",
    preferences: {
      preferredSize: "M, L",
      preferredSilhouettes: "Saree, Gown",
      newsletter: true,
      whatsappNotifications: false
    },
    internalNotes: "Very active renter. Prefers traditional silks and high-end designers."
  },
  {
    id: "CUST-003",
    name: "Diya Mehta",
    email: "diya.mehta@hotmail.com",
    phone: "+91 91670 71234",
    location: "Bangalore",
    ordersCount: 1,
    lifetimeValue: 68000,
    lastOrderDate: "21 Mar 2024",
    wishlistCount: 2,
    joinedDate: "21 Mar 2024",
    status: "Active",
    address: "12, Shanti Kunj, Koramangala 4th Block, Bangalore - 560034",
    instagram: "@diya_mehta_designs",
    birthDate: "1997-11-03",
    referrer: "Google Search",
    preferences: {
      preferredSize: "S",
      preferredSilhouettes: "Contemporary Saree, Sharara",
      newsletter: false,
      whatsappNotifications: true
    },
    internalNotes: "First order was a purchase of Midnight Blue Saree."
  },
  {
    id: "CUST-004",
    name: "Aishwarya Sharma",
    email: "aishwarya.s@gmail.com",
    phone: "+91 98110 43210",
    location: "Delhi",
    ordersCount: 1,
    lifetimeValue: 38000,
    lastOrderDate: "12 Mar 2024",
    wishlistCount: 4,
    joinedDate: "12 Mar 2024",
    status: "Active",
    address: "A-16, Defence Colony, New Delhi - 110024",
    instagram: "@aishwarya_sharma_official",
    birthDate: "1994-06-18",
    referrer: "Designer recommendation",
    preferences: {
      preferredSize: "M",
      preferredSilhouettes: "Indo-Western, Lehenga",
      newsletter: true,
      whatsappNotifications: true
    },
    internalNotes: "Rented an Ivory Sherwani for her brother's wedding. Excellent reviews."
  }
];

export const initialProducts: Product[] = [
  {
    id: "HOK-SAB-001",
    name: "Crimson Zardozi Bridal Lehenga",
    designer: "Sabyasachi",
    description: "A masterpiece in silk organza adorned with intricate zardozi and gota patti embroidery across the skirt, blouse, and dupatta. The deep crimson carries the warmth of traditional Indian bridal aesthetics.",
    category: "Bridal Lehenga",
    occasion: "Wedding, Sangeet, Reception",
    material: "Silk organza",
    embellishments: "Zardozi, Gota Patti, Resham",
    sizes: ["XL", "S", "M"],
    listingModes: ["Rental"],
    condition: "Excellent",
    availability: "Available Now",
    status: "Live",
    rentalPrice: 8500,
    securityDeposit: 15000,
    listingPrice: 250000,
    commissionRate: 25,
    minimumDurationDays: 4,
    extensionWindowDays: 2,
    cleaningBufferDays: 2,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60"],
    seoTitle: "Sabyasachi Crimson Zardozi Bridal Lehenga - Rent - House of Kaira",
    seoDescription: "Rent the Sabyasachi Crimson Zardozi Bridal Lehenga from ₹8,500 for 4 days. Silk organza with handcrafted zardozi. Doorstep delivery across India.",
    urlSlug: "sabyasachi-crimson-zardozi-bridal-lehenga",
    sku: "HOK-SAB-001",
    color: "Deep crimson",
    blockedDates: [
      { from: "2026-03-15", to: "2026-03-18", reason: "Booking HOK-ORD-001" }
    ],
    bookingHistory: [
      { orderId: "HOK-ORD-001", customerName: "Priya Rathore", date: "2026-03-15", amount: 17000, status: "Returned" }
    ]
  },
  {
    id: "HOK-SAB-002",
    name: "Gulabi Silk Bridal Lehenga",
    designer: "Sabyasachi",
    description: "An elegant Gulabi pink lehenga set featuring exquisite heritage tilla and sequin embroidery over pure Banarasi silk. Perfect for contemporary day weddings.",
    category: "Bridal Lehenga",
    occasion: "Bridal",
    material: "Gulabi silk",
    embellishments: "Heritage Tilla, Sequins, Pearls",
    sizes: ["S", "M"],
    listingModes: ["Rental", "Preloved"],
    condition: "Excellent",
    availability: "Available Now",
    status: "Live",
    rentalPrice: 6400,
    securityDeposit: 20000,
    listingPrice: 110000,
    commissionRate: 25,
    minimumDurationDays: 4,
    extensionWindowDays: 2,
    cleaningBufferDays: 3,
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=60"],
    seoTitle: "Gulabi Silk Bridal Lehenga - Sabyasachi",
    seoDescription: "Exquisite pink silk lehenga with gold tilla. Rental starts at ₹6,400.",
    urlSlug: "sabyasachi-gulabi-silk-lehenga",
    sku: "HOK-SAB-002",
    blockedDates: []
  },
  {
    id: "HOK-SAB-003",
    name: "Rajputana Silk Bridal Lehenga",
    designer: "Sabyasachi",
    description: "Heritage Rajputana silk bridal lehenga set with royal red hues and gold zari embroidery.",
    category: "Bridal Lehenga",
    occasion: "Wedding",
    material: "Rajputana silk",
    embellishments: "Gold Zari, Aari embroidery",
    sizes: ["S", "M", "L"],
    listingModes: ["Rental"],
    condition: "Pristine",
    availability: "Available Now",
    status: "Live",
    rentalPrice: 9900,
    securityDeposit: 20000,
    listingPrice: 280000,
    commissionRate: 25,
    minimumDurationDays: 4,
    extensionWindowDays: 2,
    cleaningBufferDays: 2,
    images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=60"],
    seoTitle: "Rajputana Silk Bridal Lehenga - Sabyasachi",
    seoDescription: "Royal red Rajputana silk lehenga.",
    urlSlug: "sabyasachi-rajputana-silk-lehenga",
    sku: "HOK-SAB-003",
    color: "Regal red"
  },
  {
    id: "HOK-MM-001",
    name: "Ivory Embroidered Sherwani",
    designer: "Manish Malhotra",
    description: "Sophisticated ivory sherwani featuring tone-on-tone thread work and subtle mirror embellishments. Paired with silk churidar and an organza stole.",
    category: "Sherwani",
    occasion: "Wedding, Reception",
    material: "Ivory silk",
    embellishments: "Threadwork",
    sizes: ["M", "L"],
    listingModes: ["Preloved"],
    condition: "Excellent",
    availability: "Available Now",
    status: "Live",
    rentalPrice: 0,
    securityDeposit: 0,
    listingPrice: 38000,
    commissionRate: 25,
    minimumDurationDays: 0,
    extensionWindowDays: 0,
    cleaningBufferDays: 0,
    images: ["https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=800&auto=format&fit=crop&q=60"],
    seoTitle: "Manish Malhotra Ivory Sherwani - Preloved",
    seoDescription: "Menswear elegance. Ivory Sherwani with hand-crafted mirror embroidery.",
    urlSlug: "manish-malhotra-ivory-sherwani",
    sku: "HOK-MM-001",
    blockedDates: [],
    bookingHistory: [
      { orderId: "HOK-ORD-002", customerName: "Aishwarya Sharma", date: "2026-03-12", amount: 38000, status: "Processed" }
    ]
  }
];

export const initialOrders: Order[] = [
  {
    id: "HOK-ORD-001",
    customerId: "CUST-001",
    customerName: "Priya Rathore",
    customerEmail: "priya.r@gmail.com",
    customerPhone: "+91 98765 11234",
    productId: "HOK-PRD-001",
    productName: "Crimson Zardozi Bridal Lehenga",
    designer: "Sabyasachi",
    mode: "Rental",
    amount: 8500,
    deposit: 15000,
    discount: 0,
    grandTotal: 23500,
    rentalStartDate: "2026-03-15",
    rentalEndDate: "2026-03-18",
    status: "Returned",
    address: "Flat 4B, Sea View Apartments, Bandra West, Mumbai - 400050",
    dispatchDetails: {
      dispatchedBy: "DHL Express",
      date: "2026-03-13",
      trackingNumber: "DHL12345678MN",
      courierPartner: "DHL Express"
    },
    returnLogistics: {
      returnDate: "2026-03-19",
      returnMethod: "Courier Pickup",
      courierPartner: "BlueDart Express"
    },
    conditionAssessment: {
      receivedDate: "2026-03-19",
      receivedBy: "Soumya",
      grade: "A",
      notes: "Returned in pristine condition. Dry cleaning was perfectly intact."
    },
    depositDecision: {
      status: "Released",
      releasedAmount: 15000,
      deductedAmount: 0,
      reason: "No damage detected. Released in full on return.",
      date: "2026-03-19"
    },
    logs: [
      { date: "2026-03-10 10:30 AM", message: "Order placed. Rental confirmed.", user: "System" },
      { date: "2026-03-10 10:45 AM", message: "Deposit ₹15,000 verified.", user: "Soumya" },
      { date: "2026-03-13 02:00 PM", message: "Dispatched via DHL Express (Tracking: DHL12345678MN)", user: "Logistics" },
      { date: "2026-03-19 11:30 AM", message: "Return Received. Condition marked: Excellent (Grade A)", user: "Soumya" },
      { date: "2026-03-19 11:45 AM", message: "Deposit released: ₹15,000 in Full.", user: "Finance" }
    ],
    internalNotes: "VIP renter, has completed multiple rentals without any issues."
  },
  {
    id: "HOK-ORD-002",
    customerId: "CUST-004",
    customerName: "Aishwarya Sharma",
    customerEmail: "aishwarya.s@gmail.com",
    customerPhone: "+91 98110 43210",
    productId: "HOK-PRD-003",
    productName: "Ivory Embroidered Sherwani",
    designer: "Manish Malhotra",
    mode: "Preloved",
    amount: 38000,
    deposit: 0,
    discount: 0,
    grandTotal: 38000,
    status: "Processed",
    address: "A-16, Defence Colony, New Delhi - 110024",
    dispatchDetails: {
      dispatchedBy: "BlueDart",
      date: "2026-03-14",
      trackingNumber: "BD987654321",
      courierPartner: "BlueDart"
    },
    logs: [
      { date: "2026-03-12 11:00 AM", message: "Preloved sale purchase confirmed.", user: "System" },
      { date: "2026-03-14 10:30 AM", message: "Dispatched to Delhi address via BlueDart", user: "Logistics" }
    ],
    internalNotes: "Sale item. No returns accepted under standard preloved terms."
  },
  {
    id: "HOK-ORD-003",
    customerId: "CUST-002",
    customerName: "Neha Kulkarni",
    customerEmail: "neha.k@yahoo.com",
    customerPhone: "+91 98200 54321",
    productId: "HOK-PRD-004",
    productName: "Rose Georgette Anarkali",
    designer: "Anita Dongre",
    mode: "Rental",
    amount: 6500,
    deposit: 10000,
    discount: 0,
    grandTotal: 16500,
    rentalStartDate: "2026-03-22",
    rentalEndDate: "2026-03-25",
    status: "Shipped",
    address: "Bunglow No. 8, Koregaon Park, Lane 3, Pune - 411001",
    dispatchDetails: {
      dispatchedBy: "BlueDart",
      date: "2026-03-20",
      trackingNumber: "BD1241512",
      courierPartner: "BlueDart"
    },
    logs: [
      { date: "2026-03-18 09:30 AM", message: "Booking confirmed. Deposit holding.", user: "System" },
      { date: "2026-03-20 03:00 PM", message: "Dispatched to Pune. Delivery scheduled for 21st.", user: "Logistics" }
    ],
    internalNotes: "Expected return date is 26th March."
  },
  {
    id: "HOK-ORD-004",
    customerId: "CUST-003",
    customerName: "Diya Mehta",
    customerEmail: "diya.mehta@hotmail.com",
    customerPhone: "+91 91670 71234",
    productId: "HOK-PRD-005",
    productName: "Midnight Blue Saree",
    designer: "Tarun Tahiliani",
    mode: "Buy",
    amount: 68000,
    deposit: 0,
    discount: 0,
    grandTotal: 68000,
    status: "Confirmed",
    address: "12, Shanti Kunj, Koramangala 4th Block, Bangalore - 560034",
    logs: [
      { date: "2026-03-21 04:30 PM", message: "New Purchase of Midnight Blue Saree. Order Paid.", user: "System" }
    ],
    internalNotes: "Need to package and ship by tomorrow morning."
  }
];

export const initialOffers: Offer[] = [
  {
    id: "OFR-207",
    customerName: "Priya Rathore",
    customerEmail: "priya.r@gmail.com",
    productName: "Gulabi Silk Bridal Lehenga",
    marketPrice: 110000,
    offerPrice: 100000,
    askPercentage: 91,
    date: "2026-03-22",
    status: "Countered", channel: "Website"
  },
  {
    id: "OFR-206",
    customerName: "Riya Mehta",
    customerEmail: "aishwarya.s@gmail.com",
    productName: "Gulabi Silk Bridal Lehenga",
    marketPrice: 110000,
    offerPrice: 70000,
    askPercentage: 64,
    date: "2026-03-23",
    status: "Expired", channel: "Website"
  },
  {
    id: "OFR-205",
    customerName: "Ritu Chandra",
    customerEmail: "neha.k@yahoo.com",
    productName: "Gulabi Silk Bridal Lehenga",
    marketPrice: 110000,
    offerPrice: 60000,
    askPercentage: 55,
    date: "2026-03-23",
    status: "Declined", channel: "Website"
  },
  {
    id: "OFR-204",
    customerName: "Aishwarya Sharma",
    customerEmail: "diya.mehta@hotmail.com",
    productName: "Gulabi Silk Bridal Lehenga",
    marketPrice: 110000,
    offerPrice: 80000,
    askPercentage: 73,
    date: "2026-03-18",
    status: "On Hold", channel: "WhatsApp"
  },
  { id: "OFR-203", customerName: "Kabir Malhotra", customerEmail: "kabir@example.com", productName: "Ivory Embroidered Sherwani", marketPrice: 38000, offerPrice: 32000, askPercentage: 84, date: "2026-03-17", status: "Accepted", channel: "WhatsApp" },
  { id: "OFR-202", customerName: "Divya Nair", customerEmail: "divya@example.com", productName: "Gulabi Silk Bridal Lehenga", marketPrice: 110000, offerPrice: 0, askPercentage: 0, date: "2026-03-16", status: "Enquiry", channel: "Instagram DM" },
  { id: "OFR-201", customerName: "Neha Kulkarni", customerEmail: "neha.k@yahoo.com", productName: "Gulabi Silk Bridal Lehenga", marketPrice: 110000, offerPrice: 88000, askPercentage: 80, date: "2026-03-15", status: "Pending", channel: "Website" }
];

export const initialDesigners: Designer[] = [
  {
    id: "DSGN-001",
    name: "Sabyasachi",
    slug: "sabyasachi",
    activeListings: 216,
    featured: true,
    status: "Active",
    bio: "India's most celebrated couturier, Sabyasachi Mukherjee is known for his signature vintage-inspired designs and textile-rich bridal wear.",
    foundedYear: "1999",
    website: "https://sabyasachi.com",
    instagram: "https://instagram.com/sabyasachiofficial",
    location: "Kolkata, India",
    accountManager: "Siddharth Sen",
    contactEmail: "partners@sabyasachi.com",
    contactPhone: "+91 33 2289 1234",
    payoutTerms: "30 Days after successful rental"
  },
  {
    id: "DSGN-002",
    name: "Manish Malhotra",
    slug: "manish-malhotra",
    activeListings: 157,
    featured: true,
    status: "Active",
    bio: "Synonymous with Bollywood glamour, Manish Malhotra creates magnificent, sparkling contemporary Indian ensembles featuring heavy mirror work.",
    foundedYear: "2005",
    website: "https://manishmalhotra.in",
    instagram: "https://instagram.com/manishmalhotra05",
    location: "Mumbai, India",
    accountManager: "Rhea Kapoor",
    contactEmail: "info@manishmalhotra.in",
    contactPhone: "+91 22 2605 9876",
    payoutTerms: "Standard 70/30 commission splits"
  },
  {
    id: "DSGN-003",
    name: "Tarun Tahiliani",
    slug: "tarun-tahiliani",
    activeListings: 143,
    featured: true,
    status: "Active",
    bio: "Pioneer of pre-draped luxury sarees and structured drapes. Merging European tailoring with rich Indian craftsmanship.",
    foundedYear: "1987",
    website: "https://taruntahiliani.com",
    instagram: "https://instagram.com/taruntahiliani",
    location: "Delhi NCR, India",
    accountManager: "Vikram Shah",
    contactEmail: "sales@taruntahiliani.com",
    contactPhone: "+91 124 400 5500"
  },
  {
    id: "DSGN-004",
    name: "Anita Dongre",
    slug: "anita-dongre",
    activeListings: 118,
    featured: true,
    status: "Active",
    bio: "Creating sustainable luxury with Gota Patti and Rajasthani craft preservation, representing comfortable yet opulent styling.",
    foundedYear: "1995",
    website: "https://anitadongre.com",
    instagram: "https://instagram.com/anitadongre"
  }
];

export const initialListers: Lister[] = [
  {
    id: "LST-001",
    name: "Aishwarya Sharma",
    email: "aishwarya.s@gmail.com",
    phone: "+91 98110 43210",
    location: "Delhi",
    listingsCount: 2,
    totalEarnings: 28500,
    pendingPayout: 0,
    status: "Active",
    joinedDate: "12 Mar 2024",
    instagram: "@aishwarya_sharma",
    referrer: "Instagram Influencer Campaign",
    bankDetails: {
      accountHolder: "Aishwarya Sharma",
      accountNumber: "XXXXXXXX4512",
      ifsc: "HDFC0001234",
      bankName: "HDFC Bank, Defence Colony, Delhi"
    },
    verified: true,
    internalNotes: "Verified celebrity lister. Reliable luxury wardrobe collections."
  },
  {
    id: "LST-002",
    name: "Meera Joshi",
    email: "meera.joshi@gmail.com",
    phone: "+91 98765 43210",
    location: "Mumbai",
    listingsCount: 3,
    totalEarnings: 19875,
    pendingPayout: 0,
    status: "Active",
    joinedDate: "05 Feb 2024",
    instagram: "@meera_j_mumbai",
    bankDetails: {
      accountHolder: "Meera Joshi",
      accountNumber: "XXXXXXXX9810",
      ifsc: "ICIC0000102",
      bankName: "ICICI Bank, Bandra West, Mumbai"
    },
    verified: true,
    internalNotes: "Reliable lister, has high-quality Sabyasachi pieces."
  },
  {
    id: "LST-003",
    name: "Kavya Reddy",
    email: "kavya.reddy@gmail.com",
    phone: "+91 98761 43295",
    location: "Hyderabad",
    listingsCount: 1,
    totalEarnings: 0,
    pendingPayout: 0,
    status: "Pending Review",
    joinedDate: "10 Mar 2024",
    instagram: "@kavya_reddy_hyd",
    bankDetails: {
      accountHolder: "Kavya Reddy",
      accountNumber: "XXXXXXXX7724",
      ifsc: "SBIN0002103",
      bankName: "SBI Jubilee Hills, Hyderabad"
    },
    verified: false,
    internalNotes: "Listing submission is pending physical inspection."
  }
];

export const initialListerSubmissions: ListerSubmission[] = [
  {
    id: "LSUB-001",
    listerName: "Gauri Shukla",
    listerId: "LST-004",
    productName: "Classic Velvet Sherwani - Manish Malhotra",
    category: "Sherwani",
    retailPrice: 180000,
    originalYear: "2023",
    condition: "As New - Worn Once",
    status: "Pending",
    submittedDate: "2026-03-18",
    description: "Mens Velvet Sherwani in Deep Blue with signature silver hand embroidery. Includes raw silk pajamas and matching dupatta."
  },
  {
    id: "LSUB-002",
    listerName: "Sana Shaikh",
    listerId: "LST-005",
    productName: "Champagne Banarasi Saree - Ritu Kumar",
    category: "Saree",
    retailPrice: 95000,
    originalYear: "2022",
    condition: "Excellent - Minimal Wear",
    status: "Pending",
    submittedDate: "2026-03-20",
    description: "Pure Banarasi silk saree in Champagne gold. Beautiful zari border. Handcrafted."
  }
];

export const initialPromoCodes: PromoCode[] = [
  {
    id: "PROM-001",
    code: "KAIRA20",
    discountValue: 20,
    discountType: "Percentage",
    minOrderValue: 5000,
    usageCount: 12,
    maxUses: 100,
    expiryDate: "2026-12-31",
    status: "Active",
    applicableModes: ["Rental"],
    maxUsesPerCustomer: 1
  },
  {
    id: "PROM-002",
    code: "FESTIVE1500",
    discountValue: 1500,
    discountType: "Flat",
    minOrderValue: 8000,
    usageCount: 34,
    maxUses: 50,
    expiryDate: "2026-06-30",
    status: "Active",
    applicableModes: ["Rental", "Preloved", "Buy"],
    maxUsesPerCustomer: 1
  }
];

export const initialEmailTemplates: EmailTemplate[] = [
  {
    id: "EMAIL-001",
    name: "Order Confirmed",
    subject: "Your HOK booking is confirmed - {product_name}",
    body: "Dear {customer_name},\n\nYour booking with House of Kaira is confirmed.\n\nOrder: #{order_id}\nPiece: {product_name}\nRental dates: {rental_dates}\nYour paid security deposit: {security_deposit}\n\nWe will dispatch your order 2 days before your rental starts.\n\nBest,\nHouse of Kaira Team",
    variables: ["customer_name", "order_id", "product_name", "rental_dates", "security_deposit"]
  },
  {
    id: "EMAIL-002",
    name: "Dispatched",
    subject: "Your House of Kaira order has been shipped! - #{order_id}",
    body: "Dear {customer_name},\n\nGreat news! Your designer piece is on its way.\n\nTracking Number: {tracking_number}\nCourier: {courier_partner}\nDelivery Address: {delivery_address}\n\nPlease inspect the garment upon arrival and log any fit concerns immediately.\n\nWarm regards,\nHouse of Kaira Logistics",
    variables: ["customer_name", "order_id", "tracking_number", "courier_partner", "delivery_address"]
  },
  {
    id: "EMAIL-003",
    name: "Return Reminder",
    subject: "Return scheduled for tomorrow - #{order_id}",
    body: "Hi {customer_name},\n\nWe hope you had a magical experience in your designer outfit!\n\nThis is a gentle reminder that your return pickup is scheduled for tomorrow morning.\n\nPlease place the garment back into the hanger, the fabric bag, and seal it in the transit box provided.\n\nOur courier partner will arrive between 10:00 AM and 1:00 PM.\n\nBest,\nHouse of Kaira",
    variables: ["customer_name", "order_id"]
  },
  {
    id: "EMAIL-004",
    name: "Deposit Released",
    subject: "Security Deposit Refund Initiated - #{order_id}",
    body: "Dear {customer_name},\n\nYour returned garment has undergone our standard physical check-in. It was assessed in {return_condition} condition.\n\nWe have released your security deposit of {deposit_amount} in full to your original payment method. The credit should reflect in 3-5 business days.\n\nThank you for renting responsibly!\n\nBest regards,\nHouse of Kaira Finance",
    variables: ["customer_name", "order_id", "return_condition", "deposit_amount"]
  },
  {
    id: "EMAIL-005",
    name: "Welcome",
    subject: "Welcome to House of Kaira - Luxury Wardrobes Shared",
    body: "Dear {customer_name},\n\nWelcome to India's premier luxury sharing and rental circle. You now have access to wear the country's finest heritage fashion, responsibly.\n\nBrowse the collections, schedule your next fitting, or learn about sharing your own wardrobe.\n\nYours in Style,\nSoumya, Founder & CEO",
    variables: ["customer_name"]
  }
];

export const initialSiteSettings: SiteSettings = {
  siteName: "House of Kaira",
  tagline: "Wear it. Return it. Love it again.",
  supportEmail: "hello@houseofkaira.com",
  whatsappNumber: "+91 91670 71234",
  instagramHandle: "@house_of_kaira",
  logoUrl: "",
  announcementBar: {
    text: "Elegance on demand. Book your wedding party wardrobes 3 months in advance.",
    enabled: false,
    backgroundColor: "#1e1412",
    textColor: "#fcf9f5"
  }
};

export const initialHomepage: HomepageEditor = {
  hero: {
    heading: "Dress for every celebration. Return when it's over.",
    subheading: "Curated luxury Indian occasion wear — to rent, buy preloved, or list your own.",
    primaryCtaLabel: "Explore the Edit",
    primaryCtaUrl: "/explore",
    secondaryCtaLabel: "List Your Piece",
    secondaryCtaUrl: "/list-your-piece"
  },
  testimonials: [
    {
      id: "TEST-001",
      author: "Ritu Verma",
      role: "Bridesmaid",
      text: "Wore a gorgeous Sabyasachi lehenga for my best friend's sangeet. The fit was perfect and dry cleaning was spotless. Highly recommend Kaira!",
      rating: 5
    }
  ]
};
