import React from "react";
import styles from "./styles.module.css";

interface ButtonProps {
  href: string; 
  target?: string; 
  children: React.ReactNode; 
  className?: string; 
}

const Button: React.FC<ButtonProps> = ({
  href,
  target = "_blank",
  children,
  className = "",
}) => {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={`${styles.button} ${className}`}
    >
      {children}
    </a>
  );
};

export default Button;