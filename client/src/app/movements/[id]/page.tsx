'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGetAuthUserQuery } from '@/state/api';
import MovementDetailsPage from '@/app/(components)/MovementDetailsPage'; // Importa tu página de detalles

const MovementDetail = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const router = useRouter();
  const searchParams = useSearchParams()
  const id = searchParams.get('id');

  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;
 
  if (!id) return <div>Cargando...</div>;

  return <MovementDetailsPage  currentUserDetails={currentUserDetails} movementId={String(id)} />; // Pasa el ID al componente de detalles
};

export default MovementDetail;
