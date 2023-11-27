import { useState } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, handleLike, user, setBlogs, blogs }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const handleLikes = (event) => {
        event.preventDefault()

        const newBlog = {
            id: blog.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1
        }
        handleLike(newBlog)
    }

    const handleRemove = (id) => {
        if (user.username === blog.user.username) {
            return () => {
                if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
                    blogService.remove(id)
                        .then(() => {
                            setBlogs(blogs.filter(blog => blog.id !== id))
                        })
                }
            }
        }
    }

    const [blogVisible, setBlogVisible] = useState(false)

    const toggleVisibility = () => {
        setBlogVisible(!blogVisible)
    }

    return (
        <div style={blogStyle} className='blog'>
            {blog.title}
            { blogVisible && <div>
                <p>{blog.url}</p>
                <p>Likes {blog.likes} <button onClick={handleLikes}>like</button></p>
                <p>{blog.author}</p>
                <button onClick={handleRemove(blog.id)}>remove</button>
            </div>}
            <button onClick={toggleVisibility}>{blogVisible ? 'hide' : 'view'}</button>
        </div>
    )
}

export default Blog