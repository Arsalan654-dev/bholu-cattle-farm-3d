export default function SectionHead({ label, children, lede, flip = false }) {
  return (
    <div className={`sec-head ${flip ? 'sec-head--flip' : ''}`}>
      <span className="g-label" data-hero>
        {label}
      </span>
      <div className="sec-head__body">
        <h2 className="display" data-head>
          {children}
        </h2>
        {lede && <p className="lede">{lede}</p>}
      </div>
    </div>
  )
}
