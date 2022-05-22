import { removeTokenCookie } from "../../utils/auth-cookies";
import { getLoginSession } from "../../utils/auth-token"

const logout = async (req, res) => {
    try {
        const session = await getLoginSession(req);
        if(session){
            removeTokenCookie(res);
            res.statusCode = 200;
            res.json({
                success: true,
                message: 'logged out',
            });
        }
    } catch (e) {
        console.log(e);
    }
    
    res.writeHead(200, {Location: '/'});
    res.end();
}

export default logout;
