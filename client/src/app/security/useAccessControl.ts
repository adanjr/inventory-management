import { useEffect, useState } from "react";
import { PermissionPage, useGetAuthUserQuery, useGetRolePermissionsByModuleQuery } from "@/state/api";

const useAccessControl = ({ roleId, moduleName, subModuleName }: { roleId: string; moduleName: string; subModuleName: string }) => {
  const [permissions, setPermissions] = useState<PermissionPage>({
    canAccess: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canImport: false,
    canExport: false,
    canViewDetail: false,
  });
  const [hasAccess, setHasAccess] = useState(false);

  const { data: permissionsData, isLoading: permissionsLoading } = useGetRolePermissionsByModuleQuery(
    { roleId: roleId || "", moduleName, subModuleName },
    { skip: !roleId }
  );

  useEffect(() => {
    if (permissionsData) {
      const transformedPermissions: PermissionPage = {
        canAccess: permissionsData.permissions.includes("ACCESS"),
        canAdd: permissionsData.permissions.includes("ADD"),
        canEdit: permissionsData.permissions.includes("EDIT"),
        canDelete: permissionsData.permissions.includes("DELETE"),
        canImport: permissionsData.permissions.includes("IMPORT"),
        canExport: permissionsData.permissions.includes("EXPORT"),
        canViewDetail: permissionsData.permissions.includes("VIEW_DETAIL"),
      };

      // Verifica si el usuario tiene algún permiso en el módulo/submódulo
      setHasAccess(transformedPermissions.canAccess);
      setPermissions(transformedPermissions);
    }
  }, [permissionsData]);

  console.log("permissions:",permissions);

  return { permissions, hasAccess, permissionsLoading };
};

export default useAccessControl;
