// src/components/Header/mobile/SubPanelRenderer.jsx
import React from 'react';
import { SubLabel, LinkRow } from './MobileSubPanelContent';
import { dropdownData } from '../../../data/dropdownData';

const SubPanelRenderer = ({ panelId, navigateAndClose }) => {
  
  // Map panelId to dropdownData key
  const getDataKey = () => {
    switch (panelId) {
      case 'sub-rent':
        return 'rent';
      case 'sub-preloved':
        return 'buyPreloved';
      case 'sub-new':
        return 'buyNew';
      case 'sub-women':
        return 'women';
      case 'sub-men':
        return 'men';
      case 'sub-occasions':
        return 'occasions';
      case 'sub-designers':
        return 'designers';
      default:
        return null;
    }
  };

  const dataKey = getDataKey();
  const data = dropdownData[dataKey];
  
  if (!data) return null;

  const handleLinkClick = (path) => {
    navigateAndClose(path);
  };

  // Build path based on panel type and link text
  const buildPath = (linkText, type, subType = null) => {
    switch (panelId) {
      case 'sub-rent':
        if (type === 'category') {
          return `/main-page?section=rent&category=${encodeURIComponent(linkText)}`;
        }
        if (type === 'designer') {
          return `/main-page?section=rent&designer=${encodeURIComponent(linkText)}`;
        }
        return `/main-page?section=rent`;

      case 'sub-preloved':
        if (type === 'category') {
          return `/main-page?section=preloved&category=${encodeURIComponent(linkText)}`;
        }
        if (type === 'condition') {
          return `/main-page?section=preloved&condition=${encodeURIComponent(linkText)}`;
        }
        if (type === 'price') {
          return `/main-page?section=preloved&minPrice=${linkText.min}&maxPrice=${linkText.max || ''}`;
        }
        if (type === 'designer') {
          return `/main-page?section=preloved&designer=${encodeURIComponent(linkText)}`;
        }
        return `/main-page?section=preloved`;

      case 'sub-new':
        if (type === 'category') {
          return `/main-page?section=new&category=${encodeURIComponent(linkText)}`;
        }
        if (type === 'designer') {
          return `/main-page?section=new&designer=${encodeURIComponent(linkText)}`;
        }
        return `/main-page?section=new`;

      case 'sub-women':
        if (type === 'category') {
          return `/main-page?section=women&category=${encodeURIComponent(linkText)}`;
        }
        if (type === 'occasion') {
          return `/main-page?section=women&occasion=${encodeURIComponent(linkText)}`;
        }
        if (type === 'mode') {
          const modePath = linkText === 'Rent' ? '/main-page?section=rent' 
            : linkText === 'Buy Preloved' ? '/main-page?section=preloved'
            : '/main-page?section=new';
          return modePath;
        }
        return `/main-page?section=women`;

      case 'sub-men':
        if (type === 'category') {
          return `/main-page?section=men&category=${encodeURIComponent(linkText)}`;
        }
        if (type === 'occasion') {
          return `/main-page?section=men&occasion=${encodeURIComponent(linkText)}`;
        }
        if (type === 'mode') {
          const modePath = linkText === 'Rent' ? '/main-page?section=rent' 
            : linkText === 'Buy Preloved' ? '/main-page?section=preloved'
            : '/main-page?section=new';
          return modePath;
        }
        return `/main-page?section=men`;

      case 'sub-occasions':
        if (type === 'occasion') {
          return `/main-page?section=occasions&occasion=${encodeURIComponent(linkText)}`;
        }
        if (type === 'mode') {
          const modePath = linkText === 'Rent for the Occasion' ? '/main-page?section=rent' 
            : linkText === 'Buy Preloved' ? '/main-page?section=preloved'
            : '/main-page?section=new';
          return modePath;
        }
        return `/main-page?section=occasions`;

      case 'sub-designers':
        if (type === 'designer') {
          return `/main-page?section=designers&designer=${encodeURIComponent(linkText)}`;
        }
        if (type === 'discover') {
          return `/main-page?section=designers&type=${encodeURIComponent(linkText)}`;
        }
        return `/main-page?section=designers`;

      default:
        return '/main-page';
    }
  };

  // Render content based on panel type
  const renderContent = () => {
    switch (panelId) {
      case 'sub-rent':
        return (
          <>
            <SubLabel>Shop by Category</SubLabel>
            {data.categories?.map(cat => (
              <LinkRow key={cat} onClick={() => handleLinkClick(buildPath(cat, 'category'))}>
                {cat}
              </LinkRow>
            ))}
            
            <SubLabel>Shop by Designer</SubLabel>
            {data.designers?.map(designer => (
              <LinkRow key={designer.label} onClick={() => handleLinkClick(buildPath(designer.label, 'designer'))}>
                {designer.label}
              </LinkRow>
            ))}
            
            <LinkRow isUtility onClick={() => handleLinkClick('/main-page?section=rent')}>
              See all →
            </LinkRow>
          </>
        );

      case 'sub-preloved':
        return (
          <>
            <SubLabel>Shop by Category</SubLabel>
            {data.categories?.map(cat => (
              <LinkRow key={cat} onClick={() => handleLinkClick(buildPath(cat, 'category'))}>
                {cat}
              </LinkRow>
            ))}
            
            <SubLabel>By Condition</SubLabel>
            {data.secondaryLinks?.map(condition => (
              <LinkRow key={condition} onClick={() => handleLinkClick(buildPath(condition, 'condition'))}>
                {condition}
              </LinkRow>
            ))}
            
            <SubLabel>By Price</SubLabel>
            {data.priceLinks?.map(price => (
              <LinkRow key={price.label} onClick={() => handleLinkClick(buildPath(price, 'price'))}>
                {price.label}
              </LinkRow>
            ))}
            
            <SubLabel>Shop by Designer</SubLabel>
            {data.designers?.map(designer => (
              <LinkRow key={designer.label} onClick={() => handleLinkClick(buildPath(designer.label, 'designer'))}>
                {designer.label}
              </LinkRow>
            ))}
          </>
        );

      case 'sub-new':
        return (
          <>
            <SubLabel>Shop by Category</SubLabel>
            {data.categories?.map(cat => (
              <LinkRow key={cat} onClick={() => handleLinkClick(buildPath(cat, 'category'))}>
                {cat}
              </LinkRow>
            ))}
            
            <SubLabel>Shop by Designer</SubLabel>
            {data.designers?.map(designer => (
              <LinkRow key={designer.label} onClick={() => handleLinkClick(buildPath(designer.label, 'designer'))}>
                {designer.label}
              </LinkRow>
            ))}
            
            <LinkRow isUtility onClick={() => handleLinkClick('/main-page?section=new')}>
              See all →
            </LinkRow>
          </>
        );

      case 'sub-women':
        return (
          <>
            <SubLabel>Shop by Category</SubLabel>
            {data.categories?.map(cat => (
              <LinkRow key={cat} onClick={() => handleLinkClick(buildPath(cat, 'category'))}>
                {cat}
              </LinkRow>
            ))}
            
            <SubLabel>Shop by Occasion</SubLabel>
            {data.occasions?.map(occ => (
              <LinkRow key={occ} onClick={() => handleLinkClick(buildPath(occ, 'occasion'))}>
                {occ}
              </LinkRow>
            ))}
            
            <SubLabel>Shop by Mode</SubLabel>
            {data.modes?.map(mode => (
              <LinkRow key={mode} onClick={() => handleLinkClick(buildPath(mode, 'mode'))}>
                {mode}
              </LinkRow>
            ))}
            
            <LinkRow isUtility onClick={() => handleLinkClick('/main-page?section=women')}>
              See all →
            </LinkRow>
          </>
        );

      case 'sub-men':
        return (
          <>
            <SubLabel>Shop by Category</SubLabel>
            {data.categories?.map(cat => (
              <LinkRow key={cat} onClick={() => handleLinkClick(buildPath(cat, 'category'))}>
                {cat}
              </LinkRow>
            ))}
            
            <SubLabel>Shop by Occasion</SubLabel>
            {data.occasions?.map(occ => (
              <LinkRow key={occ} onClick={() => handleLinkClick(buildPath(occ, 'occasion'))}>
                {occ}
              </LinkRow>
            ))}
            
            <SubLabel>Shop by Mode</SubLabel>
            {data.modes?.map(mode => (
              <LinkRow key={mode} onClick={() => handleLinkClick(buildPath(mode, 'mode'))}>
                {mode}
              </LinkRow>
            ))}
            
            <LinkRow isUtility onClick={() => handleLinkClick('/main-page?section=men')}>
              See all →
            </LinkRow>
          </>
        );

      case 'sub-occasions':
        return (
          <>
            <SubLabel>Browse Occasions</SubLabel>
            {data.categories?.map(occ => (
              <LinkRow key={occ} onClick={() => handleLinkClick(buildPath(occ, 'occasion'))}>
                {occ}
              </LinkRow>
            ))}
            
            <SubLabel>Shop by Mode</SubLabel>
            {data.modes?.map(mode => (
              <LinkRow key={mode} onClick={() => handleLinkClick(buildPath(mode, 'mode'))}>
                {mode}
              </LinkRow>
            ))}
          </>
        );

      case 'sub-designers':
        return (
          <>
            <SubLabel>Featured Designers</SubLabel>
            {data.categories?.map(designer => (
              <LinkRow key={designer} onClick={() => handleLinkClick(buildPath(designer, 'designer'))}>
                {designer}
              </LinkRow>
            ))}
            
            <SubLabel>Discover by Type</SubLabel>
            {data.discoverLinks?.map(link => (
              <LinkRow key={link} onClick={() => handleLinkClick(buildPath(link, 'discover'))}>
                {link}
              </LinkRow>
            ))}
            
            <SubLabel>New to HOK</SubLabel>
            {data.newToHok?.map(designer => (
              <LinkRow key={designer} onClick={() => handleLinkClick(buildPath(designer, 'designer'))}>
                {designer}
              </LinkRow>
            ))}
            
            <LinkRow isUtility onClick={() => handleLinkClick('/designers/a-z')}>
              A–Z index →
            </LinkRow>
          </>
        );

      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default SubPanelRenderer;