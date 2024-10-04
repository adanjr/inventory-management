import { useState, useEffect } from "react";
import { Color } from "@/state/api";

interface EditColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (colorId: string, updatedData: Partial<Color>) => Promise<void>;
  color: Color; // El color seleccionado para editar
}

const EditColorModal: React.FC<EditColorModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  color,
}) => {
  const [name, setName] = useState(color.name);
  
  useEffect(() => {
    // Cuando el modal se abre, actualiza los valores con los datos del color
    if (isOpen) {
      setName(color.name);
    }
  }, [color, isOpen]);

  const handleSubmit = async () => {
    if (name.trim() === "") {
      alert("El nombre del color no puede estar vacío");
      return;
    }

    // Envía los datos actualizados al controlador de edición
    await onEdit(color.colorId, { name });
  };

  if (!isOpen) return null; // No renderizar si el modal no está abierto

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Editar Color</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Color
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el nombre del color"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditColorModal;
