import React from "react";
import { useUserDetails } from "../../hooks/useUserDetails";

const ShowUserDetails = () => {
  const { userDetailsIsLoading, userDetailsIsError, error, user } =
    useUserDetails(1);
  return <div>ShowUserDetails</div>;
};

export default ShowUserDetails;
