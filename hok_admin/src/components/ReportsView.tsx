import React, { useState, useMemo } from 'react';
import { BarChart2, TrendingUp, DollarSign, Calendar, Layers } from 'lucide-react';
import { Order, Product } from '../types';

interface ReportsViewProps {
  orders: Order[];
  products: Product[];
}

export default function ReportsView({ orders = [], products = [] }: ReportsViewProps) {
  const [timeRange, setTimeRange] = useState<'30days' | '90days' | '1year'>('30days');

  // Filter orders based on timeRange if dates exist
  const safeOrders = useMemo(() => {
    const now = new Date();
    return (orders || []).filter(o => {
      if (!o) return false;
      const orderDate = new Date(o.createdAt || o.date || now);
      if (isNaN(orderDate.getTime())) return true;
      const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
      if (timeRange === '30days') return diffDays <= 30;
      if (timeRange === '90days') return diffDays <= 90;
      if (timeRange === '1year') return diffDays <= 365;
      return true;
    });
  }, [orders, timeRange]);

  // Analytical Calculations from live database orders
  const rentalRevenue = safeOrders
    .filter(o => o && o.mode === 'Rental')
    .reduce((sum, o) => sum + (Number(o?.amount) || 0), 0);

  const prelovedRevenue = safeOrders
    .filter(o => o && (o.mode === 'Preloved' || o.mode === 'Buy'))
    .reduce((sum, o) => sum + (Number(o?.amount) || 0), 0);

  const totalTaxCollected = Math.round((rentalRevenue + prelovedRevenue) * 0.12);
  const totalRevenue = rentalRevenue + prelovedRevenue + totalTaxCollected;

  // Category demand dynamically derived from live orders & products
  const categoryCounts = useMemo(() => {
    const catMap: Record<string, number> = {};
    safeOrders.forEach(o => {
      const cat = (o as any)?.category || o?.productName || 'General';
      const cleanCat = cat.split(' ')[0] || 'Standard';
      catMap[cleanCat] = (catMap[cleanCat] || 0) + 1;
    });

    return Object.entries(catMap).map(([name, count]) => ({ name, count }));
  }, [safeOrders]);

  // Monthly Revenue Trend dynamically calculated from database orders
  const monthlyRevenue = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const mIdx = (currentMonthIndex - i + 12) % 12;
      last6Months.push({ label: months[mIdx], monthNum: mIdx, value: 0 });
    }

    safeOrders.forEach(o => {
      const d = new Date(o.createdAt || o.date || new Date());
      if (!isNaN(d.getTime())) {
        const m = d.getMonth();
        const found = last6Months.find(lm => lm.monthNum === m);
        if (found) {
          found.value += Math.round((Number(o.amount) || 0) / 1000);
        }
      }
    });

    const maxVal = Math.max(...last6Months.map(m => m.value), 1);
    return last6Months.map(m => ({
      ...m,
      pct: `${Math.max(Math.round((m.value / maxVal) * 100), 4)}%`
    }));
  }, [safeOrders]);

  // Top Performing Designers dynamically derived from database orders
  const designerEarnings = useMemo(() => {
    const designerMap: Record<string, { count: number; sales: number }> = {};
    let totalSales = 0;

    safeOrders.forEach(o => {
      const designerName = (o as any)?.designer || (o as any)?.designerName || (o as any)?.brand || 'Independent';
      if (!designerMap[designerName]) {
        designerMap[designerName] = { count: 0, sales: 0 };
      }
      const amt = Number(o.amount) || 0;
      designerMap[designerName].count += 1;
      designerMap[designerName].sales += amt;
      totalSales += amt;
    });

    return Object.entries(designerMap).map(([name, data]) => ({
      name,
      count: data.count,
      sales: data.sales,
      share: totalSales > 0 ? `${Math.round((data.sales / totalSales) * 100)}%` : '0%'
    })).sort((a, b) => b.sales - a.sales);
  }, [safeOrders]);

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Reports & Analytics</h2>
          <p className="text-xs text-stone-500 mt-1">
            Real-time financial summaries, tax reports, luxury categories demand, and listers share audits.
          </p>
        </div>

        <div className="flex gap-1">
          {(['30days', '90days', '1year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 border rounded font-semibold text-[11px] transition cursor-pointer ${
                timeRange === range
                  ? 'bg-[#c5a880] border-[#c5a880] text-white shadow-sm'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {range === '30days' ? 'Last 30 Days' : range === '90days' ? 'Last 90 Days' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Bento Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm relative">
          <DollarSign className="absolute right-3 top-3 h-5 w-5 text-stone-300" />
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider font-sans">Gross Revenue (Incl. Tax)</p>
          <h3 className="text-xl font-serif font-bold text-stone-900 mt-1.5">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          <p className="text-[10px] text-stone-400 font-medium mt-1">
            Live database calculation
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm relative">
          <BarChart2 className="absolute right-3 top-3 h-5 w-5 text-stone-300" />
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider font-sans">Rental Share</p>
          <h3 className="text-xl font-serif font-bold text-stone-900 mt-1.5">₹{rentalRevenue.toLocaleString('en-IN')}</h3>
          <span className="text-[9px] text-stone-400">Excluding security escrow</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm relative">
          <Layers className="absolute right-3 top-3 h-5 w-5 text-stone-300" />
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider font-sans">Preloved Sales</p>
          <h3 className="text-xl font-serif font-bold text-stone-900 mt-1.5">₹{prelovedRevenue.toLocaleString('en-IN')}</h3>
          <span className="text-[9px] text-stone-400">Permanent wardrobe transfers</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-sm relative">
          <Calendar className="absolute right-3 top-3 h-5 w-5 text-stone-300" />
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider font-sans">12% GST Tax collected</p>
          <h3 className="text-xl font-serif font-bold text-stone-900 mt-1.5">₹{totalTaxCollected.toLocaleString('en-IN')}</h3>
          <span className="text-[9px] text-stone-400">Ready for statutory filing</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales visual chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-150 pb-2">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Monthly Revenue Trend (GST filing helper)</h3>
            <span className="text-[10px] text-stone-400 font-semibold font-mono">₹ Values in Thousands</span>
          </div>

          <div className="pt-4">
            <div className="h-44 flex items-end justify-between gap-6 px-4">
              {monthlyRevenue.map((month) => (
                <div key={month.label} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                  <div className="text-[10px] font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition duration-150">
                    ₹{month.value}k
                  </div>
                  <div 
                    className="w-full bg-[#eae1d8] group-hover:bg-[#c5a880] rounded transition-all duration-500 ease-out"
                    style={{ height: month.pct }}
                  />
                  <span className="text-[10px] font-semibold text-stone-500">{month.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories performance */}
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-150 pb-2">Demand by Outfit silhouette</h3>
          <div className="space-y-3 font-sans">
            {categoryCounts.length === 0 ? (
              <p className="text-stone-400 italic py-6 text-center">No categories data recorded yet in database.</p>
            ) : (
              categoryCounts.map(cat => {
                const maxVal = Math.max(...categoryCounts.map(c => c.count), 1);
                const pct = (cat.count / maxVal) * 100;
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between items-center text-stone-700">
                      <span className="font-semibold">{cat.name}</span>
                      <span className="font-bold">{cat.count} rents</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="bg-[#c5a880] h-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top partners label analytics */}
        <div className="lg:col-span-3 bg-white p-5 rounded-lg border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-150 pb-2">
            Top Performing Designer Label shares
          </h3>
          <div className="overflow-x-auto">
            {designerEarnings.length === 0 ? (
              <div className="py-8 text-center text-stone-400 font-medium">
                No orders recorded yet. As orders are placed in the database, designer label revenue shares will appear here.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-400 uppercase font-bold text-[9px] border-b border-stone-150 tracking-wider">
                    <th className="px-4 py-3">Label Name</th>
                    <th className="px-4 py-3">Completed Bookings</th>
                    <th className="px-4 py-3">Total Sales Share (Gross)</th>
                    <th className="px-4 py-3">Percentage Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
                  {designerEarnings.map(des => (
                    <tr key={des.name} className="hover:bg-stone-50 transition">
                      <td className="px-4 py-3 font-bold text-stone-850">{des.name}</td>
                      <td className="px-4 py-3 font-semibold text-stone-700">{des.count} Orders</td>
                      <td className="px-4 py-3 font-bold text-stone-900">₹{des.sales.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div className="bg-[#1e1412] h-full" style={{ width: des.share }} />
                          </div>
                          <span className="font-bold text-stone-500">{des.share}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
