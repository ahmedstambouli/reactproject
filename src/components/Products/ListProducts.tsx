import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ListProducts() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false); // État pour gérer l'attente

  const navigate = useNavigate(); // Get the navigate function




  // Table de conseils
  const adviceTable = [
    { condition: (product) => product.price > 1000, advice: "Ce produit est cher, pensez à cibler un public premium." },
    { condition: (product) => product.quantity < 2, advice: "Stock faible, pensez à réapprovisionner rapidement." },
    {
      condition: (product) => product.quantity === 0,
      advice: "Produit  en rupture de stock. Activez une alerte pour notifier les clients intéressés lorsqu'il sera disponible."
    },
    { condition: (product) => product.categoryId === 1, advice: "Les produits de cette catégorie sont très demandés, investissez davantage." },
    { condition: () => true, advice: "Aucune recommandation particulière pour ce produit." }, // Cas par défaut
  ];

  // Fonction pour récupérer l'analyse Gemini avec l'objet complet
  // const fetchGeminiAnalysis = async (product) => {
  //   setIsGeminiLoading(true); 
  //     const apiKey = "AIzaSyBgFbZJN4kt1ydH6yv_EVAs-UegCAmPZUY"; 

  //     const response = await axios.post(
  //       'https://api.gemini.com/endpoint', 
  //       product, 
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${apiKey}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     setGeminiAnalysis(response.data);
  //     console.log(response.data); 
  //   } catch (error) {
  //     console.error('Erreur lors de l\'analyse Gemini', error);
  //     setError('Erreur lors de l\'analyse de l\'objet produit');
  //   } finally {
  //     setIsGeminiLoading(false); 
  //   }
  // };

  // Fonction pour récupérer les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoriesResponse = await axios.get('https://localhost:7223/api/Category');
        setCategoryData(categoriesResponse.data.$values);

        const response = await axios.get('https://localhost:7223/api/Product');
        const values = response.data.$values;
        const userId = localStorage.getItem('userId');

        const filteredProducts = values.filter(
          (product) => product.userId == userId
        );

        setProductData(filteredProducts);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAdvice = (product) => {
    setIsLoadingAdvice(true); // Active l'état de chargement
    setAdvice(null); // Réinitialise le conseil

    setTimeout(() => {
      const foundAdvice = adviceTable.find((rule) => rule.condition(product));
      setAdvice(foundAdvice.advice); // Affiche le conseil après 3 secondes
      setIsLoadingAdvice(false); // Désactive l'état de chargement
    }, 3000); // Délai de 3 secondes
  };
  // Fonction pour récupérer les détails d'un produit par ID
  const fetchProductById = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7223/api/Product/${id}`);
      return response.data;
    } catch (err) {
      console.error('Erreur lors de la récupération du produit:', err);
      setError('Impossible de charger les détails du produit.');
      return null;
    }
  };

  const handleView = (productId) => {
    navigate(`/DetailProduct/${productId}`); // Redirect to the product detail page
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`https://localhost:7223/api/Product/${selectedProduct.id}`, selectedProduct);
      const updatedProducts = productData.map(product =>
        product.id === selectedProduct.id ? selectedProduct : product
      );
      setProductData(updatedProducts);
      handleModalClose();
      alert('Produit mis à jour avec succès!');
    } catch (err) {
      alert('Erreur lors de la mise à jour du produit.');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categoryData.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Inconnu';
  };


  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        // Send delete request to the API
        await axios.delete(`https://localhost:7223/api/Product/${productId}`);
  
        // Update the state to remove the deleted product from the product list
        const updatedProducts = productData.filter((product) => product.id !== productId);
        setProductData(updatedProducts);
  
        alert('Produit supprimé avec succès!');
      } catch (err) {
        console.error('Erreur lors de la suppression du produit:', err);
        alert('Erreur lors de la suppression du produit.');
      }
    }
  };
  

  if (loading) {
    return <p>Chargement des produits...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Liste des produits
          </h4>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Nom du produit</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Catégorie</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Prix</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Quantité</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((product, key) => (
              <tr key={key} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">
                  <div className="flex items-center">
                    <div className="h-12 w-16 rounded-md overflow-hidden mr-4">
                      <img
                        src={product.image || '/fallback-image.jpg'}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">{getCategoryName(product.categoryId)}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{product.price} TND</td>
                <td className="py-3 px-4 text-sm text-gray-800">{product.quantity}</td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleView(product.id)}

                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Voir
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdvice(product)} // Analyse locale
                      className="text-white bg-purple-600 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700"
                    >
                      Analyser avec Gemini
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Afficher les résultats de Gemini lorsque l'analyse est terminée */}
      {isGeminiLoading ? (
        <div className="loading-indicator">Chargement de l'analyse...</div>
      ) : geminiAnalysis ? (
        <div className="gemini-results">
          <h3>Résultats de l'analyse Gemini</h3>
          <pre>{JSON.stringify(geminiAnalysis, null, 2)}</pre> {/* Affichage des résultats sous forme de JSON */}
        </div>
      ) : null}


      {/* Afficher les conseils */}
      {isLoadingAdvice ? (
        <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-md">
          <p>Analyse en cours...</p>
        </div>
      ) : (
        advice && (
          <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">Conseil :</h3>
            <p>{advice}</p>
          </div>
        )
      )}


      {/* Modal pour éditer le produit */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Modifier le produit</h2>
            <form onSubmit={handleSave}>
              {/* Nom */}
              <div className="mb-4">
                <label htmlFor="productName" className="block text-sm font-semibold text-gray-600">Nom du produit</label>
                <input
                  type="text"
                  id="productName"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="productDescription" className="block text-sm font-semibold text-gray-600">Description</label>
                <textarea
                  id="productDescription"
                  value={selectedProduct.description || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  maxLength={500}
                />
              </div>

              {/* Quantité */}
              <div className="mb-4">
                <label htmlFor="productQuantity" className="block text-sm font-semibold text-gray-600">Quantité</label>
                <input
                  type="number"
                  id="productQuantity"
                  value={selectedProduct.quantity}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              {/* Prix */}
              <div className="mb-4">
                <label htmlFor="productPrice" className="block text-sm font-semibold text-gray-600">Prix</label>
                <input
                  type="number"
                  id="productPrice"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              {/* Image */}
              <div className="mb-4">
                <label htmlFor="productImage" className="block text-sm font-semibold text-gray-600">Image</label>
                <input
                  type="file"
                  id="productImage"
                  accept="image/*"
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.files[0] })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              {/* Catégorie */}
              <div className="mb-4">
                <label htmlFor="productCategory" className="block text-sm font-semibold text-gray-600">Catégorie</label>
                <select
                  id="productCategory"
                  value={selectedProduct.categoryId || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, categoryId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoryData.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md">
                  Sauvegarder
                </button>
                <button type="button" onClick={handleModalClose} className="bg-gray-500 text-white py-2 px-4 rounded-md">
                  Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )
      }




    </>
  )
};


export default ListProducts;
