"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import { Category } from "@/state/api";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories, isLoading, isError } = useGetCategoriesQuery("");
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (categoryData: Category) => {
    await createCategory(categoryData);
    setIsCreateModalOpen(false);
  };

  const handleEditCategory = async (categoryId: string, updatedData: Partial<Category>) => {
    if (categoryId) {
      await updateCategory({ id: categoryId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (categoryId) {
      await deleteCategory(categoryId);
    }
  };

  // Filtrar y ordenar categorías
  const filteredAndSortedCategories = categories
    ?.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por 'name'

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !categories) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch categories
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Categorias" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Categoria
        </button>
      </div>

      {/* BODY CATEGORIES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {filteredAndSortedCategories?.map((category) => (
          <div
            key={category.categoryId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {category.name}
              </h3>
              <p className="text-gray-800">Descripción: {category.description}</p>
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteCategory(category.categoryId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCategory}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditCategory}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default Categories;