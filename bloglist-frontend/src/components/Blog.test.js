import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders content', () => {
    const user = {
        username: 'mulipmby1',
        name: 'mulipmby1'
    }

    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'https://www.testurl.com/',
        likes: 5,
        user: {
            username: 'mulipmby1',
            name: 'mulipmby1'
        }
    }

    render(<Blog blog={blog} user={user}/>)
    // title is visible
    const title = screen.getAllByText('Component testing is done with react-testing-library')
    expect(title).toBeDefined()

    // url and likea are not visible
    const url = screen.queryByText('https://www.testurl.com/')
    expect(url).not.toBeInTheDocument()

    const likes = screen.queryByText(`Likes ${blog.likes}`)
    expect(likes).not.toBeInTheDocument()
})

test('clicking the button calls event handler once', async () => {
    const user = {
        username: 'mulipmby1',
        name: 'mulipmby1'
    }

    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'https://www.testurl.com/',
        likes: 5,
        user: {
            username: 'mulipmby1',
            name: 'mulipmby1'
        }
    }

    const mockHandler = jest.fn()

    render(
        <Blog blog={blog} user={user} />
    )

    const userd = userEvent.setup()
    const button = screen.getByText('view')
    await userd.click(button)

    expect(mockHandler.mock.calls).toHaveLength(0)

    // onClick is called once, url, author and likes are visible
    const url = screen.queryByText('https://www.testurl.com/')
    expect(url).toBeDefined()

    const likes = screen.queryByText(`Likes ${blog.likes}`)
    expect(likes).toBeDefined()

    const author = screen.queryByText('Test Author')
    expect(author).toBeDefined()
})


test('clicking the likes button calls event handler twice', async () => {
    const user = {
        username: 'mulipmby1',
        name: 'mulipmby1'
    }

    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'https://www.testurl.com/',
        likes: 5,
        user: {
            username: 'mulipmby1',
            name: 'mulipmby1'
        }
    }

    const mockHandler = jest.fn()

    render(
        <Blog blog={blog} user={user} handleLike={mockHandler}/>
    )

    const userd = userEvent.setup()
    const button = screen.getByText('view')
    await userd.click(button)

    const likeUser = userEvent.setup()
    const likeBtn = screen.getByText('like')
    await likeUser.click(likeBtn)
    await likeUser.click(likeBtn)

    expect(mockHandler.mock.calls).toHaveLength(2)
})
