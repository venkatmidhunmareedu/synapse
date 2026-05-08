import { IconProps } from "@renderer/lib/types";

export default function BaseIcon({ size = 24, color = 'currentColor', strokeWidth = 32, ...props }: IconProps): React.JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 400 300"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props} // Spreads extra props like className or onClick
        >
            <path d="M 80,120 C 85,160 110,210 130,170 C 140,150 145,110 165,105 C 175,100 185,250 220,260 C 250,270 270,40 310,60 C 330,70 320,180 325,250" />
        </svg>
    )
}