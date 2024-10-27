import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import Image from "next/image";

Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
        userPoolClientId:
          process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
      },
    },
  });
 
  // Configuración de los textos para formFields
  const formFields = {
    signIn: {
      username: {
        label: 'Correo Electrónico',
        placeholder: 'Ingrese su email',
      },
      password: {
        label: 'Contraseña',
        placeholder: 'Ingrese su contraseña',
      },
    },
  };

const AuthProvider =  ({ children }: any) => {
  return (
    <div>
      <Authenticator
        hideSignUp={true}
        formFields={formFields}
        components={{
          SignIn: {
            Header() {
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <Image
                        src={`https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/Logo_200X200.png`}
                        alt='Logo'
                        width={150}
                        height={20}                     
                      />
                      <h1 style={{ margin: 0 }}>Inicia sesión en tu cuenta</h1>
                    </div>
                  );
            },
            Footer() {
              return <button>Ingresar</button>; // Texto del botón de envío
            },
          },
        }}
      >
        {({ user }) =>
          user ? (
            <div>{children}</div>
          ) : (
            <div>
              <h1>Por favor, inicia sesión:</h1>
            </div>
          )
        }
      </Authenticator>
    </div>
  );
}

export default AuthProvider;