'use client';

import dynamic from 'next/dynamic';

const AdminOrderDetailPage = dynamic(() => import('@pages/AdminOrderDetailPage').then(mod => ({ default: mod.AdminOrderDetailPage })), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-t-blue-500 border-r-cyan-500 border-b-blue-400 border-l-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.6),0_0_40px_rgba(6,182,212,0.4)] ring-2 ring-blue-500/40"></div>
    </div>
  ),
});

export default AdminOrderDetailPage;

