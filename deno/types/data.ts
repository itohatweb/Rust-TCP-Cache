type DataBase<T extends OpCode, D = unknown> = { op: T; d: D };

export enum OpCode {
  Identify = 0,
  Hello = 1,
  Nani = 2,
  GetStats = 3,
  Stats = 4,
  CacheGuild = 5,
  CacheChannel = 6,
  CacheRole = 7,
  CacheMember = 8,
  CacheUser = 9,
}

export type Data =
  | DataBase<OpCode.Identify, Identify>
  | DataBase<OpCode.Hello>
  | DataBase<OpCode.GetStats>
  | DataBase<OpCode.Nani, Object>
  | DataBase<OpCode.GetStats>
  | DataBase<OpCode.Stats, Stats>
  | DataBase<OpCode.CacheGuild, Guild>
  | DataBase<OpCode.CacheChannel, Channel>
  | DataBase<OpCode.CacheRole, GuildResource<Role>>
  | DataBase<OpCode.CacheMember, GuildResource<Member>>
  | DataBase<OpCode.CacheUser, User>;

export type GuildResource<T> = {
  guildId: bigint;
  value: T;
};
export type Identify = {
  user: string;
};

export type Stats = {
  channels: number;
  guilds: number;
  memoryUsage: number;
  roles: number;
};

export type Guild = {
  afkChannelId?: bigint;
  afkTimeout: bigint;
  applicationId?: bigint;
  approximateMemberCount?: number;
  approximatePresenceCount?: number;
  banner?: string;
  defaultMessageNotifications: number;
  description?: string;
  discoverySplash?: string;
  explicitContentFilter: number;
  features: string[];
  icon?: string;
  id: bigint;
  joinedAt?: string;
  large: boolean;
  maxMembers?: number;
  maxPresences?: number;
  maxVideoChannelUsers?: number;
  memberCount?: number;
  mfaLevel: number;
  name: String;
  nsfwLevel: number;
  ownerId: bigint;
  owner?: boolean;
  // permissions: Option<Permissions>,
  preferredLocale: String;
  premiumProgressBarEnabled: boolean;
  premiumSubscriptionCount?: number;
  premiumTier: number;
  publicUpdatesChannelId?: bigint;
  rulesChannelId?: bigint;
  splash?: string;
  systemChannelFlags: number;
  systemChannelId?: bigint;
  unavailable: boolean;
  vanityUrlCode?: string;
  verificationLevel: number;
  widgetChannelId?: bigint;
  widgetEnabled?: boolean;
};

export type Channel = {
  applicationId?: bigint;
  bitrate?: number;
  defaultAutoArchiveDuration?: number;
  guildId?: bigint;
  icon?: string;
  id: bigint;
  type: number;
  lastMessageId?: bigint;
  lastPinTimestamp?: string;
  member?: ThreadMember;
  memberCount?: number;
  messageCount?: number;
  name?: String;
  newlyCreated?: boolean;
  nsfw?: boolean;
  ownerId?: bigint;
  parentId?: bigint;
  permissionOverwrites?: PermissionOverwrite[];
  position?: number;
  rateLimitPerUser?: number;
  // recipients?: VecUser,
  rtcRegion?: string;
  threadMetadata?: ThreadMetadata;
  topic?: string;
  userLimit?: number;
  videoQualityMode?: number;
};

export type ThreadMember = {
  flags: number;
  id?: bigint;
  joinTimestamp: string;
  // TODO
  // member: Option<Member>,
  // presence: Option<Presence>,
  userId?: bigint;
};

export type ThreadMetadata = {
  archived: boolean;
  autoArchiveDuration: number;
  archiveTimestamp: string;
  createTimestamp?: string;
  invitable?: boolean;
  locked: boolean;
};

export type PermissionOverwrite = {
  allow: bigint;
  deny: bigint;
  id: bigint;
  kind: number;
};

export type Role = {
  color: number;
  hoist: boolean;
  icon?: string;
  id: bigint;
  managed: boolean;
  mentionable: boolean;
  name: string;
  permissions: bigint;
  position: number;
  tags?: RoleTags;
  unicodeEmoji?: string;
};

export type RoleTags = {
  botId?: bigint;
  integrationId?: bigint;
  premiumSubscriber?: null;
};

export type Member = {
  avatar?: string;
  communicationDisabledUntil?: string;
  deaf?: boolean;
  joinedAt: string;
  mute?: boolean;
  nick?: string;
  pending?: boolean;
  premiumSince?: string;
  roles: bigint[];
  userId: bigint;
};

export type User = {
  accentColor?: number;
  avatar?: string;
  banner?: string;
  bot?: boolean;
  discriminator: string;
  email?: string;
  flags?: number;
  id: bigint;
  locale?: string;
  mfaEnabled?: boolean;
  username: string;
  premiumType?: number;
  publicFlags?: number;
  system?: boolean;
  verified?: boolean;
};
