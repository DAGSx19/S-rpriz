
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Play,
  Pause,
} from "lucide-react";
import "./style.css";

const photos = [
  "/%C4%B0mages/477d04444f4cb2ada9a8828e7755c471.jpg",
  "/%C4%B0mages/754862c464b65ad97349fe275ab111e9.jpg",
];

const tracks = [
  {
    title: "Gamsız Hayat",
    artist: "Candan Erçetin",
    src: "/music/Candan%20Er%C3%A7etin%20-%20Gams%C4%B1z%20Hayat(_H450BoeBA8c_).m4a",
  },
  {
    title: "Derin Duygular",
    artist: "Özcan Deniz",
    src: "/music/%C3%96zcan%20Deniz%20-%20Derin%20Duygular%20(Official%20Audio)(_efqS4eQSQ8s_).m4a",
  },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const audioRef = useRef(null);
  const noRef = useRef(null);

  const messages = [
    "Emin misin? 🥹",
    "Bir şans daha ver ya 😭",
    "Öykü bile bu kadar kaçmadı!",
    "Ayaz'a söyleme bunu 😂",
    "HAYIR butonu bile kararsız kaldı!",
    "Peki ya beraber güzel bir gün geçirsek? 🌸",
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (playing) {
        audioRef.current.play().catch(() => setPlaying(false));
      }
    }
  }, [trackIndex]);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
        setMusicOpen(true);
      } catch {
        setPlaying(false);
        setMusicOpen(true);
      }
    }
  }

  function nextTrack() {
    setTrackIndex((current) => (current + 1) % tracks.length);
    setMusicOpen(true);
    setPlaying(true);
  }

  function dodgeNo() {
    setNoCount((count) => count + 1);
    if (noRef.current) {
      const x = Math.random() * 140 - 70;
      const y = Math.random() * 90 - 45;
      noRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  return (
    <main className="app">
      <div className="petals" aria-hidden="true">
        🌸　🌷　🌸　💮　🌸
      </div>

      <header className="topbar">
        <span className="brand">
          <Heart size={17} fill="currentColor" /> küçük bir sürpriz
        </span>
        <button className="music-toggle" onClick={toggleMusic}>
          {playing ? <Volume2 size={17} /> : <VolumeX size={17} />}
          {playing ? "Müziği durdur" : "Müziği aç"}
        </button>
      </header>

      <audio
        ref={audioRef}
        src={tracks[trackIndex].src}
        loop
        onEnded={() => setPlaying(false)}
      />

      {musicOpen && (
        <div className="music-player">
          <Music size={16} />
          <span>
            {tracks[trackIndex].title} · {tracks[trackIndex].artist}
          </span>
          <button onClick={toggleMusic} aria-label="Müziği oynat veya durdur">
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={nextTrack} aria-label="Sonraki şarkı">
            Sonraki ♫
          </button>
        </div>
      )}

      <section className="card">
        <div className="sparkle">
          <Sparkles size={22} />
        </div>

        {step === 0 && (
          <div className="screen">
            <p className="eyebrow">Sana küçük bir sorum var...</p>
            <h1>Hazır mısın? 🌸</h1>
            <p className="description">
              Küçük bir sürpriz hazırladım. Devam etmek için hazır olman
              yeterli.
            </p>
            <button className="yes-button" onClick={() => setStep(1)}>
              Hazırım 💗
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="screen">
            <p className="eyebrow">Birlikte güzel bir anı? 🌷</p>
            <h1>Bir buluşmaya ne dersin?</h1>
            <p className="description">
              Müsait olduğun bir zamanda beraber buluşup biraz vakit
              geçirelim istiyorum. ☺️
            </p>

            <div className="photo-row">
              <figure>
                <img src={photos[0]} alt="Öykü" />
                <figcaption>Öykü 🌸</figcaption>
              </figure>
              <span className="photo-heart">♡</span>
              <figure>
                <img src={photos[1]} alt="Ayaz" />
                <figcaption>Ayaz 🌷</figcaption>
              </figure>
            </div>

            <p className="question">Ne dersin?</p>
            <div className="buttons">
              <button className="yes-button" onClick={() => setStep(2)}>
                Olur, neden olmasın 💗
              </button>
              <button
                ref={noRef}
                className="no-button"
                onMouseEnter={dodgeNo}
                onTouchStart={dodgeNo}
                onClick={dodgeNo}
              >
                Hayır 🙈
              </button>
            </div>
            {noCount > 0 && (
              <p className="funny-message">
                {messages[Math.min(noCount - 1, messages.length - 1)]}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="screen">
            <div className="big-heart">💗</div>
            <h1>Yaşasın!</h1>
            <p className="description">
              O zaman ne zaman müsait olduğunu konuşuruz. Acele yok, senin
              için uygun olan bir gün olsun. 🌸
            </p>
            <p className="signature">Küçük bir sürpriz, güzel bir anı...</p>
          </div>
        )}
      </section>

      <footer>biraz kiraz mevsimi, biraz da cesaret 🌸</footer>
    </main>
  );
          }
