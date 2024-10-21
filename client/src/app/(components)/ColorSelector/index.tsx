import { useEffect, useState } from "react";
import { VehicleColor, VehicleModelSummary } from "@/state/api";
import Image from "next/image";
import { BatteryCharging, Dumbbell, Gauge } from "lucide-react";
import { useRouter } from "next/navigation";

interface ColorSelectorProps {
  models: VehicleModelSummary[] | null | undefined;
  modelId: string | null;
  colorId: string | null;
}

const ColorSelector = ({ models, colorId, modelId }: ColorSelectorProps) => {
  const router = useRouter();

  // Hooks deben llamarse sin condiciones
  const [selectedColors, setSelectedColors] = useState<{ [modelId: number]: VehicleColor }>({});
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Encontrar el modelo actual solo si models no es null
  const model = models?.find((m) => m.modelId === Number(modelId));

  // Lógica para manejar el color inicial
  useEffect(() => {
    if (model) {
      const initialColor = model.colors.find((color) => color.colorId === Number(colorId));
      if (initialColor) {
        setSelectedColor(initialColor.colorId);
        setSelectedColors((prev) => ({ ...prev, [model.modelId]: initialColor }));
      }
    }
  }, [model, colorId]);

  // Funciones para manejar el incremento/decremento de cantidad
  const incrementQuantity = () => {
    const selectedColorObject = selectedColors[model?.modelId || 0];
    if (quantity < (selectedColorObject?.count || 1)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Manejar la selección de color
  const handleColorSelect = (modelId: number, color: VehicleColor) => {
    setSelectedColors((prev) => ({
      ...prev,
      [modelId]: color,
    }));
    setSelectedColor(color.colorId);
    setQuantity(1); // Resetear cantidad al seleccionar un nuevo color
  };

  // Si models es null o no se encuentra el modelo, renderizar mensaje
  if (!models) {
    return <div>No hay información del modelo disponible.</div>;
  }

  if (!model) {
    return <div>No se encontró el modelo seleccionado.</div>;
  }

  const selectedColorObject = selectedColors[model.modelId];

  return (
    <div className="mx-auto pb-5 w-full">
      <div className="border shadow rounded-md p-4 max-w-full w-full mx-auto flex relative">
        {/* Sección izquierda: Imagen grande */}
        <div className="w-full flex justify-center items-center relative" style={{ height: "70vh", flex: "0 0 70%" }}>
          <Image
            src={`https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/${model.modelName}-${selectedColorObject?.colorName}.jpg`}
            alt={model.modelName}
            fill
            className="rounded-2xl object-cover"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Sección derecha: Detalles */}
        <div className="w-full flex flex-col justify-between px-4 h-full" style={{ flex: "0 0 30%" }}>
          <div>
            <h3 className="text-2xl text-gray-900 font-bold">
              {model.vehicleType} {model.modelName}
            </h3>
          </div>

          {/* Duración de batería */}
          <div className="mt-2 border p-3 rounded-lg flex items-center space-x-3 bg-gray-100">
            <BatteryCharging className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Duración de batería</p>
              <p className="text-md text-gray-900">{model.range ? `${model.range} kWh` : "N/A"}</p>
            </div>
          </div>

          {/* Capacidad de peso */}
          <div className="mt-2 border p-3 rounded-lg flex items-center space-x-3 bg-gray-100">
            <Dumbbell className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Capacidad de peso</p>
              <p className="text-md text-gray-900">{model.weightCapacity ? `${model.weightCapacity} kg` : "N/A"}</p>
            </div>
          </div>

          {/* Velocidad */}
          <div className="mt-2 border p-3 rounded-lg flex items-center space-x-3 bg-gray-100">
            <Gauge className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Velocidad máxima</p>
              <p className="text-md text-gray-900">{model.speed ? `${model.speed} km/h` : "N/A"}</p>
            </div>
          </div>

          {/* Colores disponibles */}
          <div className="mt-2">
            <h4 className="text-md text-gray-700 font-medium">Colores disponibles:</h4>
            <div className="flex space-x-2 mt-2">
              {model.colors.map((color) => {
                const isSelected = selectedColors[model.modelId]?.colorId === color.colorId;
                return (
                  <div
                    key={color.colorId}
                    className={`w-8 h-8 rounded-full cursor-pointer border border-gray-300 ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                    style={{ backgroundColor: color.hexadecimal }}
                    title={color.colorName}
                    onClick={() => handleColorSelect(model.modelId, color)}
                  />
                );
              })}
            </div>
          </div>

          {/* Sección de cantidad */}
          <div className="mt-4">
            <div className="flex justify-center mb-4">
              <span className="text-xl font-medium mr-2">Grand Total:</span>
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(model.basePrice * quantity)}
              </span>
            </div>

            {/* Input numérico y botón */}
            <div className="flex items-center mb-4">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value)), model.count))}
                min={1}
                max={selectedColorObject?.count}
                className="border text-center w-24 h-12 text-xl mr-2 px-2 rounded-lg"
              />
              <button
                onClick={() => {
                  localStorage.setItem('modelId', model.modelId.toString());
                  localStorage.setItem('quantity', quantity.toString());
                  localStorage.setItem('colorId', selectedColors[model.modelId]?.colorId.toString());
                  router.push('/cart');
                }}
                className="bg-green-500 text-white py-4 px-10 rounded-lg text-2xl font-bold hover:bg-green-600"
              >
                Comprar
              </button>
            </div>

            {/* Precio en grande */}
            <div className="flex justify-center">
              <h1 className="text-3xl text-gray-900 font-bold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(model.basePrice)}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;
