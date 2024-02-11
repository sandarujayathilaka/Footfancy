export const globalErrHandler = (err, req, res, next) => {
    const stack = err?.stack;
    const message = err?.message;
    const statusCode = err?.statusCode? err?.statusCode:500;
    
    res.status(statusCode).json({
        message,
        stack,
    });
}


export const notFound = (req,res,next)=>{
    const error = new Error(`Not found - ${req.originalUrl}`);
    next(error);
}