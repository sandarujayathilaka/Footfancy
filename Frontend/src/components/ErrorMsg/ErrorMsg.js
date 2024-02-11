import Swal from "sweetalert2";
import { resetErrAction } from "../../redux/slices/globalAction/globalAction";
import { useDispatch } from "react-redux";
const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
  dispatch(resetErrAction());
};

export default ErrorMsg;
