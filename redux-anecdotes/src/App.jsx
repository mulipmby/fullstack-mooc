import { useSelector } from 'react-redux'
import store from './main'
import { useEffect } from 'react'

const App = () => {
  const anecdotes = useSelector(state => state)
  const generateId = () => Number((Math.random() * 1000000).toFixed(0))
  
  useEffect(() => {
    anecdotes.sort((a, b) => b.votes - a.votes)
  }, [anecdotes])
  
  const vote = (id) => {
    store.dispatch({
      type: 'VOTE',
      data: { id }
    })
  }
  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    store.dispatch({
      type: 'NEW_ANECDOTE',
      data: {
        content,
        id: generateId(),
        votes: 0
      }
    })
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote"/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default App