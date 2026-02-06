// Script to generate default extension icons
// Run with: node generate-icons.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 128];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient (blue sky color)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#4FC3F7');
  gradient.addColorStop(1, '#0288D1');
  
  // Draw rounded rectangle
  const radius = size * 0.15;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();
  
  // Draw sun
  ctx.fillStyle = '#FFD54F';
  const sunRadius = size * 0.25;
  const sunX = size * 0.35;
  const sunY = size * 0.35;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw cloud
  ctx.fillStyle = '#FFFFFF';
  const cloudY = size * 0.55;
  const cloudX = size * 0.55;
  const cloudSize = size * 0.15;
  
  // Cloud circles
  ctx.beginPath();
  ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
  ctx.arc(cloudX + cloudSize * 0.8, cloudY - cloudSize * 0.3, cloudSize * 0.8, 0, Math.PI * 2);
  ctx.arc(cloudX + cloudSize * 1.6, cloudY, cloudSize * 0.9, 0, Math.PI * 2);
  ctx.arc(cloudX + cloudSize * 0.4, cloudY + cloudSize * 0.3, cloudSize * 0.7, 0, Math.PI * 2);
  ctx.arc(cloudX + cloudSize * 1.2, cloudY + cloudSize * 0.3, cloudSize * 0.7, 0, Math.PI * 2);
  ctx.fill();
  
  return canvas.toBuffer('image/png');
}

// Create icons directory
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Generate icons
sizes.forEach(size => {
  const buffer = generateIcon(size);
  fs.writeFileSync(path.join(iconsDir, `default-${size}.png`), buffer);
  console.log(`Generated default-${size}.png`);
});

console.log('All icons generated successfully!');
