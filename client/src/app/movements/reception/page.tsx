'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import MovementReceptionPage from '@/app/(components)/MovementReceptionPage';

const MovementDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const id = searchParams.get('id');

 
  if (!id) return <div>Cargando...</div>;

  return <MovementReceptionPage movementId={String(id)} />; // Pasa el ID al componente de detalles
};

export default MovementDetail;
