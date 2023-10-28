import { ButtonHTMLAttributes, FC } from 'react';
import { VariantProps, tv } from 'tailwind-variants';

const button = tv({
  base: 'flex items-center justify-center rounded',
  variants: {
    variant: {
      primary: 'bg-green-550 text-white',
      danger: 'border border-red-700 text-red-700',
    },
    size: { lg: 'px-6 py-3 text-xl', sm: 'px-4 py-2' },
    disabled: {
      true: 'cursor-not-allowed opacity-60',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      disabled: false,
      className: 'hover:bg-green-600 active:bg-green-700',
    },
    {
      variant: 'danger',
      disabled: false,
      className:
        'hover:bg-red-700 hover:text-white active:border-red-900 active:bg-red-900 active:text-white',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'lg',
    disabled: false,
  },
});

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variantProps: VariantProps<typeof button>;
};

const Button: FC<Props> = (props) => {
  const { variantProps, ...rest } = props;

  return (
    <button
      {...rest}
      className={button({ ...variantProps, className: props.className })}
    >
      {props.children}
    </button>
  );
};

export default Button;
