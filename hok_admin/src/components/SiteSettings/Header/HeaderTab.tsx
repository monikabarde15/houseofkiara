import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
} from 'lucide-react';

interface MenuLink {
  id: string;
  label: string;
  link: string;
  shown: boolean;
}

interface MenuColumn {
  id: string;
  title: string;
  links: MenuLink[];
}

interface NavigationItem {
  id: string;
  label: string;
  link: string;
  badge: string;
  menu: boolean;
  style: 'Plain' | 'Accent' | 'Highlight';
  shown: boolean;
  columns: MenuColumn[];
}

interface HeaderTabProps {
  navigationBlocks: any[];
  setNavigationBlocks: React.Dispatch<React.SetStateAction<any[]>>;

  shopByCategoryItems: any[];
  setShopByCategoryItems: React.Dispatch<React.SetStateAction<any[]>>;

  shopByDesignerItems: any[];
  setShopByDesignerItems: React.Dispatch<React.SetStateAction<any[]>>;

  searchPlaceholder: string;
  setSearchPlaceholder: (value: string) => void;

  bagCartLabel: string;
  setBagCartLabel: (value: string) => void;
}

const defaultNavigation: NavigationItem[] = [
  {
    id: 'rent',
    label: 'Rent',
    link: '/rent',
    badge: 'Badge',
    menu: true,
    style: 'Accent',
    shown: true,
    columns: [
      {
        id: 'category',
        title: 'Shop by Category',
        links: [
          { id: 'bridal', label: 'Bridal Lehengas', link: '/rent/bridal', shown: true },
          { id: 'sarees', label: 'Sarees', link: '/rent/sarees', shown: true },
          { id: 'anarkalis', label: 'Anarkalis', link: '/rent/anarkalis', shown: true },
          { id: 'sharara', label: 'Sharara Sets', link: '/rent/sharara', shown: true },
          { id: 'sherwanis', label: 'Sherwanis', link: '/rent/sherwanis', shown: true },
          { id: 'kurta', label: 'Kurta Sets', link: '/rent/kurta', shown: true },
          { id: 'all', label: 'See all categories', link: '/rent/all', shown: true },
        ],
      },
      {
        id: 'designer',
        title: 'Shop by Designer',
        links: [
          { id: 'sabyasachi', label: 'Sabyasachi', link: '/rent/sabyasachi', shown: true },
          { id: 'mm', label: 'Manish Malhotra', link: '/rent/mm', shown: true },
          { id: 'anita', label: 'Anita Dongre', link: '/rent/anita', shown: true },
          { id: 'tarun', label: 'Tarun Tahiliani', link: '/rent/tarun', shown: true },
          { id: 'ajs', label: 'Abu Jani Sandeep', link: '/rent/ajs', shown: true },
          { id: 'torani', label: 'Torani', link: '/rent/torani', shown: true },
          { id: 'rawmango', label: 'Raw Mango', link: '/rent/rawmango', shown: true },
          { id: 'rimzim', label: 'Rimzim Dadu', link: '/rent/rimzim', shown: true },
          { id: 'designers', label: 'See all designers', link: '/rent/designers', shown: true },
        ],
      },
    ],
  },
  {
    id: 'preloved',
    label: 'Buy Preloved',
    link: '/buy-preloved',
    badge: 'Badge',
    menu: true,
    style: 'Plain',
    shown: true,
    columns: [],
  },
  {
    id: 'new',
    label: 'Buy New',
    link: '/buy-new',
    badge: 'Badge',
    menu: true,
    style: 'Plain',
    shown: true,
    columns: [],
  },
  {
    id: 'women',
    label: 'Women',
    link: '/women',
    badge: 'Badge',
    menu: true,
    style: 'Plain',
    shown: true,
    columns: [],
  },
  {
    id: 'men',
    label: 'Men',
    link: '/men',
    badge: 'Badge',
    menu: true,
    style: 'Plain',
    shown: true,
    columns: [],
  },
  {
    id: 'occasions',
    label: 'Occasions',
    link: '/occasions',
    badge: 'Badge',
    menu: true,
    style: 'Plain',
    shown: true,
    columns: [],
  },
  {
    id: 'designers',
    label: 'Designers',
    link: '/designers',
    badge: 'Badge',
    menu: true,
    style: 'Plain',
    shown: true,
    columns: [],
  },
  {
    id: 'categories',
    label: 'Shop by Category',
    link: '/categories',
    badge: 'Badge',
    menu: false,
    style: 'Plain',
    shown: true,
    columns: [],
  },
  {
    id: 'how',
    label: 'How It Works',
    link: '/how-it-works',
    badge: 'Badge',
    menu: false,
    style: 'Plain',
    shown: false,
    columns: [],
  },
  {
    id: 'about',
    label: 'About HOK',
    link: '/about',
    badge: 'Badge',
    menu: false,
    style: 'Plain',
    shown: false,
    columns: [],
  },
  {
    id: 'arrivals',
    label: 'New Arrivals',
    link: '/new-arrivals',
    badge: 'New',
    menu: false,
    style: 'Plain',
    shown: true,
    columns: [],
  },
  {
    id: 'list',
    label: 'List Your Piece',
    link: '/list-your-piece',
    badge: 'Badge',
    menu: false,
    style: 'Highlight',
    shown: true,
    columns: [],
  },
];

