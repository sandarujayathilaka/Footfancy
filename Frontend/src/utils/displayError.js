import Swal from "sweetalert2";
import { resetSucAction } from "../redux/slices/globalAction/globalAction";
import { useDispatch } from "react-redux";
export const displayError = (icon, message) => {
  const dispatch = useDispatch();
  return Swal.fire({
    icon,
    title: "Oops...",
    text: message,
  });
   dispatch(resetSucAction());
};
