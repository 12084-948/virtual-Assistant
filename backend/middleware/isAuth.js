import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next)=>{
    try {
        const token = req.cookies.token
        console.log("Cookies received in backend:", req.cookies);

        if(!token){
            return res.status(400).json({
                message: "User not Authenticated",
                success: false
            })
        }


        const secretKey = process.env.JWT_SECRET || 'jalajJaswal'


        // const verifyToken =  jwt.verify(token, secretKey)
        // req.userId = verifyToken._id
        const verifyToken = jwt.verify(token, secretKey);
        console.log("Decoded Token:", verifyToken);
        console.log("req.userId:", verifyToken.id || verifyToken._id);

        req.userId = verifyToken.id || verifyToken._id; // handle whichever key you used


        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Auth Error",
            success: false
        })
    }
}

export default isAuth