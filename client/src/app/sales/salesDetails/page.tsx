"use client"; // Aseguramos que este componente se renderice del lado del cliente

import { useRouter, useSearchParams  } from 'next/navigation';
import { useGetVehicleSummaryByModelAndColorQuery, 
         VehicleModelSummary, 
         VehicleColor } from "@/state/api";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { BatteryCharging, Dumbbell, Gauge } from 'lucide-react';
import ColorSelector from '@/app/(components)/ColorSelector';

const SalesDetails = () => {                     
  const modelId = localStorage.getItem('modelId') || "";
  const colorId = localStorage.getItem('colorId');
 
  const locationId = "2";
  
  const { data: models, isLoading, isError } = useGetVehicleSummaryByModelAndColorQuery({ locationId, modelId });

  return (
    <ColorSelector
      colorId={colorId}
      modelId={modelId}
      models={models || null}
      />
  );
};

export default SalesDetails;
