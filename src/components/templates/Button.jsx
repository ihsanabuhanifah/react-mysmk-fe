import React from "react";
import cx from "clsx";
export default function Button({
  size = "base",
  children,
  leftIcon,
  rightIcon,
  onClick,
  block,
  disabled,
  htmlType = "button",
  loading,
  variant = "solid",
  color = "blue",
  ...props
}) {
  let rootClass = cx(
    `rounded  transition-all duration-200 ease-out focus:outline-none focus:shadow-outline`,
    {
      "opacity-50 pointer-events-none": disabled,
      //col start

      //size
      "h-8 text-sm": size === "sm",
      "h-12 text-base": size === "base",
      "h-14 text-lg": size === "lg",
      "w-full": block,

      //variant solid
      "bg-red-500 text-white": variant === "solid" && color === "red",
      "bg-lightBlue-500 text-white": variant === "solid" && color === "blue",
      "hover:bg-lightBlue-600 text-white":
        variant === "solid" && color === "blue",

      //variant light
      "bg-lightBlue-100 text-lightBlue-700":
        variant === "light" && color === "blue",

      //variant outline
      "border border-lightBlue-300 text-lightBlue-500 bg-white hover:border-2 hover:border-lightBlue-400":
        variant === "outline" && color === "blue",
      "border border-red-200 text-red-600 bg-white hover:border-2  hover:border-red-500":
        variant === "outline" && color === "red",
      "border border-gray-200 text-gray-500 bg-white  hover:text-gray-700 hover:border-gray-500":
        variant === "outline" && color === "gray",

      //link
      "text-lightBlue-500 bg-white": variant === "link" && color === "blue",
      // "text-red-600 bg-white": variant == "link" && color == "red",
      "text-gray-500 bg-white": variant === "link" && color === "gray",
      "bg-red-600 bg-white": variant === "link" && color === "red",
    }
  );
  let insideClass = cx({
    "flex items-center justify-center px-3 space-x-5": variant !== "link",
    "flex items-center justify-center": variant === "link",
  });
  return (
    <button
      type={htmlType}
      disabled={disabled}
      className={rootClass}
      onClick={onClick}
      {...props}
    >
      <div className={insideClass}>
        {loading ? "Loading" : null}
        {leftIcon && !loading ? (
          <div className="w-4 h-4">{leftIcon}</div>
        ) : null}
        <div>{children}</div>
        {rightIcon && !loading ? (
          <div className="ml-2 w-4 h-4">{rightIcon}</div>
        ) : null}
      </div>
    </button>
  );
}
