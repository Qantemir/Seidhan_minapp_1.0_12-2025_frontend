'use client';

import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const AdminOrdersPage = dynamic(() => import('@pages/AdminOrdersPage').then(mod => ({ default: mod.AdminOrdersPage })), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-t-cyan-400 border-r-cyan-500 border-b-cyan-300 border-l-transparent shadow-[0_0_30px_rgba(34,211,238,0.8),0_0_60px_rgba(34,211,238,0.4)] ring-2 ring-cyan-400/30"></div>
    </div>
  ),
});

export default AdminOrdersPage;

