const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let i = 0
    blogs.forEach(p => {
        i = i + p.likes
    })

    return i
}
const favoriteBlog = (blogs) => {
    let i = 0
    let palautettava = blogs[0]
    blogs.forEach(p => {
        if (p.likes > palautettava.likes) {
            palautettava = p
        }
        i = i + 1
    })
    return palautettava
}

const mostBlogs = (blogs) => {
    let blogsByAuthors = []

    blogs.forEach(p => {
        const found = blogsByAuthors.some(auth => auth.author === p.author)
        if (!found) blogsByAuthors.push({ author: p.author, blogs: 1 })
        if (found) {
            const i = blogsByAuthors.findIndex(a => a.author === p.author)
            blogsByAuthors[i].blogs += 1
        }
    })
    let most = blogsByAuthors[0]
    blogsByAuthors.find(a => {
        if (most.blogs < a.blogs) most = a
    })

    return most
}

const mostLikes = (blogs) => {
    let blogsByAuthors = []

    blogs.forEach(p => {
        const found = blogsByAuthors.some(auth => auth.author === p.author)
        if (!found) blogsByAuthors.push({ author: p.author, likes: p.likes })
        if (found) {
            const i = blogsByAuthors.findIndex(a => a.author === p.author)
            blogsByAuthors[i].likes = blogsByAuthors[i].likes + p.likes
        }
    })

    let most = blogsByAuthors[0]
    blogsByAuthors.find(a => {
        if (most.likes < a.likes) most = a
    })

    return most
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}