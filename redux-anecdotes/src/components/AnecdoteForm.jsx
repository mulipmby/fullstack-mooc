import { createAnecdote } from '../reducers/anecdoteReducer'
import store from '../main'


const AnecdoteForm = () => {

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    store.dispatch(createAnecdote(content))
  }

  return (
    <div>
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

export default AnecdoteForm