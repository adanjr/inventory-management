import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Product } from '@/state/api';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  availableProducts: Product[];
  selectedProducts: Product[]; // Vehículos seleccionados actuales (se pasan desde el padre)
  onSelect: (selected: Product[]) => void; // Función para confirmar selección
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  availableProducts,
  selectedProducts,
  onSelect,
}) => {
  const [tempSelectedProducts, setTempSelectedProducts] = useState<Product[]>([]); // Estado temporal de vehículos seleccionados
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(availableProducts);

  // Filtros individuales para cada campo
  const [nameFilter, setNameFilter] = useState('');
  
  useEffect(() => {
    if (open) {
      // Sincronizar el estado temporal con los seleccionados cuando se abre el modal
      setTempSelectedProducts(selectedProducts);
    }
  }, [selectedProducts, open]);

  useEffect(() => {
    // Filtrar vehículos según los filtros introducidos
    const filtered = availableProducts.filter((Product) =>
      Product.name.toUpperCase().includes(nameFilter.toUpperCase())
    );
    setFilteredProducts(filtered);
  }, [nameFilter, availableProducts]);

  const handleSelectionChange = (ids: number[]) => {
    const selected = availableProducts.filter(Product => ids.includes(Product.productId));
    setTempSelectedProducts(selected);
  };

  const handleConfirmSelection = () => {
    // Combinar los vehículos previamente seleccionados con los nuevos seleccionados
    const combinedSelection = [...tempSelectedProducts, ...selectedProducts];

    // Filtrar para que no haya duplicados en la selección
    const uniqueSelection = Array.from(new Set(combinedSelection.map(v => v.productId)))
      .map(id => combinedSelection.find(v => v.productId === id)!);

    onSelect(uniqueSelection); // Enviar la selección combinada al padre
    onClose();
  };

  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 30 },
    { field: "name", headerName: "Nombre", width: 100 },
    { field: "price", headerName: "Precio", width: 100 },
    { field: 'stockQuantity', headerName: 'Cantidad en Stock', width: 150 },
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
        <h2>Seleccionar Productos</h2>

        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Filtrar por Nombre"
            variant="outlined"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Contenedor con scroll solo para el DataGrid */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '60vh', marginBottom: 2 }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              const selectedIds = newSelection as number[];
              const selectedProducts = availableProducts.filter((v) => selectedIds.includes(v.productId));
              setTempSelectedProducts(selectedProducts);
            }}
            getRowId={(row) => row.productId}
            isRowSelectable={(params) => !selectedProducts.some(v => v.productId === params.row.ProductId)}
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

export default ProductModal;
