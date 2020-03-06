import React from 'react';

interface ArrowProps {
  className?: string;
}

const Arrow: React.FC<ArrowProps> = ({ className }) => {
  return (<svg width="20" height="20" viewBox="0 0 20 20" className={ className }>
    <path d="M14.586 9.007l-3.293-3.293L12.707 4.3l5.707 5.707-5.707 5.707-1.414-1.414 3.293-3.293H2v-2h12.586z"/>
  </svg>);
};

export default Arrow;
