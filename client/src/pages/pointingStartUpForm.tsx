const PointingStartUpForm = () => {
  return (
    <div>
      <label>
        Username:
        <input type="text" required />
      </label>
      <label>
        Room:
        <input type="text" required />
      </label>
      <label>
        Join as Observer
        <input type="checkbox" />
      </label>
      <div>
        <button type="submit">Join Room</button>
        <button type="submit">Create Room</button>
      </div>
    </div>
  );
};

export default PointingStartUpForm;
