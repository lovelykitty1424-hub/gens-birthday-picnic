use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(null);
  const [status, setStatus] = useState("");
  const [guestList, setGuestList] = useState([]);

  async function loadGuests() {
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setGuestList(data.rsvps || []);
    } catch {}
  }

  useEffect(() => {
    loadGuests();
    const timer = setInterval(loadGuests, 5000);
    return () => clearInterval(timer);
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || attending === null) {
      setStatus("Por favor completa tu nombre y confirma tu asistencia.");
      return;
    }
    setStatus("Guardando tu confirmación…");
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), attending }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "No se pudo guardar tu RSVP.");
      return;
    }
    setStatus(attending ? "¡Gracias! 💕 Nos vemos el 19 de septiembre." : "Gracias por avisarnos. 💕");
    setName("");
    setAttending(null);
    loadGuests();
  }

  return (
    <main className="page">
      <div className="petal petal1" /><div className="petal petal2" />
      <section className="hero">
        <div className="eyebrow">UNA NOCHE ESPECIAL ✦</div>
        <h1>Mi Cena de<br/><span>Cumpleaños</span></h1>
        <p className="intro">Quiero celebrar esta noche especial junto a mi familia y me encantaría contar contigo.</p>

        <div className="event-card">
          <div><span>FECHA</span><strong>Sábado, 19 de septiembre</strong><small>2026</small></div>
          <div><span>HORA</span><strong>8:00 PM</strong></div>
          <div><span>LUGAR</span><strong>La Locanda Pontezuela</strong><small>C. Villa Residencial 8 · Santiago, República Dominicana</small></div>
        </div>
      </section>

      <section className="dress">
        <div className="dress-icon">✿</div>
        <div>
          <p className="label">CÓDIGO DE VESTIMENTA</p>
          <h2>Tonos suaves y pastel</h2>
          <p>Rosa · azul · lavanda · tonos suaves</p>
          <div className="no-white"><b>NO VESTIR DE BLANCO</b><span>La cumpleañera estará vestida de blanco. 🤍</span></div>
        </div>
      </section>

      <section className="rsvp">
        <p className="label">RSVP</p>
        <h2>¿Nos acompañas?</h2>
        <p className="muted">Confirma tu asistencia para la cena.</p>
        <form onSubmit={submit}>
          <label>Nombre completo</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Escribe tu nombre" />
          <label>¿Asistirás a la cena?</label>
          <div className="choices">
            <button type="button" className={attending===true?"choice selected": "choice"} onClick={()=>setAttending(true)}>Sí, allí estaré 💕</button>
            <button type="button" className={attending===false?"choice selected": "choice"} onClick={()=>setAttending(false)}>No podré asistir</button>
          </div>
          <button className="submit" type="submit">Confirmar asistencia ✦</button>
          {status && <p className="status">{status}</p>}
        </form>
      </section>

      <section className="guests">
        <p className="label">LISTA DE INVITADOS</p>
        <h2>Quiénes vienen 💕</h2>
        <div className="guest-grid">
          {guestList.filter(g=>g.attending).map(g => <div className="guest" key={g.id}>♡ {g.name}</div>)}
        </div>
        {!guestList.filter(g=>g.attending).length && <p className="muted">Aún no hay confirmaciones.</p>}
      </section>

      <footer>Con cariño, para una noche llena de recuerdos ✨</footer>
    </main>
  );
}
