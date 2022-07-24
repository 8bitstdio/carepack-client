import isEmpty from "lodash/isEmpty";
import apiURL from "/utils/urls";

const getUsername = async (req, res) => {
    const { username = "" } = req.query;
    try {
        const response = await fetch(`${apiURL}/api/users/username/${username}`, {
            method: "GET",
        });
        const { data } = await response.json();
        res.statusCode = 200;
        if (isEmpty(data)) {
            res.json({
                message: "Username is not taken",
                data,
                success: true,
            });
        } else {
            res.json({
                message: "Username is already taken",
                data,
                success: false,
            });
        }
    } catch (error) {
        res.statusCode = 500;
        res.json({
            success: false,
            message: `Error fetching data. Error: ${e}`,
        });
    }
}

export default getUsername;