import React, { useEffect } from "react";
import Login from "../Users/Forms/Login";
import { getUserProfileAction } from "../../redux/slices/users/usersSlice";
import { useDispatch, useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  //get user from local storage
  //dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch]);

  const { userAuth } = useSelector((state) => state?.users);
  console.log(userAuth?.userInfo?.userFound?.isAdmin);
  const isAdmin = userAuth?.userInfo?.userFound?.isAdmin ? true : false;
  if (!isAdmin) {
    return <h1>Access Denied, Admin Only</h1>;
  }
  return <>{children}</>;
};

export default AdminRoute;
