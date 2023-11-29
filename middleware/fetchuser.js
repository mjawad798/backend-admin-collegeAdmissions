var jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) =>{
//GET the user from the jwt token and add ID to req object.
const token = req.header('auth-token');
if(!token){
    res.status(401).send({error: "Please Provide Valid Token for Authentication.."});
}
try {

    const data = jwt.verify(token, process.env.JWT_SECRET);
//    const data = jwt.verify(token,'aaaaaaa');

req.user = data.user;

next();

} catch (error) {
    res.status(401).send({error: "Token is no more valid. Please Login again to Continue.."});
   
}



}



 module.exports = fetchuser;