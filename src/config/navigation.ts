export type NavigationIcon = "dashboard" | "projects" | "guarantees";

export type NavigationItem = {
  href: string;
  label: string;
  icon: NavigationIcon;
};

export const navigationItems: NavigationItem[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: "dashboard",
    },
    {
        href: "/proyectos",
        label: "Proyectos",
        icon: "projects",
    },
    {
        href: "/cartas-fianza",
        label: "Cartas Fianza",
        icon: "guarantees",
    },
];

