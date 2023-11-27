import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)



    useEffect(() => {
        blogService.getAll().then(blogs => {
            blogs.sort((a, b) => a.likes - b.likes)
            setBlogs(blogs)
        }
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])
    // handleSection ---------------------------------------------------------------
    const handleTime = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 3000)
    }

    const handleLikes = (blog) => {
        blogService.update(blog.id, blog)
            .then(returnedBlog => {
                setBlogs(blogs.map(bool => bool.id !== returnedBlog.id ? bool : returnedBlog))
            })
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            handleTime('wrong username or password')
        }
    }
    // ---------------------------------------------------------------------------------

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <Notification message={errorMessage} />
            <h2>Log in to application</h2>
            <div>
        username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
        password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )

    if (user === null) {
        return (
            <div>
                {loginForm()}
            </div>
        )
    }

    return (
        <div>
            <h1>blogs</h1>
            <Notification message={errorMessage} />
            {user &&
        <div>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout} type="submit">logout</button>
            <BlogForm setBlogs={setBlogs} blogs={blogs} handleTime={handleTime} />
        </div>
            }
            {blogs.map(blog =>
                <Blog key={blog.id} user={user} blog={blog} handleLike={handleLikes} blogs={blogs} setBlogs={setBlogs} />
            )}
        </div>
    )
}

export default App