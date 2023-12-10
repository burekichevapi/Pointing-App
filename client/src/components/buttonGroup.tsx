import { v4 as uuidV4 } from "uuid";
import "./button.css";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { setUserSelection } from "../redux/pointSlice";
import { emitPointSelection } from "../webSocket";

interface ButtonGroupProps {
  buttons: Array<number>;
}

const ButtonGroup = ({ buttons }: ButtonGroupProps) => {
  const { userSelection } = useAppSelector((state: RootState) => state.point);
  const dispatch = useAppDispatch();

  const handleButtonClick = (point: number) => {
    dispatch(setUserSelection(point));
    emitPointSelection(point);
  };

  return (
    <div>
      <h2>Point Options</h2>
      <div>
        {buttons.map((btn) => (
          <button
            key={`${uuidV4()}`}
            value={btn}
            onClick={() => handleButtonClick(btn)}
            className={btn === userSelection ? "selected" : ""}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGroup;
