import twitter from "utils/twitter";

const me = async (req, res) => {
    try {
        const { client } = await twitter(req);
        const scope = 'public_metrics,verified,description,id,withheld,created_at,username,profile_image_url,pinned_tweet_id,location,name,url';
        const results = await client.get('users/me', {
            'user.fields': scope,
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

export default me;
