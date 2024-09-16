"use client";

import React from "react";
import { NextUIProvider } from "@nextui-org/react";

function Providers({ children }: React.PropsWithChildren) {
  return <NextUIProvider>{children}</NextUIProvider>;
}

export default Providers;
