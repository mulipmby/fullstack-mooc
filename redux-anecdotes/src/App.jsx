import AnecdoteForm from './components/AnecdoteForm'
import AnecDoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecDoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App