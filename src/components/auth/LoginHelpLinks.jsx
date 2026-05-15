import { Icon } from "../ui/Icons.jsx";

const links = [
  { label: "Support", icon: "help", href: "#support" },
  { label: "Docs", icon: "document", href: "#docs" },
  { label: "Security", icon: "security", href: "#security" },
];

export function LoginHelpLinks() {
  return (
    <nav className="login-help" aria-label="Help links">
      {links.map((link) => (
        <a key={link.label} className="login-help__link" href={link.href}>
          <Icon name={link.icon} className="login-help__icon" />
          <span>{link.label}</span>
        </a>
      ))}
    </nav>
  );
}
