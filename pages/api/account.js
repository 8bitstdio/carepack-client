import apiURL from "../../utils/urls";

const account = async (req, res) => {
  const { username = "" } = req.body;
  try {
    const response = await fetch(`${apiURL}/api/users/username/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data } = await response.json();

    res.statusCode = 200;
    res.json({
      data,
      success: true,
    });
  } catch (e) {
    res.statusCode = 500;
    res.json({
      success: false,
    });
  }
};

export default account;
