import { Breadcrumb, BreadcrumbItem } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export type BreadcrumbProps = {
  name?: string;
  url?: string;
};

export function BreadcrumbComponent({ name, url }: BreadcrumbProps) {
  const hasAdditionalItem = !!name && !!url;
  return (
    <Breadcrumb aria-label="Default breadcrumb example">
      <BreadcrumbItem href="/" icon={HiHome}>
        Home
      </BreadcrumbItem>
      {hasAdditionalItem && <BreadcrumbItem href={url}>{name}</BreadcrumbItem>}
    </Breadcrumb>
  );
}
