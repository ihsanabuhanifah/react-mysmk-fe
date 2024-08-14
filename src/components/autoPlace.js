// "use client";
// import React, { useState } from "react";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-places-autocomplete";

// export const Autoplace = () => {
//   const [address, setAddress] = useState("");
//   const [coordinates, setCoordinates] = useState({
//     lat: null,
//     lng: null,
//   });

//   const handleChange = (address) => {
//     setAddress(address);
//   };

//   const handleSelect = async (value) => {
//     const result = await geocodeByAddress(value);
//     const ll = await getLatLng(result[0]);
//     console.log(ll);
//     setAddress(value);
//     setCoordinates(ll);
//     console.error("Error", error);

//     // try {
//     //   const result = await geocodeByAddress(value);
//     //   const ll = await getLatLng(result[0]);
//     //   console.log(ll);
//     //   setAddress(value);
//     //   setCoordinates(ll);
//     // } catch (error) {
//     //   console.error("Error", error);
//     // }
//   };

//   return (
//     <div className="App">
//       <div >
//         <p>lat:{coordinates.lat}</p>
//         <p>long:{coordinates.lng}</p>
//         <p>address:{address}</p>
//       </div>

//       <PlacesAutocomplete
//         value={address}
//         onChange={setAddress}
//         onSelect={handleSelect}
//       >
//         {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//           <div>
//             <input
//               {...getInputProps({
//                 placeholder: "Search Places ...",
//                 className: "location-search-input",
//               })}
//             />
//             <div className="autocomplete-dropdown-container">
//               {loading ? <div>Loading...</div> :null}
//               {/* {loading && <div>Loading...</div>} */}
//               {/* {suggestions.map((suggestion) => {
//                 const className = suggestion.active
//                   ? "suggestion-item--active"
//                   : "suggestion-item";
//                 const style = suggestion.active
//                   ? { backgroundColor: "#fafafa", cursor: "pointer" }
//                   : { backgroundColor: "#ffffff", cursor: "pointer" };
//                 return (
//                   <div
//                     {...getSuggestionItemProps(suggestion, {
//                       className,
//                       style,
//                     })}
//                     key={suggestion.placeId}
//                   >
//                     <span>{suggestion.description}</span>
//                   </div>
//                 );
//               })} */}
//               {suggestions.map((suggestions)=> {
//                 return <div>{suggestions.description}</div>
//               })}
//             </div>
//           </div>
//         )}
//       </PlacesAutocomplete>
//     </div>
//   );
// };
