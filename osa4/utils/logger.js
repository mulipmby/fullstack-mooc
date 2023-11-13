const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...params)
    }

}

const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.info(...params)
    }
}

module.exports = {
    error, info
}