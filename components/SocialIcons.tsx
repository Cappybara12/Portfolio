import { Linkedin, Github, Twitter, Instagram, Youtube } from "lucide-react";

const LINKS = [
  { href: "https://www.linkedin.com/in/akshay-kumar-sharma-37aa55256/", label: "linkedin", Icon: Linkedin },
  { href: "https://github.com/akshayne912", label: "github", Icon: Github },
  { href: "https://x.com/cappybaradeploy", label: "x", Icon: Twitter },
  { href: "https://instagram.com/akshayat.it", label: "instagram", Icon: Instagram },
  { href: "https://www.youtube.com/@signoz/videos", label: "youtube", Icon: Youtube },
  { href: "https://medium.com/@akshayne912", label: "medium", Icon: MediumIcon },
];

function MediumIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <ellipse cx="6" cy="12" rx="5" ry="6" />
      <ellipse cx="16.5" cy="12" rx="2.5" ry="6" />
      <ellipse cx="21" cy="12" rx="1" ry="6" />
    </svg>
  );
}

export default function SocialIcons() {
  return (
    <ul className="flex flex-wrap gap-3">
      {LINKS.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
            className="group relative inline-flex h-12 w-12 items-center justify-center border-2 border-indigo text-indigo transition-colors hover:bg-indigo hover:text-ink"
          >
            <Icon className="h-5 w-5" />
            <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-pixel text-xs tracking-widest text-bone/0 transition-colors group-hover:text-bone/70">
              {label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
