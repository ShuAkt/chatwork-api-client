import axios from "axios";

export default class ChatworkApi {
  constructor(private api_token: string) {}

  /**
   * 自分自身の情報を取得
   */
  async getMe(getMeParam: GetMeParam = {}) {
    const { data } = await axios.get(`https://api.chatwork.com/v2/me`, {
      params: getMeParam,
      headers: { "X-ChatWorkToken": this.api_token }
    });

    return data;
  }

  /**
   * 自分の未読数、未読To数、未完了タスク数を返す
   */
  async getMyStatus(getMyStatusParam: GetMyStatusParam = {}) {
    const { data } = await axios.get(`https://api.chatwork.com/v2/my/status`, {
      params: getMyStatusParam,
      headers: { "X-ChatWorkToken": this.api_token }
    });

    return data as GetMyStatusResponse;
  }

  /**
   * 自分のタスク一覧を取得する。(※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
   */
  async getMyTasks(getMyTasksParam: GetMyTasksParam) {
    const { data } = await axios.get(`https://api.chatwork.com/v2/my/tasks`, {
      params: getMyTasksParam,
      headers: { "X-ChatWorkToken": this.api_token }
    });

    return data;
  }

  /**
   * 自分のコンタクト一覧を取得
   */
  async getContacts(getContactsParam: GetContactsParam = {}) {
    const { data } = await axios.get(`https://api.chatwork.com/v2/contacts`, {
      params: getContactsParam,
      headers: { "X-ChatWorkToken": this.api_token }
    });

    return data;
  }

