import type { HTMLAttributes, ReactNode } from 'react';

export type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <section className={`shared-card ${className}`.trim()} {...props}>
      {children}
    </section>
  );
}
