import React from 'react';
import AdminOrderDetailClient from './AdminOrderDetailClient';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="p-8">
      <AdminOrderDetailClient orderId={id} />
    </div>
  );
}
