"use client";

import { useEffect, useState } from "react";

interface Provider {
  id: number;
  name: string;
}

interface SearchProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProvider: (provider: Provider) => void;
}

const SearchProviderModal: React.FC<SearchProviderModalProps> = ({
  isOpen,
  onClose,
  onSelectProvider,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [showAddProviderButton, setShowAddProviderButton] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await fetch("/api/providers"); // Cambia esta URL a la de tu API.
      const data = await response.json();
      setProviders(data);
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = providers.filter((provider) =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProviders(results);
      setShowAddProviderButton(results.length === 0); // Mostrar el botón si no hay resultados
    } else {
      setFilteredProviders(providers);
      setShowAddProviderButton(false);
    }
  }, [searchTerm, providers]);

  const handleSelectProvider = (provider: Provider) => {
    onSelectProvider(provider);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "block" : "hidden"}`}>
      <h2 className="text-xl font-bold mb-4">Buscar Proveedor</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-4"
        placeholder="Selecciona un proveedor..."
      />
      {showAddProviderButton && (
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
          Agregar nuevo proveedor
        </button>
      )}
      <div className="max-h-60 overflow-y-auto mb-4">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="p-2 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectProvider(provider)}
            >
              {provider.name}
            </div>
          ))
        ) : (
          <div className="p-2 text-gray-500">No se encontraron proveedores.</div>
        )}
      </div>
      <button
        className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        onClick={onClose}
      >
        Cerrar
      </button>
    </div>
  );
};

export default SearchProviderModal;