  /**
   * チャットのメンバー一覧を取得
   */
  async getRoomsMembers(
    room_id: string,
    getRoomsMembersParam: GetRoomsMembersParam = {}
  ) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/rooms/${room_id}/members`,
      {
        params: getRoomsMembersParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * チャットのメンバーを一括変更
   */
  async putRoomsMembers(
    room_id: string,
    putRoomsMembersParam: PutRoomsMembersParam = {}
  ) {
    const params = new URLSearchParams();
    Object.entries(putRoomsMembersParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.put(
      `https://api.chatwork.com/v2/rooms/${room_id}/members`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PutRoomsMembersResponse;
  }

  /**
   * メッセージを既読にする
   */
  async putRoomsMessagesRead(
    room_id: string,
    putRoomsMessagesReadParam: PutRoomsMessagesReadParam
  ) {
    const params = new URLSearchParams();
    Object.entries(putRoomsMessagesReadParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.put(
      `https://api.chatwork.com/v2/rooms/${room_id}/messages/read`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PutRoomsMessagesReadResponse;
  }

  /**
   * メッセージを未読にする
   */
  async putRoomsMessagesUnread(
    room_id: string,
    putRoomsMessagesUnreadParam: PutRoomsMessagesUnreadParam
  ) {
    const params = new URLSearchParams();
    Object.entries(putRoomsMessagesUnreadParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.put(
      `https://api.chatwork.com/v2/rooms/${room_id}/messages/unread`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PutRoomsMessagesUnreadResponse;
  }

  /**
   * メッセージ情報を取得
   */
  async getRoomsMessagesInfo(
    room_id: string,
    message_id: string,
    getRoomsMessagesInfoParam: GetRoomsMessagesInfoParam = {}
  ) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/rooms/${room_id}/messages/${message_id}`,
      {
        params: getRoomsMessagesInfoParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * チャットのメッセージを更新する。
   */
  async putRoomsMessagesInfo(
    room_id: string,
    message_id: string,
    putRoomsMessagesInfoParam: PutRoomsMessagesInfoParam
  ) {
    const params = new URLSearchParams();
    Object.entries(putRoomsMessagesInfoParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.put(
      `https://api.chatwork.com/v2/rooms/${room_id}/messages/${message_id}`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PutRoomsMessagesInfoResponse;
  }

  /**
   * メッセージを削除
   */
  async deleteRoomsMessagesInfo(
    room_id: string,
    message_id: string,
    deleteRoomsMessagesInfoParam: DeleteRoomsMessagesInfoParam = {}
  ) {
    const { data } = await axios.delete(
      `https://api.chatwork.com/v2/rooms/${room_id}/messages/${message_id}`,
      {
        params: deleteRoomsMessagesInfoParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data as DeleteRoomsMessagesInfoResponse;
  }

  /**
   * チャットのメッセージ一覧を取得。パラメータ未指定だと前回取得分からの差分のみを返します。(最大100件まで取得)
   */
  async getRoomsMessages(
    room_id: string,
    getRoomsMessagesParam: GetRoomsMessagesParam
  ) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/rooms/${room_id}/messages`,
      {
        params: getRoomsMessagesParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * チャットに新しいメッセージを追加
   */
  async postRoomsMessages(
    room_id: string,
    postRoomsMessagesParam: PostRoomsMessagesParam
  ) {
    const params = new URLSearchParams();
    Object.entries(postRoomsMessagesParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.post(
      `https://api.chatwork.com/v2/rooms/${room_id}/messages`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PostRoomsMessagesResponse;
  }

  /**
   * タスク完了状態を変更する
   */
  async putRoomsTasksStatus(
    room_id: string,
    task_id: string,
    putRoomsTasksStatusParam: PutRoomsTasksStatusParam
  ) {
    const params = new URLSearchParams();
    Object.entries(putRoomsTasksStatusParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.put(
      `https://api.chatwork.com/v2/rooms/${room_id}/tasks/${task_id}/status`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PutRoomsTasksStatusResponse;
  }

  /**
   * タスク情報を取得
   */
  async getRoomsTasksInfo(
    room_id: string,
    task_id: string,
    getRoomsTasksInfoParam: GetRoomsTasksInfoParam = {}
  ) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/rooms/${room_id}/tasks/${task_id}`,
      {
        params: getRoomsTasksInfoParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * チャットのタスク一覧を取得 (※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
   */
  async getRoomsTasks(room_id: string, getRoomsTasksParam: GetRoomsTasksParam) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/rooms/${room_id}/tasks`,
      {
        params: getRoomsTasksParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * チャットに新しいタスクを追加
   */
  async postRoomsTasks(
    room_id: string,
    postRoomsTasksParam: PostRoomsTasksParam
  ) {
    const params = new URLSearchParams();
    Object.entries(postRoomsTasksParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.post(
      `https://api.chatwork.com/v2/rooms/${room_id}/tasks`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PostRoomsTasksResponse;
  }

  /**
   * ファイル情報を取得
   */
  async getRoomsFilesInfo(
    room_id: string,
    file_id: string,
    getRoomsFilesInfoParam: GetRoomsFilesInfoParam
  ) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/rooms/${room_id}/files/${file_id}`,
      {
        params: getRoomsFilesInfoParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * チャットのファイル一覧を取得 (※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
   */
  async getRoomsFiles(room_id: string, getRoomsFilesParam: GetRoomsFilesParam) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/rooms/${room_id}/files`,
      {
        params: getRoomsFilesParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * チャットに新しいファイルをアップロード
   */
  async postRoomsFiles(
    room_id: string,
    postRoomsFilesParam: PostRoomsFilesParam = {}
  ) {
    const params = new URLSearchParams();
    Object.entries(postRoomsFilesParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.post(
      `https://api.chatwork.com/v2/rooms/${room_id}/files`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PostRoomsFilesResponse;
  }

  /**
   * 招待リンクを取得する
   */
  async getRoomsLink(
    room_id: string,
    getRoomsLinkParam: GetRoomsLinkParam = {}
  ) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/rooms/${room_id}/link`,
      {
        params: getRoomsLinkParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * 招待リンクを作成する
   */
  async postRoomsLink(room_id: string, postRoomsLinkParam: PostRoomsLinkParam) {
    const params = new URLSearchParams();
    Object.entries(postRoomsLinkParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.post(
      `https://api.chatwork.com/v2/rooms/${room_id}/link`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PostRoomsLinkResponse;
  }

  /**
   * 招待リンクの情報を変更する
   */
  async putRoomsLink(room_id: string, putRoomsLinkParam: PutRoomsLinkParam) {
    const params = new URLSearchParams();
    Object.entries(putRoomsLinkParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.put(
      `https://api.chatwork.com/v2/rooms/${room_id}/link`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PutRoomsLinkResponse;
  }

  /**
   * 招待リンクを削除する
   */
  async deleteRoomsLink(
    room_id: string,
    deleteRoomsLinkParam: DeleteRoomsLinkParam = {}
  ) {
    const { data } = await axios.delete(
      `https://api.chatwork.com/v2/rooms/${room_id}/link`,
      {
        params: deleteRoomsLinkParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data as DeleteRoomsLinkResponse;
  }

  /**
   * チャットの名前、アイコン、種類(my/direct/group)を取得
   */
  async getRoomsInfo(
    room_id: string,
    getRoomsInfoParam: GetRoomsInfoParam = {}
  ) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/rooms/${room_id}`,
      {
        params: getRoomsInfoParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * チャットの名前、アイコンをアップデート
   */
  async putRoomsInfo(room_id: string, putRoomsInfoParam: PutRoomsInfoParam) {
    const params = new URLSearchParams();
    Object.entries(putRoomsInfoParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.put(
      `https://api.chatwork.com/v2/rooms/${room_id}`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PutRoomsInfoResponse;
  }

  /**
   * グループチャットを退席/削除する
   */
  async deleteRoomsInfo(
    room_id: string,
    deleteRoomsInfoParam: DeleteRoomsInfoParam
  ) {
    const { data } = await axios.delete(
      `https://api.chatwork.com/v2/rooms/${room_id}`,
      {
        params: deleteRoomsInfoParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * 自分のチャット一覧の取得
   */
  async getRooms(getRoomsParam: GetRoomsParam = {}) {
    const { data } = await axios.get(`https://api.chatwork.com/v2/rooms`, {
      params: getRoomsParam,
      headers: { "X-ChatWorkToken": this.api_token }
    });

    return data;
  }

  /**
   * グループチャットを新規作成
   */
  async postRooms(postRoomsParam: PostRoomsParam) {
    const params = new URLSearchParams();
    Object.entries(postRoomsParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.post(
      `https://api.chatwork.com/v2/rooms`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data as PostRoomsResponse;
  }

  /**
   * 自分に対するコンタクト承認依頼を承認する
   */
  async putIncomingRequestsInfo(
    request_id: string,
    putIncomingRequestsInfoParam: PutIncomingRequestsInfoParam = {}
  ) {
    const params = new URLSearchParams();
    Object.entries(putIncomingRequestsInfoParam).forEach(([key, value]) =>
      params.set(key, value)
    );
    const { data } = await axios.put(
      `https://api.chatwork.com/v2/incoming_requests/${request_id}`,
      params,
      { headers: { "X-ChatWorkToken": this.api_token } }
    );

    return data;
  }

  /**
   * 自分に対するコンタクト承認依頼をキャンセルする
   */
  async deleteIncomingRequestsInfo(
    request_id: string,
    deleteIncomingRequestsInfoParam: DeleteIncomingRequestsInfoParam = {}
  ) {
    const { data } = await axios.delete(
      `https://api.chatwork.com/v2/incoming_requests/${request_id}`,
      {
        params: deleteIncomingRequestsInfoParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }

  /**
   * 自分に対するコンタクト承認依頼一覧を取得する(※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
   */
  async getIncomingRequests(
    getIncomingRequestsParam: GetIncomingRequestsParam = {}
  ) {
    const { data } = await axios.get(
      `https://api.chatwork.com/v2/incoming_requests`,
      {
        params: getIncomingRequestsParam,
        headers: { "X-ChatWorkToken": this.api_token }
      }
    );

    return data;
  }
}

/**
 * 自分自身の情報を取得
 */
export interface GetMeParam {}

/**
 * 自分の未読数、未読To数、未完了タスク数を返す
 */
export interface GetMyStatusParam {}

/**
 * 自分のタスク一覧を取得する。(※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
 */
export interface GetMyTasksParam {
  /** タスクの依頼者のアカウントID */
  assigned_by_account_id?: number;

  /** タスクのステータス */
  status?: "open" | "done";
}

/**
 * 自分のコンタクト一覧を取得
 */
export interface GetContactsParam {}

/**
 * チャットのメンバー一覧を取得
 */
export interface GetRoomsMembersParam {}

/**
 * チャットのメンバーを一括変更
 */
export interface PutRoomsMembersParam {}

/**
 * メッセージを既読にする
 */
export interface PutRoomsMessagesReadParam {
  /** ここで指定するIDのメッセージまでを既読にする。すでに既読済みの場合はエラー(400) */
  message_id?: string;
}

/**
 * メッセージを未読にする
 */
export interface PutRoomsMessagesUnreadParam {
  /** ここで指定するIDのメッセージ以降を未読にする */
  message_id: string;
}

/**
 * メッセージ情報を取得
 */
export interface GetRoomsMessagesInfoParam {}

/**
 * チャットのメッセージを更新する。
 */
export interface PutRoomsMessagesInfoParam {
  /** 更新するメッセージ本文 */
  body: string;
}

/**
 * メッセージを削除
 */
export interface DeleteRoomsMessagesInfoParam {}

/**
 * チャットのメッセージ一覧を取得。パラメータ未指定だと前回取得分からの差分のみを返します。(最大100件まで取得)
 */
export interface GetRoomsMessagesParam {
  /** 未取得にかかわらず最新の100件を取得するか */
  force?: 0 | 1;
}

/**
 * チャットに新しいメッセージを追加
 */
export interface PostRoomsMessagesParam {
  /** メッセージ本文 */
  body: string;

  /** 追加したメッセージを自分から見て未読とするか */
  self_unread?: 0 | 1;
}

/**
 * タスク完了状態を変更する
 */
export interface PutRoomsTasksStatusParam {
  /** タスク完了状態 */
  body: "open" | "done";
}

/**
 * タスク情報を取得
 */
export interface GetRoomsTasksInfoParam {}

/**
 * チャットのタスク一覧を取得 (※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
 */
export interface GetRoomsTasksParam {
  /** タスクの担当者のアカウントID */
  account_id?: number;

  /** タスクの依頼者のアカウントID */
  assigned_by_account_id?: number;

  /** タスクのステータス */
  status?: "open" | "done";
}

/**
 * チャットに新しいタスクを追加
 */
export interface PostRoomsTasksParam {
  /** タスクの内容 */
  body: string;

  /** 担当者のアカウントID */
  to_ids: string;

  /** タスクの期限 */
  limit?: number;

  /** タスク期限の種別 */
  limit_type?: "none" | "date" | "time";
}

/**
 * ファイル情報を取得
 */
export interface GetRoomsFilesInfoParam {
  /** ダウンロードする為のURLを生成するか */
  create_download_url?: 0 | 1;
}

/**
 * チャットのファイル一覧を取得 (※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
 */
export interface GetRoomsFilesParam {
  /** アップロードしたユーザーのアカウントID */
  account_id?: number;
}

/**
 * チャットに新しいファイルをアップロード
 */
export interface PostRoomsFilesParam {}

/**
 * 招待リンクを取得する
 */
export interface GetRoomsLinkParam {}

/**
 * 招待リンクを作成する
 */
export interface PostRoomsLinkParam {
  /** リンク文字列 */
  code?: string;

  /** 承認要否 */
  need_acceptance?: 0 | 1;

  /** リンク説明文 */
  description?: string;
}

/**
 * 招待リンクの情報を変更する
 */
export interface PutRoomsLinkParam {
  /** リンク文字列 */
  code?: string;

  /** 承認要否 */
  need_acceptance?: 0 | 1;

  /** リンク説明文 */
  description?: string;
}

/**
 * 招待リンクを削除する
 */
export interface DeleteRoomsLinkParam {}

/**
 * チャットの名前、アイコン、種類(my/direct/group)を取得
 */
export interface GetRoomsInfoParam {}

/**
 * チャットの名前、アイコンをアップデート
 */
export interface PutRoomsInfoParam {
  /** グループチャット名 */
  name?: string;

  /** チャット概要 */
  description?: string;
}

/**
 * グループチャットを退席/削除する
 */
export interface DeleteRoomsInfoParam {
  /** 退席するか、削除するか */
  action_type: "leave" | "delete";
}

/**
 * 自分のチャット一覧の取得
 */
export interface GetRoomsParam {}

/**
 * グループチャットを新規作成
 */
export interface PostRoomsParam {
  /** グループチャット名 */
  name: string;

  /** チャット概要 */
  description?: string;

  /** 招待リンク作成 */
  link?: 0 | 1;

  /** リンク文字列 */
  link_code?: string;

  /** 承認要否 */
  link_need_acceptance?: 0 | 1;
}

/**
 * 自分に対するコンタクト承認依頼を承認する
 */
export interface PutIncomingRequestsInfoParam {}

/**
 * 自分に対するコンタクト承認依頼をキャンセルする
 */
export interface DeleteIncomingRequestsInfoParam {}

/**
 * 自分に対するコンタクト承認依頼一覧を取得する(※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
 */
export interface GetIncomingRequestsParam {}

export interface GetMyStatusResponse {
  unread_room_num: number;
  mention_room_num: number;
  mytask_room_num: number;
  unread_num: number;
  mention_num: number;
  mytask_num: number;
}

export interface PutRoomsMembersResponse {
  admin: number[];
  member: number[];
  readonly: number[];
}

export interface PutRoomsMessagesReadResponse {
  unread_num: number;
  mention_num: number;
}

export interface PutRoomsMessagesUnreadResponse {
  unread_num: number;
  mention_num: number;
}

export interface PutRoomsMessagesInfoResponse {
  message_id: string;
}

export interface DeleteRoomsMessagesInfoResponse {
  message_id: string;
}

export interface PostRoomsMessagesResponse {
  message_id: string;
}

export interface PutRoomsTasksStatusResponse {
  task_id: number;
}

export interface PostRoomsTasksResponse {
  task_ids: number[];
}

export interface PostRoomsFilesResponse {
  file_id: number;
}

export interface PostRoomsLinkResponse {
  public: boolean;
  url: string;
  need_acceptance: boolean;
  description: string;
}

export interface PutRoomsLinkResponse {
  public: boolean;
  url: string;
  need_acceptance: boolean;
  description: string;
}

export interface DeleteRoomsLinkResponse {
  public: boolean;
}

export interface PutRoomsInfoResponse {
  room_id: number;
}

export interface PostRoomsResponse {
  room_id: number;
}