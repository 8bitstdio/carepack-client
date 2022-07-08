import apiURL from '../../utils/urls';

const editAccount = async (req, res) => {
    const {
        name = '',
        username = '',
        email = '',
        website = '',
        description = '',
        photo = '',
        wallet = '',
        id = '',
    } = req.body;

    console.log(wallet);

    if (wallet !== '') {
        try {
            const response = await fetch(`${apiURL}/api/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        name,
                        username,
                        email,
                        website,
                        description,
                        photo,
                        wallet,
                    }
                })
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
    }
    res.statusCode = 500;
    res.json({
        success: false,
        wallet,
        message: 'Wallet is required',
    });
}

export default editAccount;
