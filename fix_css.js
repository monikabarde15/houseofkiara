import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/styles/productcategory/onlyrentaldetail.css');
let content = fs.readFileSync(filePath); // read as buffer

// The file might have null bytes at the end. We can search for the start of the bad block.
// Let's just find the index of "top: 0px;" in the buffer which is near the end.
const text = content.toString('utf8');
const safePoint = text.lastIndexOf('top: 0px;');

if (safePoint !== -1) {
  // Find the closing brace of the media query after top: 0px;
  const afterSafe = text.indexOf('}', safePoint);
  const endOfMedia = text.indexOf('}', afterSafe + 1);
  
  if (endOfMedia !== -1) {
    let cleanContent = text.substring(0, endOfMedia + 1);
    
    cleanContent += `
/* =========================================
   COLOR BLOCK FOR RENTAL
========================================= */
.rental-color-section {
    margin: 24px 0;
}

.rental-section-label {
    font-family: 'DM Sans';
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: #8A7E72;
    margin-bottom: 12px;
}

.rental-swatches-details {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.rental-swatches-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid #E8E0D4;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
}

.rental-swatches-item:hover {
    border-color: #C9A96E;
}

.rental-swatches-item.active {
    border-color: #1A1612;
    background: #FAF7F2;
}

.rental-swatch-circle-details {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.15);
}

.rental-swatch-name {
    font-family: 'DM Sans';
    font-size: 11px;
    color: #1A1612;
}
`;
    // Clean null bytes just in case
    cleanContent = cleanContent.replace(/\\x00/g, '').replace(/\\0/g, '');
    fs.writeFileSync(filePath, cleanContent, 'utf8');
    console.log('Fixed CSS by trimming bad end');
  }
} else {
  console.log('safe point not found');
}
