"use client";

import * as React from "react";
import Link from "next/link";

import { CircleAlertIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../../../components/ui/navigation-menu";
import { useRouter } from "next/navigation";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Wedding Invitations",
    href: "/invites/wedding",
    description: "Elegant wedding invitation designs with RSVP, countdown, gallery, and venue details in one shareable link.",
  },
  {
    title: "Birthday Invitations",
    href: "/invites/birthday",
    description: "Fun birthday invite templates with themes, event details, and quick sharing for friends and family.",
  },
  {
    title: "Engagement Invitations",
    href: "/invites/engagement",
    description: "Modern engagement invites with couple details, photos, event location, and a personalized invite page.",
  },
  {
    title: "Baby Shower Invitations",
    href: "/invites/baby-shower",
    description: "Cute baby shower invites with schedule, venue map, and a digital guest message wall.",
  },
  {
    title: "Reception Invitations",
    href: "/invites/reception",
    description: "Reception invite templates with venue, timing, and guest confirmation—built for mobile-first sharing.",
  },
  {
    title: "Corporate Event Invitations",
    href: "/invites/corporate",
    description: "Professional corporate invites for launches and meetings with branding, RSVP tracking, and secure access.",
  },
];
export function NavMenu() {
  const router = useRouter();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger className="cursor-pointer bg-transparent">Store</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="cursor-pointer bg-transparent" onClick={() => router.push("/about-us")}>
            About
          </NavigationMenuTrigger>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="cursor-pointer bg-transparent" onClick={() => router.push("/contact-us")}>
            Contact
          </NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
