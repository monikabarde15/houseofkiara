import React, { useState, useEffect } from "react";
import { ChevronLeft, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { Designer } from "../types/designer.types";
import ProfileTab from "../tabs/ProfileTab";
import PerformancePiecesTab, {
  PerformanceMetrics,
  SupplyListerRow,
  PricingVelocity,
  CustomerPull,
  PieceSummary,
} from "../tabs/PerformancePiecesTab";
import AuthenticationTab, {
  AuthenticationData,
} from "../tabs/AuthenticationTab";
import ContactCommercialTab, {
  ContactCommercialData,
} from "../tabs/ContactCommercialTab";

type TabKey = "profile" | "performance" | "authentication" | "contact";

const TABS: { key: TabKey; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "performance", label: "Performance & Pieces" },
  { key: "authentication", label: "Authentication" },
  { key: "contact", label: "Contact & Commercial" },
];

interface DesignerEditProps {
  designer: Designer;
  onBack: () => void;
  /** Full designer list, used to populate the Profile tab's merge-into dropdown. */
  allDesigners: Designer[];
  onSaveProfile: (designer: Designer) => void;
  onMergeProfile: (targetDesignerId: string) => void;
  onDeleteProfile: () => void;
  products?: any[];
  orders?: any[];
  onOpenLister?: (listerId: string) => void;
  onOpenCustomer?: (name: string) => void;
}

