export type ctx = (ctx?: {
  api?: any;
  event?: {
    senderID?: string;
    threadID?: string;
    messageID?: string;
    body?: string;
    isGroup?: boolean;
    logMessageType?: string;
    type?: string;
    attachments?: any[];
    mentions?: {
      [key: string]: any;
    };
    author?: string;
    reaction?: string;
    isUnread?: boolean;
    [key: string]: any;
  };
  args?: string[];
  Users?: any;
  Threads?: any;
  [key: string]: any;
}) => any;

export type Botpack = {
  config: {
    name: string;
    usePrefix: boolean;
    commandCategory: string;
    credits?: string;
    cooldowns?: number;
    hasPermssion?: number;
    dependencies?: {
      [key: string]: string | number;
    };
    envConfig?: {
      [key: string]: any;
    };
  };
  onLoad?: (ctx?: any) => any;
  run: ctx;
  handleEvent?: ctx;
  handleReaction?: ctx;
  handleReply?: ctx;
};
