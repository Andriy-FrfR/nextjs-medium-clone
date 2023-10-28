import { VariantProps, tv } from 'tailwind-variants';
import { TextareaHTMLAttributes, forwardRef } from 'react';

const textarea = tv({
  base: 'w-full rounded border border-gray-300 px-6 py-3 text-xl text-gray-600 placeholder:text-gray-400',
  variants: {
    disabled: { true: 'cursor-not-allowed bg-gray-150' },
  },
});

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variantProps: VariantProps<typeof textarea>;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  function Textarea(props, ref) {
    const { variantProps, ...rest } = props;

    return (
      <textarea
        {...rest}
        ref={ref}
        className={textarea({ ...variantProps, className: props.className })}
      />
    );
  },
);

export default Textarea;
