import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = (props) => {
    const [blogVisible, setBlogVisible] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const toggleVisibility = () => {
        setBlogVisible(!blogVisible)
    }

    const addBlog = (event) => {
        event.preventDefault()
        const blogObject = {
            title: newTitle,
            author: newAuthor,
            url: newUrl
        }
        blogService.create(blogObject)
            .then(returnedBlog => {
                props.setBlogs(props.blogs.concat(returnedBlog))
                setNewTitle('')
                setNewAuthor('')
                setNewUrl('')
                props.handleTime(`a new blog ${returnedBlog.title} ${returnedBlog.author} added`)
            })
    }

    return (
        <div>
            <div>
                <button onClick={toggleVisibility}>{blogVisible ? 'cancel' : 'create new blog'}</button>
            </div>
            {blogVisible && <div>
                <form onSubmit={addBlog}>
                    <h2>create new</h2>
                    <div>
                        title
                        <input
                            type="text"
                            role="textbox"
                            id='title'
                            value={newTitle}
                            onChange={({ target }) => setNewTitle(target.value)}
                        />
                    </div>
                    <div>
                        author
                        <input
                            type="text"
                            role='textbox'
                            id='author'
                            value={newAuthor}
                            onChange={({ target }) => setNewAuthor(target.value)}
                        />
                    </div>
                    <div>
                        url
                        <input
                            type="text"
                            role="textbox"
                            id='url'
                            value={newUrl}
                            onChange={({ target }) => setNewUrl(target.value)}
                        />
                    </div>
                    <button type="submit" id='create-button'>create</button>
                </form>
            </div>}
        </div>

    )
}

BlogForm.propTypes = {
    setBlogs: PropTypes.func.isRequired,
    blogs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
    handleTime: PropTypes.func.isRequired
}

export default BlogForm