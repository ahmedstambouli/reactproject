import React, { useState } from 'react';
import axios from 'axios';

function AddCategorie({ addCategorie }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      // Vérifier si le champ est vide
      setError("Le nom de la catégorie est requis.");
      return;
    }

    try {
      // Appel API pour ajouter la catégorie
      const response = await axios.post("https://localhost:7223/api/Category", {
        name: name,
      });

      // Appeler la fonction addCategorie du parent pour ajouter la catégorie à l'état local
      addCategorie(response.data); // Ajouter la catégorie récupérée dans l'état du parent

      // Réinitialiser le champ de saisie et l'erreur
      setName('');
      setError('');
    } catch (err) {
      console.error("Erreur lors de l'ajout de la catégorie:", err);
      setError("Une erreur est survenue lors de l'ajout de la catégorie.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Ajouter une Catégorie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Nom de la catégorie"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Afficher l'erreur si elle existe */}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategorie;
