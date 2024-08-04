// import React, { useState } from 'react';
// import Geocode from 'react-geocode';
// import { FaFacebook, FaTwitter } from 'react-icons/fa';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// // import GOOGLE_API from './env'

// // Set your Google Maps API key here
// Geocode.setApiKey(GOOGLE_API);
// Geocode.setLanguage('en');

// const mapContainerStyle = {
//   height: '400px',
//   width: '800px'
// };

// const center = {
//   lat: -6.58296,
//   lng: 106.77569
// };

// const LocationSearch = () => {
//   const [address, setAddress] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');

//   const handleSearch = async () => {
//     try {
//       const response = await Geocode.fromAddress(address);
//       const { lat, lng } = response.results[0].geometry.location;
//       setLatitude(lat);
//       setLongitude(lng);
//     } catch (error) {
//       console.error('Error fetching geocode:', error);
//     }
//   };

//   return (
//     <div className="p-8 bg-green-100">
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Place Name
//         </label>
//         <input
//           type="text"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//         <button
//           onClick={handleSearch}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
//         >
//           Find
//         </button>
//       </div>
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Latitude
//         </label>
//         <input
//           type="text"
//           value={latitude}
//           readOnly
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Longitude
//         </label>
//         <input
//           type="text"
//           value={longitude}
//           readOnly
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>
//       <div className="flex space-x-4 mb-4">
//         <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all">
//           <FaFacebook />
//         </button>
//         <button className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition-all">
//           <FaTwitter />
//         </button>
//       </div>
//       <div className="mb-4">
//         <p className="text-gray-700 text-sm">
//           For better accuracy please type Name Address City State Zipcode.
//         </p>
//       </div>
//       <div className="mb-4">
//         {latitude && longitude && (
//           <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
//             <GoogleMap
//               mapContainerStyle={mapContainerStyle}
//               center={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
//               zoom={13}
//             >
//               <Marker position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }} />
//             </GoogleMap>
//           </LoadScript>
//         )}
//       </div>
//       <div>
//         {latitude && longitude && (
//           <a
//             href={`https://www.google.com/maps?q=${latitude},${longitude}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="px-4 py-2 bg-blue-500 text-white text-lg rounded hover:bg-blue-600 transition-all"
//           >
//             Lihat peta lebih besar
//           </a>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LocationSearch;
