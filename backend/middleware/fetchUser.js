import jwt from 'jsonwebtoken';
const JWT_SECRET = 'Iam$goodboy';

// Middleware code

const fetchUser = (req, res, next) => {

    const token = req.header('auth-token');
    if(!token) {
        return res.status(401).send({error: "Please authenticate with valid token"});
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }

    catch(err) {
        return res.status(401).send({error: "Some authentication error occured" });
    }
}

export default fetchUser;
