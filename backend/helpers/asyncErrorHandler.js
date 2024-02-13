//whichever function have async and await wrap it in asyncErrorHandler, to catch error automatically

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asyncErrorHandler = (func) => {
    return function (req, res, next) {
        func(req, res, next).catch((err) => next(err)); // passing to global error handler
    };
};

export default asyncErrorHandler;