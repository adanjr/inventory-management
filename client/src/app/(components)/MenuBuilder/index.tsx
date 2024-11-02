// MenuBuilder.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, ChevronDown, ChevronUp } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  subItems?: MenuItem[];
}

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, isCollapsed }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-700`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

interface MenuBuilderProps {
  menuItems: MenuItem[];
  isCollapsed: boolean;
}

const MenuBuilder = ({ menuItems, isCollapsed }: MenuBuilderProps) => {
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex-grow mt-4 overflow-y-auto">
      {menuItems.map((item, index) => (
        <div key={index}>
          <div
            className={`cursor-pointer flex items-center px-8 py-4 hover:bg-blue-100 gap-3 ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
            onClick={() => item.subItems && toggleSubMenu(item.label)}
          >
            <item.icon className="w-6 h-6 !text-gray-700" />
            {!isCollapsed && <span className="font-medium text-gray-700">{item.label}</span>}
            {!isCollapsed && item.subItems && (
              <span>
                {openSubMenus[item.label] ? <ChevronUp /> : <ChevronDown />}
              </span>
            )}
          </div>
          {item.subItems && openSubMenus[item.label] && !isCollapsed && (
            <div className="ml-8">
              {item.subItems.map((subItem, subIndex) => (
                <SidebarLink
                  key={subIndex}
                  href={subItem.href}
                  icon={subItem.icon}
                  label={subItem.label}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBuilder;
