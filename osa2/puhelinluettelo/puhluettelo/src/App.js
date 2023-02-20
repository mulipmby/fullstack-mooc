import { useState, useEffect } from 'react'
import Person from './components/Person'
import personService from './service/persons'

const Filter = ( {newFilter, handleFilterChange}) => {
  return (
    <div>
      filter shown with
      <input 
            value={newFilter}
            onChange={handleFilterChange}
          />
    </div>
  )
}

const NewPerson = ({ addName, newName, handleNameChange,newNumber, handleNumberChange} ) => {
  return (
    <form onSubmit={addName}>
        <div>
          name: 
          <input 
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number:
          <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
  )
}

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={style}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [ alertColor, setAlertColor ] = useState('alertGreen')

  
  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])


  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName, 
      number: newNumber,   
    }

    if (persons.map(person => person.name).includes(newName)) {
     if ( window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) ) 
    personService
      .update(persons.find(person => person.name === newName).id, nameObject)
      .then(response => {
        setPersons(persons.map(person => person.id !== response.data.id ? person : nameObject))
    }) 
    .catch(reason => {
      setAlertColor('alertRed')
      handleTime(`Information of ${newName} has already been removed from server`)
    })
  } else { 
     personService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response.data)) 
        handleTime(`Added ${response.data.name} ${response.data.number}`)
      })
      .catch(reason => {
        setAlertColor('alertRed')
        handleTime(reason.response.data)
        console.log(reason.response.data)
      })
    }
    
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleTime = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
      setAlertColor('alertGreen')
    }, 3000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} style={alertColor}/>
      <Filter 
        newFilter={newFilter} 
        handleFilterChange={handleFilterChange}
      />
      <h3>add a new</h3>
      <NewPerson 
        addName={addName} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}
       />
      <h2>Numbers</h2>
        <Person 
          persons={persons}  
          newFilter={newFilter}  
          setPersons={setPersons}
        />  
    </div>
  )
}

export default App