import Hero from "../components/Hero";
import Sidebar from "../components/Sidebar";

export default function Home() {

    return (

        <main className="layout">
            
            <Sidebar />
            <Hero />
        </main>
    );
}