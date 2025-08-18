// src/admin/components/inputs/CheckInputs.jsx
import React, { useRef } from "react";
import { useCheckbox, useRadio, useRadioGroup } from "react-aria";
import { useToggleState, useRadioGroupState } from "react-stately";

/* -------------------- CheckboxInput -------------------- */
export function CheckboxInput({
  children,
  isDisabled = false,
  defaultSelected,
  onChange,
}) {
  const state = useToggleState({ defaultSelected, onChange });
  const ref = useRef(null);
  const { inputProps } = useCheckbox({ children, isDisabled }, state, ref);

  return (
    <label className={`checkbox ${isDisabled ? "disabled" : ""}`}>
      <input {...inputProps} ref={ref} className="checkboxInput" />
      <span className="checkboxBox">
        <svg className="checkboxIcon" viewBox="0 0 18 18" aria-hidden="true">
          <polyline
            points="4 9 7 12 14 5"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </span>
      <span className="checkboxLabel">{children}</span>
    </label>
  );
}

/* -------------------- RadioGroupInput -------------------- */
export function RadioGroupInput({ label, options = [], value, onChange }) {
  const state = useRadioGroupState({ value, onChange });
  const { radioGroupProps, labelProps } = useRadioGroup({ label }, state);

  return (
    <div {...radioGroupProps} className="radioGroupWrapper">
      <span {...labelProps} className="radioGroupLabel">
        {label}
      </span>
      <div className="radioOptions">
        {options.map((opt) => (
          <Radio key={opt.value} option={opt} state={state} />
        ))}
      </div>
    </div>
  );
}

/* -------------------- Single Radio -------------------- */
function Radio({ option, state }) {
  const ref = useRef(null);
  const { inputProps } = useRadio(
    { value: option.value, children: option.label },
    state,
    ref
  );

  const isSelected = state.selectedValue === option.value;

  return (
    <label className={`radio ${isSelected ? "selected" : ""}`}>
      <input {...inputProps} ref={ref} className="radioInput" />
      <span className="radioCircle" />
      <span className="radioLabel">{option.label}</span>
    </label>
  );
}
