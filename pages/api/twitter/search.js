import twitter from "utils/twitter";

const search = async (req, res) => {
    try {
        const { client } = await twitter(req);
        const results = await client.get('users/me', {
            'user.fields': 'public_metrics'
        });
        return res.status(200).json({
            status: 'OK',
            data: results.data,
        });
    } catch(e) {
        console.log(e);
        return res.status(400).json({
            status: e.message,
        })
    }
}

export default search;
