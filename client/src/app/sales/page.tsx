"use client";

import { useState, useEffect } from 'react';
import { useGetVehiclesQuery, 
         useCreateSaleMutation,
         Vehicle,
         NewSale } from '@/state/api';  

const SalesPage = () => {
  const { data: vehicles = [], isLoading } = useGetVehiclesQuery();
  const [createSale] = useCreateSaleMutation();
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerId, setCustomerId] = useState<number | null>(null); // Ajusta según tu modelo de clientes
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  
  useEffect(() => {
    if (selectedVehicleId && vehicles.length > 0) {
      const selectedVehicle = vehicles.find(v => v.vehicleId === selectedVehicleId);
      if (selectedVehicle) {
        setUnitPrice(selectedVehicle.price);
        setTotalAmount(selectedVehicle.price * quantity);
      }
    }
  }, [selectedVehicleId, quantity, vehicles]);
  
  const handleSale = async () => {
    if (selectedVehicleId && quantity && unitPrice && totalAmount) {
      const saleData: NewSale = {
        timestamp: new Date(),
        quantity,
        unitPrice,
        totalAmount,
        customerId,
        saleDetails: [
          {
            vehicleId: selectedVehicleId,
            quantity,
            unitPrice,
            subtotal: totalAmount,
          },
        ],
      };
      
      try {
        await createSale(saleData).unwrap();
        alert('Venta registrada con éxito');
        // Resetea el formulario si es necesario
      } catch (error) {
        console.error('Error al registrar la venta:', error);
        alert('Error al registrar la venta');
      }
    }
  };

  if (isLoading) {
    return <p>Cargando vehículos...</p>;
  }

  return (
    <div>
      <h1>Registro de Ventas</h1>
      <div>
        <label htmlFor="vehicle">Selecciona un vehículo:</label>
        <select 
          id="vehicle" 
          onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
        >
          <option value="">--Seleccionar--</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
              {vehicle.serial} - {vehicle.makeName} - ${vehicle.price}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity">Cantidad:</label>
        <input 
          type="number" 
          id="quantity" 
          value={quantity} 
          min={1} 
          onChange={(e) => setQuantity(Number(e.target.value))} 
        />
      </div>
      <div>
        <label>Total a Pagar:</label>
        <p>${totalAmount.toFixed(2)}</p>
      </div>
      <div>
        <label htmlFor="customer">ID del Cliente:</label>
        <input 
          type="number" 
          id="customer" 
          value={customerId || ''} 
          onChange={(e) => setCustomerId(Number(e.target.value))} 
        />
      </div>
      <button onClick={handleSale}>Registrar Venta</button>
    </div>
  );
};

export default SalesPage;
