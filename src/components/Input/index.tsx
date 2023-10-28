import { VariantProps, tv } from 'tailwind-variants';
import { InputHTMLAttributes, forwardRef } from 'react';

const input = tv({
  base: 'rounded w-full border border-gray-300 text-gray-600 placeholder:text-gray-400',
  variants: {
    sizeVariant: {
      lg: 'h-[51px] px-6 py-3 text-xl',
      sm: 'h-[38px] px-3 py-2',
    },
    disabled: { true: 'cursor-not-allowed bg-gray-150' },
  },
  defaultVariants: { sizeVariant: 'lg' },
});

type Props = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof input>;

const Input = forwardRef<HTMLInputElement, Props>(function Input(props, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className={input({ ...props, className: props.className })}
    />
  );
});

export default Input;
