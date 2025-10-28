import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white shadow-glow hover:bg-brand-dark focus-visible:outline-brand-dark disabled:bg-brand/40 disabled:text-white/70',
  secondary:
    'bg-white text-brand shadow-sm ring-1 ring-brand/20 hover:bg-brand/10 dark:bg-slate-900 dark:text-brand-light dark:ring-brand/30',
  ghost:
    'text-brand hover:bg-brand/10 dark:text-brand-light dark:hover:bg-brand/10',
  danger:
    'bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-600 disabled:bg-red-500/60',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  fullWidth,
  ...props
}) => (
  <button
    className={clsx(
      'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      VARIANT_STYLES[variant],
      fullWidth && 'w-full',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
