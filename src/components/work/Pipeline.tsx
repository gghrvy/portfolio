export function Pipeline({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol className="pipeline" aria-label={label}>
      {steps.map((step, index) => (
        <li key={step} className="pipeline-step">
          <span className="pipeline-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="pipeline-name">{step}</span>
        </li>
      ))}
    </ol>
  )
}
