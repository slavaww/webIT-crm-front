import React from 'react';

const Loading = ({sizes = 54}) => {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.0"
                width={sizes + 'px'}
                height={sizes + 'px'}
                viewBox="0 0 128 128"
                xmlSpace="preserve"
            >
                    <g>
                        <path fill="#fcf7f7" d="M99.359,10.919a60.763,60.763,0,1,0,0,106.162A63.751,63.751,0,1,1,99.359,10.919Z"/>
                        <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="360ms" repeatCount="indefinite"></animateTransform>
                    </g>
                    <g>
                        <path fill="#f8eded" d="M28.641,117.081a60.763,60.763,0,1,0,0-106.162A63.751,63.751,0,1,1,28.641,117.081Z"/>
                        <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="540ms" repeatCount="indefinite"></animateTransform>
                    </g>
                    <g>
                        <path fill="#f3e1e1" d="M117.081,99.313a60.763,60.763,0,1,0-106.162,0A63.751,63.751,0,1,1,117.081,99.313Z"/>
                        <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1080ms" repeatCount="indefinite"></animateTransform>
                    </g>
            </svg>
        </>
    )
};

export default Loading;