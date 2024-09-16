"use client";

import React, { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CampaignIcon from "@mui/icons-material/Campaign";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { usePathname, useRouter } from "next/navigation";

export default function MobileNavigationBar() {
  const [value, setValue] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") setValue(0);
    else if (pathname === "/reports") setValue(1);
    else if (pathname === "/contact") setValue(2);
    else if (pathname === "/donation") setValue(3);
  }, [pathname]);

  return (
    <div className="fixed w-full bottom-0 z-20 border-t">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Início"
          onClick={() => router.push("/")}
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label="Denúncias"
          onClick={() => router.push("/reports")}
          icon={<CampaignIcon />}
        />
        <BottomNavigationAction
          label="Contato"
          onClick={() => router.push("/contact")}
          icon={<SupportAgentIcon />}
        />
        <BottomNavigationAction
          label="Doação"
          onClick={() => router.push("/donation")}
          icon={<VolunteerActivismIcon />}
        />
      </BottomNavigation>
    </div>
  );
}
