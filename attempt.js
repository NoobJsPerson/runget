module.exports = (func, ...args) => {
    try {
        return func(...args);
    } catch (err) {
        console.log(args[0]);
        console.error(err);
        return null;
    }
}