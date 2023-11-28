import { useSelector } from 'react-redux'
import store from './main'
import { useEffect } from 'react'
import { createAnecdote } from './reducers/anecdoteReducer'

const App = () => {
  const anecdotes = useSelector(state => state)
  
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
    store.dispatch(createAnecdote(content))
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