'use client';

import { useState, useEffect } from 'react';
import { useGetAuthUserQuery } from '@/state/api';
import InventoryMovement from '@/app/(components)/InventoryMovement';

const InventoryMovementsPage = () => {   
  const { data: currentUser } = useGetAuthUserQuery({});
 
  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;

  return <InventoryMovement currentUserDetails={currentUserDetails} />;
};

export default InventoryMovementsPage;