 "use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  BadgeDollarSign,
  BatteryCharging,
  Boxes,
  Car,
  CircleDollarSign,
  Clipboard,
  Copyright,
  CreditCard,
  Building,
  Factory,
  FileBox, 
  FileText,
  FolderTree,
  Layout,
  LucideIcon,
  Map,
  Menu,
  MonitorDot,
  Package,
  Plug,
  CheckCircle,
  NotebookPen,
  SlidersHorizontal,
  ShoppingBag,
  SquareUser,
  User,
  ChevronDown,
  ChevronUp,
  HandCoins,  
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }
      }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />

        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const [filterText, setFilterText] = useState(""); // Estado del filtro de búsqueda
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleCatalog = () => setIsCatalogOpen(!isCatalogOpen);
  const toggleInventory = () => setIsInventoryOpen(!isInventoryOpen);
  const toggleSales = () => setIsSalesOpen(!isSalesOpen);
  const togglePurchases = () => setIsPurchasesOpen(!isPurchasesOpen);
  const toggleManagement = () => setIsManagementOpen(!isManagementOpen);
  const toggleFinance = () => setIsFinanceOpen(!isFinanceOpen);
  const toggleReports = () => setIsReportsOpen(!isReportsOpen);
 
  // Lista completa del menú
  const menuItems = [
    {
      label: "Dashboard",
      icon: Layout,
      href: "/dashboard",
      subItems: [],
    },   
    {
      label: "Inventario",
      icon: Archive,
      href: "",
      subItems: [
        { label: "Inventario General", href: "/inventory", icon: Archive },
        { label: "Inventario Detalle", href: "/inventoryByBranch", icon: FileText },
        { label: "Vehículos", href: "/vehicles", icon: Car },
        { label: "Productos", href: "/products", icon: Package },
        { label: "Modelos", href: "/models", icon: FileBox },
        { label: "Familias de Modelos", href: "/families", icon: FolderTree },
        { label: "Suc/Almacenes", href: "/locations", icon: Map },
      ],
    },
    {
      label: "Ventas",
      icon: BadgeDollarSign,
      href: "",
      subItems: [
        { label: "Punto de Venta", href: "/sales", icon: BadgeDollarSign },    
        { label: "Ordenes de Venta", href: "/salesOrders", icon: BadgeDollarSign },       
        { label: "Clientes", href: "/customers", icon: SquareUser },
      ],
    },
    {
      label: "Compras",
      icon: ShoppingBag,
      href: "",
      subItems: [
        { label: "Compras", href: "/buy", icon: ShoppingBag },
        { label: "Ordenes de Compra", href: "/purchasesOrders", icon: BadgeDollarSign },       
        { label: "Proveedores", href: "/suppliers", icon: Building },
      ],
    },
    {
      label: "Catálogos",
      icon: Boxes,
      href: "",
      subItems: [        
        { label: "Categorías", href: "/categories", icon: Boxes },
        { label: "Condiciones de Vehiculos", href: "/vehicleConditions", icon: Boxes },
        { label: "Colores", href: "/colors", icon: Boxes },
        { label: "Estatus de Disponibilidad", href: "/vehicleAvailabilityStatus", icon: Boxes },
        { label: "Estatus de Vehiculo", href: "/vehicleStatus", icon: Boxes },
        { label: "Fabricantes", href: "/makes", icon: Factory },
        { label: "Garantías de Vehículos", href: "/warranties", icon: CheckCircle },
        { label: "Garantías de Baterías", href: "/batteryWarranties", icon: BatteryCharging },
        { label: "Marcas", href: "/manufacturers", icon: Copyright },        
        { label: "Tipos de Auditorias", href: "/auditTypes", icon: NotebookPen },
        { label: "Tipos de Carga", href: "/fuelTypes", icon: Plug }, 
        { label: "Tipos de Motor", href: "/engineTypes", icon: Boxes }, 
        { label: "Tipos de Transmision", href: "/transmissions", icon: Boxes },            
        { label: "Tipos de Vehiculo", href: "/vehicleTypes", icon: Boxes },
      ],
    },
    {
      label: "Finanzas",
      icon: HandCoins,
      href: "",
      subItems: [
        { label: "Gastos", href: "/expenses", icon: HandCoins },      
      ],
    },              
    {
      label: "Reportes",
      icon: Clipboard,
      href: "",
      subItems: [
        { label: "Ventas", href: "/reports/sales", icon: CircleDollarSign },
        { label: "Compras", href: "/reports/purchases", icon: CreditCard },
      ],
    },
    {
      label: "Administracion",
      icon: MonitorDot,
      href: "",
      subItems: [
        { label: "Usuarios", href: "/users", icon: User },                 
      ],
    },
  ];

  // Filtrar elementos del menú con base en el texto de búsqueda
  const filteredMenuItems = menuItems
    .map((item) => {
      const filteredSubItems = item.subItems.filter((subItem) =>
        subItem.label.toLowerCase().includes(filterText.toLowerCase())
      );
      if (
        item.label.toLowerCase().includes(filterText.toLowerCase()) ||
        filteredSubItems.length > 0
      ) {
        return { ...item, subItems: filteredSubItems };
      }
      return null;
    })
    .filter(Boolean);

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <Image
          src="https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/yaii+logo.png"
          alt="yaii-logo"
          width={50}
          height={50}
          className="rounded w-8"
        />
        <h1
          className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          ERP
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* SEARCH INPUT */}
      {!isSidebarCollapsed && (
        <div className="px-8 mt-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      )}

      {/* LINKS */}
      <div className="flex-grow mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {filteredMenuItems.map((item, index) => (
        <div key={index}>
          {/* Menú de nivel 1 */}
          <div
            className={`cursor-pointer flex items-center px-8 py-4 hover:bg-blue-100 gap-3 ${
              isSidebarCollapsed ? "justify-center" : "justify-start"
            }`}
            onClick={
              (item?.subItems?.length || 0) > 0 // Verifica si subItems existe y tiene elementos
                ? item?.label === "Catálogos"
                  ? toggleCatalog
                  : item?.label === "Inventario"
                  ? toggleInventory
                  : item?.label === "Ventas"
                  ? toggleSales
                  : item?.label === "Compras"
                  ? togglePurchases
                  : item?.label === "Finanzas"
                  ? toggleFinance
                  : item?.label === "Administracion"
                  ? toggleManagement
                  : toggleReports
                : undefined
            }
          >
            {/* Verificar si 'item.icon' es un componente válido */}
            {item?.icon && <item.icon className="w-6 h-6 !text-gray-700" />}
            
            {!isSidebarCollapsed && (
              <span className="font-medium text-gray-700">{item?.label}</span>
            )}

            {!isSidebarCollapsed && (item?.subItems?.length || 0) > 0 && (
              <span>
                {item?.label === "Catálogos" && isCatalogOpen ? (
                  <ChevronUp />
                ) : item?.label === "Inventario" && isInventoryOpen ? (
                  <ChevronUp />
                ) : item?.label === "Ventas" && isSalesOpen ? (
                  <ChevronUp />
                ) : item?.label === "Compras" && isPurchasesOpen ? (
                  <ChevronUp />
                ) : item?.label === "Finanzas" && isFinanceOpen ? (
                  <ChevronUp />
                ) : item?.label === "Administracion" && isManagementOpen ? (
                  <ChevronUp />
                ) : item?.label === "Reportes" && isReportsOpen ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </span>
            )}
          </div>
          {/* Menú de nivel 2 */}
          {(item?.subItems?.length || 0) > 0 && !isSidebarCollapsed && (
            <div
              className={`ml-8 ${
                item?.label === "Catálogos" && isCatalogOpen
                  ? "block"
                  : item?.label === "Inventario" && isInventoryOpen
                  ? "block"
                  : item?.label === "Ventas" && isSalesOpen
                  ? "block"
                  : item?.label === "Compras" && isPurchasesOpen
                  ? "block"
                  : item?.label === "Finanzas" && isFinanceOpen
                  ? "block"
                  : item?.label === "Administracion" && isManagementOpen
                  ? "block"
                  : item?.label === "Reportes" && isReportsOpen
                  ? "block"
                  : "hidden"
              }`}
            >
              {item?.subItems?.map((subItem, subIndex) => (
                <SidebarLink
                  key={subIndex}
                  href={subItem.href}
                  icon={subItem.icon}
                  label={subItem.label}
                  isCollapsed={isSidebarCollapsed}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      </div>
    </div>
  );
};

export default Sidebar;
