import apiURL from "/utils/urls";

const typeahead = async (req, res) => {
    const { query = "" } = req.query;
    try {
        const response = await fetch(`${apiURL}/api/users/query/${query}`, {
            method: "GET",
        });
        const { data } = await response.json();
        res.statusCode = 200;
        res.json({
            message: "Successfully retrieved results",
            data,
            success: true,
        });
    } catch (error) {
        res.statusCode = 500;
        res.json({
            success: false,
            message: `Error fetching data. Error: ${e}`,
        });
    }
}

export default typeahead;