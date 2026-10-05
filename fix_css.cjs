const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/styles/productcategory/onlyrentaldetail.css');
let content = fs.readFileSync(filePath, 'utf8');

const badIndex = content.indexOf(' / *   = = = = = = = = = = = = = = = = = = = = = = = = =');
if (badIndex !== -1) {
  content = content.substring(0, badIndex);
  content += `
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
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed CSS');
} else {
  console.log('Bad CSS not found');
}
