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
    expect(url).not.toBeVisible()

    const likes = screen.queryByText(`Likes ${blog.likes}`)
    expect(likes).not.toBeVisible()
})