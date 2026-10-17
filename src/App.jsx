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

const TIMES = ['11:00', '13:00', '15:00', '17:00', '19:00']

const todayISO = () => {
  const n = new Date()
  const p = (v) => String(v).padStart(2, '0')
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`
}

/* "2026-10-23" → "cuma, 23 Ekim" (yerel saat; kayma olmaz) */
const formatDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

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
  const [stage, setStage] = useState('intro') // intro | invite | yes
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const audioRef = useRef(null)
  const wantsPlay = useRef(false)
  const headingRef = useRef(null)
  const firstRender = useRef(true)

  const track = TRACKS[trackIndex]
  const canConfirm = Boolean(date) && date >= todayISO() && Boolean(time)

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
  }, [stage, confirmed])

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

      {stage === 'intro' && <Petals />}

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
            </div>
          </div>
        </main>
      )}

      {stage === 'yes' && (
        <main className="screen screen--yes" key="yes">
          <Blossom />
          <div className="copy">
            <h1 className="title" tabIndex={-1} ref={headingRef}>
              {confirmed ? 'Güzel, zamanı seçtik.' : 'Sevindim. Ne zaman uygun olur?'}
            </h1>

            {confirmed ? (
              <>
                <p className="lead">
                  Bu seçim yalnızca bu ekranda görünür. Bana ayrıca yazarak iletmeyi unutma.
                </p>
                <div className="summary" aria-live="polite">
                  <span className="summary-date">{formatDate(date)}</span>
                  <span className="summary-time">Saat {time}</span>
                </div>
                <button type="button" className="btn btn--outline" onClick={() => setConfirmed(false)}>
                  Seçimi değiştir
                </button>
              </>
            ) : (
              <>
                <p className="lead">Sana uygun bir gün ve saat seç, yeri birlikte belirleriz.</p>

                <div className="picker">
                  <label className="field">
                    <span className="field-label">Tarih</span>
                    <input
                      type="date"
                      className="field-input"
                      value={date}
                      min={todayISO()}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </label>

                  <fieldset className="times">
                    <legend className="field-label">Saat</legend>
                    <div className="times-grid">
                      {TIMES.map((t) => (
                        <label className="chip" key={t}>
                          <input
                            type="radio"
                            name="time"
                            value={t}
                            checked={time === t}
                            onChange={() => setTime(t)}
                          />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <p className="preview" aria-live="polite">
                  {date && date < todayISO()
                    ? 'Geçmiş bir tarih seçilemez.'
                    : date && time
                      ? `Seçimin: ${formatDate(date)}, ${time}`
                      : 'Henüz bir seçim yapmadın.'}
                </p>

                <div className="actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={!canConfirm}
                    onClick={() => setConfirmed(true)}
                  >
                    Seçimi onayla
                  </button>
                  <button type="button" className="btn btn--outline" onClick={() => setStage('invite')}>
                    Daveti tekrar gör
                  </button>
                </div>
              </>
            )}
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
