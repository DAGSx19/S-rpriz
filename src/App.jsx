
import { useState } from "react";
import { Heart, Music2, Cherry, Sparkles } from "lucide-react";

const lines = [
  "Öykü bile bu kadar peşinden koşmamıştır 😂🍒",
  "HAYIR butonu Ayaz'dan kaçmayı öğrenmiş!",
  "Bir şans versen ne kaybedersin ki? 🙃",
  "Son kararın mı gerçekten? 👀",
];

export default function App() {
  const [step, setStep] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState(null);
  const [musicOn, setMusicOn] = useState(false);

  function runAway() {
    const padding = 24;
    const maxX = Math.max(0, window.innerWidth - 150 - padding);
    const maxY = Math.max(0, window.innerHeight - 70 - padding);

    setNoPosition({
      left: `${padding + Math.random() * maxX}px`,
      top: `${padding + Math.random() * maxY}px`,
    });
    setNoCount((count) => count + 1);
  }

  return (
    <main className="page">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <div className="petals" aria-hidden="true">
        🍒　🌸　♡　🌸　🍒
      </div>

      <section className="card">
        <div className="icon-circle">
          {step === 2 ? <Heart size={32} /> : <Cherry size={32} />}
        </div>

        <p className="eyebrow">
          <Sparkles size={14} /> KÜÇÜK BİR SÜRPRİZ <Sparkles size={14} />
        </p>

        {step === 0 && (
          <>
            <h1>Hazır mısın?</h1>
            <p className="description">
              Sana minicik bir sürpriz hazırladım.
              <br />
              Devam etmek için hazır olman yeterli. 🍒
            </p>
            <button className="primary" onClick={() => setStep(1)}>
              Hazırım <Heart size={17} />
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <p className="series">Kiraz Mevsimi havasında... 🌸</p>
            <h1>Birlikte buluşalım mı?</h1>
            <p className="description">
              Müsait olduğun bir zamanda beraber buluşup
              biraz vakit geçirelim istiyorum. 💗
            </p>

            {noCount > 0 && (
              <p className="tease" key={noCount}>
                {lines[(noCount - 1) % lines.length]}
              </p>
            )}

            <div className="buttons">
              <button className="primary" onClick={() => setStep(2)}>
                Olurrr! 💗
              </button>

              <button
                className="secondary"
                style={
                  noPosition
                    ? {
                        position: "fixed",
                        left: noPosition.left,
                        top: noPosition.top,
                        zIndex: 10,
                      }
                    : {}
                }
                onMouseEnter={runAway}
                onTouchStart={(event) => {
                  event.preventDefault();
                  runAway();
                }}
                onClick={runAway}
              >
                HAYIR 🙈
              </button>
            </div>

            <p className="small-note">
              {noCount === 0
                ? "Cevabını merakla bekliyorum..."
                : "Buton bile karar veremedi 😂"}
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Yaşasııın! 🍒</h1>
            <p className="description">
              O zaman ne zaman müsait olduğunu konuşuruz.
              <br />
              Güzel bir gün olması dileğiyle. 💕
            </p>
            <div className="success-heart">💌</div>
            <button
              className="primary"
              onClick={() => {
                const message =
                  "Selam! 🍒 Siteyi gördüm. Birlikte buluşmak için ne zaman müsait olduğumu konuşalım mı?";
                navigator.clipboard?.writeText(message);
                setStep(3);
              }}
            >
              Mesajı hazırla ✨
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1>Mesaj hazır! 💌</h1>
            <p className="description">
              Mesajı kopyalamayı denedim. Şimdi sohbetinizden
              gönderip buluşma zamanını konuşabilirsiniz.
            </p>
            <button className="primary" onClick={() => setStep(2)}>
              Geri dön <Heart size={17} />
            </button>
          </>
        )}

        <div className="card-footer">
          <span>made with</span>
          <Heart size={12} fill="currentColor" />
          <span>and a little cherry magic</span>
        </div>
      </section>

      <button
        className="music-button"
        onClick={() => setMusicOn((value) => !value)}
        aria-label="Müzik kontrolü"
      >
        <Music2 size={17} />
        {musicOn ? "Müzik açık" : "Müzik yakında"}
      </button>

      <p className="bottom-text">belki güzel bir anının başlangıcıdır ♡</p>
    </main>
  );
            }
        
