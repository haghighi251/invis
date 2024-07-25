import ShowUserDetails from "@/modules/invis/pages/user/ShowUserDetails";
import React from "react";

export type UserViewPageProps = {
  params: { id: number }
}

const Page = ({ params }: UserViewPageProps) => {
  return <ShowUserDetails userId={params.id} />;
};

export default Page;
