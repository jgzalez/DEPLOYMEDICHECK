import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { ModalInput } from "./ModalInput";

export const PlacesAutoComplete = ({setSelected, onLocation})=>{
    const{
        ready,
        value,
        setValue,
        suggestions:{status, data},
        clearSuggestions,
    } = usePlacesAutocomplete()

    const handleSelect = async(e)=>{
        const address = e.target.value;
        setValue(address, false);
        clearSuggestions();
        const results = await getGeocode({address});
        (results[0].place_id);
        const {lat, lng} = await getLatLng(results[0]);
        const location = {lat, lng, place_id: results[0].place_id, address}
        onLocation(location)
        setSelected({lat, lng})
    }

    return<div> 
        <input className="absolute z-10 left-[30%] top-[20%] p-2" value={value} onChange={e=> setValue(e.target.value)} disabled={!ready}/>
        <select onChange={handleSelect} className="absolute z-10 left-[30%] top-[40%]">
        {status === "OK" && data.map(({place_id, description})=>(
            <option  key={place_id} value={description}>{description}</option>
        ))}
        </select>
        
    </div>
}