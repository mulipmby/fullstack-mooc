import AnecdoteForm from './components/AnecdoteForm'
import AnecDoteList from './components/AnecdoteList'
import Filter from './components/Filter'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecDoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App