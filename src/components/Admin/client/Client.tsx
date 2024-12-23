import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Client() {
    const [partners, setPartners] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchPartners = async () => {
        try {
          const response = await axios.get("https://localhost:7223/api/User");
          const data = response.data.$values;
          console.log(data);
  
          // Vérification de la structure de la réponse et extraction des valeurs
          if (Array.isArray(data)) {
            // Filtrer les partenaires dont le role est égal à 1
            const filteredPartners = data.filter((partner) => partner.role === 2);
            setPartners(filteredPartners);
          } else {
            setPartners([data]); // Si c'est un seul objet, on l'encapsule dans un tableau
          }
        } catch (err) {
          setError("Failed to fetch data from the API.");
        }
      };
  
      fetchPartners();
    }, []);
  
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
           Client
        </h4>
  
        {error && <p className="text-red-500">{error}</p>}
  
        <div className="flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Username
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Email
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Address
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Phone
              </h5>
            </div>
          </div>
  
          {/* Table Rows */}
          {partners.length > 0 ? (
            partners.map((partner, index) => (
              <div
                key={index}
                className="grid grid-cols-4 border-b border-stroke dark:border-strokedark"
              >
                <div className="p-2.5 xl:p-5">
                  <p className="text-sm font-medium text-black dark:text-white">
                    {partner?.username || "N/A"}
                  </p>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <p className="text-sm text-black dark:text-white">
                    {partner?.email || "N/A"}
                  </p>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <p className="text-sm text-black dark:text-white">
                    {partner?.address || "N/A"}
                  </p>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <p className="text-sm text-black dark:text-white">
                    {partner?.phone || "N/A"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2.5 text-center xl:p-5">
              <p className="text-sm text-gray-500">No Client available.</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  

export default Client
