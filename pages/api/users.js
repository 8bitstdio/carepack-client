import { GET_USER_DETAILS } from "../../utils/urls";

const getUsers = async (_, res) => {
  try {
    const response = await fetch(`${GET_USER_DETAILS}/all`);
    const data = await response.json();
    res.statusCode = 200;
    res.json({
      ...data,
      success: true,
    });
  } catch (e) {
    res.statusCode = 500;
    res.json({
      success: false,
      error: e.message,
    });
  }
};

export default getUsers;

