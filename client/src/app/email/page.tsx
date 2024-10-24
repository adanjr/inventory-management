'use client';

import { useState } from 'react';
import { useSendMailMutation } from "@/state/api";  

const SendEmail = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",    
    text: "",
  });

  const [sendMail] = useSendMailMutation(); // Usar el hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    try {
      const response = await sendMail(formData);

      alert(response);  
    } catch (error) {
      console.error('Error al enviar correo:', error);
      alert('Error enviando el correo');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 border rounded-md shadow-md bg-white">
      <h1 className="text-2xl font-bold text-center mb-4">Enviar Correo</h1>
      <form onSubmit={handleSendEmail} className="w-full">
        {/* Campo para el correo destinatario */}
        <label htmlFor="to" className="block text-sm font-medium text-gray-700">
          Correo destinatario
        </label>
        <input
          type="email"          
          name="to"
          placeholder="Ingrese el correo"
          value={formData.to}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
          required
        />

        {/* Campo para el asunto */}
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mt-4">
          Asunto
        </label>
        <input
          type="text"
          name="subject"
          placeholder="Ingrese el asunto"
          value={formData.subject}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
          required
        />

        {/* Campo para el mensaje */}
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mt-4">
          Mensaje
        </label>
        <textarea
          name="text"
          placeholder="Escriba su mensaje aquí"
          value={formData.text}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
          rows={4}
          required
        ></textarea>

        {/* Botón de enviar */}
        <button
          type="submit"
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Enviar Correo
        </button>
      </form>
    </div>
  );
};

export default SendEmail;