export default function HeaderTab({
  navigationBlocks,
  setNavigationBlocks,
  searchPlaceholder,
  setSearchPlaceholder,
  bagCartLabel,
  setBagCartLabel,
}: HeaderTabProps) {

 const [navigation, setNavigation] = useState<NavigationItem[]>(
  navigationBlocks?.length
    ? navigationBlocks.map((item) => ({
        ...item,
        columns: (item.columns ?? []).map((column: any) => ({
          ...column,
          links: column.links ?? [],
        })),
      }))
    : defaultNavigation
);

  const [expandedId, setExpandedId] = useState<string | null>('rent');

  const [stickyHeader, setStickyHeader] = useState(true);
  const [showTagline, setShowTagline] = useState(true);

  const [backLink, setBackLink] = useState('Back to cart');
  const [securityLine, setSecurityLine] = useState(
    'SSL encrypted · Secured by Razorpay'
  );
  const [pagesUsingIt, setPagesUsingIt] = useState(
    'Checkout, Payment, Order confirmation'
  );

  const updateNavigation = (updated: NavigationItem[]) => {
    setNavigation(updated);
    setNavigationBlocks(updated);
  };

  const updateItem = (
    id: string,
    updates: Partial<NavigationItem>
  ) => {
    updateNavigation(
      navigation.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newList = [...navigation];

    if (direction === 'up' && index > 0) {
      [newList[index - 1], newList[index]] = [
        newList[index],
        newList[index - 1],
      ];
    }

    if (
      direction === 'down' &&
      index < newList.length - 1
    ) {
      [newList[index + 1], newList[index]] = [
        newList[index],
        newList[index + 1],
      ];
    }

    updateNavigation(newList);
  };

  const removeItem = (id: string) => {
    updateNavigation(
      navigation.filter((item) => item.id !== id)
    );
  };

  const updateMenuColumn = (
    itemId: string,
    columnId: string,
    updates: Partial<MenuColumn>
  ) => {
    updateNavigation(
      navigation.map((item) => {
        if (item.id !== itemId) return item;

        return {
          ...item,
          columns: item.columns.map((column) =>
            column.id === columnId
              ? { ...column, ...updates }
              : column
          ),
        };
      })
    );
  };

  const toggleMenuLink = (
    itemId: string,
    columnId: string,
    linkId: string
  ) => {
    updateNavigation(
      navigation.map((item) => {
        if (item.id !== itemId) return item;

        return {
          ...item,
          columns: item.columns.map((column) => {
            if (column.id !== columnId) return column;

            return {
              ...column,
              links: column.links.map((link) =>
                link.id === linkId
                  ? { ...link, shown: !link.shown }
                  : link
              ),
            };
          }),
        };
      })
    );
  };

  return (
    <div className="space-y-6">

      {/* HEADER INTRO */}
      <div className="flex items-start justify-between border-b border-[#E8E1D9] pb-3">

        <div>
          <h2 className="text-xl font-serif text-[#1E1915] font-bold">
            Header
          </h2>

          <p className="text-[11.5px] text-[#6F665B] mt-0.5">
            One navigation, every page. The prototype screens carry six
            different versions of this list — this is the one that ships.
          </p>
        </div>

        <span className="text-[10.5px] text-[#8C847A]">
          Priya (Ops) · 2 days ago
        </span>

      </div>

      {/* NOTICE */}
      <div className="bg-[#FFFDF7] border border-[#F2E8D8] rounded p-3 text-[11.5px] text-[#3D352B]">
        The mobile screens label this icon “Bag” while the desktop screens
        say “Cart”. One word has to win.
      </div>

      {/* NAVIGATION CARD */}
      <div className="bg-white border border-[#E0D5C7] rounded shadow-2xs overflow-hidden">

        <div className="px-4 py-3 border-b border-[#E8E1D9]">

          <h3 className="text-sm font-bold text-[#1E1915]">
            Navigation
          </h3>

          <p className="text-[10.5px] text-[#8C847A] mt-0.5">
            Untick anything you are out of stock on and it leaves the
            storefront menu — the row stays here so you can put it back.
          </p>

        </div>

        {/* COLUMN HEADINGS */}
        <div className="hidden md:grid grid-cols-[38px_1.4fr_1fr_100px_55px_100px_30px] gap-2 px-4 py-2 border-b border-[#E8E1D9] text-[9px] uppercase tracking-wider font-bold text-[#8C847A]">
          <span />
          <span>Label</span>
          <span>Link</span>
          <span>Badge</span>
          <span>Menu</span>
          <span>Style</span>
          <span />
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="p-3 space-y-1.5">

          {navigation.map((item, index) => {

            const expanded = expandedId === item.id;

            return (
              <div key={item.id}>

                {/* MAIN ROW */}
                <div className="border border-[#E8E1D9] rounded bg-white">

                  <div className="grid grid-cols-[28px_30px_1.4fr_1fr_70px_45px_90px_25px] items-center gap-2 px-2.5 py-2">

                    {/* CHECKBOX */}
                    <input
                      type="checkbox"
                      checked={item.shown}
                      onChange={() =>
                        updateItem(item.id, {
                          shown: !item.shown,
                        })
                      }
                      className="h-4 w-4 accent-[#C7A55C]"
                    />

                    {/* REORDER */}
                    <div className="flex flex-col items-center">

                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="h-3 text-[#8C847A] disabled:opacity-20"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>

                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === navigation.length - 1}
                        className="h-3 text-[#8C847A] disabled:opacity-20"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>

                    </div>

                    {/* LABEL */}
                    <input
                      value={item.label}
                      onChange={(e) =>
                        updateItem(item.id, {
                          label: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-[#E0D5C7] rounded px-2 py-1.5 text-[11px] text-[#332F2B] outline-none focus:border-[#C7A55C]"
                    />

                    {/* LINK */}
                    <input
                      value={item.link}
                      onChange={(e) =>
                        updateItem(item.id, {
                          link: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-[#E0D5C7] rounded px-2 py-1.5 text-[11px] text-[#8C847A] outline-none focus:border-[#C7A55C]"
                    />

                    {/* BADGE */}
                    <input
                      value={item.badge}
                      onChange={(e) =>
                        updateItem(item.id, {
                          badge: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-[#E0D5C7] rounded px-2 py-1.5 text-[10px] text-[#8C847A] outline-none focus:border-[#C7A55C]"
                    />

                    {/* MENU */}
                    <input
                      type="checkbox"
                      checked={item.menu}
                      onChange={() =>
                        updateItem(item.id, {
                          menu: !item.menu,
                        })
                      }
                      className="h-4 w-4 accent-[#C7A55C]"
                    />

                    {/* STYLE */}
                    <select
                      value={item.style}
                      onChange={(e) =>
                        updateItem(item.id, {
                          style: e.target.value as NavigationItem['style'],
                        })
                      }
                      className="bg-white border border-[#E0D5C7] rounded px-1.5 py-1.5 text-[10px] outline-none"
                    >
                      <option>Plain</option>
                      <option>Accent</option>
                      <option>Highlight</option>
                    </select>

                    {/* EXPAND / DELETE */}
                    <div className="flex items-center gap-1">

                      {item.menu && (
                        <button
                          onClick={() =>
                            setExpandedId(
                              expanded ? null : item.id
                            )
                          }
                          className="text-[#8C847A] hover:text-[#1E1915]"
                        >
                          {expanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#A89F91] hover:text-rose-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>

                    </div>

                  </div>

                  {/* SUBTITLE */}
                  <div className="px-10 pb-2 text-[9.5px] text-[#8C847A] flex justify-between">

                    <span>
                      {item.columns.length
                        ? `${item.columns.length} columns · ${
                            item.columns.reduce(
                              (total, column) =>
                                total + column.links.length,
                              0
                            )
                          } links shown`
                        : `Goes straight to ${item.link}`}
                    </span>

                    {item.columns.length ? (
                      <button
                        onClick={() =>
                          setExpandedId(
                            expanded ? null : item.id
                          )
                        }
                        className="text-[#C7A55C] font-medium"
                      >
                        {expanded ? 'close' : 'edit menu'}
                      </button>
                    ) : (
                      <span className="text-[#C7A55C]">
                        {item.menu ? 'build a menu' : ''}
                      </span>
                    )}

                  </div>

                </div>

                {/* EXPANDED MENU */}
                {expanded &&
                  item.menu &&
                  item.columns.length > 0 && (

                    <div className="ml-7 mr-2 mt-1 bg-[#FAF7F2] border border-[#E8E1D9] rounded p-2.5 space-y-2">

                      {item.columns.map((column) => (

                        <div
                          key={column.id}
                          className="bg-white border border-[#E0D5C7] rounded p-2.5"
                        >

                          <div className="flex items-center justify-between border-b border-[#F0EBE5] pb-2 mb-1">

                            <div className="flex items-center gap-2">

                              <input
                                type="checkbox"
                                checked
                                readOnly
                                className="h-4 w-4 accent-[#C7A55C]"
                              />

                              <input
                                value={column.title}
                                onChange={(e) =>
                                  updateMenuColumn(
                                    item.id,
                                    column.id,
                                    {
                                      title: e.target.value,
                                    }
                                  )
                                }
                                className="font-bold text-[11px] border-none outline-none bg-transparent"
                              />

                            </div>

                            <div className="text-[9px] text-[#8C847A]">
                              {column.links.length} of{' '}
                              {column.links.length} &nbsp;
                              <span className="text-[#C7A55C]">
                                All
                              </span>
                              &nbsp;&nbsp;
                              <span className="text-[#8C847A]">
                                None
                              </span>
                            </div>

                          </div>

                          {/* LINKS */}
                          <div className="space-y-0.5">

                            {column.links.map((link) => (

                              <div
                                key={link.id}
                                className="grid grid-cols-[25px_1.3fr_1fr] gap-2 items-center py-1"
                              >

                                <input
                                  type="checkbox"
                                  checked={link.shown}
                                  onChange={() =>
                                    toggleMenuLink(
                                      item.id,
                                      column.id,
                                      link.id
                                    )
                                  }
                                  className="h-4 w-4 accent-[#C7A55C]"
                                />

                                <span className="text-[11px] text-[#332F2B]">
                                  {link.label}
                                </span>

                                <span className="text-[10px] text-[#8C847A]">
                                  {link.link}
                                </span>

                              </div>

                            ))}

                          </div>

                          <button className="mt-2 border border-dashed border-[#E0D5C7] rounded px-2 py-1 text-[9.5px] text-[#8C847A] hover:text-[#C7A55C]">
                            + Link
                          </button>

                        </div>

                      ))}

                      <button className="border border-dashed border-[#E0D5C7] rounded px-2.5 py-1 text-[10px] text-[#8C847A]">
                        + Add menu column
                      </button>

                    </div>

                  )}

              </div>
            );
          })}

        </div>

        {/* ADD ITEM */}
        <div className="px-4 pb-4">

          <button
            onClick={() => {
              const newItem: NavigationItem = {
                id: `item-${Date.now()}`,
                label: 'New item',
                link: '/new-item',
                badge: 'Badge',
                menu: false,
                style: 'Plain',
                shown: true,
                columns: [],
              };

              updateNavigation([
                ...navigation,
                newItem,
              ]);
            }}
            className="border border-dashed border-[#E0D5C7] rounded px-2.5 py-1 text-[10px] text-[#8C847A] hover:text-[#C7A55C] flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add item
          </button>

        </div>

      </div>

      {/* BEHAVIOUR */}
      <div className="bg-white border border-[#E0D5C7] rounded shadow-2xs overflow-hidden">

        <div className="px-4 py-3 border-b border-[#E8E1D9]">

          <h3 className="text-sm font-bold text-[#1E1915]">
            Behaviour
          </h3>

        </div>

        <div className="p-4 space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-1">

              <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C847A]">
                SEARCH PLACEHOLDER
              </label>

              <input
                value={searchPlaceholder}
                onChange={(e) =>
                  setSearchPlaceholder(e.target.value)
                }
                className="w-full bg-white border border-[#E0D5C7] rounded px-2.5 py-2 text-[11px] outline-none focus:border-[#C7A55C]"
              />

            </div>

            <div className="space-y-1">

              <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C847A]">
                BAG / CART LABEL
              </label>

              <select
                value={bagCartLabel}
                onChange={(e) =>
                  setBagCartLabel(e.target.value)
                }
                className="w-full bg-white border border-[#E0D5C7] rounded px-2.5 py-2 text-[11px] outline-none"
              >
                <option>Cart</option>
                <option>Bag</option>
              </select>

              <p className="text-[9.5px] text-[#A89F91]">
                One word, used on desktop and on the mobile bar.
              </p>

            </div>

          </div>

          {/* STICKY */}
          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={stickyHeader}
              onChange={(e) =>
                setStickyHeader(e.target.checked)
              }
              className="h-4 w-4 accent-[#C7A55C]"
            />

            <span className="text-xs text-[#332F2B]">
              Header stays fixed while scrolling
            </span>

          </label>

          {/* TAGLINE */}
          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={showTagline}
              onChange={(e) =>
                setShowTagline(e.target.checked)
              }
              className="h-4 w-4 accent-[#C7A55C]"
            />

            <span className="text-xs text-[#332F2B]">
              Show the tagline under the wordmark
            </span>

          </label>

        </div>

      </div>

      {/* REDUCED HEADER */}
      <div className="bg-white border border-[#E0D5C7] rounded shadow-2xs overflow-hidden">

        <div className="px-4 py-3 border-b border-[#E8E1D9]">

          <h3 className="text-sm font-bold text-[#1E1915]">
            Reduced header
          </h3>

          <p className="text-[10.5px] text-[#8C847A] mt-0.5">
            Checkout drops the menu so nothing pulls a shopper out
            mid-payment.
          </p>

        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="space-y-1">

            <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C847A]">
              BACK LINK
            </label>

            <input
              value={backLink}
              onChange={(e) =>
                setBackLink(e.target.value)
              }
              className="w-full bg-white border border-[#E0D5C7] rounded px-2.5 py-2 text-[11px] outline-none focus:border-[#C7A55C]"
            />

          </div>

          <div className="space-y-1">

            <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C847A]">
              SECURITY LINE
            </label>

            <input
              value={securityLine}
              onChange={(e) =>
                setSecurityLine(e.target.value)
              }
              className="w-full bg-white border border-[#E0D5C7] rounded px-2.5 py-2 text-[11px] outline-none focus:border-[#C7A55C]"
            />

          </div>

          <div className="space-y-1 sm:col-span-2">

            <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C847A]">
              PAGES USING IT
            </label>

            <input
              value={pagesUsingIt}
              onChange={(e) =>
                setPagesUsingIt(e.target.value)
              }
              className="w-full bg-white border border-[#E0D5C7] rounded px-2.5 py-2 text-[11px] outline-none focus:border-[#C7A55C]"
            />

            <p className="text-[9.5px] text-[#A89F91]">
              Comma separated.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}