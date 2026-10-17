import { useEffect, useRef, useState } from 'react'
import './style.css'

/* ------------------------------------------------------------------
   Varlıklar: Public/ klasörü vite.config.js içinde publicDir olarak
   ayarlı, bu yüzden yollar kök dizinden başlar. encodeURI; Türkçe
   karakterleri (İ, ç, ö, ı), boşlukları ve parantezleri güvenle kodlar.
------------------------------------------------------------------- */
const BASE = import.meta.env.BASE_URL
const asset = (path) => encodeURI(`${BASE}${path}`)

const PHOTOS = [
  {
    src: asset('İmages/477d04444f4cb2ada9a8828e7755c471.jpg'),
    alt: 'Birinci fotoğraf',
  },
  {
    src: asset('İmages/754862c464b65ad97349fe275ab111e9.jpg'),
    alt: 'İkinci fotoğraf',
  },
]

const TRACKS = [
  {
    title: 'Gamsız Hayat',
    artist: 'Candan Erçetin',
    src: asset('music/Candan Erçetin - Gamsız Hayat(_H450BoeBA8c_).m4a'),
  },
  {
    title: 'Derin Duygular',
    artist: 'Özcan Deniz',
    src: asset(
      'music/Özcan Deniz - Derin Duygular (Official Audio)(_efqS4eQSQ8s_).m4a',
    ),
  },
]

/* Düşen taç yapraklarının sabit (rastgele olmayan) dağılımı */
const PETALS = Array.from({ length: 9 }, (_, i) => ({
  x: (i * 37 + 8) % 100,
  size: 9 + ((i * 5) % 8),
  delay: -((i * 2.3) % 14),
  dur: 13 + ((i * 3) % 7),
  sway: i % 2 ? 28 : -28,
}))

function Petals() {
  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            '--x': `${p.x}%`,
            '--s': `${p.size}px`,
            '--delay': `${p.delay}s`,
            '--dur': `${p.dur}s`,
            '--sway': `${p.sway}px`,
          }}
        />
      ))}
    </div>
  )
}

function Blossom() {
  return (
    <svg className="blossom" viewBox="0 0 100 100" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} style={{ transform: `rotate(${i * 72}deg)`, transformOrigin: '50px 50px' }}>
          <ellipse
            className="blossom-petal"
            cx="50"
            cy="27"
            rx="13"
            ry="22"
            style={{ '--i': i }}
          />
        </g>
      ))}
      <circle className="blossom-core" cx="50" cy="50" r="5" />
    </svg>
  )
}

function Icon({ name }) {
  const common = { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': true }
  if (name === 'play')
    return (
      <svg {...common}>
        <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
      </svg>
    )
  if (name === 'pause')
    return (
      <svg {...common}>
        <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M6 5.5v13l9-6.5zM17 5h2v14h-2z" fill="currentColor" />
    </svg>
  )
}

export default function App() {
  const [stage, setStage] = useState('intro') // intro | invite | yes | later
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const audioRef = useRef(null)
  const wantsPlay = useRef(false)
  const headingRef = useRef(null)
  const firstRender = useRef(true)

  const track = TRACKS[trackIndex]

  /* Şarkı değişince, kullanıcı müziği başlatmışsa yeni şarkıyı çal */
  useEffect(() => {
    if (wantsPlay.current && audioRef.current) {
      audioRef.current.play().catch(() => setPlaying(false))
    }
  }, [trackIndex])

  /* Ekran değişince başlığa odaklan (klavye ve ekran okuyucu için) */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [stage])

  const startMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    wantsPlay.current = true
    audio.play().catch(() => {
      wantsPlay.current = false
      setPlaying(false)
    })
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      startMusic()
    } else {
      wantsPlay.current = false
      audio.pause()
    }
  }

  const nextTrack = () => setTrackIndex((i) => (i + 1) % TRACKS.length)

  const begin = () => {
    startMusic() // tarayıcı kuralı: ses, kullanıcı dokunuşuyla başlar
    setStage('invite')
  }

  return (
    <div className={`stage stage--${stage}`}>
      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={nextTrack}
      />

      {(stage === 'intro' || stage === 'yes') && <Petals />}

      {stage === 'intro' && (
        <main className="screen screen--intro" key="intro">
          <div className="arch">
            <img src={PHOTOS[0].src} alt={PHOTOS[0].alt} className="arch-img" />
          </div>
          <div className="copy">
            <h1 className="title" tabIndex={-1} ref={headingRef}>
              Sana küçük bir sorum var.
            </h1>
            <p className="lead">Bir dakikanı almaz. Sesin açık olursa daha güzel olur.</p>
            <button type="button" className="btn btn--primary" onClick={begin}>
              Başla
            </button>
          </div>
        </main>
      )}

      {stage === 'invite' && (
        <main className="screen screen--invite" key="invite">
          <div className="duo">
            <img src={PHOTOS[0].src} alt={PHOTOS[0].alt} className="duo-img duo-img--a" />
            <img src={PHOTOS[1].src} alt={PHOTOS[1].alt} className="duo-img duo-img--b" />
          </div>
          <div className="copy">
            <h1 className="title" tabIndex={-1} ref={headingRef}>
              Bir gün buluşalım mı?
            </h1>
            <p className="lead">
              Seninle bir gün buluşup biraz vakit geçirmek isterim. Müsait olduğun bir zamanda
              ne dersin?
            </p>
            <div className="actions">
              <button type="button" className="btn btn--primary" onClick={() => setStage('yes')}>
                Olur, buluşalım
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setStage('later')}>
                Biraz düşüneyim
              </button>
            </div>
          </div>
        </main>
      )}

      {stage === 'yes' && (
        <main className="screen screen--yes" key="yes">
          <Blossom />
          <div className="copy">
            <h1 className="title" tabIndex={-1} ref={headingRef}>
              Sevindim, teşekkür ederim.
            </h1>
            <p className="lead">
              Sana uygun olan günü ve saati söylemen yeterli. Yeri de birlikte seçeriz.
            </p>
            <button type="button" className="btn btn--outline" onClick={() => setStage('invite')}>
              Daveti tekrar gör
            </button>
          </div>
        </main>
      )}

      {stage === 'later' && (
        <main className="screen screen--later" key="later">
          <div className="copy">
            <h1 className="title" tabIndex={-1} ref={headingRef}>
              Tamam, acele yok.
            </h1>
            <p className="lead">Hazır olduğunda davet burada olacak.</p>
            <button type="button" className="btn btn--primary" onClick={() => setStage('invite')}>
              Davete dön
            </button>
          </div>
        </main>
      )}

      {stage !== 'intro' && (
        <div className="player" role="group" aria-label="Müzik kontrolü">
          <button
            type="button"
            className="player-btn"
            onClick={toggleMusic}
            aria-label={playing ? 'Müziği duraklat' : 'Müziği çal'}
          >
            <Icon name={playing ? 'pause' : 'play'} />
          </button>
          <div className="player-info" aria-live="polite">
            <span className="player-title">{track.title}</span>
            <span className="player-artist">{track.artist}</span>
          </div>
          <button
            type="button"
            className="player-btn"
            onClick={nextTrack}
            aria-label="Sonraki şarkı"
          >
            <Icon name="next" />
          </button>
        </div>
      )}
    </div>
  )
}
