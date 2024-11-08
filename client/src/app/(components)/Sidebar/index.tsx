import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {  useGetAuthUserQuery,
          useGetRolePermissionsByNameQuery,
          MenuModules,
 } from "@/state/api";
import MenuBuilder from "@/app/(components)/MenuBuilder";
import Image from "next/image";
import { Menu, Layout, Archive, FileText, Car, Package, FileBox, FolderTree, BadgeDollarSign,
  SquareUser, ShoppingBag, Building, Boxes, Factory, CheckCircle, BatteryCharging, Copyright,
  NotebookPen , Plug , HandCoins, CircleDollarSign, CreditCard, MonitorDot, Building2, User,
  Warehouse, DollarSign, Percent, Mail, Blocks, DatabaseBackup, Clipboard,LucideProps
  } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const { data: currentUser } = useGetAuthUserQuery({});

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;
  
  const userRole = currentUserDetails?.roleName || 'NO ROLE';
  const roleId = currentUserDetails?.roleId;
  const menuPermissions = currentUserDetails?.menuModules;
 
  interface MenuItem {
    name: string;
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    href: string;
    subItems?: MenuItem[]; 
  }
 
  // Lista completa del menú
  const menuItems: MenuItem[] =  [
    {
      name: "Dashboard",
      label: "Dashboard",
      icon: Layout,
      href: "/dashboard",
      subItems: [],
    },   
    {
      name: "Inventory",
      label: "Inventario",
      icon: Archive,
      href: "",
      subItems: [
        { name: "Movimientos", label: "Inventario General", href: "/inventory", icon: Archive },
        { name: "Movimientos", label: "Inventario Detalle", href: "/inventoryByBranch", icon: FileText },
        { name: "Vehiculos", label: "Vehículos", href: "/vehicles", icon: Car },
        { name: "Modelos", label: "Modelos", href: "/models", icon: FileBox },
        { name: "Familias", label: "Familias de Modelos", href: "/families", icon: FolderTree }, 
        { name: "Productos", label: "Productos", href: "/products", icon: Package },
        { name: "Categorias", label: "Categorías", href: "/categories", icon: Boxes },
      ],
    },
    {
      name: "Sales",
      label: "Ventas",
      icon: BadgeDollarSign,
      href: "",
      subItems: [
        { name: "Ordenes", label: "Punto de Venta", href: "/sales", icon: BadgeDollarSign },    
        { name: "Ordenes", label: "Punto de Venta 2", href: "/pointOfSale", icon: BadgeDollarSign },  
        { name: "Ordenes", label: "Ordenes de Venta", href: "/salesOrders", icon: BadgeDollarSign },       
        { name: "Clientes", label: "Clientes", href: "/customers", icon: SquareUser },
      ],
    },
    {
      name: "Purchases",
      label: "Compras",
      icon: ShoppingBag,
      href: "",
      subItems: [       
        { name: "Ordenes", label: "Ordenes de Compra", href: "/purchasesOrders", icon: BadgeDollarSign },       
        { name: "Proveedores", label: "Proveedores", href: "/suppliers", icon: Building },
      ],
    },
    {
      name: "Catalogs", 
      label: "Catálogos",
      icon: Boxes,
      href: "",
      subItems: [               
        { name: "Todos", label: "Condiciones de Vehiculos", href: "/vehicleConditions", icon: Boxes },
        { name: "Todos", label: "Colores", href: "/colors", icon: Boxes },
        { name: "Todos", label: "Estatus de Disponibilidad", href: "/vehicleAvailabilityStatus", icon: Boxes },
        { name: "Todos", label: "Estatus de Vehiculo", href: "/vehicleStatus", icon: Boxes },
        { name: "Todos", label: "Fabricantes", href: "/makes", icon: Factory },
        { name: "Todos", label: "Garantías de Vehículos", href: "/warranties", icon: CheckCircle },
        { name: "Todos", label: "Garantías de Baterías", href: "/batteryWarranties", icon: BatteryCharging },
        { name: "Todos", label: "Marcas", href: "/manufacturers", icon: Copyright },        
        { name: "Todos", label: "Tipos de Auditorias", href: "/auditTypes", icon: NotebookPen },
        { name: "Todos", label: "Tipos de Carga", href: "/fuelTypes", icon: Plug }, 
        { name: "Todos", label: "Tipos de Motor", href: "/engineTypes", icon: Boxes }, 
        { name: "Todos", label: "Tipos de Transmision", href: "/transmissions", icon: Boxes },            
        { name: "Todos", label: "Tipos de Vehiculo", href: "/vehicleTypes", icon: Boxes },
      ],
    },
    {
      name: "Finance", 
      label: "Finanzas",
      icon: HandCoins,
      href: "",
      subItems: [
        { name: "Gastos", label: "Gastos", href: "/expenses", icon: HandCoins },      
      ],
    },              
    {
      name: "Reports", 
      label: "Reportes",
      icon: Clipboard,
      href: "",
      subItems: [
        { name: "Ventas", label: "Ventas", href: "/reports/sales", icon: CircleDollarSign },
        { name: "Compras", label: "Compras", href: "/reports/purchases", icon: CreditCard },
      ],
    },
    {
      name: "Administration", 
      label: "Administracion",
      icon: MonitorDot,
      href: "",      
      subItems: [          
        { name: "Organizacion", label: "Perfil de Organización", href: "/organizationProfile", icon: Building2 }, 
        { name: "Usuarios", label: "Usuarios", href: "/users", icon: User },   
        { name: "Almacenes", label: "Almacenes", href: "/locations", icon: Warehouse }, 
        { name: "Monedas", label: "Monedas", href: "/currencies", icon: DollarSign }, 
        { name: "Impuestos", label: "Impuestos", href: "/taxes", icon: Percent },       
        { name: "Email", label: "Email", href: "/email", icon: Mail },              
        { name: "Integrations", label: "Integraciones", href: "/integrations", icon: Blocks },              
        { name: "Backup", label: "Backup de Datos", href: "/databaseBackup", icon: DatabaseBackup },                        
      ],
    },
  ]; 

  return (
    <div className={`fixed flex flex-col ${isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"} bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`}>
      <div className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${isSidebarCollapsed ? "px-5" : "px-8"}`}>
        <Image
          src="https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/yaii+logo.png"
          alt="yaii-logo"
          width={50}
          height={50}
          className="rounded w-8"
        />
        <h1 className={`${isSidebarCollapsed ? "hidden" : "block"} font-extrabold text-2xl`}>ERP</h1>
        <button className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100" onClick={toggleSidebar}>
          <Menu className="w-4 h-4" />
        </button>
      </div>
      <MenuBuilder menuModules={menuPermissions}  menuItems={menuItems} isCollapsed={isSidebarCollapsed} />
    </div>
  );
};

export default Sidebar;