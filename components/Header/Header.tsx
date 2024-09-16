"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useWindowSize from "@/helpers/useWindowSize";
import MobileNavigationBar from "../mobileNavigationBar/MobileNavigationBar";
import Image from "next/image";
import styles from "./Header.module.css";

function getClassName(currentPathname: string, pathname: string) {
  if (currentPathname === "/" || currentPathname === "/donation")
    return "text-white hover:text-gray-400";
  if (currentPathname === pathname) return "text-black";
  return "text-blue-700 hover:text-blue-900";
}

function getLogoColor(currentPathname: string) {
  if (currentPathname === "/" || currentPathname === "/donation") {
    return "/logo_mbl_white.png";
  }
  return "/logo_mbl_blue.png";
}

const Header: React.FC = () => {
  const pathname = usePathname();
  const windowSize = useWindowSize();

  if (windowSize.width && windowSize.width <= 600) {
    return <MobileNavigationBar />;
  }

  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src={getLogoColor(pathname)}
          alt="mbl campinas"
          width={150}
          height={60}
        />
        {/* <h1 className={`${styles.logo} ${getClassName(pathname, "/")}`}>
          MBL Campinas
        </h1> */}
      </Link>
      <nav className={styles.navigation}>
        <ul>
          <li className="text-gr">
            <Link href="/" className={getClassName(pathname, "/")}>
              Início
            </Link>
          </li>
          <li className={getClassName(pathname, "/reports")}>
            <Link href="/reports">Denúncias</Link>
          </li>
          <li className={getClassName(pathname, "/contact")}>
            <Link href="/contact">Contato</Link>
          </li>
          <li className={getClassName(pathname, "/donation")}>
            <Link href="/donation">Doação</Link>
          </li>
          <li className={getClassName(pathname, "/about")}>
            <Link
              href="/about"
              className={pathname === "/about" ? styles.active : ""}
            >
              Sobre
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
