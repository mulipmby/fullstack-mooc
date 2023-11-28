import { useSelector } from 'react-redux'
import store from '../main'
import { useEffect } from 'react'

const AnecDoteList = () => {
    const anecdotes = useSelector(state => {
        if ( state.filter === '' ) {
          return state.anecdotes
        }
        return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
      })

    useEffect(() => {
      anecdotes.sort((a, b) => b.votes - a.votes)
    }, [anecdotes])
  
    const vote = (id) => {
      store.dispatch({
        type: 'VOTE',
        data: { id }
      })
    }
    
    return (
        <div>
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
        </div>
    )
}

export default AnecDoteList