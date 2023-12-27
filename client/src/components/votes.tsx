import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { SOCKET } from "../sockets/socket";
import User from "../models/user";
import { upsertVote } from "../redux/voteSlice";
import Communicate from "../sockets/communicate";

const Votes = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const { votes, revealVotes } = useAppSelector(
    (state: RootState) => state.votes
  );

  useEffect(() => {
    SOCKET.on(Communicate.UPDATE_VOTES, (updatedVotes: User[]) => {
      if (JSON.stringify(updatedVotes) !== JSON.stringify(votes))
        dispatch(upsertVote(updatedVotes));
    });
    SOCKET.emit(Communicate.PAGE_LOAD, user.roomId);

    return () => {
      SOCKET.off(Communicate.UPDATE_VOTES);
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
