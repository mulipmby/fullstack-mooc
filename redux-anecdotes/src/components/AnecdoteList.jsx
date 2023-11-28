import { useSelector } from 'react-redux'
import store from '../store'
import { vote } from '../reducers/anecdoteReducer'


const AnecDoteList = () => {
    const anecdotes = useSelector(state => {
        if ( state.filter === '' ) {
          return state.anecdotes
        }
        return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
      })

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
    
    return (
        <div>
        {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => store.dispatch(vote(anecdote.id))}>vote</button>
          </div>
        </div>
      )}
        </div>
    )
}

export default AnecDoteList