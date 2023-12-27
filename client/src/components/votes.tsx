import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { SOCKET } from "../webSocket";
import User from "../models/user";
import { upsertVote } from "../redux/voteSlice";

const Votes = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const { votes, revealVotes } = useAppSelector(
    (state: RootState) => state.votes
  );

  useEffect(() => {
    SOCKET.on("get_votes", (updatedVotes: User[]) => {
      console.log("updated:", updatedVotes);
      console.log("current:", votes);
      if (JSON.stringify(updatedVotes) !== JSON.stringify(votes))
        dispatch(upsertVote(updatedVotes));
    });

    SOCKET.emit("on_load", user.roomId);

    return () => {
      SOCKET.off("get_votes");
    };
  }, [dispatch, user.roomId, votes]);

  return (
    <div>
      {Array.from(votes).map((voter, index) => {
        return (
          user.username !== voter.username && (
            <div key={index}>
              <label>
                {voter.username}: {revealVotes && voter.point}
              </label>
            </div>
          )
        );
      })}
    </div>
  );
};

export default Votes;
