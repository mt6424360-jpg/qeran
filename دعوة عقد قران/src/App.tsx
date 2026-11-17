import { useEffect, useRef, useState } from "react"

const EVENT_DATE = new Date("2026-12-03T13:00:00")
const ENVELOPE_OPEN_DURATION_MS = 300
const VENUE_URL = "https://maps.app.goo.gl/yPZNn4bD51WAQkix7"

type IconName = "calendar" | "clock" | "location" | "arrow"

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M16 3v4M8 3v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    arrow: <path d="m8 5 7 7-7 7" />,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Countdown() {
  const getRemaining = () => Math.max(0, EVENT_DATE.getTime() - Date.now())
  const [remaining, setRemaining] = useState(getRemaining)

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const seconds = Math.floor(remaining / 1000)
  const items = [
    { value: Math.floor(seconds / 86400), label: "يوم" },
    { value: Math.floor((seconds % 86400) / 3600), label: "ساعة" },
    { value: Math.floor((seconds % 3600) / 60), label: "دقيقة" },
    { value: seconds % 60, label: "ثانية" },
  ]

  return (
    <div className="countdown" aria-label="الوقت المتبقي للمناسبة">
      {items.map((item, index) => (
        <div className="countdown-item" key={item.label}>
          <strong>{String(item.value).padStart(2, "0")}</strong>
          <span>{item.label}</span>
          {index < items.length - 1 && <i aria-hidden="true">:</i>}
        </div>
      ))}
    </div>
  )
}

function HeroEnvelope({
  opened,
  onOpen,
}: {
  opened: boolean
  onOpen: () => void
}) {
  return (
    <div className={`hero-envelope-scene ${opened ? "is-open" : ""}`}>
      <button
        className="green-envelope"
        type="button"
        onClick={onOpen}
        aria-label="اضغط على الظرف لرؤية الدعوة"
        disabled={opened}
      >
        <img
          className="envelope-closed"
          src={`${import.meta.env.BASE_URL}assets/green-envelope.png`}
          alt=""
        />
        <img
          className="envelope-open"
          src={`${import.meta.env.BASE_URL}assets/z-envelope-cutout.webp`}
          alt=""
        />
        <span className="envelope-prompt">
          <b>اضغط على الظرف</b>
          <small>لرؤية الدعوة</small>
        </span>
      </button>
    </div>
  )
}

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false)
  const [invitationRevealed, setInvitationRevealed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const revealTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current)
      }
    }
  }, [])

 const openEnvelope = () => {
  if (envelopeOpened) return

  setEnvelopeOpened(true)

  // تشغيل الأغنية عند فتح الظرف
  audioRef.current?.play().catch((error) => {
    console.log("Music playback error:", error)
  })

  // تشغيل الفيديو
  videoRef.current?.play().catch(() => undefined)

  revealTimerRef.current = window.setTimeout(
    () => setInvitationRevealed(true),
    ENVELOPE_OPEN_DURATION_MS,
  )
}

  return (
    <main dir="rtl" className={invitationRevealed ? "invitation-opened" : ""}>
       <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}m.mp3.mpeg`}
        loop
        preload="auto"
        playsInline
       />
      <section className="hero" aria-label="دعوة أفراح عائلة العلواني">
        <video
          ref={videoRef}
          className="hero-video"
          src={`${import.meta.env.BASE_URL}assets/invitation-background.mp4`}
          playsInline
          muted
          autoPlay
          loop
          preload="metadata"
          poster={`${import.meta.env.BASE_URL}assets/video-poster.jpg`}
        />
        <div className="hero-shade" />

        <div
          className="family-heading"
          style={{ animationDuration: ".45s", animationDelay: ".05s" }}
        >
          <span>أفراح</span>
          <h1>عائلة بن سليمان</h1>
          <i />
        </div>

        <HeroEnvelope opened={envelopeOpened} onOpen={openEnvelope} />

        <div className="incense-smoke" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        {invitationRevealed && (
          <button
            className="scroll-hint"
            type="button"
            style={{ animationDelay: ".1s" }}
            onClick={() =>
              document
                .querySelector("#invitation-card")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>مرّر لرؤية الدعوة</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}
      </section>

      {invitationRevealed && (
        <section className="content-section" id="invitation-card">
          <p
            className="quran-verse"
            lang="ar"
            dir="rtl"
            style={{
              maxWidth: 520,
              margin: "0 auto 30px",
              color: "#665638",
              fontFamily: "'Aref Ruqaa', serif",
              fontSize: "clamp(16px, 4vw, 22px)",
              lineHeight: 2,
              textAlign: "center",
            }}
          >
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا
            لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ
            إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
          </p>

          <article className="invitation-card">
            <img
              src={`${import.meta.env.BASE_URL}assets/ornate-frame-cutout.png`}
              alt=""
              aria-hidden="true"
            />
            <div className="card-copy">
              <div className="your-text">
                <span className="second-line">بسم الله الرحمن الرحيم</span>
                <p className="honor">
                  بكل ود، تتشرف عائلة الحاج
                  <br />
                  <strong>مصطفى سليمان</strong>
                  <br />
                  بدعوتكم لحضور مأدبة غداء وعقد قِران
                </p>
              </div>

              <p className="groom-label">نجلها</p>
              <h3>السلطان أيمن</h3>
              <p className="closing">بحضوركم تكتمل فرحتنا</p>
            </div>
          </article>

          <p className="event-intro">تفاصيل المناسبة</p>

          <div className="details-grid">
            <div className="detail-card">
              <span className="icon-disc">
                <Icon name="calendar" />
              </span>
              <div>
                <small>التاريخ</small>
                <strong>الخميس، 3 / 12 / 2026</strong>
              </div>
            </div>

            <div className="detail-card">
              <span className="icon-disc">
                <Icon name="clock" />
              </span>
              <div>
                <small>الوقت</small>
                <strong>الساعة 1:00 ظهراً</strong>
              </div>
            </div>

            <a
              className="detail-card location-card"
              href={VENUE_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span className="icon-disc">
                <Icon name="location" />
              </span>
              <div>
                <small>المكان: صالة قصر مارينا (قاعة فيولا)</small>
                <strong>اضغط لرؤية موقع الصالة</strong>
              </div>
              <span className="location-arrow">
                <Icon name="arrow" />
              </span>
            </a>
          </div>

          <div className="countdown-heading">
            <span>باقي على فرحتنا</span>
          </div>
          <Countdown />

          <footer>
            <span>ننتظر حضوركم بكل محبة</span>
            <b>عائلة بن سليمان</b>
          </footer>
        </section>
      )}
    </main>
  )
}
