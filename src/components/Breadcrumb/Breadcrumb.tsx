import { Breadcrumb, BreadcrumbItem } from "flowbite-react";
import Link from "next/link";
import { HiHome } from "react-icons/hi";

export type BreadcrumbProps = {
  name?: string;
  url?: string;
};

export function BreadcrumbComponent({ name, url }: BreadcrumbProps) {
  const hasAdditionalItem = !!name && !!url;
  return (
    <Breadcrumb aria-label="Default breadcrumb example">
      <BreadcrumbItem icon={HiHome}>
        <Link href="/">Home</Link>
      </BreadcrumbItem>
      {hasAdditionalItem && <BreadcrumbItem href={url}>{name}</BreadcrumbItem>}
    </Breadcrumb>
  );
}
