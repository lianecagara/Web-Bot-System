export type Settings = {
  name: string;
  description: string;
  noPrefix?: boolean;
  aliases?: string[];
  creator?: string;
  version?: string;
  category?: string;
  cooldown?: number | string;
  permission?: number | string;
  [key: string]: any;
};

export type CommandType = {
  settings: Settings;
  main: (ctx: any) => Promise<any> | any;
  [key: string]: any;
};
