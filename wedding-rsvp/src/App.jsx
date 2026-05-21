import { supabase } from "./supabaseClient";
import { Church, Wine, MapPinned } from "lucide-react";
import "./App.css";
import { useEffect, useState, useRef } from "react";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState([{ name: "", isChild: false }]);
  const [busConfirmed, setBusConfirmed] = useState(false);
  const [note, setNote] = useState("");
  const [daysLeft, setDaysLeft] = useState(0);
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormClosing, setIsFormClosing] = useState(false);

  useEffect(() => {
    const weddingDate = new Date("2026-09-11T00:00:00");

    const updateDaysLeft = () => {
      const now = new Date();
      const difference = weddingDate - now;

      const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

      setDaysLeft(days);
    };

    updateDaysLeft();

    const timer = setInterval(updateDaysLeft, 1000 * 60 * 60);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  const ua = navigator.userAgent.toLowerCase();

  const isSamsungBrowser =
    ua.includes("samsung") ||
    ua.includes("samsungbrowser") ||
    ua.includes("samsung browser");

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const updateSamsungTheme = () => {
    if (isSamsungBrowser && mediaQuery.matches) {
      document.body.classList.add("samsung-browser");
    } else {
      document.body.classList.remove("samsung-browser");
    }
  };

  updateSamsungTheme();

  mediaQuery.addEventListener("change", updateSamsungTheme);

  return () => {
    mediaQuery.removeEventListener("change", updateSamsungTheme);
  };
}, []);

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index][field] = value;
    setGuests(updatedGuests);
  };

  const addGuest = () => {
    setGuests([...guests, { name: "", isChild: false }]);
  };

  const removeGuest = (index) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const smoothScrollToForm = () => {
    setTimeout(() => {
      if (!formRef.current) return;

      const targetY = formRef.current.offsetTop - 20;
      const startY = window.scrollY;
      const distance = targetY - startY;
      const duration = 900;

      let startTime = null;

      const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
      };

      const animation = (currentTime) => {
        if (!startTime) startTime = currentTime;

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        window.scrollTo(
          0,
          startY + distance * easeOutCubic(progress)
        );

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = {
      ime_prezime: attending === "da" ? guests[0]?.name || "" : fullName,
      dolazak: attending,
      gosti:
        attending === "da"
          ? guests.map((guest) => ({
            fullName: guest.name,
            isChild: guest.isChild,
          }))
          : [],
      zainteresirani_za_bus: attending === "da" ? busConfirmed : false,
      potvrda_busa: attending === "da" ? busConfirmed : false,
      napomena: attending === "da" ? note : "",
    };

    const startTime = Date.now();

    const { error } = await supabase
      .from("potvrde_dolaska")
      .insert([formData]);

    const elapsed = Date.now() - startTime;

    const minimumLoadingTime = 1800;

    if (elapsed < minimumLoadingTime) {
      await new Promise((resolve) =>
        setTimeout(resolve, minimumLoadingTime - elapsed)
      );
    }

    if (error) {
      console.log(error);
      alert("Greška kod spremanja.");
      setIsSubmitting(false);
      return;
    }

    setIsFormClosing(true);

    setTimeout(() => {
      setSubmitted(true);
      setFullName("");
      setAttending("");
      setGuests([{ name: "", isChild: false }]);
      setBusConfirmed(false);
      setNote("");
      setIsSubmitting(false);
      setShowForm(false);
      setIsFormClosing(false);
    }, 450);
  };

  return (
    <main className="page">
      <section className="hero">

        <div className="photo-hero">
          <img src="/couple4.jpg" alt="Marija i Ivan" />
        </div>

        <p className="script">Zajedno sa svojim obiteljima</p>

        <h1>
          Marija Perković
          <span>&</span>
          Ivan Sabljić
        </h1>

        <p className="script">s radošću vas pozivamo na naše vjenčanje</p>

        <p className="date">PETAK, 11. RUJNA 2026.</p>

        <div className="days-counter">
          <span>{daysLeft}</span>
          <p>dana do vjenčanja</p>
        </div>

        <div className="timeline">
          <div className="timeline-curved">
            <svg
              className="timeline-path"
              viewBox="0 0 620 360"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="desktop-timeline-path"
                d="M20 -55 V95 Q20 155 95 155 H560 Q635 155 635 230 V380"
              />
              <circle cx="20" cy="35" r="7" className="svg-dot desktop-dot" />
              <circle cx="635" cy="290" r="7" className="svg-dot desktop-dot" />
            </svg>
            <span className="mobile-line-dot ceremony"></span>
            <span className="mobile-line-dot dinner"></span>
            <div className="timeline-icon church-icon">
              <Church size={24} strokeWidth={1.6} />
            </div>

            <div className="timeline-icon wine-icon">
              <Wine size={24} strokeWidth={1.6} />
            </div>

            <div className="timeline-event ceremony">
              <div>
                <h3>Obred vjenčanja</h3>
                <p>Crkva sv. Mati Slobode</p>
                <p>Jarun 1, Zagreb</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Crkva%20sv.%20Mati%20Slobode%20Jarun%201%20Zagreb"
                  target="_blank"
                  rel="noreferrer"
                  className="map-link"
                >
                  Prikaži na karti
                </a>
                <p>16:30h</p>
              </div>
            </div>

            <div className="timeline-event dinner">
              <div>
                <h3>Svečana večera</h3>
                <p>Wedding Resort Corberone</p>
                <p>Mačkovec, Brdovec</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Wedding%20Resort%20Corberone%20Ma%C4%8Dkovec%20Brdovec"
                  target="_blank"
                  rel="noreferrer"
                  className="map-link"
                >
                  Prikaži na karti
                </a>
                <p>18:00h</p>
              </div>
            </div>
          </div>
        </div>


        <section className="bus-section">
          <h2>Organizirani prijevoz autobusom</h2>
          <p>
            Autobus bi okvirno prolazio rutom:
            <br />
            <strong>
              Otočac → Gospić → Korenica → Plitvička Jezera → Crkva sv. Mati Slobode → Corberone
            </strong>
          </p>

          <div className="map-wrapper">
            <img
              src="/Desktopkarta.png"
              alt="Karta autobusne rute"
              className="bus-map"
            />
          </div>

          <p className="small-note">
            Točna ruta, stanice i vrijeme polaska bit će naknadno dogovoreni
            prema broju zainteresiranih.
          </p>
        </section>

        <p className="script big">
          Vaša prisutnost učinit će ovaj dan još posebnijim
        </p>
        <p>Molimo odgovorite na pozivnicu do 15. srpnja 2026.</p>

        {submitted && (
          <section className="success-card">
            <h2>Hvala na odgovoru!</h2>
            <p>Vaša potvrda je uspješno zaprimljena.</p>
            <p className="success-note">
              Ako naknadno dođe do promjene, slobodno ponovno ispunite obrazac ili nam se javite.
            </p>
          </section>
        )}

        {!showForm && !submitted && (
          <button
            className="primary-button"
            onClick={() => {
              setSubmitted(false);
              setShowForm(true);

              setTimeout(() => {
                if (!formRef.current) return;

                const targetY = formRef.current.offsetTop - 40;
                const startY = window.scrollY;
                const distance = targetY - startY;
                const duration = 1400;
                let startTime = null;

                const easeInOutCubic = (t) => {
                  return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
                };

                const animation = (currentTime) => {
                  if (!startTime) startTime = currentTime;

                  const timeElapsed = currentTime - startTime;
                  const progress = Math.min(timeElapsed / duration, 1);

                  const ease = easeInOutCubic(progress);

                  window.scrollTo(0, startY + distance * ease);

                  if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                  }
                };

                requestAnimationFrame(animation);
              }, 100);
            }}
          >
            Odgovorite na pozivnicu
          </button>
        )}
      </section>

      {showForm && (
        <section
          className={`card ${isFormClosing ? "card-closing" : ""}`}
          ref={formRef}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <p className="question">
                Hoćete li prisustvovati našem vjenčanju?
              </p>

              <label className="radio-row">
                <input
                  type="radio"
                  name="attending"
                  value="da"
                  checked={attending === "da"}
                  onChange={(e) => {
                    setAttending(e.target.value);
                    smoothScrollToForm();
                  }}
                  required
                />
                Da, dolazimo
              </label>

              <label className="radio-row">
                <input
                  type="radio"
                  name="attending"
                  value="ne"
                  checked={attending === "ne"}
                  onChange={(e) => {
                    setAttending(e.target.value);
                    smoothScrollToForm();
                  }}
                />
                Nažalost, ne dolazimo
              </label>
            </div>

            {attending === "ne" && (
              <div className="attending-content">
                <div className="form-group">
                  <label>Ime i prezime</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="npr. Ivan Horvat"
                    required
                  />
                </div>
              </div>
            )}

            {attending === "da" && (
              <div className="attending-content">
                <div className="form-group">
                  <h2 className="form-label-title">Osobe koje dolaze</h2>

                  {guests.map((guest, index) => (
                    <div className="guest-box" key={index}>
                      <input
                        type="text"
                        placeholder={`Ime i prezime osobe ${index + 1}`}
                        value={guest.name}
                        onChange={(e) =>
                          handleGuestChange(index, "name", e.target.value)
                        }
                        required
                      />

                      {index > 0 && (
                        <label className="radio-row">
                          <input
                            type="checkbox"
                            checked={guest.isChild}
                            onChange={(e) =>
                              handleGuestChange(
                                index,
                                "isChild",
                                e.target.checked
                              )
                            }
                          />
                          Dijete mlađe od 12 godina
                        </label>
                      )}

                      {index > 0 && (
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => removeGuest(index)}
                        >
                          Ukloni osobu
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={addGuest}
                  >
                    Dodaj osobu
                  </button>
                </div>



                <label className="checkbox-row">
                  <input
                    className="round-check"
                    type="checkbox"
                    checked={busConfirmed}
                    onChange={(e) => setBusConfirmed(e.target.checked)}
                  />
                  Zainteresirani smo za organizirani prijevoz autobusom
                </label>

                <div className="form-group">
                  <label className="form-label-title">
                    Dodatne informacije
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Npr. alergije, posebna prehrana ili druge važne napomene..."
                    rows="4"
                  />
                </div>
              </div>
            )}

            {attending && (
              <button
                className="primary-button full-width"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                ) : (
                  "Pošalji odgovor"
                )}
              </button>
            )}
          </form>
        </section>
      )}
    </main>
  );
}

export default App;