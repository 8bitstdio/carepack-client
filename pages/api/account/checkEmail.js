import isEmpty from "lodash/isEmpty";
import apiURL from "/utils/urls";

const getEmail = async (req, res) => {
    const { email = "" } = req.query;
    try {
        const response = await fetch(`${apiURL}/api/users/email/${email}`, {
            method: "GET",
        });
        const { data } = await response.json();
        res.statusCode = 200;
        if (isEmpty(data)) {
            res.json({
                message: "Email is not taken",
                data,
                success: true,
            });
        } else {
            res.json({
                message: "Email is already taken",
                data,
                success: false,
            });
        }
    } catch (error) {
        res.statusCode = 500;
        res.json({
            success: false,
            message: error,
        });
    }
}

export default getEmail;