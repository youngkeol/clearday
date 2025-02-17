import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";


const AddrSearch = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [search, setSearch] = useState();
  const inputRef = useRef();

  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;
    console.log("@2")
    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };
    const autocompleteInstance = new places.Autocomplete(inputRef.current, options);
    setPlaceAutocomplete(autocompleteInstance);

  }, [places]);

  console.log(placeAutocomplete)

 

  // Add listener for place selection
  useEffect(() => {
    if (!placeAutocomplete) return;

    const listener = placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      setSelectedPlace(place);
      setSearch(place.formatted_address || ""); // Update the search input with the selected address
    });

    // Clean up the listener when the component unmounts or placeAutocomplete changes
    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [placeAutocomplete]);

  
  const inputChangeHandler = (e) => {
    setSearch(e.target.value); // 입력 값을 search 상태로 업데이트

  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(search)
  }

  return (
    <>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          id="autocomplete"
          className="search-input"
          placeholder="주소를 입력하세요"
          autoComplete="off"
          value ={search}
          onChange={inputChangeHandler}
          ref={inputRef}
        />
      </form>
    </>
  );
};

export default AddrSearch;
