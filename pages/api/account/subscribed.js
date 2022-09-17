import apiURL from "utils/urls";

const following = async (req, res) => {
  const { id, cursor } = req.query;
  try {
    const response = await fetch(
      `${apiURL}/api/subscribers/subbed/${id}/${cursor}`
    );
    const { data } = await response.json();
    res.status(200).json({
      data,
      message: "Subscriptions fetched successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export default following;
