'use client';

import dynamic from 'next/dynamic';

const CartPage = dynamic(() => import('@pages/CartPage').then(mod => ({ default: mod.CartPage })), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-t-white border-r-white/50 border-b-white/30 border-l-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
    </div>
  ),
});

export default CartPage;

