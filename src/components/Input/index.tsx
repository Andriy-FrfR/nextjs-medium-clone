import { VariantProps, tv } from 'tailwind-variants';
import { InputHTMLAttributes, forwardRef } from 'react';

const input = tv({
  base: 'rounded border border-[#00000026] text-gray-600 placeholder:text-gray-400',
  variants: {
    size: { lg: 'h-[51px] px-6 py-3 text-xl' },
    state: { loading: 'cursor-not-allowed bg-gray-150' },
  },
  defaultVariants: { size: 'lg' },
});

type Props = VariantProps<typeof input> & InputHTMLAttributes<HTMLInputElement>;

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
