import React from 'react';
import '../../styles/howitworks/chapter-nav.css';

const ChapterNav = ({ activeSection }) => {
  const chapters = [
    { id: 'section-shop', btnId: 'cnb-shop', label: 'Shopping', dotColor: '#C9A96E' },
    { id: 'section-modes', btnId: 'cnb-modes', label: 'Rent & Preloved', dotColor: '#1A1612' },
    { id: 'section-sell', btnId: 'cnb-sell', label: 'List & Earn', dotColor: '#B85C38' },
    { id: 'section-pol', btnId: 'cnb-pol', label: 'Policies', dotColor: '#8A7E72' },
    { id: 'section-faq', btnId: 'cnb-faq', label: 'FAQ', dotColor: '#8A7E72' },
  ];

  const handleClick = (sectionId) => {
    if (window.hokScroll) {
      window.hokScroll(sectionId);
    }
  };

  return (
    <nav id="chapnav" className="hok-hiw-chapnav">
      <div className="hok-hiw-chapnav-inner">
        {chapters.map((chapter) => (
          <button
            key={chapter.btnId}
            id={chapter.btnId}
            className={`hok-hiw-cn-btn ${activeSection === chapter.id ? 'hok-hiw-lit' : ''}`}
            onClick={() => handleClick(chapter.id)}
          >
            <span className="hok-hiw-cn-dot" style={{ background: chapter.dotColor }}></span>
            {chapter.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ChapterNav;