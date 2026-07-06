import Hero from "../components/Hero";
import Sidebar from "../components/Sidebar";

export default function Home() {

    return (
        <main className="layout">

            <Sidebar />

            <section className="content">

                <div className="glass">
                    <h2>SYSTEM STATUS</h2>

                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Integer vitae eros at elit efficitur gravida.
                        Suspendisse potenti.
                    </p>
                </div>

                <div className="glass">
                    <h2>RECENT LOGS</h2>

                    <p>
                        Placeholder data stream active...
                    </p>
                </div>

            </section>

        </main>
    );
}