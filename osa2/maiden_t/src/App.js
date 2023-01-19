import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Weather = ( {Weath, Countries, newFilter, handleWeather} ) => {

  
  const con = Countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
  if (con.length === 1) {
    handleWeather(con[0].capital)
    
    if (Weath) {
     const temp = Weath.main.temp - 273.15
      return (
        <div>
          <p> Temperature {temp} Celsius</p>
            <img 
              src={`http://openweathermap.org/img/wn/${Weath.weather[0].icon}@2x.png`}
              alt="icon"
              />
          <p>wind {Weath.wind.speed} m/s </p>
       </div>
     )
  }
  }
}
const Country = ( {  Countries,  newFilter, handleSubmit } ) => {

  const con = Countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
  
   if (con.length > 10 && con.length > 1) {
    return ( <p> Too many matches, specify another filter</p>)
  } if (con.length === 1) {
  
    const name = con[0].name.common
    const capital = con[0].capital
    const area = con[0].area
    const languages = con[0].languages
    const flag = con[0].flags.png
    
    return (
      <div>
        <h2>{name}</h2>
        <p>capital {capital}</p>
        <p>area {area}</p>
        <h4>languages:</h4>
        <ul>{(languages) ? Object.values(languages).map(lang => <li key={lang}>{lang}</li>): <p></p>}</ul>
        <img src={flag ? flag:""} alt="flag"/>
        <h2>Weather in {capital}</h2>
      </div>
    )
  } else {
    return (con.map(country => 
      <p key={country.name.common}>{country.name.common} 
        <button onClick={() => handleSubmit(country.name.common, country.capital)} >show</button>
      </p>
    ))
  }
}

const Filter = ( {newFilter, handleFilterChange}) => {
  return (
    <div>
      find countries:
      <input 
            value={newFilter}
            onChange={handleFilterChange}
          />
    </div>
  )
}

function App() {
  const [Countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState('');
  const [Weath, setWeather] = useState(null);

  useEffect(() => {
    console.log('effect')
  
    const eventHandler = response => {
      console.log('promise fulfilled')
      setCountries(response.data)
    }
  
    const promise = axios.get('https://restcountries.com/v3.1/all')
    promise.then(eventHandler)
  }, [])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleSubmit = (count) => { 
    setNewFilter(count)
  }

  const apiKey = process.env.REACT_APP_API_KEY

  const onSearch = (event) => {
      axios
        .get(`http://api.openweathermap.org/data/2.5/weather?q=${event}&appid=${apiKey}`)
        .then(response => {
          setWeather(response.data)
        })  
}
const handleWeather = (capt) => { 
  onSearch(capt)
}

  return (
    <div> 
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <Country  Countries={Countries}  newFilter={newFilter} handleSubmit={handleSubmit}  />
      <Weather Weath={Weath} Countries={Countries}  newFilter={newFilter} handleWeather={handleWeather}/>
    </div>
  );
}

export default App;
