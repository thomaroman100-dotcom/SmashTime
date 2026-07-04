"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.toggle("is-home-page", pathname === "/");

    return () => {
      document.body.classList.remove("is-home-page");
    };
  }, [pathname]);

  return null;
}
