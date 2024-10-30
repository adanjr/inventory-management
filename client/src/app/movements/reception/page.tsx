'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGetAuthUserQuery } from '@/state/api';
import MovementReceptionPage from '@/app/(components)/MovementReceptionPage';

const MovementDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const id = searchParams.get('id');

  const { data: currentUser } = useGetAuthUserQuery({});
 
  if (!id) return <div>Cargando...</div>;

  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;

  return <MovementReceptionPage movementId={String(id)} currentUserDetails={currentUserDetails} />; // Pasa el ID al componente de detalles
};

export default MovementDetail;
