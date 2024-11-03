import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CognitoIdentityProviderClient, 
  SignUpCommand, 
  AdminSetUserPasswordCommand,
  AdminDisableUserCommand 
 } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        Location: {
          select: {
            name: true, // Solo selecciona el campo 'name' de Location
          },
        },
        Role: {
          select: {
            name: true, // Solo selecciona el campo 'roleName' de Role
          },
        },
      },
    });

    // Mapea los usuarios para incluir los nombres directamente
    const formattedUsers = users.map(user => ({
      ...user,
      locationName: user.Location?.name, // Agrega el nombre de la ubicación
      roleName: user.Role?.name,     // Agrega el nombre del rol    
    }));

    res.json(formattedUsers);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        cognitoId: cognitoId,
      },
      include: {
        Location: {
          select: {
            name: true, // Solo selecciona el campo 'name' de Location
          },
        },
        Role: {
          select: {
            name: true, // Solo selecciona el campo 'roleName' de Role
          },
        },
      },
    });

    const formattedUser = {
      ...user,
      locationName: user?.Location?.name || null, // Agrega el nombre de la ubicación
      roleName: user?.Role?.name || null,         // Agrega el nombre del rol
    };

    res.json(formattedUser);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: Number(userId),
      },
      include: {
        Location: {
          select: {
            name: true, // Solo selecciona el campo 'name' de Location
          },
        },
        Role: {
          select: {
            name: true, // Solo selecciona el campo 'roleName' de Role
          },
        },
      },
    });

    const formattedUser = {
      ...user,
      locationName: user?.Location?.name || null, // Agrega el nombre de la ubicación
      roleName: user?.Role?.name || null,         // Agrega el nombre del rol
    };

    res.json(formattedUser);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId, username, name, email, profilePictureUrl, locationId, roleId, password } = req.body;
  try {

    const { userConfirmed, userSub } = await registerUserInCognito(username, password, email);

    if (!userSub) {
      throw new Error("Cognito ID could not be retrieved.");
    }

    const newUser = await prisma.user.create({
      data: {
        cognitoId: userSub || '',
        username,
        name,
        email,
        profilePictureUrl,
        locationId,
        roleId,
      },
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating user: ${error.message}` });
  }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  const { username, name, email, profilePictureUrl, locationId, roleId } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { cognitoId },
      data: {
        username,
        name,
        email,
        profilePictureUrl,
        locationId,
        roleId,
      },
    });
    res.json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: `Error updating user: ${error.message}` });
    }
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    
    const user = await prisma.user.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    // Deshabilitar el usuario en Cognito
    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID as string,
      Username: user!.username,  
    };

    const command = new AdminDisableUserCommand(params);
    await cognitoClient.send(command);

    // Opcional: Actualiza el estado del usuario en tu base de datos si es necesario
    await prisma.user.update({
      where: { userId: Number(userId) },
      data: { isActive: false }, // Actualiza el estado en la base de datos
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Error disabling user in Cognito:", error);
    res.status(500).json({ message: `Error disabling user: ${error.message}` });
  }
};

// Eliminar un usuario
export const deleteUser2 = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;

  try {
    await prisma.user.delete({
      where: { cognitoId },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: `Error deleting user: ${error.message}` });
    }
  }
};

export const registerUserInCognito = async (
  username: string,
  password: string,
  email: string
): Promise<{ userConfirmed: boolean; userSub: string | undefined }> => {
  const input = {
    ClientId: process.env.COGNITO_CLIENT_ID as string, // Asegúrate de definir este valor en tu .env
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "name",
        Value: username,
      },
    ],
  };

  try {
    const command = new SignUpCommand(input);
    const response = await cognitoClient.send(command);

    // Extrae la información relevante de la respuesta
    const userConfirmed = response.UserConfirmed || false;
    const userSub = response.UserSub;

    if (userSub && !userConfirmed) {
      await forceChangePassword(username,password);
    }

    return {
      userConfirmed,
      userSub,
    };
  } catch (error) {
    console.error("Error al registrar el usuario en Cognito:", error);
    throw new Error(`Error registering user: ${error}`);
  }
};

export const forceChangePassword = async (username: string, password: string): Promise<void> => {
  const command = new AdminSetUserPasswordCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID as string, // Asegúrate de definir este valor en tu .env
    Username: username,
    Password: password, // Contraseña temporal
    Permanent: false, // Esto indicará que el usuario debe cambiar la contraseña en el primer inicio de sesión
  });

  try {
    await cognitoClient.send(command);
    console.log("Se ha solicitado el cambio de contraseña en el primer inicio de sesión.");
  } catch (error) {
    console.error("Error al forzar cambio de contraseña en Cognito:", error);
    throw new Error(`Error forcing password change: ${error}`);
  }
};