import apiURL from "utils/urls";

const unsubscribe = async (req, res) => {
    const { user_id, subscriber_id } = req.body;
    try {
        const response = await fetch(`${apiURL}/api/subscribers/${user_id}/${subscriber_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { data } = await response.json();
        res.statusCode = 200;
        res.json({
            message: "Successfully Unsubscribed",
            data,
            success: true,
        });
    } catch (e) {
        res.statusCode = 200;
        res.json({
            success: false,
            message: `Could not Unsubscribe. Error: ${e}`,
        });
    }
}

export default unsubscribe;