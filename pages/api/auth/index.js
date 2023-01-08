import apiURL from '../../../utils/urls';
import { setLoginSession } from '../../../utils/auth-token';


const auth = async (req, res) => {
    const {wallet} = req.body;
    try {
        const walletLower = wallet.toLowerCase();
        const response = await fetch(`${apiURL}/api/users/wallet/${walletLower}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const {data} = await response.json();
        if(data?.wallet) {
            const session = {
                user_id: data?.id,
                username: data?.username,
                address: walletLower,
            };
            setLoginSession(res, session, walletLower);
            res.json({
                ...data,
                success: true,
            });
        }
        res.statusCode = 200;
        res.json({
            success: false,
        });
    } catch (e) {
        res.statusCode = 500;
        res.json({
            success: false,
            error: e.message,
        });
    }
}

export default auth;