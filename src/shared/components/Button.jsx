// src/shared/components/Button.jsx
import { useButton } from "react-aria";
import { useRef, useState } from "react";
import "./Button.css";

export default function Button({
  variant, // outline | solid (없으면 기본)
  color, // success | warning | error (없어도 가능)
  size,
  icon,
  children,
  ...props
}) {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);

  // Ripple 상태
  const [ripples, setRipples] = useState([]);

  function createRipple(e) {
    const rect = ref.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, key: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
    }, 600);
  }

  // className 조합
  const classes = ["btn"];

  if (variant) classes.push(`btn-${variant}`); // btn-outline / btn-solid
  if (color) classes.push(`color-${color}`); // color-success / color-error
  if (size) classes.push(`btn-${size}`); // btn-sm / btn-md / btn-lg

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={classes.join(" ")}
      onClick={(e) => {
        createRipple(e);
        props.onClick?.(e);
      }}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children && <span className="btn-label">{children}</span>}

      {/* Ripple Layer */}
      <span className="ripple-container">
        {ripples.map((r) => (
          <span
            key={r.key}
            className="ripple"
            style={{ top: r.y, left: r.x, width: r.size, height: r.size }}
          />
        ))}
      </span>
    </button>
  );
}
