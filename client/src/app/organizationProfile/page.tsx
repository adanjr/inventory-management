'use client';

import { useState, useEffect } from "react";
import { useGetOrganizationByIdQuery, 
         useCreateOrganizationMutation, 
         useUpdateOrganizationMutation,
         useGetAuthUserQuery,
         useGetRolePermissionsByModuleQuery, 
         PermissionPage} from "@/state/api"; // Importa tus hooks de API
import { Organization, NewOrganization, UpdatedOrganization } from "@/state/api"; // Asegúrate de que las interfaces estén definidas

const OrganizationProfilePage = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
   const id = "1";
   const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [moduleName, setModuleName] = useState("Administration");
  const [subModuleName, setSubModuleName] = useState("Organizacion");

  // Consulta para obtener la organización por ID
  const { data: organization, isLoading, isError, error } = useGetOrganizationByIdQuery(id as string, {
    skip: !id, // No ejecutar la consulta si no hay ID
  });

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

  // Mutaciones para crear y actualizar la organización
  const [createOrganization] = useCreateOrganizationMutation();
  const [updateOrganization] = useUpdateOrganizationMutation();

  const userPermissions = permissionsData?.permissions || [];

  // Manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement; // Afirmar que currentTarget es un HTMLFormElement
    const formData = new FormData(form);
  
    const organizationData: NewOrganization | UpdatedOrganization = {
      name: formData.get("name") as string,
      rfc: formData.get("rfc") as string,
      commercialName: formData.get("commercialName") as string,
      responsiblePerson: formData.get("responsiblePerson") as string,
      address: formData.get("address") as string,
      address2: formData.get("address2") as string, 
      neighborhood: formData.get("neighborhood") as string, 
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      timezone: formData.get("timezone") as string,
      purchaseOrderPrefix: formData.get("purchaseOrderPrefix") as string,
      saleOrderPrefix: formData.get("saleOrderPrefix") as string,
      invoicePrefix: formData.get("invoicePrefix") as string,
      startingOrderNumber: Number(formData.get("startingOrderNumber")),
      startingInvoiceNumber: Number(formData.get("startingInvoiceNumber")),
      startingPurchaseOrderNumber: Number(formData.get("startingPurchaseOrderNumber")),
      logoUrl:  formData.get("logoUrl") as string,
    };
    
  
    if (organization) {
      // Si existe, actualiza la organización
      await updateOrganization({ id: id as string, data: organizationData });
      alert("Informacion de Organizacion Actualiza Exitosamente");
    } else {
      // Si no existe, crea una nueva organización
      await createOrganization(organizationData);
      alert("Informacion de Organizacion Agregada Exitosamente");
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  const transformPermissions = (userPermissions: string[]): PermissionPage => {
    return {      
      canAccess: false,
      canAdd: false,
      canEdit: userPermissions.includes("EDIT"),    
      canDelete: false,
      canImport: false,
      canExport: false,
      canViewDetail: false,
       
    };
  };

  const permissions = transformPermissions(userPermissions);

  return (
    <div className="mx-auto py-5 w-full max-w-5xl">
    <h1 className="text-2xl font-bold">
         Información de Organización
    </h1><br></br>
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="name" className="block">Nombre</label>
        <input 
            type="text" 
            name="name" 
            defaultValue={organization?.name} 
            required 
            readOnly={!permissions.canEdit} 
            className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="rfc" className="block">RFC</label>
        <input type="text" name="rfc" defaultValue={organization?.rfc} required readOnly={!permissions.canEdit}  className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="commercialName" className="block">Nombre Comercial</label>
        <input type="text" name="commercialName" defaultValue={organization?.commercialName} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input type="email" name="email" defaultValue={organization?.email} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="phone" className="block">Teléfono</label>
        <input type="tel" name="phone" defaultValue={organization?.phone} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="address" className="block">Direccion</label>
        <input type="text" name="address" defaultValue={organization?.address} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="address2" className="block">Direccion 2</label>
        <input type="text" name="address2" defaultValue={organization?.address2} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="neighborhood" className="block">Colonia</label>
        <input type="text" name="neighborhood" defaultValue={organization?.neighborhood} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="city" className="block">Ciudad</label>
        <input type="text" name="city" defaultValue={organization?.city} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="state" className="block">Estado</label>
        <input type="text" name="state" defaultValue={organization?.state} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="postalCode" className="block">Código Postal</label>
        <input type="text" name="postalCode" defaultValue={organization?.postalCode} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="country" className="block">País</label>
        <input type="text" name="country" defaultValue={organization?.country} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="timezone" className="block">Zona Horaria</label>
        <input type="text" name="timezone" defaultValue={organization?.timezone} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="purchaseOrderPrefix" className="block">Prefijo Orden de Compra</label>
        <input type="text" name="purchaseOrderPrefix" defaultValue={organization?.purchaseOrderPrefix} readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="saleOrderPrefix" className="block">Prefijo Orden de Venta</label>
        <input type="text" name="saleOrderPrefix" defaultValue={organization?.saleOrderPrefix} readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="invoicePrefix" className="block">Prefijo Factura</label>
        <input type="text" name="invoicePrefix" defaultValue={organization?.invoicePrefix} readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="startingOrderNumber" className="block">Número Inicial de Orden</label>
        <input type="number" name="startingOrderNumber" defaultValue={organization?.startingOrderNumber} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="startingInvoiceNumber" className="block">Número Inicial de Factura</label>
        <input type="number" name="startingInvoiceNumber" defaultValue={organization?.startingInvoiceNumber} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="startingPurchaseOrderNumber" className="block">Número Inicial de Orden de Compra</label>
        <input type="number" name="startingPurchaseOrderNumber" defaultValue={organization?.startingPurchaseOrderNumber} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="responsiblePerson" className="block">Persona Responsable</label>
        <input type="text" name="responsiblePerson" defaultValue={organization?.responsiblePerson} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      <div>
        <label htmlFor="logoUrl" className="block">Logo Url</label>
        <input type="text" name="logoUrl" defaultValue={organization?.logoUrl} required readOnly={!permissions.canEdit} className="border rounded w-full p-2" />
      </div>
      
      <div className="col-span-3">
        {permissions.canEdit && (
            <button type="submit" className="bg-blue-500 text-white rounded py-2 px-4 w-full">
            {organization ? "Guardar Información" : "Guardar Información"}
          </button>
          )}        
      </div>
    </form>
  </div>
  
  );
};

export default OrganizationProfilePage;
