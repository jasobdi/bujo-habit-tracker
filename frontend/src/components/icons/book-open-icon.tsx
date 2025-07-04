import React from "react";

export function BookOpenIcon({
    className = "w-6 h-6 text-foreground",
    ...props
}: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            {...props}
        >
            <path d="M22.922,1.7a2.985,2.985,0,0,0-2.458-.648l-6.18,1.123A3.993,3.993,0,0,0,12,3.461,3.993,3.993,0,0,0,9.716,2.172L3.536,1.049A3,3,0,0,0,0,4V20.834l12,2.183,12-2.183V4A2.992,2.992,0,0,0,22.922,1.7ZM11,20.8,2,19.166V4a1,1,0,0,1,1.179-.983L9.358,4.14A2,2,0,0,1,11,6.108Zm11-1.636L13,20.8V6.108A2,2,0,0,1,14.642,4.14l6.179-1.123A1,1,0,0,1,22,4Z"/>
        </svg>
    );
}