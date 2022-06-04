import jwt from "jsonwebtoken"

const JWT_SECRET = "Something";

export const signJWT = (payload={}, expiry='24h')=> {
  try {
    const token = jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: expiry }
      );  
      return token
  } catch (error) {
    return null
  }

}

export const verifyJWT = (token)=> {
  try {
    const data = jwt.verify(
      token, JWT_SECRET
      );  
      return data
  } catch (error) {
    return null;
  }

}

//verified jwt returns a payload

