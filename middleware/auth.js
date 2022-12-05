import jwt from 'jsonwebtoken'

export const isAuthenticated = (req, res, next) => {
    try {
        let token = req.header("Authorization");
        console.log(token)
        if (!token) {
            return res.status(404).send("Token not found");
        }
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.email = decoded.email;
        next();
    } catch (error) {
        return res.status(401).send(error.message);
        // console.error(error);
    }
}