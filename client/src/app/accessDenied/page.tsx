import React from 'react'

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-lg mb-6">
        No tienes los permisos necesarios para acceder a esta función.
      </p>
      
    </div>
  )
}

export default AccessDenied