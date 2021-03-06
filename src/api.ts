// This file was automatically generated.
import axios from "axios";
import { stringify } from "qs";
import * as FormData from "form-data";
import * as FileType from "file-type/browser";

import * as Types from "./types";

export const CHATWORK_URL = "https://api.chatwork.com/v2";

export type RateLimits = {
  /** 次に制限がリセットされる時間（Unix time） */
  "x-ratelimit-reset": number;
  /** 残りコール回数 */
  "x-ratelimit-remaining": number;
  /** 最大コール回数 */
  "x-ratelimit-limit": number;
};

/**
 * Chatwork API V2
 */
export default class ChatworkApi {
  private _rateLimits?: RateLimits;
  private _apiToken?: string;
  set apiToken(apiToken: string | undefined) {
    this._apiToken = apiToken;
  }
  get apiToken() {
    return this._apiToken || process?.env?.CHATWORK_API_TOKEN;
  }

  /**
   * API制限情報
   * APIが呼び出されるとレスポンスヘッダの情報を基に更新される
   */
  get rateLimits() {
    return this._rateLimits;
  }

  constructor(apiToken?: string) {
    this._apiToken = apiToken;
  }

  private getRequestHeaders() {
    return {
      "X-ChatWorkToken": this.apiToken,
    };
  }

  private checkApiToken(headers: any) {
    if (!headers["X-ChatWorkToken"]) {
      throw new Error("Chatwork API Token is not set.");
    }
  }

  private saveRateLimits(headers: any) {
    const rateLimits = Object.entries(headers)
      .filter(([key, value]) => key.startsWith("x-ratelimit"))
      .map(([key, value]) => [key, Number(value)]);
    this._rateLimits = Object.fromEntries(rateLimits) as RateLimits;
  }

  private async get<T>(uri: string, params: any = {}) {
    const requestHeaders = this.getRequestHeaders();
    this.checkApiToken(requestHeaders);
    const { data, headers } = await axios.get(CHATWORK_URL + uri, {
      headers: requestHeaders,
      params,
    });

    this.saveRateLimits(headers);

    return data as T;
  }

