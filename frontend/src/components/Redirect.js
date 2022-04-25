import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    return navigate("/public");
  }, []);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>This Page Not Found</h1>
    </div>
  );
};

export default NotFound;
