"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  BadgeDollarSign,
  Boxes,
  Car,
  CircleDollarSign,
  Clipboard,
  Copyright,
  CreditCard,
  Building,
  Factory,
  HandCoins,
  Layout,
  LucideIcon,
  Map,
  MonitorDot,
  Menu,
  SlidersHorizontal,
  ShoppingBag,
  SquareUser,
  User,
  ChevronDown,
  ChevronUp,
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

  // Estados para controlar submenús
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // Funciones para controlar los submenús
  const toggleCatalog = () => setIsCatalogOpen(!isCatalogOpen);
  const toggleInventory = () => setIsInventoryOpen(!isInventoryOpen);
  const toggleSales = () => setIsSalesOpen(!isSalesOpen);
  const togglePurchases = () => setIsPurchasesOpen(!isPurchasesOpen);
  const toggleReports = () => setIsReportsOpen(!isReportsOpen);
  const toggleManagement = () => setIsManagementOpen(!isManagementOpen);
  const toggleFinance = () => setIsFinanceOpen(!isFinanceOpen);

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
          src="https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/logo.png"
          alt="yaii-logo"
          width={27}
          height={27}
          className="rounded w-8"
        />
        <h1
          className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          YAII/ERP
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
        {/* Dashboard */}
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />

        {/* Catálogos */}
        <div>
          <div
            className="cursor-pointer flex items-center px-8 py-4 hover:bg-blue-100 gap-3"
            onClick={toggleCatalog}
          >
            <Boxes className="w-6 h-6 !text-gray-700" />
            {!isSidebarCollapsed && (
              <span className="font-medium text-gray-700">Catálogos</span>
            )}
            {!isSidebarCollapsed && (
              <span>{isCatalogOpen ? <ChevronUp /> : <ChevronDown />}</span>
            )}
          </div>
          {isCatalogOpen && !isSidebarCollapsed && (
            <div className="ml-8">
              <SidebarLink href="/categories" icon={Boxes} label="Categorías" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/colors" icon={Boxes} label="Colores" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/vehicleStatus" icon={Boxes} label="Estatus de Vehiculo" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/makes" icon={Factory} label="Fabricantes" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/manufacturers" icon={Copyright} label="Marcas" isCollapsed={isSidebarCollapsed} />           
              <SidebarLink href="/models" icon={Clipboard} label="Modelos" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/fuelTypes" icon={Boxes} label="Tipos de Combustible" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/engineTypes" icon={Boxes} label="Tipos de Motor" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/transmissions" icon={Boxes} label="Tipos de Transmision" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/vehicleTypes" icon={Boxes} label="Tipos de Vehiculo" isCollapsed={isSidebarCollapsed} />        
            </div>
          )}
        </div>

        {/* Inventario */}
        <div>
          <div
            className="cursor-pointer flex items-center px-8 py-4 hover:bg-blue-100 gap-3"
            onClick={toggleInventory}
          >
            <Archive className="w-6 h-6 !text-gray-700" />
            {!isSidebarCollapsed && (
              <span className="font-medium text-gray-700">Inventario</span>
            )}
            {!isSidebarCollapsed && (
              <span>{isInventoryOpen ? <ChevronUp /> : <ChevronDown />}</span>
            )}
          </div>
          {isInventoryOpen && !isSidebarCollapsed && (
            <div className="ml-8">
              <SidebarLink href="/inventory" icon={Archive} label="Inventario General" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/vehicles" icon={Car} label="Vehículos" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/products" icon={Clipboard} label="Productos" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/locations" icon={Map} label="Suc/Almacenes" isCollapsed={isSidebarCollapsed} />
            </div>
          )}
        </div>

        {/* Ventas */}
        <div>
          <div
            className="cursor-pointer flex items-center px-8 py-4 hover:bg-blue-100 gap-3"
            onClick={toggleSales}
          >
            <BadgeDollarSign className="w-6 h-6 !text-gray-700" />
            {!isSidebarCollapsed && (
              <span className="font-medium text-gray-700">Ventas</span>
            )}
            {!isSidebarCollapsed && (
              <span>{isSalesOpen ? <ChevronUp /> : <ChevronDown />}</span>
            )}
          </div>
          {isSalesOpen && !isSidebarCollapsed && (
            <div className="ml-8">
              <SidebarLink href="/sales" icon={BadgeDollarSign} label="Punto de Venta" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/customers" icon={SquareUser} label="Clientes" isCollapsed={isSidebarCollapsed} />
            </div>
          )}
        </div>

        {/* Compras */}
        <div>
          <div
            className="cursor-pointer flex items-center px-8 py-4 hover:bg-blue-100 gap-3"
            onClick={togglePurchases}
          >
            <ShoppingBag className="w-6 h-6 !text-gray-700" />
            {!isSidebarCollapsed && (
              <span className="font-medium text-gray-700">Compras</span>
            )}
            {!isSidebarCollapsed && (
              <span>{isPurchasesOpen ? <ChevronUp /> : <ChevronDown />}</span>
            )}
          </div>
          {isPurchasesOpen && !isSidebarCollapsed && (
            <div className="ml-8">  
              <SidebarLink href="/buy" icon={ShoppingBag} label="Comprar" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/suppliers" icon={Building} label="Proveedores" isCollapsed={isSidebarCollapsed} />
            </div>
          )}
        </div>

          {/* Finanzas */}
          <div>
          <div
            className="cursor-pointer flex items-center px-8 py-4 hover:bg-blue-100 gap-3"
            onClick={toggleFinance}
          >
            <HandCoins className="w-6 h-6 !text-gray-700" />
            {!isSidebarCollapsed && (
              <span className="font-medium text-gray-700">Finanzas</span>
            )}
            {!isSidebarCollapsed && (
              <span>{isFinanceOpen ? <ChevronUp /> : <ChevronDown />}</span>
            )}
          </div>
          {isFinanceOpen && !isSidebarCollapsed && (
            <div className="ml-8">              
              <SidebarLink href="/expenses" icon={HandCoins} label="Gastos" isCollapsed={isSidebarCollapsed} />             
            </div>
          )}
        </div>
    


        {/* Reportes */}
        <div>
          <div
            className="cursor-pointer flex items-center px-8 py-4 hover:bg-blue-100 gap-3"
            onClick={toggleReports}
          >
            <Clipboard className="w-6 h-6 !text-gray-700" />
            {!isSidebarCollapsed && (
              <span className="font-medium text-gray-700">Reportes</span>
            )}
            {!isSidebarCollapsed && (
              <span>{isReportsOpen ? <ChevronUp /> : <ChevronDown />}</span>
            )}
          </div>
          {isReportsOpen && !isSidebarCollapsed && (
            <div className="ml-8">
              <SidebarLink href="/reports/sales" icon={CircleDollarSign} label="Ventas" isCollapsed={isSidebarCollapsed} />
              <SidebarLink href="/reports/purchases" icon={CreditCard} label="Compras" isCollapsed={isSidebarCollapsed} />
            </div>
          )}
        </div>

        {/* ADMIN */}
        <div>
          <div
            className="cursor-pointer flex items-center px-8 py-4 hover:bg-blue-100 gap-3"
            onClick={toggleManagement}
          >
            <MonitorDot className="w-6 h-6 !text-gray-700" />
            {!isSidebarCollapsed && (
              <span className="font-medium text-gray-700">Administracion</span>
            )}
            {!isSidebarCollapsed && (
              <span>{isManagementOpen ? <ChevronUp /> : <ChevronDown />}</span>
            )}
          </div>
          {isManagementOpen && !isSidebarCollapsed && (
            <div className="ml-8">                       
              <SidebarLink href="/users" icon={User} label="Usuarios" isCollapsed={isSidebarCollapsed} />             
            </div>
          )}
        </div>

        {/* Dashboard */}
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Configuracion"
          isCollapsed={isSidebarCollapsed}
        />

      </div>
    </div>
  );
};

export default Sidebar;
