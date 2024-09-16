import { Input, InputProps } from "@nextui-org/react";
import React, { useState } from "react";
import { EyeSlashFilledIcon } from "./eyeSlashFilledIcon";
import { EyeFilledIcon } from "./eyeFilledIcon";

export default function PasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = useState(false);

  function toggleVisibility() {
    setIsVisible(!isVisible);
  }

  return (
    <Input
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            // @ts-ignore
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            // @ts-ignore
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
}