  private async post<T>(uri: string, params: any = {}) {
    const requestHeaders = this.getRequestHeaders();
    this.checkApiToken(requestHeaders);
    const { data, headers } = await axios.post(
      CHATWORK_URL + uri,
      stringify(params),
      {
        headers: {
          ...requestHeaders,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    this.saveRateLimits(headers);

    return data as T;
  }

  private async postFile<T>(uri: string, params: any = {}) {
    const requestHeaders = this.getRequestHeaders();
    this.checkApiToken(requestHeaders);

    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) continue;
      if (key === "file") {
        const file = value as Buffer;
        const fileType = await FileType.fromBuffer(file);
        const fileName = params["file_name"] || "NO_NAME";
        formData.append(key, file, {
          contentType: fileType?.mime,
          filename: fileName,
          knownLength: file.length,
        });
      } else {
        formData.append(key, value);
      }
    }

    const { data, headers } = await axios.post(CHATWORK_URL + uri, formData, {
      headers: {
        ...requestHeaders,
        ...formData.getHeaders(),
      },
    });

    this.saveRateLimits(headers);

    return data as T;
  }

  private async delete<T>(uri: string, params: any = {}) {
    const requestHeaders = this.getRequestHeaders();
    this.checkApiToken(requestHeaders);
    const { data, headers } = await axios.delete(CHATWORK_URL + uri, {
      headers: requestHeaders,
      params,
    });

    this.saveRateLimits(headers);

    return data as T;
  }

  private async put<T>(uri: string, params: any = {}) {
    const requestHeaders = this.getRequestHeaders();
    this.checkApiToken(requestHeaders);
    const { data, headers } = await axios.put(
      CHATWORK_URL + uri,
      stringify(params),
      {
        headers: {
          ...requestHeaders,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    this.saveRateLimits(headers);

    return data as T;
  }

  /**
   * 自分自身の情報を取得
   */
  async getMe() {
    return await this.get<Types.GetMeResponse>(`/me`);
  }

  /**
   * 自分の未読数、未読To数、未完了タスク数を返す
   */
  async getMyStatus() {
    return await this.get<Types.GetMyStatusResponse>(`/my/status`);
  }

  /**
   * 自分のタスク一覧を取得する。(※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
   */
  async getMyTasks(params?: Types.GetMyTasksParam) {
    return await this.get<Types.GetMyTasksResponse>(`/my/tasks`, params);
  }

  /**
   * 自分のコンタクト一覧を取得
   */
  async getContacts() {
    return await this.get<Types.GetContactsResponse>(`/contacts`);
  }

  /**
   * 自分のチャット一覧の取得
   */
  async getRooms() {
    return await this.get<Types.GetRoomsResponse>(`/rooms`);
  }

  /**
   * グループチャットを新規作成
   */
  async postRoom(params: Types.PostRoomParam) {
    return await this.post<Types.PostRoomResponse>(`/rooms`, params);
  }

  /**
   * チャットの名前、アイコン、種類(my/direct/group)を取得
   */
  async getRoom(room_id: string | number) {
    return await this.get<Types.GetRoomResponse>(`/rooms/${room_id}`);
  }

  /**
   * チャットの名前、アイコンをアップデート
   */
  async putRoom(room_id: string | number, params?: Types.PutRoomParam) {
    return await this.put<Types.PutRoomResponse>(`/rooms/${room_id}`, params);
  }

  /**
   * グループチャットを退席/削除する
   */
  async deleteRoom(room_id: string | number, params: Types.DeleteRoomParam) {
    return await this.delete<Types.DeleteRoomResponse>(
      `/rooms/${room_id}`,
      params,
    );
  }

  /**
   * チャットのメンバー一覧を取得
   */
  async getRoomMembers(room_id: string | number) {
    return await this.get<Types.GetRoomMembersResponse>(
      `/rooms/${room_id}/members`,
    );
  }

  /**
   * チャットのメンバーを一括変更
   */
  async putRoomMembers(
    room_id: string | number,
    params: Types.PutRoomMembersParam,
  ) {
    return await this.put<Types.PutRoomMembersResponse>(
      `/rooms/${room_id}/members`,
      params,
    );
  }

  /**
   * チャットのメッセージ一覧を取得。パラメータ未指定だと前回取得分からの差分のみを返します。(最大100件まで取得)
   */
  async getRoomMessages(
    room_id: string | number,
    params?: Types.GetRoomMessagesParam,
  ) {
    return await this.get<Types.GetRoomMessagesResponse>(
      `/rooms/${room_id}/messages`,
      params,
    );
  }

  /**
   * チャットに新しいメッセージを追加
   */
  async postRoomMessage(
    room_id: string | number,
    params: Types.PostRoomMessageParam,
  ) {
    return await this.post<Types.PostRoomMessageResponse>(
      `/rooms/${room_id}/messages`,
      params,
    );
  }

  /**
   * メッセージを既読にする
   */
  async putRoomMessagesRead(
    room_id: string | number,
    params?: Types.PutRoomMessagesReadParam,
  ) {
    return await this.put<Types.PutRoomMessagesReadResponse>(
      `/rooms/${room_id}/messages/read`,
      params,
    );
  }

  /**
   * メッセージを未読にする
   */
  async putRoomMessagesUnread(
    room_id: string | number,
    params: Types.PutRoomMessagesUnreadParam,
  ) {
    return await this.put<Types.PutRoomMessagesUnreadResponse>(
      `/rooms/${room_id}/messages/unread`,
      params,
    );
  }

  /**
   * メッセージ情報を取得
   */
  async getRoomMessage(room_id: string | number, message_id: string | number) {
    return await this.get<Types.GetRoomMessageResponse>(
      `/rooms/${room_id}/messages/${message_id}`,
    );
  }

  /**
   * チャットのメッセージを更新する。
   */
  async putRoomMessage(
    room_id: string | number,
    message_id: string | number,
    params: Types.PutRoomMessageParam,
  ) {
    return await this.put<Types.PutRoomMessageResponse>(
      `/rooms/${room_id}/messages/${message_id}`,
      params,
    );
  }

  /**
   * メッセージを削除
   */
  async deleteRoomMessage(
    room_id: string | number,
    message_id: string | number,
  ) {
    return await this.delete<Types.DeleteRoomMessageResponse>(
      `/rooms/${room_id}/messages/${message_id}`,
    );
  }

  /**
   * チャットのタスク一覧を取得 (※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
   */
  async getRoomTasks(
    room_id: string | number,
    params?: Types.GetRoomTasksParam,
  ) {
    return await this.get<Types.GetRoomTasksResponse>(
      `/rooms/${room_id}/tasks`,
      params,
    );
  }

  /**
   * チャットに新しいタスクを追加
   */
  async postRoomTask(
    room_id: string | number,
    params: Types.PostRoomTaskParam,
  ) {
    return await this.post<Types.PostRoomTaskResponse>(
      `/rooms/${room_id}/tasks`,
      params,
    );
  }

  /**
   * タスク情報を取得
   */
  async getRoomTask(room_id: string | number, task_id: string | number) {
    return await this.get<Types.GetRoomTaskResponse>(
      `/rooms/${room_id}/tasks/${task_id}`,
    );
  }

  /**
   * タスク完了状態を変更する
   */
  async putRoomTaskStatus(
    room_id: string | number,
    task_id: string | number,
    params: Types.PutRoomTaskStatusParam,
  ) {
    return await this.put<Types.PutRoomTaskStatusResponse>(
      `/rooms/${room_id}/tasks/${task_id}/status`,
      params,
    );
  }

  /**
   * チャットのファイル一覧を取得 (※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
   */
  async getRoomFiles(
    room_id: string | number,
    params?: Types.GetRoomFilesParam,
  ) {
    return await this.get<Types.GetRoomFilesResponse>(
      `/rooms/${room_id}/files`,
      params,
    );
  }

  /**
   * チャットに新しいファイルをアップロード
   */
  async postRoomFile(
    room_id: string | number,
    params: Types.PostRoomFileParam,
  ) {
    return await this.postFile<Types.PostRoomFileResponse>(
      `/rooms/${room_id}/files`,
      params,
    );
  }

  /**
   * ファイル情報を取得
   */
  async getRoomFile(
    room_id: string | number,
    file_id: string | number,
    params?: Types.GetRoomFileParam,
  ) {
    return await this.get<Types.GetRoomFileResponse>(
      `/rooms/${room_id}/files/${file_id}`,
      params,
    );
  }

  /**
   * 招待リンクを取得する
   */
  async getRoomLink(room_id: string | number) {
    return await this.get<Types.GetRoomLinkResponse>(`/rooms/${room_id}/link`);
  }

  /**
   * 招待リンクを作成する
   */
  async postRoomLink(
    room_id: string | number,
    params?: Types.PostRoomLinkParam,
  ) {
    return await this.post<Types.PostRoomLinkResponse>(
      `/rooms/${room_id}/link`,
      params,
    );
  }

  /**
   * 招待リンクの情報を変更する
   */
  async putRoomLink(room_id: string | number, params?: Types.PutRoomLinkParam) {
    return await this.put<Types.PutRoomLinkResponse>(
      `/rooms/${room_id}/link`,
      params,
    );
  }

  /**
   * 招待リンクを削除する
   */
  async deleteRoomLink(room_id: string | number) {
    return await this.delete<Types.DeleteRoomLinkResponse>(
      `/rooms/${room_id}/link`,
    );
  }

  /**
   * 自分に対するコンタクト承認依頼一覧を取得する(※100件まで取得可能。今後、より多くのデータを取得する為のページネーションの仕組みを提供予定)
   */
  async getIncomingRequests() {
    return await this.get<Types.GetIncomingRequestsResponse>(
      `/incoming_requests`,
    );
  }

  /**
   * 自分に対するコンタクト承認依頼を承認する
   */
  async putIncomingRequest(request_id: string | number) {
    return await this.put<Types.PutIncomingRequestResponse>(
      `/incoming_requests/${request_id}`,
    );
  }

  /**
   * 自分に対するコンタクト承認依頼をキャンセルする
   */
  async deleteIncomingRequest(request_id: string | number) {
    return await this.delete<Types.DeleteIncomingRequestResponse>(
      `/incoming_requests/${request_id}`,
    );
  }
}
