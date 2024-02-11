import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetSucAction } from "../../redux/slices/globalAction/globalAction";

const SuccessMsg = ({ message }) => {
  const dispatch = useDispatch();
  Swal.fire({
    icon: "success",
    title: "Good job!",
    text: message,
  });
  dispatch(resetSucAction());
};

export default SuccessMsg;
