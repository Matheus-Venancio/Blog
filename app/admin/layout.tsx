"use client";

import { auth } from "@/api/firebase/initialConfig";
import { getAdminInfo } from "@/api/firebase/userInfo";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminInfo = await getAdminInfo(user.uid);
        if (adminInfo) {
          sessionStorage.setItem("username", adminInfo.name);
          if (pathname == "/admin") {
            router.replace("/admin/dashboard");
          }
        }
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
      } else {
        // User is signed out

        sessionStorage.clear();
        router.replace("/admin");
      }
    });
  }, []);

  return <div>{children}</div>;
}
