import { useState } from "react"
import blogService from '../services/blogs'

const BlogForm = (props) => {
    const [blogVisible, setBlogVisible] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const hideWhenVisible = { display: blogVisible ? 'none' : '' }
    const showWhenVisible = { display: blogVisible ? '' : 'none' }

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
            <div style={hideWhenVisible}>
                <button onClick={() => setBlogVisible(true)}>create new blog </button>
            </div>
            <div style={showWhenVisible}>
                <form onSubmit={addBlog}>
                    <h2>create new</h2>
                    <div>
                        title
                        <input
                            type="text"
                            value={newTitle}
                            onChange={({ target }) => setNewTitle(target.value)}
                        />
                    </div>
                    <div>
                        author
                        <input
                            type="text"
                            value={newAuthor}
                            onChange={({ target }) => setNewAuthor(target.value)}
                        />
                    </div>
                    <div>
                        url
                        <input
                            type="text"
                            value={newUrl}
                            onChange={({ target }) => setNewUrl(target.value)}
                        />
                    </div>
                    <button type="submit">create</button>
                </form>
                <button onClick={() => setBlogVisible(false)}>cancel</button>
            </div>
        </div>

    )
}

export default BlogForm