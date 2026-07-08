const links = [
    {
        title: "The Nail Room",
        description: "My mom's nail salon's website, made by me",
        url: "https://the-nail-room-gamma.vercel.app"
    },
    {
        title: "Ouroboros",
        description: "Self eating snake game, stupid gimick lmao",
        url: "https://ouroboros-seven-theta.vercel.app/"
    }
];

export default function Links() {

    return (

        <div className="links-page">

            <h1>ALEXIS CINEMATIC UNIVERSE</h1>

            <p>
                My other sites :3
            </p>

            <div className="links-grid">

                {links.map(link => (

                    <a
                        key={link.title}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-card"
                    >

                        <h2>{link.title}</h2>

                        <p>{link.description}</p>

                    </a>

                ))}

            </div>

        </div>

    );

}