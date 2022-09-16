const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
    const authorization = req.headers.authorization
    
    if ( !authorization ) {
        res.status(401).json({message: 'Authorization is not defined'})
        return
    }
    
    try {
        
        const bearer = authorization.split(' ')[0]
        const token = authorization.split(' ')[1]

        jwt.verify(token, '123', (err) => {
            if ( err ) {
                res.status(400).json({ message: 'Token is not Correct' })
                return
            }
            
            next()
        })

    } catch (error) {
        console.log(error)
    }

}

module.exports = protect