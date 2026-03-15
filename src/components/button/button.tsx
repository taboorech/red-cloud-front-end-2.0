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
  primary: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 active:bg-blue-700 active:border-blue-700',
  secondary: 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600 hover:border-gray-600 active:bg-gray-700 active:border-gray-700',
  outline: 'bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-white hover:bg-gray-100 dark:hover:bg-white hover:text-gray-900 dark:hover:text-black active:bg-gray-200 dark:active:bg-white',
  ghost: 'bg-transparent text-gray-700 dark:text-white border-transparent hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white active:bg-gray-200 dark:active:bg-white/20',
  danger: 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 active:bg-red-700 active:border-red-700',
  snow: 'bg-white dark:bg-white text-gray-900 dark:text-black border-gray-200 dark:border-white hover:bg-gray-50 dark:hover:bg-gray-100 active:bg-gray-100 dark:active:bg-gray-200 shadow-sm',
  auth: 'bg-gray-100 dark:bg-[#262626] text-gray-700 dark:text-gray-300 border-gray-100 dark:border-[#262626] hover:bg-gray-200 dark:hover:bg-[#333333] hover:border-gray-200 dark:hover:border-[#333333] active:bg-gray-300 dark:active:bg-[#404040]',
  tab: 'bg-transparent text-gray-700 dark:text-white border-transparent hover:text-gray-500 dark:hover:text-gray-400 hover:bg-transparent',
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
    const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-medium leading-none text-center whitespace-nowrap border cursor-pointer transition-all duration-200 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';
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
