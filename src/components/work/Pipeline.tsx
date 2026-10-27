export function Pipeline({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol className="pipeline" aria-label={label} data-observe style={{ '--n': steps.length } as React.CSSProperties}>
      {steps.map((step, index) => (
        <li key={step} className="pipeline-step" style={{ '--i': index } as React.CSSProperties}>
          <span className="pipeline-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="pipeline-name">{step}</span>
        </li>
      ))}
      <li className="pipeline-lane" aria-hidden="true"><span className="pipeline-runner" /></li>
    </ol>
  )
}
