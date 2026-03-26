import React from 'react';

const messages = [
  '🛒 FREE DELIVERY ON ALL ORDERS ABOVE ₹500',
  '🥬 FRESH FROM FARMS — UP TO 20% OFF ON ORGANIC VEGGIES',
  '🍎 WEEKEND SPECIAL: BUY 1 GET 1 FREE ON SELECT FRUITS',
  '🥦 SUSTAINABLY SOURCED — EAT FRESH, LIVE HEALTHY',
  '🥛 DAIRY DEALS — NEW STOCK EVERY MORNING',
];

const all = [...messages, ...messages].join('   •   ');

const TopNavbar = () => {
  return (
    <div className="bg-accent text-white h-10 flex items-center overflow-hidden border-b border-accent-dark/20 shadow-sm">
      <div className="flex-1 marquee-container px-4">
        <div className="marquee-content text-[13px] font-semibold tracking-wide flex items-center gap-12">
          {messages.map((msg, i) => (
            <span key={i} className="whitespace-nowrap flex items-center gap-2">
              {msg}
            </span>
          ))}
          {messages.map((msg, i) => (
            <span key={`dup-${i}`} className="whitespace-nowrap flex items-center gap-2">
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;

