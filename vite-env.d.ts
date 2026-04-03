/// <reference types="vite/client" />

// SVG imports via @svgr/rollup
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

// Image imports
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// CSS modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// react-input-mask (if missing types)
declare module 'react-input-mask' {
  import * as React from 'react';
  interface InputMaskProps extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskChar?: string | null;
    formatChars?: { [key: string]: string };
    alwaysShowMask?: boolean;
    inputRef?: React.Ref<HTMLInputElement>;
    beforeMaskedValueChange?: (
      newState: { value: string; selection: { start: number; end: number } | null },
      oldState: { value: string; selection: { start: number; end: number } | null },
      userInput: string,
      maskOptions: { mask: string; maskChar: string; alwaysShowMask: boolean; formatChars: { [key: string]: string } }
    ) => { value: string; selection: { start: number; end: number } | null };
  }
  const InputMask: React.FC<InputMaskProps>;
  export default InputMask;
}
