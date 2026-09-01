import React, { useRef, useState, useEffect } from 'react';
import '../../styles/howitworks/shopping-journey.css';

const ShoppingJourney = () => {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const journeySteps = [
    {
      id: 1,
      number: '01',
      title: 'Browse and discover',
      body: 'Explore our curated collection of designer pieces. Filter by occasion, designer, size, and category to find exactly what you\'re looking for.',
      details: [
        'Filter by occasion, designer, size & category',
        'Save favourites to your wishlist',
        'Real-time availability for rentals'
      ]
    },
    {
      id: 2,
      number: '02',
      title: 'Choose your mode',
      body: 'Decide whether you want to rent for a special occasion or buy preloved to keep forever. Every piece shows both options clearly.',
      details: [
        'Rent for 4-8 days starting at 20% of retail',
        'Buy preloved at 30-70% below retail',
        'Clear pricing and deposit information'
      ]
    },
    {
      id: 3,
      number: '03',
      title: 'Checkout and confirm',
      body: 'Review your order, select delivery dates, and complete payment. For rentals, the refundable deposit is held securely.',
      details: [
        'Secure payment via Razorpay',
        'Rental deposit held, not charged',
        'Instant order confirmation'
      ]
    },
    {
      id: 4,
      number: '04',
      title: 'Delivered, <em>ready to wear</em>',
      body: 'Your piece arrives at your doorstep, professionally dry-cleaned and pressed. Ready to wear straight out of the box.',
      details: [
        'Doorstep delivery in sustainable packaging',
        'Pre-paid return label included',
        'HOK handles all cleaning'
      ]
    },
    {
      id: 5,
      number: '05',
      title: 'The Loop — <em>keep it going</em>',
      body: 'After your event, return rental pieces easily. Or list your own pieces to earn and keep the circular fashion cycle moving.',
      details: [
        'Easy returns with scheduled pickup',
        'List your own pieces to earn',
        'Every piece gets a second life'
      ]
    }
  ];

  // Progress dots click handler
  const handleDotClick = (index) => {
    const track = trackRef.current;
    if (!track) return;
    
    const cards = track.querySelectorAll('.hok-hiw-jcard');
    if (cards[index]) {
      const cardLeft = cards[index].offsetLeft;
      track.scrollTo({ left: cardLeft - 80, behavior: 'smooth' });
    }
  };

  // Update active dot on scroll
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll('.hok-hiw-jcard');
    let minIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const distance = Math.abs(rect.left - trackRect.left);
      
      if (distance < minDistance) {
        minDistance = distance;
        minIndex = index;
      }
    });

    setActiveIndex(minIndex);
  };

  // Mouse drag for horizontal scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
    trackRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (trackRef.current) {
      trackRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (trackRef.current) {
        trackRef.current.style.cursor = 'grab';
      }
    }
  };

  // Touch drag for mobile (handled by native scroll + snap)

  return (
    <section id="section-shop" className="hok-hiw-sec hok-hiw-sec-alt hok-hiw-shop-section">
      {/* Section Header */}
      <div className="hok-hiw-shop-header">
        <div className="hok-hiw-shop-eyebrow">
          <span className="hok-hiw-shop-line"></span>
          <span className="hok-hiw-shop-eyebrow-text">Shopping at HOK</span>
        </div>
        
        <h2 className="hok-hiw-shop-title">
          From discovery to your <em>doorstep</em>
        </h2>
        
        <p className="hok-hiw-shop-lead">
          Four steps stand between you and wearing a Sabyasachi to that wedding 
          you've been circling on the calendar.
        </p>
        
        <div className="hok-hiw-shop-scroll-hint">
          <span className="hok-hiw-shop-scroll-bar"></span>
          <span className="hok-hiw-shop-scroll-bar"></span>
          <span className="hok-hiw-shop-scroll-text">Drag or scroll to explore each step</span>
        </div>
      </div>

      {/* Journey Track */}
      <div 
        ref={trackRef}
        className="hok-hiw-jtrack"
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {journeySteps.map((step, index) => (
          <div 
            key={step.id} 
            className={`hok-hiw-jcard ${index === 4 ? 'hok-hiw-jcard-dark' : ''}`}
          >
            {/* Ghost Number */}
            <span className="hok-hiw-jcard-ghost">{step.number}</span>
            
            {/* Step Identifier */}
            <div className="hok-hiw-jstep-num">Step {step.number}</div>
            
            {/* Step Title */}
            <h3 
              className="hok-hiw-jstep-title"
              dangerouslySetInnerHTML={{ __html: step.title }}
            />
            
            {/* Step Body */}
            <p className="hok-hiw-jstep-body">{step.body}</p>
            
            {/* Details List */}
            <div className="hok-hiw-jstep-details">
              {step.details.map((detail, idx) => (
                <div key={idx} className="hok-hiw-jspd">
                  <span className="hok-hiw-jspd-dot"></span>
                  <span className="hok-hiw-jspd-text">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Spacer for full scroll */}
        <div className="hok-hiw-jcard-spacer"></div>
      </div>

      {/* Progress Dots */}
      <div className="hok-hiw-jdots" id="jdots">
        {journeySteps.map((_, index) => (
          <span
            key={index}
            className={`hok-hiw-jdot ${activeIndex === index ? 'hok-hiw-on' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default ShoppingJourney;