import personService from '../service/persons'

const Person = ( { persons, newFilter, setPersons} ) => {
  const p =
  persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase())
 )

 const handleDelete = (event) => {
   
   if (window.confirm(`Delete ${event.name} ?`)) {
     personService
     .del(event.id)
     .then(response => {
       setPersons(persons.filter(per => per.id !== event.id))
     })
   }
 }

   return (
     <div>
       {p.map(person =>
         <p 
         key={person.name}>{person.name} {person.number}
         <button onClick={() => handleDelete(person)}> delete</button>
         </p>)  
       }    
     </div>  
   )
}
  


export default Person