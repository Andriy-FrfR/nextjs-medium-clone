import { VariantProps, tv } from 'tailwind-variants';
import { TextareaHTMLAttributes, forwardRef } from 'react';

const textarea = tv({
  base: 'w-full rounded border border-gray-300 px-6 py-3 text-xl text-gray-600 placeholder:text-gray-400',
  variants: {
    disabled: { true: 'cursor-not-allowed bg-gray-150' },
  },
});

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textarea>;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  function Textarea(props, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        className={textarea({ ...props, className: props.className })}
      />
    );
  },
);

export default Textarea;
