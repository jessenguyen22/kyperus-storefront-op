import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const variantClasses = {
  primary: 'bg-[#333333] border border-[#444444]',
  secondary: 'bg-transparent border border-[#333333]',
  accent: 'bg-[#333333] border border-[#444444]',
};

const clipPath = 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      isLoading = false,
      disabled = false,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    const baseClasses = `
      relative
      font-medium
      text-white
      outline-none
      focus-visible:ring-2
      focus-visible:ring-offset-2
      focus-visible:ring-white
      focus-visible:ring-offset-transparent
      overflow-hidden
      transition-colors
      duration-300
      hover-slide-bg
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${className}
    `;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={baseClasses}
        style={{ clipPath }}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading && (
            <div className="animate-spin">
              <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
            </div>
          )}
          {children}
        </span>

        {isDisabled && !isLoading && (
          <div className="absolute inset-0 bg-black/50 z-20" />
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';