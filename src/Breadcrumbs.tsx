import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

const SITE_URL = 'https://korixllc.com';

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  // The last crumb (current page) omits "item" per Google's guidance — its
  // URL is the page itself and isn't required in a BreadcrumbList.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: `${SITE_URL}${item.to}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 flex items-center flex-wrap gap-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-navy-900 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-navy-900 font-medium truncate max-w-[240px]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};
