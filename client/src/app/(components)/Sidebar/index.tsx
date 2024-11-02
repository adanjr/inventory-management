import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import MenuBuilder from "@/app/(components)/MenuBuilder";
import Image from "next/image";
import { Menu, Layout, Archive, FileText, Car, Package, FileBox, FolderTree, BadgeDollarSign,
  SquareUser, ShoppingBag, Building, Boxes, Factory, CheckCircle, BatteryCharging, Copyright,
  NotebookPen , Plug , HandCoins, CircleDollarSign, CreditCard, MonitorDot, Building2, User,
  Warehouse, DollarSign, Percent, Mail, Blocks, DatabaseBackup, Clipboard,LucideProps
  } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";

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

  interface MenuItem {
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    href: string;
    subItems?: MenuItem[]; // Asegúrate de que subItems sea del tipo correcto
  }
 
  // Lista completa del menú
  const adminMenuItems: MenuItem[] =  [
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
      ],
    },
    {
      label: "Ventas",
      icon: BadgeDollarSign,
      href: "",
      subItems: [
        { label: "Punto de Venta", href: "/sales", icon: BadgeDollarSign },    
        { label: "Punto de Venta 2", href: "/pointOfSale", icon: BadgeDollarSign },  
        { label: "Ordenes de Venta", href: "/salesOrders", icon: BadgeDollarSign },       
        { label: "Clientes", href: "/customers", icon: SquareUser },
      ],
    },
    {
      label: "Compras",
      icon: ShoppingBag,
      href: "",
      subItems: [       
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
        { label: "Perfil de Organización", href: "/organizationProfile", icon: Building2 }, 
        { label: "Usuarios", href: "/users", icon: User },   
        { label: "Almacenes", href: "/locations", icon: Warehouse }, 
        { label: "Monedas", href: "/currencies", icon: DollarSign }, 
        { label: "Impuestos", href: "/taxes", icon: Percent },       
        { label: "Email", href: "/email", icon: Mail },              
        { label: "Integraciones", href: "/integrations", icon: Blocks },              
        { label: "Backup de Datos", href: "/databaseBackup", icon: DatabaseBackup },                        
      ],
    },
  ];

  const salesMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: Layout,
      href: "/dashboard",
      subItems: [],
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
      label: "Reportes",
      icon: Clipboard,
      href: "",
      subItems: [
        { label: "Ventas", href: "/reports/sales", icon: CircleDollarSign },
      ],
    },   
  ];

  const warehouseMenuItems: MenuItem[] = [    
    {
      label: "Inventario",
      icon: Archive,
      href: "",
      subItems: [
        { label: "Inventario Detalle", href: "/inventoryByBranch", icon: FileText },
        { label: "Vehículos", href: "/vehicles", icon: Car },
        { label: "Productos", href: "/products", icon: Package },
        { label: "Modelos", href: "/models", icon: FileBox },
        { label: "Familias de Modelos", href: "/families", icon: FolderTree },        
      ],
    },
    {
      label: "Compras",
      icon: ShoppingBag,
      href: "",
      subItems: [
        { label: "Proveedores", href: "/suppliers", icon: Building },
      ],
    },
  ];

  let menuItems: MenuItem[];

  if (userRole === 'ADMINISTRADOR') {
    menuItems = adminMenuItems;  
  } else if (userRole === 'ALMACENISTA') {
    menuItems = warehouseMenuItems;
  } else if (userRole === 'VENDEDOR') {
    menuItems = salesMenuItems;
  } else {
    menuItems = [];  
  }

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
      <MenuBuilder menuItems={menuItems} isCollapsed={isSidebarCollapsed} />
    </div>
  );
};

export default Sidebar;