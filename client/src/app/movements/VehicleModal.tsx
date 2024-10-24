import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Vehicle } from '@/state/api';

interface VehicleModalProps {
  open: boolean;
  onClose: () => void;
  availableVehicles: Vehicle[];
  selectedVehicles: Vehicle[]; // Vehículos seleccionados actuales (se pasan desde el padre)
  onSelect: (selected: Vehicle[]) => void; // Función para confirmar selección
}

const VehicleModal: React.FC<VehicleModalProps> = ({
  open,
  onClose,
  availableVehicles,
  selectedVehicles,
  onSelect,
}) => {
  const [tempSelectedVehicles, setTempSelectedVehicles] = useState<Vehicle[]>([]); // Estado temporal de vehículos seleccionados
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(availableVehicles);

  // Filtros individuales para cada campo
  const [modelFilter, setModelFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [serialFilter, setSerialFilter] = useState('');
  const [motorFilter, setMotorFilter] = useState('');

  useEffect(() => {
    if (open) {
      // Sincronizar el estado temporal con los seleccionados cuando se abre el modal
      setTempSelectedVehicles(selectedVehicles);
    }
  }, [selectedVehicles, open]);

  useEffect(() => {
    // Filtrar vehículos según los filtros introducidos
    const filtered = availableVehicles.filter((vehicle) =>
      vehicle.model.name.toUpperCase().includes(modelFilter.toUpperCase()) &&
      vehicle.color.name.toUpperCase().includes(colorFilter.toUpperCase()) &&
      vehicle.engineNumber?.toUpperCase().includes(motorFilter.toUpperCase()) &&
      vehicle.internal_serial?.toUpperCase().includes(serialFilter.toUpperCase())
    );
    setFilteredVehicles(filtered);
  }, [modelFilter, colorFilter, serialFilter, motorFilter, availableVehicles]);

  const handleSelectionChange = (ids: number[]) => {
    const selected = availableVehicles.filter(vehicle => ids.includes(vehicle.vehicleId));
    setTempSelectedVehicles(selected);
  };

  const handleConfirmSelection = () => {
    // Combinar los vehículos previamente seleccionados con los nuevos seleccionados
    const combinedSelection = [...tempSelectedVehicles, ...selectedVehicles];

    // Filtrar para que no haya duplicados en la selección
    const uniqueSelection = Array.from(new Set(combinedSelection.map(v => v.vehicleId)))
      .map(id => combinedSelection.find(v => v.vehicleId === id)!);

    onSelect(uniqueSelection); // Enviar la selección combinada al padre
    onClose();
  };

  const columns: GridColDef[] = [
    { field: "vehicleId", headerName: "ID", width: 30 },
    { field: "modelName", headerName: "Modelo", width: 100 },
    { field: "colorName", headerName: "Color", width: 100 },
    { field: 'internal_serial', headerName: 'Serial', width: 150 },
    { field: 'engineNumber', headerName: 'Numero de Motor', flex: 1 },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        width: '80%', 
        maxHeight: '80vh', 
        margin: '50px auto', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        display: 'flex', 
        flexDirection: 'column',
      }}>
        <h2>Seleccionar Vehículos</h2>

        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Filtrar por Modelo"
            variant="outlined"
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            fullWidth
          />
          <TextField
            label="Filtrar por Color"
            variant="outlined"
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            fullWidth
          />
          <TextField
            label="Filtrar por Serial"
            variant="outlined"
            value={serialFilter}
            onChange={(e) => setSerialFilter(e.target.value)}
            fullWidth
          />
           <TextField
            label="Filtrar por Motor"
            variant="outlined"
            value={motorFilter}
            onChange={(e) => setMotorFilter(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Contenedor con scroll solo para el DataGrid */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '60vh', marginBottom: 2 }}>
          <DataGrid
            rows={filteredVehicles}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              const selectedIds = newSelection as number[];
              const selectedVehicles = availableVehicles.filter((v) => selectedIds.includes(v.vehicleId));
              setTempSelectedVehicles(selectedVehicles);
            }}
            getRowId={(row) => row.vehicleId}
            isRowSelectable={(params) => !selectedVehicles.some(v => v.vehicleId === params.row.vehicleId)}
          />
        </Box>

        {/* Botones siempre visibles */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmSelection} variant="contained" color="primary">
            Confirmar Selección
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VehicleModal;
