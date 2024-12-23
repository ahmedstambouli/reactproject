import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../images/cover/cover-01.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import userSix from '../images/user/user-06.png';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const id = localStorage.getItem('userId');

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`https://localhost:7223/api/User/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img src={user.imagepath || userSix} alt="profile" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {user.username}
            </h3>
            <p className="font-medium">{user.role === 0 ? 'Admin' : 'partenaire'}</p>
            <p className="mt-2 text-gray-500">Email:{user.email}</p>
            <p className="text-gray-500">phone:{user.phone}</p>
            <p className="text-gray-500">address:{user.address}</p>
            <Link to="/edit-profile" className="mt-4 inline-block text-primary">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
