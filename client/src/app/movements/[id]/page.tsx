'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import MovementDetailsPage from '@/app/(components)/MovementDetailsPage'; // Importa tu página de detalles

const MovementDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const id = searchParams.get('id');

 
  if (!id) return <div>Cargando...</div>;

  return <MovementDetailsPage movementId={String(id)} />; // Pasa el ID al componente de detalles
};

export default MovementDetail;
