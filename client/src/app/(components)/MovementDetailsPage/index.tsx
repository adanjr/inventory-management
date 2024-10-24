import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMovementByIdQuery } from '@/state/api'; // Cambia esto según tu lógica
import Header from '@/app/(components)/Header';
import { useReactToPrint } from 'react-to-print';

const MovementDetailsPage = ({ movementId }: { movementId: string }) => {
  const { data: movement, isLoading, isError } = useGetMovementByIdQuery(movementId);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement | null>(null); // Referencia al contenido a imprimir

  const handlePrint = useReactToPrint({     
    contentRef: printRef, // Usamos la referencia directamente
    documentTitle: `Detalle_Movimiento_${movementId}`,
  });

  if (isLoading) return <div>Cargando...</div>;
  if (isError || !movement) return <div>Error al cargar los detalles del movimiento.</div>;

  return (
    <div ref={printRef} className="mx-auto py-5 w-full">
      <Header name="Detalle del Movimiento de Inventario" />
      <div  className="mt-5 grid grid-cols-2 gap-6">
        {/* Ubicación de Origen */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Ubicación de Origen</label>
          <p className="border border-gray-300 rounded p-2">{movement.fromLocationName}</p>
        </div>

        {/* Ubicación de Destino */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Ubicación de Destino</label>
          <p className="border border-gray-300 rounded p-2">{movement.toLocationName}</p>
        </div>

        {/* Tipo de Movimiento */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Tipo de Movimiento</label>
          <p className="border border-gray-300 rounded p-2">{movement.movementType}</p>
        </div>

        {/* Estado del Movimiento */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Estado del Movimiento</label>
          <p className="border border-gray-300 rounded p-2">{movement.status}</p>
        </div>

        {/* Fecha del Movimiento */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Fecha del Movimiento</label>
          <p className="border border-gray-300 rounded p-2">{new Date(movement.movementDate).toLocaleDateString()}</p>
        </div>

        {/* Vehículos Seleccionados */}
        <div className="col-span-2">
          <label className="text-gray-700 font-medium">Vehículos Transferidos</label>
          <table className="min-w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Modelo</th>
                <th className="border border-gray-300 px-4 py-2">Color</th>
                <th className="border border-gray-300 px-4 py-2">Serial</th>
                <th className="border border-gray-300 px-4 py-2">Numero de Motor</th>
              </tr>
            </thead>
            <tbody>
              {movement.vehicles.map((vehicle: any) => (
                <tr key={vehicle.vehicleId}>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.modelName}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.colorName}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.internal_serial}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.engineNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notas */}
        <div className="flex flex-col col-span-2">
          <label className="text-gray-700 font-medium">Notas</label>
          <p className="border border-gray-300 rounded p-2">{movement.notes || "Sin notas"}</p>
        </div>

        {movement.status === "COMPLETADO" && (
          <div className="border border-gray-300 rounded-lg p-4 mb-4 col-span-2">
            <h2 className="text-lg font-bold mb-4">Información de Recepción</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Fecha de Recepción</label>
                <p className="border border-gray-300 rounded p-2">
                {movement.arrivalDate ? new Date(movement.arrivalDate).toLocaleDateString() : "Fecha no disponible"}
                </p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Recibido Por</label>
                <p className="border border-gray-300 rounded p-2">
                    {movement.receivedBy || ''}
                </p>
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-gray-700 font-medium">Notas de Recepción</label>
                <p className="border border-gray-300 rounded p-2">
                  {movement.receptionNotes || "Sin notas"}
                </p>
              </div>
            </div>
          </div>
        )}


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
          onClick={() => handlePrint()}   // Llamamos directamente a handlePrint
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Imprimir PDF
        </button>
      </div>

      
    </div>
  );
};

export default MovementDetailsPage;
