import { useState } from "react"
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
  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title}
        <button onClick={() => setBlogVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={() => setBlogVisible(false)}>hide</button>
        <p>{blog.title}</p>
        <p>{blog.url}</p>
        <p>Likes {blog.likes} <button onClick={handleLikes}>like</button></p>
        <p>{blog.author}</p>
        <button onClick={handleRemove(blog.id)}>remove</button>
      </div>
    </div>
  )
}

export default Blog