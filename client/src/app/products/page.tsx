"use client";

import { useGetProductsQuery,
         useGetAuthUserQuery, 
         useGetRolePermissionsByModuleQuery,
         PermissionPage
        } from "@/state/api";
import { useEffect, useState } from "react";
import Header from "@/app/(components)/Header";
import ProductsGrid from "@/app/(components)/Products/ProductsGrid";

const Products = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const { data: products, isError, isLoading } = useGetProductsQuery("%");

  const [searchTerm, setSearchTerm] = useState(""); 
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [moduleName, setModuleName] = useState("Inventory");
  const [subModuleName, setSubModuleName] = useState("Productos");

  useEffect(() => {
    if (currentUser?.userDetails?.roleId) {
      setRoleId(currentUser.userDetails.roleId.toString());
    }
  }, [currentUser]);

  const { data: permissionsData, isLoading: permissionsLoading } = useGetRolePermissionsByModuleQuery(
    {
      roleId: roleId || "",  // Si roleId no está disponible, pasamos una cadena vacía o un valor adecuado
      moduleName,
      subModuleName,
    },
    { skip: !roleId }  // Esto evita la consulta cuando no tenemos roleId
  );

  if (isError || !products) return <div>Fallo al cargar productos</div>;

  if (permissionsLoading) return <div>Cargando permisos...</div>;

  const userPermissions = permissionsData?.permissions || [];

  const filteredProducts = products.filter((product) =>
    [
      product.name,
    ]
      .some((field) =>
        field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (isLoading) {
    return <div className="py-4">Cargando...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
    <Header name="Productos" />

    <div className="mt-4 mb-6">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
    </div>
    
    <ProductsGrid 
          products={filteredProducts} 
          role={currentUser?.userDetails?.roleName || "NO ROLE"}
          permissions={userPermissions} />
  </div>
  );
};

export default Products;
