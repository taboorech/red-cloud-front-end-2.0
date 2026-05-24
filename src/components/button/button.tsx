import React from 'react';
import classNames from 'classnames';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'snow' | 'auth' | 'tab';
export type ButtonSize = 'none' | 'circle' | 'sm' | 'md' | 'lg';
export type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white border-brand-500 hover:bg-brand-600 hover:border-brand-600 active:bg-brand-700 active:border-brand-700',
  secondary: 'bg-app-soft text-app-text border-app-line hover:bg-app-soft-2 active:bg-app-soft-2',
  outline: 'bg-transparent text-app-text border-app-line hover:bg-app-soft active:bg-app-soft-2',
  ghost: 'bg-transparent text-app-text-soft border-transparent hover:bg-app-soft hover:text-app-text active:bg-app-soft-2',
  danger: 'bg-brand-500 text-white border-brand-500 hover:bg-brand-600 hover:border-brand-600 active:bg-brand-700 active:border-brand-700',
  // Inverted-contrast pill: dark in light theme, light in dark theme.
  snow: 'bg-app-text text-app-base border-app-text hover:opacity-90 active:opacity-80 shadow-sm',
  auth: 'bg-app-soft text-app-text-soft border-app-soft hover:bg-app-soft-2 hover:border-app-soft-2 active:bg-app-soft-2',
  tab: 'bg-transparent text-app-text-soft border-transparent hover:text-app-text hover:bg-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  none: '',
  circle: 'p-2',
  sm: 'px-3.5 py-2 text-sm sm:px-2.5 sm:py-1.5',
  md: 'px-5 py-2.5 text-base sm:px-4 sm:py-2',
  lg: 'px-6 py-3 text-lg sm:px-5 sm:py-2.5',
};

const roundedStyles: Record<ButtonRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      rounded = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-medium leading-none text-center whitespace-nowrap border cursor-pointer transition-all duration-200 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';
    const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
    const fullWidthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={classNames(baseStyles, variantStyles[variant], sizeStyles[size], roundedStyles[rounded], fullWidthStyles, disabledStyles, className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="absolute flex items-center justify-center" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="w-[1em] h-[1em] animate-spin">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="50"
                strokeDashoffset="10"
              />
            </svg>
          </span>
        )}
        {!loading && leftIcon && <span className="inline-flex items-center justify-center">{leftIcon}</span>}
        <span className={classNames(loading ? 'opacity-0' : '', 'w-full')}>{children}</span>
        {!loading && rightIcon && <span className="inline-flex items-center justify-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
