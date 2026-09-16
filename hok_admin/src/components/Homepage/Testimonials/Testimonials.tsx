
import React, { useState } from "react";
import "./Testimonials.css";

type Testimonial = {
  id: number;
  name: string;
  initials: string;
  city: string;
  context: string;
  quote: string;
  stars: number;
  source: string;
  orderNumber: string;
  visible: boolean;
};

const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Rathore",
    initials: "PR",
    city: "Mumbai",
    context: "Rented for a Wedding",
    quote:
      "I wore a Sabyasachi lehenga to my sister's wedding for a fraction of the retail price. The quality, the packaging — everything felt completely premium.",
    stars: 5,
    source: "Verified order",
    orderNumber: "HOK-ORD-001",
    visible: true,
  },
  {
    id: 2,
    name: "Aishwarya Sharma",
    initials: "AS",
    city: "Delhi",
    context: "Sold her Bridal Lehenga",
    quote:
      "House of Kaira made the entire experience feel seamless. I loved being able to give my bridal outfit another life.",
    stars: 5,
    source: "Verified order",
    orderNumber: "HOK-ORD-002",
    visible: true,
  },
  {
    id: 3,
    name: "Neha Kulkarni",
    initials: "NK",
    city: "Pune",
    context: "Regular Renter",
    quote:
      "The collection is beautiful, and renting makes dressing for special occasions so much easier.",
    stars: 5,
    source: "Verified order",
    orderNumber: "HOK-ORD-003",
    visible: true,
  },
];

