import { useMemo, useState } from "react";
import { useLiveUpdate } from "../hooks/useLiveUpdate";

const DONATIONS_STORAGE_KEY = "alexis-donations-admin";
const ADMIN_KEY = "5134";

function formatAmount(amount) {
    return Number(amount || 0).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
}

function formatDate(dateString) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

export default function Donations() {

    const [donations, setDonations] = useState([]);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem(DONATIONS_STORAGE_KEY) === "true";
    });

    async function loadDonations() {

        try {
            const response = await fetch("/api/donations");
            const data = await response.json();
            setDonations(data.donations || []);
        } catch (error) {
            console.error("Error loading donations:", error);
        }

    }

    useLiveUpdate(loadDonations, 20000);

    const totalRaised = useMemo(() => {
        return donations.reduce((sum, donation) => sum + Number(donation.amount || 0), 0);
    }, [donations]);

    function unlockAdmin() {

        if (typeof window === "undefined") return;

        const entered = window.prompt("Enter the donations admin key");

        if (entered === ADMIN_KEY) {
            window.localStorage.setItem(DONATIONS_STORAGE_KEY, "true");
            setIsAdmin(true);
            return;
        }

        window.alert("Only the owner can add donations.");
    }

    async function addDonation() {

        if (!isAdmin || !name.trim() || !amount.trim()) return;

        setSubmitting(true);

        try {

            const response = await fetch("/api/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, amount, message, password: ADMIN_KEY })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to add donation");
            }

            setName("");
            setAmount("");
            setMessage("");
            loadDonations();

        } catch (error) {
            console.error("Error adding donation:", error);
            window.alert(error.message || "Unable to add donation right now.");
        } finally {
            setSubmitting(false);
        }

    }

    return (
        <div className="donations-page">

            <h1 className="donations-title">
                CASHAPP DONATORS
            </h1>

            <p className="donations-subtitle">
                thank you to everyone who has supported my move ♡
            </p>

            <a
                className="donations-cashtag"
                href="https://cash.app/$alexisdye01"
                target="_blank"
                rel="noopener noreferrer"
            >
                SEND A DONATION: $alexisdye01
            </a>

            <div className="donations-total">
                TOTAL RAISED: <span>{formatAmount(totalRaised)}</span>
            </div>

            <div className="donations-list">

                {donations.length ? donations.map((donation) => (
                    <div key={donation.id} className="donation-card">

                        <div className="donation-card__header">
                            <h3>{donation.name}</h3>
                            <span className="donation-card__amount">
                                {formatAmount(donation.amount)}
                            </span>
                        </div>

                        {donation.message && (
                            <p className="donation-card__message">
                                "{donation.message}"
                            </p>
                        )}

                        <p className="donation-card__date">
                            {formatDate(donation.created_at)}
                        </p>

                    </div>
                )) : (
                    <p className="donations-empty">
                        No donations yet. Be the first!
                    </p>
                )}

            </div>

            {isAdmin ? (
                <div className="donations-input">

                    <input
                        placeholder="donor name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        placeholder="amount (USD)..."
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <textarea
                        placeholder="message (optional)..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button onClick={addDonation} disabled={submitting}>
                        ADD DONATION
                    </button>

                </div>
            ) : (
                <button className="donations-admin-unlock" onClick={unlockAdmin}>
                    owner login
                </button>
            )}

        </div>
    );
}
