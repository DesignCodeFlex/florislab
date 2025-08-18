// src/admin/components/inputs/TextInputs.jsx
import React, { useRef } from "react";
import { useTextField } from "react-aria";

/* -------------------- TextInput -------------------- */
export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  errorMessage = null,
  rightElement = null,
}) {
  const ref = useRef(null);
  const { labelProps, inputProps } = useTextField(
    {
      label,
      value,
      onChange,
      placeholder,
      type,
      isDisabled: disabled,
    },
    ref
  );

  return (
    <div className={`inputWrapper ${errorMessage ? "has-error" : ""}`}>
      <div className="inputLabelRow">
        <label {...labelProps} className="inputLabel">
          {label}
        </label>
        {errorMessage && <span className="inputError">{errorMessage}</span>}
      </div>

      <div className="inputFieldWrapper">
        <input {...inputProps} ref={ref} className="inputField" />
        {rightElement && (
          <div className="inputRightElement">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

/* -------------------- TextareaInput -------------------- */
export function TextareaInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  errorMessage = "",
}) {
  const ref = useRef(null);
  const { labelProps, inputProps } = useTextField(
    {
      label,
      value,
      onChange,
      placeholder,
      isDisabled: disabled,
      inputElementType: "textarea",
    },
    ref
  );

  return (
    <div className={`inputWrapper ${errorMessage ? "has-error" : ""}`}>
      <div className="inputLabelRow">
        <label {...labelProps} className="inputLabel">
          {label}
        </label>
        {errorMessage && <span className="inputError">{errorMessage}</span>}
      </div>

      <div className="inputFieldWrapper textareaWrapper">
        <textarea {...inputProps} ref={ref} className="inputField textarea" />
      </div>
    </div>
  );
}
