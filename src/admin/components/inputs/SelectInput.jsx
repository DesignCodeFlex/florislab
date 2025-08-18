// src/admin/components/inputs/SelectInput.jsx
import React, { useRef } from "react";
import {
  HiddenSelect,
  useSelect,
  useButton,
  mergeProps,
  useFocusRing,
  useListBox,
  useOption,
} from "react-aria";
import { useSelectState, Item } from "react-stately";
import Button from "@shared/components/Button";
import { ChevronDown } from "lucide-react";

export function SelectInput({
  label,
  value,
  onChange,
  options = [],
  placeholder = "선택하세요",
  disabled = false,
}) {
  const state = useSelectState({
    selectedKey: value,
    onSelectionChange: onChange,
    placeholder,
    children: options.map((opt) => <Item key={opt.value}>{opt.label}</Item>),
  });

  const triggerRef = useRef(null);
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    { label, placeholder, isDisabled: disabled },
    state,
    triggerRef
  );
  const { buttonProps } = useButton(triggerProps, triggerRef);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <div className="inputWrapper">
      {/* 라벨 */}
      <div className="inputLabelRow">
        <label {...labelProps} className="inputLabel">
          {label}
        </label>
      </div>

      {/* 트리거 */}
      <HiddenSelect
        state={state}
        triggerRef={triggerRef}
        label={label}
        name={label}
      />
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={triggerRef}
        className={`inputField selectTrigger ${
          isFocusVisible ? "focus-visible" : ""
        }`}
      >
        <span {...valueProps}>
          {state.selectedItem ? state.selectedItem.rendered : placeholder}
        </span>

        {/* 아이콘을 span으로, 버튼처럼 보이게 */}
        <span className="selectIconButton">
          <ChevronDown size={20} />
        </span>
      </button>

      {/* 옵션 메뉴 */}
      {state.isOpen && <ListBox state={state} menuProps={menuProps} />}
    </div>
  );
}

/* -------------------- ListBox -------------------- */
function ListBox({ state, menuProps }) {
  const ref = useRef();
  const { listBoxProps } = useListBox(menuProps, state, ref);
  return (
    <ul {...listBoxProps} ref={ref} className="selectMenu">
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

/* -------------------- Option -------------------- */
function Option({ item, state }) {
  const ref = useRef();
  const { optionProps, isSelected, isFocused } = useOption(
    { key: item.key },
    state,
    ref
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={`selectOption ${isSelected ? "selected" : ""} ${
        isFocused ? "focused" : ""
      }`}
    >
      {item.rendered}
    </li>
  );
}
