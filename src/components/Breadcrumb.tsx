'use client';

import { useEffect } from 'react';
import Link from 'next/link';

const BASE_URL = 'https://businesseventscalendars.com';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
      })),
    };

    const existing = document.querySelector('script[data-breadcrumb="true"]');
    if (existing) {
      existing.textContent = JSON.stringify(schema);
    } else {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-breadcrumb', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.querySelector('script[data-breadcrumb="true"]');
      if (el) el.remove();
    };
  }, [items]);

  return (
    <div className="sa-breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span> &rsaquo; </span>}
          {item.href && index < items.length - 1 ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
