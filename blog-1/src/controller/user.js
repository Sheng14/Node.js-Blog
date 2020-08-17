const loginCheck = (username, password) => {
    if (username === "Dark" && password === 123) {
        return true
    } else {
        return false
    }
}

module.exports = {
    loginCheck
}