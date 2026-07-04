"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.toggle("is-home-page", pathname === "/");
    document.body.classList.toggle("is-admin-page", pathname.startsWith("/admin"));

    return () => {
      document.body.classList.remove("is-home-page");
      document.body.classList.remove("is-admin-page");
    };
  }, [pathname]);

  return null;
}
