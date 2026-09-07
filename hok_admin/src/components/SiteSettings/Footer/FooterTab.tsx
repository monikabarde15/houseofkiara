import React, { useState } from 'react';
import './FooterTab.css';

interface FooterLink {
  id: string;
  label: string;
  path: string;
}

interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

const initialColumns: FooterColumn[] = [
  {
    id: 'shop',
    title: 'Shop',
    links: [
      { id: 'rent', label: 'Rent', path: '/rent' },
      { id: 'preloved', label: 'Buy Preloved', path: '/preloved' },
      { id: 'new', label: 'Buy New', path: '/buy-new' },
      { id: 'occasion', label: 'Shop by Occasion', path: '/occasions' },
      { id: 'category', label: 'Shop by Category', path: '/categories' },
      { id: 'designers', label: 'All Designers', path: '/designers' },
    ],
  },
  {
    id: 'sell',
    title: 'Sell with Us',
    links: [
      { id: 'price', label: 'List Your Piece', path: '/list-your-piece' },
      { id: 'works', label: 'How It Works', path: '/how-it-works' },
      {
        id: 'guidelines',
        label: 'Seller Guidelines',
        path: '/seller-guidelines',
      },
      { id: 'pricing', label: 'Pricing & Fees', path: '/pricing' },
      {
        id: 'partners',
        label: 'Designer Partners',
        path: '/designer-partners',
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    links: [
      { id: 'faqs', label: 'FAQs', path: '/faqs' },
      {
        id: 'care',
        label: 'Care, Cleaning & Damage',
        path: '/care-policy',
      },
      { id: 'deposit', label: 'Deposit Policy', path: '/deposit-policy' },
      {
        id: 'refunds',
        label: 'Refunds & Cancellations',
        path: '/refunds',
      },
      { id: 'contact', label: 'Contact Us', path: '/contact' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { id: 'about', label: 'About HOK', path: '/about' },
      {
        id: 'sustainability',
        label: 'Sustainability',
        path: '/sustainability',
      },
      { id: 'careers', label: 'Careers', path: '/careers' },
      { id: 'press', label: 'Press', path: '/press' },
      { id: 'blog', label: 'Blog', path: '/blog' },
    ],
  },
];

const initialLegalLinks: FooterLink[] = [
  { id: 'terms', label: 'Terms & Conditions', path: '/terms' },
  { id: 'privacy', label: 'Privacy Policy', path: '/privacy' },
  {
    id: 'refund-policy',
    label: 'Refund & Cancellation Policy',
    path: '/refunds',
  },
  {
    id: 'deposit-policy',
    label: 'Deposit Policy',
    path: '/deposit-policy',
  },
  {
    id: 'care-policy',
    label: 'Care, Cleaning & Damage Policy',
    path: '/care-policy',
  },
  {
    id: 'shipping',
    label: 'Shipping Policy',
    path: '/shipping-policy',
  },
  { id: 'cookies', label: 'Cookie Policy', path: '/cookies' },
];

const paymentMethods = [
  { name: 'UPI', active: true },
  { name: 'Visa', active: true },
  { name: 'Mastercard', active: true },
  { name: 'RuPay', active: true },
  { name: 'Net Banking', active: true },
  { name: 'Paytm', active: false },
  { name: 'Amex', active: false },
  { name: 'No-cost EMI', active: false },
];

export default function FooterTab() {
  const [columns, setColumns] =
    useState<FooterColumn[]>(initialColumns);

  const [legalLinks, setLegalLinks] =
    useState<FooterLink[]>(initialLegalLinks);

  const [blurb, setBlurb] = useState('{{tagline}}');

  const [copyright, setCopyright] = useState(
    '© {{year}} House of Kaira. All rights reserved. Indore, India.'
  );

  const [trustBadges, setTrustBadges] = useState(
    'Secure Payments, Circular Fashion'
  );

  const [newsletterEnabled, setNewsletterEnabled] =
    useState(false);

  const [payments, setPayments] =
    useState(paymentMethods);

  const [editingLink, setEditingLink] = useState<string | null>(null);

  const updateColumnTitle = (
    columnId: string,
    value: string
  ) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? { ...column, title: value }
          : column
      )
    );
  };

  const updateLink = (
    columnId: string,
    linkId: string,
    field: 'label' | 'path',
    value: string
  ) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              links: column.links.map((link) =>
                link.id === linkId
                  ? { ...link, [field]: value }
                  : link
              ),
            }
          : column
      )
    );
  };

  const deleteLink = (
    columnId: string,
    linkId: string
  ) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              links: column.links.filter(
                (link) => link.id !== linkId
              ),
            }
          : column
      )
    );
  };

  const addLink = (columnId: string) => {
    const newLink: FooterLink = {
      id: `link-${Date.now()}`,
      label: 'New link',
      path: '/',
    };

    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              links: [...column.links, newLink],
            }
          : column
      )
    );

    setEditingLink(newLink.id);
  };

  const updateLegalLink = (
    linkId: string,
    field: 'label' | 'path',
    value: string
  ) => {
    setLegalLinks((prev) =>
      prev.map((link) =>
        link.id === linkId
          ? { ...link, [field]: value }
          : link
      )
    );
  };

  const deleteLegalLink = (linkId: string) => {
    setLegalLinks((prev) =>
      prev.filter((link) => link.id !== linkId)
    );
  };

  const addLegalLink = () => {
    setLegalLinks((prev) => [
      ...prev,
      {
        id: `legal-${Date.now()}`,
        label: 'New legal link',
        path: '/',
      },
    ]);
  };

  const togglePayment = (name: string) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.name === name
          ? {
              ...payment,
              active: !payment.active,
            }
          : payment
      )
    );
  };

  return (
    <div className="footer-tab">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="footer-tab__intro">
        <div>
          <h2>Footer</h2>

          <p>
            Links, legal copy, payment methods and the copyright line.
          </p>
        </div>
      </div>


      {/* =========================================
          LINK COLUMNS
          ========================================= */}

      <section className="footer-card">

        <div className="footer-card__header">
          <div>
            <h3>Link columns</h3>

            <p>
              Four columns of storefront links. Keep paths and labels together.
            </p>
          </div>
        </div>


        <div className="footer-columns-grid">

          {columns.map((column, columnIndex) => (

            <div
              className="footer-column-card"
              key={column.id}
            >

              {/* COLUMN HEADER */}

              <div className="footer-column-header">

                <span className="footer-column-number">
                  COLUMN {columnIndex + 1}
                </span>

                <input
                  value={column.title}
                  onChange={(e) =>
                    updateColumnTitle(
                      column.id,
                      e.target.value
                    )
                  }
                  className="footer-heading-input"
                />

              </div>


              {/* LINKS */}

              <div className="footer-links">

                {column.links.map((link) => {

                  const isEditing =
                    editingLink === link.id;

                  return (

                    <div
                      className="footer-link-row"
                      key={link.id}
                    >

                      {isEditing ? (

                        <>
                          <input
                            autoFocus
                            value={link.label}
                            onChange={(e) =>
                              updateLink(
                                column.id,
                                link.id,
                                'label',
                                e.target.value
                              )
                            }
                            className="footer-edit-input"
                          />

                          <input
                            value={link.path}
                            onChange={(e) =>
                              updateLink(
                                column.id,
                                link.id,
                                'path',
                                e.target.value
                              )
                            }
                            className="footer-edit-input footer-path-edit"
                          />

                          <button
                            className="footer-save-mini"
                            onClick={() =>
                              setEditingLink(null)
                            }
                          >
                            ✓
                          </button>
                        </>

                      ) : (

                        <>
                          <button
                            className="footer-link-label"
                            onClick={() =>
                              setEditingLink(link.id)
                            }
                          >
                            {link.label}
                          </button>

                          <button
                            className="footer-link-path"
                            onClick={() =>
                              setEditingLink(link.id)
                            }
                          >
                            {link.path}
                          </button>

                          <button
                            className="footer-delete-btn"
                            onClick={() =>
                              deleteLink(
                                column.id,
                                link.id
                              )
                            }
                            title="Remove link"
                          >
                            ×
                          </button>
                        </>

                      )}

                    </div>

                  );
                })}

              </div>


              {/* ADD */}

              <button
                className="footer-add-btn"
                onClick={() =>
                  addLink(column.id)
                }
              >
                + Link
              </button>

            </div>

          ))}

        </div>

      </section>


      {/* =========================================
          LEGAL ROW
          ========================================= */}

      <section className="footer-card">

        <div className="footer-card__header">

          <div>

            <h3>Legal row</h3>

            <p>
              Each needs a published document.

              <button className="footer-inline-link">
                Platform &amp; Legal
              </button>
            </p>

          </div>

        </div>


        <div className="footer-legal-list">

          {legalLinks.map((link) => (

            <div
              className="footer-legal-row"
              key={link.id}
            >

              <button
                className="footer-link-label"
                onClick={() => {
                  const newLabel =
                    window.prompt(
                      'Edit label',
                      link.label
                    );

                  if (newLabel !== null) {
                    updateLegalLink(
                      link.id,
                      'label',
                      newLabel
                    );
                  }
                }}
              >
                {link.label}
              </button>


              <button
                className="footer-link-path"
                onClick={() => {
                  const newPath =
                    window.prompt(
                      'Edit path',
                      link.path
                    );

                  if (newPath !== null) {
                    updateLegalLink(
                      link.id,
                      'path',
                      newPath
                    );
                  }
                }}
              >
                {link.path}
              </button>


              <button
                className="footer-delete-btn"
                onClick={() =>
                  deleteLegalLink(link.id)
                }
              >
                ×
              </button>

            </div>

          ))}

        </div>


        <button
          className="footer-add-btn"
          onClick={addLegalLink}
        >
          + Legal link
        </button>

      </section>


      {/* =========================================
          COPY & BADGES
          ========================================= */}

      <section className="footer-card">

        <div className="footer-card__header">

          <h3>Copy &amp; badges</h3>

        </div>


        <div className="footer-card__body">

          <div className="footer-field">

            <label>
              BLURB UNDER THE WORDMARK
            </label>

            <input
              value={blurb}
              onChange={(e) =>
                setBlurb(e.target.value)
              }
              className="footer-text-input"
            />

            <span className="footer-hint">
              Prints: Circular Luxury Fashion
              <span className="pointer-badge">
                {'{}'}
              </span>
            </span>

          </div>


          <div className="footer-field">

            <label>
              COPYRIGHT LINE
            </label>

            <input
              value={copyright}
              onChange={(e) =>
                setCopyright(e.target.value)
              }
              className="footer-text-input"
            />

            <span className="footer-hint">
              Prints: © 2026 House of Kaira.
              All rights reserved. Indore, India.
              <span className="pointer-badge">
                {'{}'}
              </span>
            </span>

            <span className="footer-hint">
              The prototype screens carry 2024, 2025 and 2026.
              A pointer never needs an annual edit.
            </span>

          </div>


          <div className="footer-field">

            <label>
              TRUST BADGES
            </label>

            <input
              value={trustBadges}
              onChange={(e) =>
                setTrustBadges(e.target.value)
              }
              className="footer-text-input"
            />

            <span className="footer-hint">
              Comma separated.
            </span>

          </div>


          <div className="footer-field">

            <label>
              PAYMENT METHODS SHOWN
            </label>

            <div className="payment-methods">

              {payments.map((payment) => (

                <button
                  key={payment.name}
                  onClick={() =>
                    togglePayment(payment.name)
                  }
                  className={`payment-chip ${
                    payment.active
                      ? 'payment-chip--active'
                      : 'payment-chip--inactive'
                  }`}
                >
                  {payment.name}
                </button>

              ))}

            </div>

            <span className="footer-hint">
              Only advertise what checkout accepts.
            </span>

          </div>

        </div>

      </section>


      {/* =========================================
          NEWSLETTER
          ========================================= */}

      <section className="footer-card">

        <div className="footer-card__header">

          <h3>Newsletter</h3>

        </div>


        <div className="footer-newsletter">

          <button
            className={`footer-toggle ${
              newsletterEnabled
                ? 'footer-toggle--on'
                : ''
            }`}
            onClick={() =>
              setNewsletterEnabled(
                (prev) => !prev
              )
            }
          >
            <span />
          </button>


          <div>

            <div className="footer-newsletter-title">
              Show the newsletter block
            </div>

            <div className="footer-hint">
              Only the checkout page offers signup today.
            </div>

          </div>

        </div>


        {newsletterEnabled && (

          <div className="footer-newsletter-expanded">

            <div className="footer-field">

              <label>HEADING</label>

              <input
                className="footer-text-input"
                placeholder="Join our newsletter"
              />

            </div>


            <div className="footer-field">

              <label>BUTTON LABEL</label>

              <input
                className="footer-text-input"
                placeholder="Subscribe"
              />

            </div>


            <div className="footer-field">

              <label>BODY</label>

              <textarea
                className="footer-textarea"
                placeholder="Stay updated with House of Kaira."
              />

            </div>


            <div className="footer-field">

              <label>CONSENT LINE</label>

              <input
                className="footer-text-input"
                placeholder="By subscribing, you agree to our policies."
              />

            </div>

          </div>

        )}

      </section>

    </div>
  );
}