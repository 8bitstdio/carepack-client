import apiURL from "utils/urls";

const analytics = async (req, res) => {
  const { id } = req.query;
  try {
    const response = await fetch(`${apiURL}/api/subscribers/count/${id}`);
    const result = await response.json();
    res.status(200).json({
      data: result,
      message: "Fetched subscriber counts",
    });
  } catch (error) {
    console.log(error);
  }
};

export default analytics;
