export default function Sidebar() {

    return (
        <aside className="glass sidebar">

            <h2>NODE STATUS</h2>

            <p>NODE_01 :: ACTIVE</p>
            <p>NODE_02 :: ACTIVE</p>
            <p>NODE_03 :: STANDBY</p>
            <p>NODE_04 :: OFFLINE</p>

            <hr />

            <h2>SESSION DATA</h2>

            <p>ID: ########</p>
            <p>STATE: STABLE</p>

            <p>SYNC: RUNNING</p>

        </aside>
    );
}