const Testimonials: React.FC = () => {
  const [showBand, setShowBand] = useState(true);

  const [eyebrow, setEyebrow] = useState(
    "Worn, Loved & Shared Across India"
  );

  const [heading, setHeading] = useState(
    "What our customers *say*"
  );

  const [desktopLayout, setDesktopLayout] =
    useState("Three across");

  const [mobileLayout, setMobileLayout] =
    useState("Swipe");

  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);

  const [editingId, setEditingId] = useState(1);

  const editingTestimonial = testimonials.find(
    (item) => item.id === editingId
  );

  const updateTestimonial = (
    field: keyof Testimonial,
    value: string | number | boolean
  ) => {
    setTestimonials((items) =>
      items.map((item) =>
        item.id === editingId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const moveTestimonial = (
    index: number,
    direction: "up" | "down"
  ) => {
    const newIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= testimonials.length
    ) {
      return;
    }

    const updated = [...testimonials];

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    setTestimonials(updated);
  };

  const removeTestimonial = (id: number) => {
    setTestimonials((items) =>
      items.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      setEditingId(
        testimonials.find((item) => item.id !== id)?.id || 0
      );
    }
  };

  const addTestimonial = () => {
    const newId =
      Math.max(0, ...testimonials.map((item) => item.id)) + 1;

    const newTestimonial: Testimonial = {
      id: newId,
      name: "New Customer",
      initials: "NC",
      city: "",
      context: "",
      quote: "",
      stars: 5,
      source: "Verified order",
      orderNumber: "",
      visible: true,
    };

    setTestimonials((items) => [...items, newTestimonial]);
    setEditingId(newId);
  };

  const renderHeading = (text: string) => {
    const parts = text.split("*");

    return parts.map((part, index) =>
      index % 2 === 1 ? (
        <em key={index}>{part}</em>
      ) : (
        <React.Fragment key={index}>
          {part}
        </React.Fragment>
      )
    );
  };

  return (
    <div className="testimonials-editor">

      {/* HEADER */}

      <div className="testimonials-heading-row">
        <div>
          <h2>Testimonials</h2>

          <p>
            Customer quotes. Each one records where it came
            from, so a claim on the homepage can always be
            traced back to a real order.
          </p>
        </div>

        <span className="editor-band-count">
          Band 8 of 9
        </span>
      </div>


      {/* SHOW BAND */}

      <div className="editor-live-row">

        <button
          type="button"
          className={`hok-switch ${showBand ? "on" : ""}`}
          onClick={() => setShowBand((value) => !value)}
          aria-label="Toggle homepage band"
        >
          <span />
        </button>

        <strong>
          Show this band on the homepage
        </strong>

        <span>
          {showBand
            ? "Showing on the live homepage, in position 8."
            : "This band is hidden from the homepage."}
        </span>

      </div>


      {/* THE WORDS */}

      <section className="hok-editor-card">

        <h3>The words</h3>

        <label htmlFor="testimonial-eyebrow">
          EYEBROW
        </label>

        <input
          id="testimonial-eyebrow"
          value={eyebrow}
          onChange={(event) =>
            setEyebrow(event.target.value)
          }
        />

        <p className="field-help">
          Centred, with a rule on both sides.
        </p>


        <label htmlFor="testimonial-heading">
          HEADING
        </label>

        <textarea
          id="testimonial-heading"
          value={heading}
          onChange={(event) =>
            setHeading(event.target.value)
          }
        />

        <p className="field-help">
          A line break starts a new line. Wrap one word in
          *asterisks* to set it in the italic gold serif.
        </p>


        {/* READS AS */}

        <div className="reads-as-box">

          <span>READS AS</span>

          <h4>
            {renderHeading(heading)}
          </h4>

        </div>


        {/* LAYOUT */}

        <div className="testimonial-layout-grid">

          <div>

            <label htmlFor="testimonial-desktop">
              DESKTOP
            </label>

            <select
              id="testimonial-desktop"
              value={desktopLayout}
              onChange={(event) =>
                setDesktopLayout(event.target.value)
              }
            >
              <option>Three across</option>
              <option>Two across</option>
              <option>Four across</option>
            </select>

          </div>


          <div>

            <label htmlFor="testimonial-mobile">
              MOBILE
            </label>

            <select
              id="testimonial-mobile"
              value={mobileLayout}
              onChange={(event) =>
                setMobileLayout(event.target.value)
              }
            >
              <option>Swipe</option>
              <option>Stack</option>
            </select>

          </div>

        </div>

      </section>


      {/* THE QUOTES */}

      <section className="hok-editor-card">

        <div className="section-title-row">

          <div>
            <h3>The quotes</h3>

            <p>
              Each one records where it came from. A claim
              on the homepage that cannot be traced back
              to a real order is a claim worth not making.
            </p>
          </div>

        </div>


        {/* QUOTE GRID */}

        <div
          className={`testimonial-grid ${
            desktopLayout === "Two across"
              ? "two-columns"
              : desktopLayout === "Four across"
              ? "four-columns"
              : "three-columns"
          }`}
        >

          {testimonials.map((testimonial, index) => (

            <article
              key={testimonial.id}
              className={`testimonial-card ${
                editingId === testimonial.id
                  ? "selected"
                  : ""
              }`}
              onClick={() => setEditingId(testimonial.id)}
            >

              {/* AVATAR */}

              <div className="testimonial-avatar">

                <span className="avatar-number">
                  {index + 1}
                </span>

                {testimonial.initials || "NC"}

              </div>


              {/* CARD DETAILS */}

              <div className="testimonial-card-content">

                <h4>
                  {testimonial.name || "New Customer"}
                </h4>

                <p className="testimonial-meta">
                  {testimonial.city || "City"}{" "}
                  ·{" "}
                  {testimonial.context || "Customer"}
                </p>

              </div>


              {/* ACTIONS */}

              <div className="testimonial-card-actions">

                <button
                  type="button"
                  className="hok-small-button"
                  disabled={index === 0}
                  onClick={(event) => {
                    event.stopPropagation();
                    moveTestimonial(index, "up");
                  }}
                >
                  ↑
                </button>

                <button
                  type="button"
                  className="hok-small-button"
                  disabled={
                    index === testimonials.length - 1
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    moveTestimonial(index, "down");
                  }}
                >
                  ↓
                </button>

                <button
                  type="button"
                  className="hok-remove"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeTestimonial(testimonial.id);
                  }}
                >
                  Remove
                </button>

              </div>

            </article>

          ))}


          {/* ADD QUOTE */}

          <button
            type="button"
            className="add-testimonial-card"
            onClick={addTestimonial}
          >
            <span>＋</span>
            <strong>Add a quote</strong>
          </button>

        </div>

      </section>


      {/* EDITING QUOTE */}

      {editingTestimonial && (

        <section className="hok-editor-card editing-testimonial">

          <div className="editing-header">

            <span>
              EDITING QUOTE {testimonials.indexOf(editingTestimonial) + 1}
            </span>

            <strong>
              {editingTestimonial.name}
            </strong>

          </div>


          {/* SHOW QUOTE */}

          <div className="editor-live-row inner-live-row">

            <button
              type="button"
              className={`hok-switch ${
                editingTestimonial.visible ? "on" : ""
              }`}
              onClick={() =>
                updateTestimonial(
                  "visible",
                  !editingTestimonial.visible
                )
              }
              aria-label="Toggle quote visibility"
            >
              <span />
            </button>

            <strong>
              Show this quote on the homepage
            </strong>

          </div>


          {/* QUOTE */}

          <label htmlFor="editing-quote">
            QUOTE
          </label>

          <textarea
            id="editing-quote"
            value={editingTestimonial.quote}
            onChange={(event) =>
              updateTestimonial("quote", event.target.value)
            }
            rows={4}
          />


          {/* NAME + INITIALS */}

          <div className="testimonial-form-grid">

            <div>

              <label htmlFor="editing-name">
                NAME
              </label>

              <input
                id="editing-name"
                value={editingTestimonial.name}
                onChange={(event) =>
                  updateTestimonial(
                    "name",
                    event.target.value
                  )
                }
              />

            </div>


            <div>

              <label htmlFor="editing-initials">
                INITIALS ON THE AVATAR
              </label>

              <input
                id="editing-initials"
                value={editingTestimonial.initials}
                placeholder="PR"
                onChange={(event) =>
                  updateTestimonial(
                    "initials",
                    event.target.value
                  )
                }
              />

              <p className="field-help">
                Blank takes the first letters of the name.
              </p>

            </div>

          </div>


          {/* CITY + CONTEXT */}

          <div className="testimonial-form-grid">

            <div>

              <label htmlFor="editing-city">
                CITY
              </label>

              <input
                id="editing-city"
                value={editingTestimonial.city}
                onChange={(event) =>
                  updateTestimonial(
                    "city",
                    event.target.value
                  )
                }
              />

            </div>


            <div>

              <label htmlFor="editing-context">
                WHAT THEY DID
              </label>

              <input
                id="editing-context"
                value={editingTestimonial.context}
                onChange={(event) =>
                  updateTestimonial(
                    "context",
                    event.target.value
                  )
                }
              />

              <p className="field-help">
                Reads as “City · What they did”.
              </p>

            </div>

          </div>


          {/* STARS + SOURCE */}

          <div className="testimonial-form-grid">

            <div>

              <label htmlFor="editing-stars">
                STARS
              </label>

              <select
                id="editing-stars"
                value={editingTestimonial.stars}
                onChange={(event) =>
                  updateTestimonial(
                    "stars",
                    Number(event.target.value)
                  )
                }
              >
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>

            </div>


            <div>

              <label htmlFor="editing-source">
                WHERE IT CAME FROM
              </label>

              <select
                id="editing-source"
                value={editingTestimonial.source}
                onChange={(event) =>
                  updateTestimonial(
                    "source",
                    event.target.value
                  )
                }
              >
                <option>Verified order</option>
                <option>Customer interview</option>
                <option>Manual entry</option>
              </select>

              <p className="field-help">
                Traceable to an order in the panel.
              </p>

            </div>

          </div>


          {/* ORDER NUMBER */}

          <label htmlFor="editing-order">
            ORDER NUMBER
          </label>

          <input
            id="editing-order"
            value={editingTestimonial.orderNumber}
            onChange={(event) =>
              updateTestimonial(
                "orderNumber",
                event.target.value
              )
            }
          />

          <p className="field-help">
            Matches {editingTestimonial.name} · Customer testimonial.
          </p>

        </section>

      )}

    </div>
  );
};

export default Testimonials;