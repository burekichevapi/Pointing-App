export default class Communicate {
  public static get CREATE_ROOM(): string {
    return `create_room`;
  }
  public static get JOIN_ROOM(): string {
    return `join_room`;
  }
  public static get SHOW_VOTES(): string {
    return `show_votes`;
  }
  public static get SEND_VOTE(): string {
    return `send_vote`;
  }
  public static get UPDATE_VOTES(): string {
    return `update_votes`;
  }
  public static get PAGE_LOAD(): string {
    return `page_load`;
  }
  public static get USER_LEAVE_ROOM(): string {
    return `user_leave_room`;
  }
}
