import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 flex items-center flex-wrap gap-1">
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
