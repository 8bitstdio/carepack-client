import apiURL from '../../utils/urls';

const editAccount = async (req, res) => {
    console.log(req.body);
    
    const {
        name = '',
        username = '',
        email='',
        website='',
        description='',
        wallet,
    } = req.body.values;
    console.log(req.body.values);
    let query = '';

    if (wallet !== '') {
        query = `
            mutation {
                editUser(input: {
                    name: "${name}",
                    username: "${username}",
                    email: "${email}",
                    website: "${website}",
                    description: "${description}",
                    wallet: "${wallet}"
                }) {
                    name
                    wallet
                    email
                    username
                    isVerified
                }
            }
        `;
    }
    try {
        const response = await fetch(`${apiURL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query
            })
        });
        const {data} = await response.json();
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

export default editAccount;