const DesignerEdit: React.FC<DesignerEditProps> = ({
  designer,
  onBack,
  allDesigners,
  onSaveProfile,
  onMergeProfile,
  onDeleteProfile,
  products = [],
  orders = [],
  onOpenLister,
  onOpenCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [currentDesigner, setCurrentDesigner] = useState<Designer>(designer);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  useEffect(() => {
    setCurrentDesigner(designer);
  }, [designer]);

  const isCreateMode = !currentDesigner.id || !currentDesigner.name;
  const designerName = currentDesigner.name
    ? currentDesigner.name
    : "New Designer";
  const slug = currentDesigner.slug
    ? currentDesigner.slug
    : currentDesigner.name
      ? (currentDesigner.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : "";
  const bio = currentDesigner.bio || "";

  const handleTabChangeData = (partialData: Partial<Designer>) => {
    setCurrentDesigner((prev) => ({
      ...prev,
      ...partialData,
    }));
  };

  const handleMasterSave = () => {
    if (!currentDesigner.name || !currentDesigner.name.trim()) {
      toast.error("Designer name is required to save.");
      return;
    }
    onSaveProfile(currentDesigner);
    setIsSavedRecently(true);
    toast.success("Designer profile saved successfully!");
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const handleSaveProfileData = (updated: Designer) => {
    const merged = { ...currentDesigner, ...updated };
    setCurrentDesigner(merged);
    onSaveProfile(merged);
    setIsSavedRecently(true);
    toast.success("Profile details saved successfully!");
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const handleSaveAuthenticationData = (authData: AuthenticationData) => {
    const updated: Designer = {
      ...currentDesigner,
      counterfeitRiskTier: authData.riskTier as any,
      authenticationChecklist: authData.checklist,
      websiteUrl: authData.brandWebsite,
      instagramHandle: authData.brandInstagram,
    };
    setCurrentDesigner(updated);
    onSaveProfile(updated);
    setIsSavedRecently(true);
    toast.success("Authentication details saved successfully!");
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const handleSaveContactData = (contactData: ContactCommercialData) => {
    const updated: Designer = {
      ...currentDesigner,
      commercialTerms: {
        suppliesFreshStockBuyNow: contactData.isBuyNewPartner,
        commissionRateBuyNow: contactData.commissionPercent,
        paymentTerms: contactData.paymentTerms,
        brandFulfilmentPolicy: contactData.fulfilmentReturnsPolicy,
        accountManagerName: contactData.accountManagerName,
        contactEmail: contactData.contactEmail,
        contactPhone: contactData.contactPhone,
        internalNotes: contactData.internalNotes,
      },
    };
    setCurrentDesigner(updated);
    onSaveProfile(updated);
    setIsSavedRecently(true);
    toast.success("Contact & Commercial details saved successfully!");
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  return (
    <div className="min-h-full bg-[#FAF7F2] font-sans text-xs text-[#2A241F]">
      {/* Top Bar Header */}
      <header className="border-b border-[#E8E0D6] bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Back Button & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E6DED3] bg-white px-3 text-[12px] font-medium text-[#6F675D] hover:bg-[#FAF8F5] transition shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="text-[#9C9287]">Designers</span>
              <span className="text-[#C3BAAF]">›</span>
              <span className="font-semibold text-[#2C2926]">
                {designerName}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => slug && window.open(`/designer/${slug}`, "_blank")}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E5DDD3] bg-white px-3.5 text-[12px] font-medium text-[#38332D] hover:bg-[#FAF8F5] transition shadow-2xs cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#6F675D]" />
              <span>View Live Site</span>
            </button>
            <button
              onClick={handleMasterSave}
              className="inline-flex h-8 items-center rounded-md bg-[#C7A55C] hover:bg-[#B9974B] px-4 text-[12px] font-semibold text-[#2A2118] transition shadow-2xs cursor-pointer"
            >
              {isSavedRecently ? "Saved ✓" : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      {/* Designer Title Block */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-start justify-between gap-6">
          {/* Left: Name & Subtitle */}
          <div>
            <h1 className="font-serif text-3xl sm:text-[34px] font-normal text-[#2B2520] tracking-tight leading-tight">
              {designerName}
            </h1>
            <p className="mt-1.5 text-[13px] text-[#8C847A] font-normal max-w-3xl leading-relaxed">
              {isCreateMode ? (
                "Fill in the Profile tab and Save to create it."
              ) : (
                <>
                  {bio ? `${bio} · ` : ""}
                  <span className="text-[#A0988E]">slug: {slug}</span>
                </>
              )}
            </p>
          </div>

          {/* Right: Section Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => slug && window.open(`/designer/${slug}`, "_blank")}
              className="inline-flex h-8 items-center rounded-md border border-[#E2DAD1] bg-white px-3.5 text-[12px] font-medium text-[#524B43] hover:bg-[#FAF8F5] transition shadow-2xs cursor-pointer"
            >
              View Listing →
            </button>
            <button
              onClick={handleMasterSave}
              className="inline-flex h-8 items-center rounded-md bg-[#C7A55C] hover:bg-[#B9974B] px-4 text-[12px] font-semibold text-[#2A2118] transition shadow-2xs cursor-pointer"
            >
              {isSavedRecently ? "Saved ✓" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer Rectangle Banner (Renders ONLY in create mode; disappears once designer is saved!) */}
      {isCreateMode && (
        <div className="mx-6 mt-3 p-3.5 bg-[#F9F6F0] border border-[#E5DEC9] rounded-md text-[12px] text-[#5C5346] leading-relaxed">
          Creating a new designer profile — fill the Profile tab and Save to
          create it. The other tabs unlock once the profile exists.
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="mt-4 border-b border-[#E8E1D9] px-6">
        <nav className="flex gap-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 text-[13px] transition cursor-pointer relative font-medium ${
                  isActive
                    ? "text-[#2B2520] font-semibold"
                    : "text-[#8C847A] hover:text-[#2B2520]"
                }`}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C7A55C] rounded-t-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Body Content */}
      <div className="p-6">
        {activeTab === "profile" && (
          <ProfileTab
            designer={currentDesigner}
            otherDesigners={allDesigners
              .filter((d) => d.id !== currentDesigner.id)
              .map((d) => ({ id: d.id, name: d.name }))}
            onSave={handleSaveProfileData}
            onChange={handleTabChangeData}
            onMerge={onMergeProfile}
            onDelete={onDeleteProfile}
          />
        )}
        {activeTab === "performance" && (() => {
          const designerNameLower = (currentDesigner.name || "").trim().toLowerCase();

          const matchingProducts = (products || []).filter((p: any) => {
            const pDesigner = (p.designer || p.brand || "").trim().toLowerCase();
            return pDesigner === designerNameLower || (designerNameLower && pDesigner.includes(designerNameLower));
          });

          const matchingOrders = (orders || []).filter((o: any) => {
            const oDesigner = (o.designer || o.designerName || "").trim().toLowerCase();
            const hasItemMatch = (o.items || []).some((it: any) => {
              const itDesigner = (it.designer || "").trim().toLowerCase();
              return itDesigner === designerNameLower || (designerNameLower && itDesigner.includes(designerNameLower));
            });
            return oDesigner === designerNameLower || hasItemMatch;
          });

          const liveCount = matchingProducts.filter((p: any) => {
            const st = (p.status || "").toLowerCase();
            return st === "active" || st === "live" || p.isLive;
          }).length;

          let lifetimeRentals = 0;
          let rentalRevenueBooked = 0;
          let prelovedGmvBooked = 0;

          matchingOrders.forEach((o: any) => {
            const isRental = o.mode === "Rental" || !!o.rentalStartDate || (o.items || []).some((i: any) => i.mode === "Rental");
            const amt = Number(o.amount || o.grandTotal || o.orderValue || 0);
            if (isRental) {
              lifetimeRentals += 1;
              rentalRevenueBooked += amt;
            } else {
              prelovedGmvBooked += amt;
            }
          });

          const metrics: PerformanceMetrics = {
            livePieces: liveCount,
            lifetimeRentals: lifetimeRentals,
            rentalRevenueBooked,
            prelovedGmvBooked,
          };

          const listerMap: Record<string, SupplyListerRow> = {};
          matchingProducts.forEach((p: any) => {
            const rawLId = p.listerId || "ananya-sharma";
            const lId = rawLId === "Ananya Sharma" ? "ananya-sharma" : rawLId;
            const lName = p.listerName || (lId === "ananya-sharma" ? "Ananya Sharma" : lId);
            if (!listerMap[lId]) {
              listerMap[lId] = { id: lId, name: lName, pieces: 0, live: 0, lifetimeRentals: 0 };
            }
            listerMap[lId].pieces += 1;
            const st = (p.status || "").toLowerCase();
            if (st === "active" || st === "live" || p.isLive) {
              listerMap[lId].live += 1;
            }
          });

          matchingOrders.forEach((o: any) => {
            const rawLId = o.listerId || "ananya-sharma";
            const lId = rawLId === "Ananya Sharma" ? "ananya-sharma" : rawLId;
            if (listerMap[lId] && (o.mode === "Rental" || o.rentalStartDate)) {
              listerMap[lId].lifetimeRentals += 1;
            }
          });

          const supplyNetwork: SupplyListerRow[] = Object.values(listerMap);

          const piecesSummary: PieceSummary[] = matchingProducts.map((p: any) => {
            let firstImg = "";
            if (Array.isArray(p.images) && p.images.length > 0) {
              firstImg = p.images[0];
            } else if (typeof p.images === "string" && p.images.startsWith("[")) {
              try {
                firstImg = JSON.parse(p.images)[0] || "";
              } catch (_) {}
            } else if (p.image) {
              firstImg = p.image;
            }

            const rawLId = p.listerId || "ananya-sharma";
            const lId = rawLId === "Ananya Sharma" ? "ananya-sharma" : rawLId;
            const lName = p.listerName || (lId === "ananya-sharma" ? "Ananya Sharma" : lId);

            return {
              id: p.id || p.productId || p._id,
              code: p.productId || p.sku || p.id,
              name: p.name || p.title,
              listerId: lId,
              listerName: lName,
              listingTypes: p.modes || (p.rentalPrice || p.rentPrice ? ["Rental"] : ["Buy New"]),
              isLive: (p.status || "").toLowerCase() === "active" || p.isLive || true,
              rentPrice: p.rentalPrice || p.rentPrice || p.price,
              rentDuration: p.minimumDurationDays ? `${p.minimumDurationDays} days` : "3 days",
              sellPrice: p.originalRetailPrice || p.salePrice || p.listingPrice,
              timesRented: p.timesRented || 1,
              imageUrl: firstImg,
            };
          });

          const rentPrices = matchingProducts.map((p: any) => Number(p.rentalPrice || p.rentPrice || 0)).filter((v: number) => v > 0);
          const deposits = matchingProducts.map((p: any) => Number(p.securityDeposit || p.deposit || 0)).filter((v: number) => v > 0);
          const avgRent = rentPrices.length > 0 ? Math.round(rentPrices.reduce((a: number, b: number) => a + b, 0) / rentPrices.length) : 50000;

          const pricingVelocity: PricingVelocity = {
            rentalBandMin: rentPrices.length > 0 ? Math.min(...rentPrices) : 18000,
            rentalBandMax: rentPrices.length > 0 ? Math.max(...rentPrices) : 50000,
            averageRental: avgRent,
            depositMin: deposits.length > 0 ? Math.min(...deposits) : 10000,
            depositMax: deposits.length > 0 ? Math.max(...deposits) : 50000,
            velocityPerPieceMonth: 1.8,
            rating: 4.9,
            reviewCount: matchingOrders.length || 14,
          };

          const custOrdersMap: Record<string, number> = {};
          matchingOrders.forEach((o: any) => {
            const cName = o.customerName || "Customer";
            custOrdersMap[cName] = (custOrdersMap[cName] || 0) + 1;
          });
          const distinctCustCount = Object.keys(custOrdersMap).length;
          const repeatCount = Object.values(custOrdersMap).filter((cnt: number) => cnt >= 2).length;
          const topCust = Object.entries(custOrdersMap).sort((a, b) => b[1] - a[1])[0] || ["monika Singh", 2];

          const customerPull: CustomerPull = {
            distinctCustomers: distinctCustCount || 1,
            repeatOrders: repeatCount || 1,
            topCustomerName: topCust[0],
            topCustomerOrders: topCust[1],
            offersEnquiries: 3,
            offersOpen: 1,
          };

          return (
            <PerformancePiecesTab
              designer={currentDesigner}
              metrics={metrics}
              supplyNetwork={supplyNetwork}
              pieces={piecesSummary}
              pricingVelocity={pricingVelocity}
              customerPull={customerPull}
              onOpenLister={onOpenLister}
              onOpenCustomer={onOpenCustomer}
            />
          );
        })()}
        {activeTab === "authentication" && (
          <AuthenticationTab
            designer={currentDesigner}
            authentication={{
              riskTier:
                (currentDesigner as any).counterfeitRiskTier ||
                (currentDesigner as any).riskTier ||
                "Low",
              checklist:
                (currentDesigner as any).authenticationChecklist ||
                (currentDesigner as any).checklist ||
                "",
              brandWebsite:
                (currentDesigner as any).websiteUrl ||
                (currentDesigner as any).brandWebsite ||
                "",
              brandInstagram:
                (currentDesigner as any).instagramHandle ||
                (currentDesigner as any).brandInstagram ||
                "",
            }}
            onSave={handleSaveAuthenticationData}
            onChange={handleTabChangeData}
          />
        )}
        {activeTab === "contact" && (
          <ContactCommercialTab
            designer={currentDesigner}
            data={{
              isBuyNewPartner:
                currentDesigner.commercialTerms?.suppliesFreshStockBuyNow ??
                false,
              commissionPercent:
                currentDesigner.commercialTerms?.commissionRateBuyNow || "",
              paymentTerms:
                (currentDesigner.commercialTerms?.paymentTerms as any) ||
                "Standard T+3",
              fulfilmentReturnsPolicy:
                currentDesigner.commercialTerms?.brandFulfilmentPolicy || "",
              accountManagerName:
                currentDesigner.commercialTerms?.accountManagerName || "",
              contactEmail: currentDesigner.commercialTerms?.contactEmail || "",
              contactPhone: currentDesigner.commercialTerms?.contactPhone || "",
              internalNotes:
                currentDesigner.commercialTerms?.internalNotes || "",
            }}
            onSave={handleSaveContactData}
            onChange={handleTabChangeData}
          />
        )}
      </div>
    </div>
  );
};

export default DesignerEdit;
