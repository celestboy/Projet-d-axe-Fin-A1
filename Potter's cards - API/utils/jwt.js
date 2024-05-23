import jsonwebtoken from "jsonwebtoken";

export const generateToken = (user) => {
    return jsonwebtoken.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );
};
