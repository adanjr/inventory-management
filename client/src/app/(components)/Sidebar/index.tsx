"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  Boxes,
  Car,
  CircleDollarSign,
  Clipboard,
  Copyright,
  Building,
  Factory,
  Layout,
  LucideIcon,
  Map,
  Menu,  
  SlidersHorizontal,
  SquareUser,
  User,
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

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // Lista de enlaces que aparecen en el sidebar
  const sidebarLinks = [
    { href: "/dashboard", icon: Layout, label: "Dashboard" },
    { href: "/inventory", icon: Archive, label: "Inventario" },
    { href: "/vehicles", icon: Car, label: "Vehiculos" },
    { href: "/manufacturers", icon: Copyright, label: "Marcas" },
    { href: "/categories", icon: Boxes, label: "Categorias" },
    { href: "/products", icon: Clipboard, label: "Productos" },
    { href: "/colors", icon: Boxes, label: "Colores" },
    { href: "/engineTypes", icon: Boxes, label: "Tipos de Motor" },
    { href: "/fuelTypes", icon: Boxes, label: "Tipos de Combustible" },
    { href: "/makes", icon: Factory, label: "Fabricantes" },
    { href: "/models", icon: Boxes, label: "Modelos" },
    { href: "/transmissions", icon: Boxes, label: "Tipos de Transmision" },
    { href: "/vehicleStatus", icon: Boxes, label: "Estatus de Vehiculo" },
    { href: "/vehicleTypes", icon: Boxes, label: "Tipos de Vehiculo" },    
    { href: "/customers", icon: SquareUser, label: "Clientes" },
    { href: "/suppliers", icon: Building, label: "Proveedores" },
    { href: "/locations", icon: Map, label: "Suc/Almacenes" },
    { href: "/users", icon: User, label: "Usuarios" },
    { href: "/settings", icon: SlidersHorizontal, label: "Configuracion" },
    { href: "/expenses", icon: CircleDollarSign, label: "Gastos" },
  ];

  // Filtrar enlaces según el texto de búsqueda
  const filteredLinks = sidebarLinks.filter((link) =>
    link.label.toLowerCase().includes(filterText.toLowerCase())
  );

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
        {filteredLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isCollapsed={isSidebarCollapsed}
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy; 2024 YAII/ERP</p>
      </div>
    </div>
  );
};

export default Sidebar;