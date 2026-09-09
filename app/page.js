"use client";

import { useEffect, useMemo, useState } from "react";

const EVENT_DATE = "September 14, 2026";
const EVENT_TIME = "6:45 PM";
const LOCATION = "Central Park — near 59th St / Columbus Circle";

export default function Home() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [r, i] = await Promise.all([
        fetch("/api/rsvp", { cache: "no-store" }),
        fetch("/api/items", { cache: "no-store" })
      ]);
      setRsvps(await r.json());
      setItems(await i.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  const attendingCount = useMemo(
    () => rsvps.filter((r) => r.attending).length,
    [rsvps]
  );

  async function submitRSVP(e) {
    e.preventDefault();
    if (!name.trim() || attending === null) {
      setMessage("Please enter your name and choose an RSVP.");
      return;
    }
    setMessage("Saving your RSVP…");
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, attending })
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Something went wrong.");
    setMessage(`You're ${attending ? "coming" : "not able to make it"} 💕`);
    await loadData();
  }

  async function addItem(e) {
    e.preventDefault();
    if (!name.trim() || !newItem.trim()) {
      setMessage("Add your name first, then enter an item.");
      return;
    }
    setMessage("Adding item…");
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: newItem, claimedBy: name })
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Could not add item.");
    setNewItem("");
    setMessage("Item added to the picnic list 🌷");
    await loadData();
  }

  async function claimItem(id) {
    if (!name.trim()) {
      setMessage("Enter your name above before claiming an item.");
      return;
    }
    const res = await fetch("/api/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, claimedBy: name })
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "That item may already be claimed.");
    setMessage("Item claimed! Thank you 🧺");
    await loadData();
  }

  return (
    <main>
      <section className="hero">
        <div className="heroCard">
          <img src="/invitation.jpg" alt="Gens Birthday Picnic invitation" className="inviteImage" />
          <div className="heroText">
            <p className="eyebrow">YOU'RE INVITED ♡</p>
            <h1>Gens Birthday Picnic</h1>
            <p className="intro">Come celebrate with me for a cozy picnic in the park! 🌷🧺</p>
            <div className="details">
              <div><span>♡</span><strong>{EVENT_DATE}</strong><small>{EVENT_TIME}</small></div>
              <div><span>⌖</span><strong>Central Park</strong><small>near 59th St / Columbus Circle</small></div>
              <div><span>✿</span><strong>Dress code</strong><small>Pastel colors</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="sectionCard">
          <div className="sectionTitle">
            <div><p className="eyebrow">LET ME KNOW</p><h2>RSVP</h2></div>
            <span className="count">{attendingCount} coming</span>
          </div>

          <form onSubmit={submitRSVP}>
            <label>Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            <label>Will you be joining?</label>
            <div className="choiceRow">
              <button type="button" className={attending === true ? "choice active" : "choice"} onClick={() => setAttending(true)}>♡ Yes, I'll be there</button>
              <button type="button" className={attending === false ? "choice active no" : "choice"} onClick={() => setAttending(false)}>Maybe next time ♡</button>
            </div>
            <button className="primary" type="submit">Save my RSVP</button>
          </form>

          {message && <p className="message">{message}</p>}

          <div className="guestList">
            <h3>Who's coming</h3>
            {loading ? <p>Loading…</p> : rsvps.filter(r => r.attending).map(r => (
              <span className="guest" key={r.id}>♡ {r.name}</span>
            ))}
            {!loading && !rsvps.some(r => r.attending) && <p>No RSVPs yet — be the first! 🌸</p>}
          </div>
        </div>

        <div className="sectionCard">
          <div className="sectionTitle">
            <div><p className="eyebrow">BRING A LITTLE SOMETHING</p><h2>Picnic Items</h2></div>
          </div>
          <p className="subtext">Claim something from the list, or add your own item. Everyone sees the same list.</p>

          <div className="itemList">
            {items.map((entry) => (
              <div className="item" key={entry.id}>
                <div><strong>{entry.item}</strong><small>{entry.claimed_by ? `♡ ${entry.claimed_by}` : "Not claimed yet"}</small></div>
                {!entry.claimed_by && <button onClick={() => claimItem(entry.id)}>Claim</button>}
              </div>
            ))}
            {!items.length && <p>No items yet — add the first one!</p>}
          </div>

          <form className="addForm" onSubmit={addItem}>
            <input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add an item (e.g. lemonade)" />
            <button className="primary" type="submit">Add item</button>
          </form>
        </div>

        <div className="sectionCard note">
          <p className="eyebrow">A LITTLE NOTE</p>
          <h2>Pastel picnic vibes 🌷</h2>
          <p>Wear your favorite pastel colors — pink, lavender, baby blue, butter yellow, mint, cream, or anything soft and cute!</p>
          <p className="small">Meeting area: around the Columbus Circle / 59th Street station side of Central Park. I'll share the exact picnic spot with guests closer to the event.</p>
        </div>
      </section>

      <footer>made with ♡ for Gens</footer>
    </main>
  );
}
