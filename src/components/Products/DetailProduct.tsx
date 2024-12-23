import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function DetailProduct() {
  const { id } = useParams(); // Get the product ID from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details by ID
  useEffect(
    () => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7223/api/Product/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Error retrieving product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Link to="/Products">
          <button className="text-sm text-blue-600 mb-4 hover:underline">
            Back to product list
          </button>
        </Link>

        <h2 className="text-3xl font-semibold text-gray-800 mb-4">{product.name}</h2>

        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3">
            <img
              src={product.image || '/fallback-image.jpg'}
              alt={product.name}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>

          <div className="sm:w-2/3 sm:pl-6 mt-4 sm:mt-0">
            <p className="text-gray-700 text-lg mb-2"><strong>Category:</strong> {product.categoryId}</p>
            <p className="text-gray-700 text-lg mb-2"><strong>Price:</strong> {product.price} TND</p>
            <p className="text-gray-700 text-lg mb-4"><strong>Quantity:</strong> {product.quantity}</p>
            <p className="text-gray-600 text-base">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
