import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las organizaciones o buscar por nombre
export const getOrganizations = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const organizations = await prisma.organization.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive", // Búsqueda insensible a mayúsculas/minúsculas
        },
      },
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving organizations" });
  }
};

// Obtener una organización por ID
export const getOrganizationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params;
    const organization = await prisma.organization.findUnique({
      where: { id: Number(organizationId) },
    });
    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
    } else {
      res.json(organization);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving organization" });
  }
};

// Crear una nueva organización
export const createOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      commercialName,
      rfc,
      email,
      phone,
      address,
      address2,
      neighborhood,
      city,
      state,
      postalCode,
      country,
      purchaseOrderPrefix,
      saleOrderPrefix,
      invoicePrefix,
      startingOrderNumber,
      startingInvoiceNumber,
      startingPurchaseOrderNumber,
      responsiblePerson,
      logoUrl,
    } = req.body;

    const organization = await prisma.organization.create({
      data: {
        name,
        commercialName,
        rfc,
        email,
        phone,
        address,
        address2,
        neighborhood,
        city,
        state,
        postalCode,
        country,
        purchaseOrderPrefix,
        saleOrderPrefix,
        invoicePrefix,
        startingOrderNumber,
        startingInvoiceNumber,
        startingPurchaseOrderNumber,
        responsiblePerson,
        logoUrl,
      },
    });

    res.status(201).json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating organization" });
  }
};

// Actualizar una organización por ID
export const updateOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params;
    const {
      name,
      commercialName,
      rfc,
      email,
      phone,
      address,
      address2,
      neighborhood,
      city,
      state,
      postalCode,
      country,
      purchaseOrderPrefix,
      saleOrderPrefix,
      invoicePrefix,
      startingOrderNumber,
      startingInvoiceNumber,
      startingPurchaseOrderNumber,
      responsiblePerson,
      logoUrl,
    } = req.body;

    const organization = await prisma.organization.update({
      where: { id: Number(organizationId) },
      data: {
        name,
        commercialName,
        rfc,
        email,
        phone,
        address,
        address2,
        neighborhood,
        city,
        state,
        postalCode,
        country,
        purchaseOrderPrefix,
        saleOrderPrefix,
        invoicePrefix,
        startingOrderNumber,
        startingInvoiceNumber,
        startingPurchaseOrderNumber,
        responsiblePerson,
        logoUrl,
      },
    });

    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: "Error updating organization" });
  }
};

// Eliminar una organización por ID
export const deleteOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params;
    await prisma.organization.delete({
      where: { id: Number(organizationId) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting organization" });
  }
};
