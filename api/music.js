export default async function handler(req, res) {

    const apiKey = process.env.LASTFM_API_KEY;
    const username = process.env.LASTFM_USERNAME;


    const url =
        "https://ws.audioscrobbler.com/2.0/" +
        `?method=user.getrecenttracks` +
        `&user=${username}` +
        `&api_key=${apiKey}` +
        `&format=json` +
        `&limit=11`;


    try {

        const response = await fetch(url);

        const data = await response.json();


        res.status(200).json(data);


    } catch(error) {

        res.status(500).json({
            error: "Music subsystem offline"
        });

    }

}