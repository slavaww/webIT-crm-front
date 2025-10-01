import React from 'react';

const UserSVG = ({ width = 24, height = 24, fill="none", stroke="white", type = "all" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill={fill}
            viewBox="0 0 24 24"
        >
            {type === "1" && (
                <path d="M15 19C15 16.7909 12.3137 15 9 15C5.68629 15 3 16.7909 3 19M21 10L17 14L15 12M9 12C6.79086 12 5 10.2091 5 8C5 5.79086 6.79086 4 9 4C11.2091 4 13 5.79086 13 8C13 10.2091 11.2091 12 9 12Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
            {type === "0" && (
                <path d="M15 19C15 16.7909 12.3137 15 9 15C5.68629 15 3 16.7909 3 19M17 14L19 12M19 12L21 10M19 12L17 10M19 12L21 14M9 12C6.79086 12 5 10.2091 5 8C5 5.79086 6.79086 4 9 4C11.2091 4 13 5.79086 13 8C13 10.2091 11.2091 12 9 12Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
            {type === "all" && (
                <path d="M18 19C18 16.7909 15.3137 15 12 15C8.68629 15 6 16.7909 6 19M12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
        </svg>
    );
};

export default UserSVG;
