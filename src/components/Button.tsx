import React from "react";

interface ButtonProps {
  href: string; // 링크 주소
  target?: string; // target 속성 (_blank, _self 등)
  children: React.ReactNode; // 버튼 내용
  className?: string; // 추가 스타일링을 위한 클래스
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
      className={`button ${className}`}
      style={{
        display: "inline-block",
        padding: "10px 20px",
        backgroundColor: "#0078D4",
        color: "white",
        borderRadius: "5px",
        textDecoration: "none",
        fontWeight: "bold",
      }}
    >
      {children}
    </a>
  );
};

export default Button;
