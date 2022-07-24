import apiURL from "utils/urls";

const Subscribe = async (req, res) => {
    const { user_id, subscriber_id } = req.body;
    try {
        const response = await fetch(`${apiURL}/api/subscribers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subscriber : {
                    user_id,
                    subscriber_id
                }
            }),
        });
        const { data } = await response.json();
        res.statusCode = 200;
        res.json({
            message: "Successfully Subscribed",
            data,
            success: true,
        });
    } catch (e) {
        res.statusCode = 200;
        res.json({
            success: false,
            message: `Could not Subscribe. Error: ${e}`,
        });
    }
}

export default Subscribe;