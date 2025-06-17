import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from 'react-datepicker';


interface Countries {
  id: string;
  name: string;
  iso2: string;
}
interface Cities {
  id: string;
  name: string;
  code:string
}
interface FlightRuleProps {
  conditions: {
    originCountries: string[];
    originCities: string[];
    destinationCountries: string[];
    destinationCities: string[];
    fareType: string;
    tripType: string;
    cabinType: string;
    flightClass: string;
    fromDate: string;
    toDate: string;
  };
  onFormDataChange: (updatedData: any) => void;
}

export default function FlightRule({ conditions, onFormDataChange }: FlightRuleProps) {
  const [countries, setCountries] = useState<Countries[]>([]);
  const [cities, setCities] = useState<Cities[]>([]);
  const [error, setError] = useState('');
  const [destinationCities, setDestinationCities] = useState<Cities[]>([]);
  const [originCities, setOriginCities] = useState<Cities[]>([]);
  const [countryNames,setcountryNames] = useState<String[]>([]);
  onFormDataChange

  useEffect(() => {
    // Fetch countries from the backend API
    const fetchCountries = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Unauthorized: No token found. Please log in.');
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-countries-rules`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCountries(response.data.data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);
  useEffect(() => {
    const fetchOriginCities = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
  
      if (conditions.originCountries.length > 0) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-cities-rules`,
            { countryIds: conditions.originCountries },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOriginCities(response.data.data);
        } catch (error) {
          console.error('Failed to fetch origin cities:', error);
        }
      } else {
        setOriginCities([]);
      }
    };
  
    fetchOriginCities();
  }, [conditions.originCountries]);
  
  useEffect(() => {
    const fetchDestinationCities = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
  
      if (conditions.destinationCountries.length > 0) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-cities-rules`,
            { countryIds: conditions.destinationCountries },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDestinationCities(response.data.data);
        } catch (error) {
          console.error('Failed to fetch destination cities:', error);
        }
      } else {
        setDestinationCities([]);
      }
    };
  
    fetchDestinationCities();
  }, [conditions.destinationCountries]);
  
  // Handle changes in flight inputs (select fields)
  const handleFlightChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFormDataChange({
      ...conditions,
      [name]: value
    }, true);
    // true
  };
  // Handle changes in origin country select field
  const handleCountryChange = (
  selectedOptions: any,
  countryKey: 'originCountries' | 'destinationCountries',
  cityKey: 'originCities' | 'destinationCities'
) => {
  // const selectedCountries = selectedOptions ? selectedOptions.map((option: any) => option.iso2) : [];
  const selectedCountries = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
  
  onFormDataChange({
    ...conditions,
    [countryKey]: selectedCountries,
    [cityKey]: []  
  },true );
  // true
};

const handleCityChange = (
  selectedOptions: any,
  cityKey: 'originCities' | 'destinationCities'
) => {
  const selectedCities = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
  onFormDataChange({
    ...conditions,
    [cityKey]: selectedCities
  }, true);
  // 
};


  // Map countries to Select options
  const countryOptions = Array.isArray(countries)
    ? countries.map((country: any) => ({
      value: country.name,
      label: country.name,
      id: country.id,
      iso2: country.iso2
    })) : [];
  const cityOptions = Array.isArray(cities)
    ? cities.map((city: any) => ({
      value: city.name,
      id: city.id,
      label: city.name,
      code:(city.iata) ? city.iata: city.icao
    })) : [];
  return (
    <div className="flight-rule-div mt-4">
      <table className="table CreateFlightRules">
        <tbody>
          <tr>
            <th>Fare Type</th>
            <td>
              <select
                name="fareType"
                className="form-select"
                value={conditions.fareType}
                onChange={handleFlightChange}
              >
                <option value="0">All</option>
                <option value="1">Public</option>
                <option value="2">Private</option>
                <option value="3">Corporate</option>
              </select>
            </td>
            <th>Trip Type</th>
            <td>
              <select
                name="tripType"
                className="form-select"
                value={conditions.tripType}
                onChange={handleFlightChange}
              >
                <option value="0">All</option>
                <option value="1">One Way</option>
                <option value="2">Round Trip</option>
                <option value="3">Multi City</option>
              </select>
            </td>
            <th>Cabin Type</th>
            <td>
              <select
                name="cabinType"
                className="form-select"
                value={conditions.cabinType}
                onChange={handleFlightChange}
              >
                <option value="1">Economy</option>
                <option value="2">EconomyCoach</option>
                <option value="3">PremiumEconomy</option>
                <option value="4">Business</option>
                <option value="5">PremiumBusiness</option>
                <option value="6">First</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>Flight Class</th>
            <td>
              <select
                name="flightClass"
                className="form-select"
                value={conditions.flightClass}
                onChange={handleFlightChange}
              >
                <option value="0">All</option>
                <option value="1">Domestic</option>
                <option value="2">International</option>
              </select>
            </td>
            <th>From Date</th>
            <td>
              <ReactDatePicker
                selected={conditions.fromDate ? new Date(conditions.fromDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    onFormDataChange({
                      ...conditions,
                      fromDate: date.toISOString().split('T')[0],
                    }, true);
                  }
                }}
                minDate={new Date()}
                dateFormat="dd-MM-yyyy"
                className="form-control"
              />
            </td>
            <th>To Date</th>
            <td>
              <ReactDatePicker
                selected={conditions.toDate ? new Date(conditions.toDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    onFormDataChange({
                      ...conditions,
                      toDate: date.toISOString().split('T')[0],
                    }, true);
                  }
                }}
                minDate={conditions.fromDate ? new Date(conditions.fromDate) : new Date()}
                dateFormat="dd-MM-yyyy"
                className="form-control"
              />
            </td>
          </tr>
          <tr>
            <th>Origin Country</th>
            <td>
            <Select
                name="originCountries"
                value={countryOptions.filter((option) =>
                  (conditions.originCountries || []).includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleCountryChange(selectedOptions, 'originCountries', 'originCities')
                }
              />
            </td>
            <th>Origin Cities</th>
            <td>
            <Select
                  name="originCities"
                  value={originCities
                    .filter(city => conditions.originCities.includes(city.name))
                    .map(city => ({ value: city.name, label: city.name }))}
                  onChange={(selectedOptions) =>
                    handleCityChange(selectedOptions, 'originCities')
                  }
                  options={originCities.map(city => ({ value: city.name, label: city.name }))}
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
            </td>
          </tr>
          <tr>
            <th>Destination Country</th>
            <td>
              <Select
                name="destinationCountries"
                value={countryOptions.filter((option) =>
                  (conditions.destinationCountries || []).includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleCountryChange(selectedOptions, 'destinationCountries', 'destinationCities')
                }
                options={countryOptions}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </td>
            <th>Destination Cities</th>
            <td>
            <Select
                  name="destinationCities"
                  value={destinationCities
                    .filter(city => conditions.destinationCities.includes(city.name))
                    .map(city => ({ value: city.name, label: city.name }))}
                  onChange={(selectedOptions) =>
                    handleCityChange(selectedOptions, 'destinationCities')
                  }
                  options={destinationCities.map(city => ({ value: city.name, label: city.name }))}
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
