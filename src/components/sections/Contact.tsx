import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { NodeLabel, TextLink } from '@/components/ui'
import { availability, closing, contact } from '@/content/profile'

export function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <NodeLabel index="05">Contact</NodeLabel>
        <h2 id="contact-title">{closing.heading}</h2>
        <p className="contact-body">{closing.body}</p>
        <div className="contact-cta">
          <a className="contact-email" href={`mailto:${contact.email}`}>
            <span>{contact.email}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a className="contact-phone link" href={contact.phoneHref}><span className="link-text">{contact.phone}</span></a>
          <p className="contact-direct">{closing.direct}</p>
        </div>
        <div className="contact-availability">
          <p className="status-chip"><span className="status-dot" aria-hidden="true" />{availability.status}</p>
          <p>{availability.intro}</p>
          <ul>
            {availability.items.map((item) => (
              <li key={item.title}><strong>{item.title}</strong><span>{item.detail.join(' · ')}</span></li>
            ))}
          </ul>
        </div>
        <div className="contact-profiles">
          <TextLink href={contact.github}><FaGithub aria-hidden="true" /> GitHub</TextLink>
          <TextLink href={contact.linkedin}><FaLinkedinIn aria-hidden="true" /> LinkedIn</TextLink>
          <TextLink href={contact.resume}>Resume</TextLink>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <span>© {new Date().getFullYear()} Harvy H. Monte de Ramos</span>
        <a className="link" href="#top"><span className="link-text">Back to top</span><ArrowUp size={14} aria-hidden="true" /></a>
      </div>
    </footer>
  )
}
