import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCategorie from './AddCategorie';
import ListCategorie from './ListCategorie';

const Categorie = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Effectuer la requête API pour charger les catégories au chargement du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7223/api/Category");
        const categoriesData = response.data.$values;
        setCategories(categoriesData); // Mettre à jour l'état avec les catégories récupérées
      } catch (err) {
        setError("Une erreur est survenue lors de la récupération des catégories.");
      }
    };

    fetchCategories();
  }, []);

  // Fonction pour ajouter une nouvelle catégorie
  const addCategorie = (newCategory) => {
    setCategories([...categories, newCategory]); // Ajouter la catégorie à la liste
  };

  // Fonction pour supprimer une catégorie
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7223/api/Category/${id}`);
      setCategories(categories.filter(category => category.id !== id)); // Mettre à jour la liste après suppression
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression de la catégorie.");
    }
  };

  return (
    <div>
      <AddCategorie addCategorie={addCategorie} /> {/* Passer la fonction addCategorie */}
      <ListCategorie categories={categories} handleDelete={handleDelete} error={error} />
    </div>
  );
};

export default Categorie;
