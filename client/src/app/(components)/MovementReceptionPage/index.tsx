import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMovementByIdQuery, useUpdateMovementMutation, User } from '@/state/api';
import Header from '@/app/(components)/Header';
import { useReactToPrint } from 'react-to-print';

type MovementReceptionData = {
  arrivalDate: Date;
  receivedBy: string;
  isReceived: boolean;
  receptionNotes?: string | null;
};

interface MovementReceptionPageProps {
  movementId: string;
  currentUserDetails: User
};


const MovementReceptionPage = ({ movementId, currentUserDetails }: MovementReceptionPageProps) => {
  const { data: movement, isLoading, isError } = useGetMovementByIdQuery(movementId);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement | null>(null);

  // Estado inicializado con valores predeterminados
  const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
  const [receivedBy, setReceivedBy] = useState<string>('');
  const [isReceived, setIsReceived] = useState<boolean>(true); // Por defecto, isReceived es true
  const [receptionNotes, setReceptionNotes] = useState<string | null>(null);

  // Mutación para actualizar el movimiento
  const [updateMovement] = useUpdateMovementMutation();


  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Detalle_Movimiento_${movementId}`,
  });

  const handleConfirmReception = async () => {

    const updatedMovement = {
      arrivalDate,
      receivedBy: currentUserDetails.userId.toString() ,
      isReceived,
      receptionNotes,
    };

    try {


      await updateMovement({ id: movementId, data: updatedMovement });  
      alert('Recepción confirmada con éxito');
      router.push('/inventoryMovements');
    } catch (error) {
      console.error('Error al confirmar la recepción:', error);
      alert('Error al confirmar la recepción');
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError || !movement) return <div>Error al cargar los detalles del movimiento.</div>;

  return (
    <div ref={printRef} className="mx-auto py-5 w-full">
      <Header name="Recepcion de Transferencia de Inventario" />
      <div className="mt-5 grid grid-cols-2 gap-6">
        {/* Información del Movimiento */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Ubicación de Origen</label>
          <p className="border border-gray-300 rounded p-2">{movement.fromLocationName}</p>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Ubicación de Destino</label>
          <p className="border border-gray-300 rounded p-2">{movement.toLocationName}</p>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Tipo de Movimiento</label>
          <p className="border border-gray-300 rounded p-2">{movement.movementType}</p>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Estado del Movimiento</label>
          <p className="border border-gray-300 rounded p-2">{movement.status}</p>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Fecha del Movimiento</label>
          <p className="border border-gray-300 rounded p-2">{new Date(movement.movementDate).toLocaleDateString()}</p>
        </div>

        <div className="col-span-2">
          <label className="text-gray-700 font-medium">Vehículos Transferidos</label>
          <table className="min-w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Modelo</th>
                <th className="border border-gray-300 px-4 py-2">Color</th>
                <th className="border border-gray-300 px-4 py-2">Serial</th>
              </tr>
            </thead>
            <tbody>
              {movement.vehicles.map((vehicle: any) => (
                <tr key={vehicle.vehicleId}>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.modelName}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.colorName}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.internal_serial}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col col-span-2">
          <label className="text-gray-700 font-medium">Notas</label>
          <p className="border border-gray-300 rounded p-2">{movement.notes || "Sin notas"}</p>
        </div>
      </div>

      {/* Campos para Confirmación de Recepción */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-medium">Confirmación de Recepción</h2>
        
        <div className="flex flex-col mt-4">
          <label className="text-gray-700 font-medium">Fecha de Recepción</label>
          <input
            type="date"
            value={arrivalDate.toISOString().split('T')[0]}
            onChange={(e) => setArrivalDate(new Date(e.target.value))}
            className="border border-gray-300 rounded p-2"
          />
        </div>

        <div className="flex flex-col mt-4">
          <label className="text-gray-700 font-medium">¿Recibido?</label>
          <select
            value={isReceived ? 'Sí' : 'No'}
            onChange={(e) => setIsReceived(e.target.value === 'Sí')}
            className="border border-gray-300 rounded p-2"
          >
            <option value="No">No</option>
            <option value="Sí">Sí</option>
          </select>
        </div>

        <div className="flex flex-col mt-4">
          <label className="text-gray-700 font-medium">Notas de Recepción</label>
          <textarea
            value={receptionNotes || ''}
            onChange={(e) => setReceptionNotes(e.target.value)}
            className="border border-gray-300 rounded p-2"
            placeholder="Notas adicionales"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleConfirmReception}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Confirmar Recepción
          </button>
        </div>
      </div>

      {/* Botones de acciones */}
      <div className="flex col-span-2 justify-end mt-4 space-x-4">
        <button
          onClick={() => router.push('/inventoryMovements')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Volver
        </button>

        <button
          onClick={() => handlePrint()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Imprimir PDF
        </button>
      </div>
    </div>
  );
};

export default MovementReceptionPage;
