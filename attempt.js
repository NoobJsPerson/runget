module.exports = (func, ...args) => {
    try {
        return func(...args);
    } catch (err) {
        console.error(err);
        return null;
    }
}