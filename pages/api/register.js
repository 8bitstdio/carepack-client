import apiURL from '../../utils/urls';
import { setLoginSession } from '../../utils/auth-token';


const register = async (req, res) => {
    const {wallet, username, email, name} = req.body;
    try {
        const walletLower = wallet.toLowerCase();
        const response = await fetch(`${apiURL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    wallet: walletLower,
                    name: name,
                    username: username,
                    email: email,
                }
            }),
        });
        const {data} = await response.json();
        const session = {
            username: data.username,
            address: walletLower,
        };
        setLoginSession(res, session, walletLower);
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
}

export default register;