import React from 'react';

function ListCategory({ categories, handleDelete, error }) {
  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center">Category List</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="overflow-x-auto mt-4">
        {categories.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Active</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-2 border-b">{category.name}</td>
                  <td className="px-4 py-2 border-b">{category.isActive ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      // Add edit functionality here
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      style={{ marginLeft: 8 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No categories available.</p>
        )}
      </div>
    </div>
  );
}

export default ListCategory;
