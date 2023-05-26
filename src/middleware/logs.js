const logRequest = (req, res, next) => {
    console.log('log request ke PATH: ', req.path);
    next();
}

module.exports = logRequest;