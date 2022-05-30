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
  CacheMessage = 10,
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
  | DataBase<OpCode.CacheUser, User>
  | DataBase<OpCode.CacheMessage, Message>;

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
  name: string;
  nsfwLevel: number;
  ownerId: bigint;
  owner?: boolean;
  // permissions?: Permissions,
  preferredLocale: string;
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
  name?: string;
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
  // member?: Member,
  // presence?: Presence,
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
  type: number;
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

export type Message = {
  // activity?: MessageActivity,
  // application?: MessageApplication,
  // applicationId?: u64,
  attachments: Attachment[];
  // author: User,
  author: bigint;
  channelId: bigint;
  components: Component[];
  content: string;
  editedTimestamp?: string;
  embeds: Embed;
  // flags?: u64,
  guildId?: bigint;
  id: bigint;
  interaction?: MessageInteraction;
  type: number;
  // member?: Member,
  // mentionChannels: VecChannelMention,
  // mentionEveryone: bool,
  // mentionRoles: Vecu64,
  // mentions: VecMention,
  pinned: boolean;
  // reactions: VecMessageReaction,
  // reference?: MessageReference,
  referencedMessage?: Message;
  // stickerItems: VecMessageSticker,
  threadId?: bigint;
  // timestamp: string,
  // thread?: Channel,
  // tts: bool,
  webhookId?: bigint;
};

export type MessageActivity = {
  type: number;
  partyId?: string;
};

export type MessageApplication = {
  coverImage?: string;
  description: string;
  icon?: string;
  id: bigint;
  name: string;
};

export type Attachment = {
  contentType?: string;
  ephemeral: boolean;
  filename: string;
  description?: string;
  height?: number;
  id: bigint;
  proxyUrl: string;
  size: number;
  url: string;
  width?: number;
};

export type Component = {
  components?: Component[];
  customId?: string;
  disabled?: boolean;
  emoji?: Reaction;
  type: number;
  label?: string;
  maxLength?: number;
  maxValues?: number;
  minLength?: number;
  minValues?: number;
  options?: SelectMenuOption[];
  placeholder?: string;
  required?: boolean;
  style?: number;
  url?: string;
  value?: string;
};

export type Reaction = {
  animated?: boolean;
  id?: bigint;
  name?: string;
};

export type SelectMenuOption = {
  default: boolean;
  description?: string;
  emoji?: Reaction;
  label: string;
  value: string;
};

export type Embed = {
  author?: EmbedAuthor;
  color?: number;
  description?: string;
  fields?: EmbedField[];
  footer?: EmbedFooter;
  image?: EmbedImage;
  type: string;
  provider?: EmbedProvider;
  thumbnail?: EmbedThumbnail;
  timestamp?: string;
  title?: string;
  url?: string;
  video?: EmbedVideo;
};

export type EmbedAuthor = {
  iconUrl?: string;
  name: string;
  proxyIconUrl?: string;
  url?: string;
};

export type EmbedField = {
  inline: boolean;
  name: string;
  value: string;
};

export type EmbedFooter = {
  iconUrl?: string;
  proxyIconUrl?: string;
  text: string;
};

export type EmbedImage = {
  height?: number;
  proxyUrl?: string;
  url: string;
  width?: number;
};

export type EmbedProvider = {
  name?: string;
  url?: string;
};

export type EmbedThumbnail = {
  height?: number;
  proxyUrl?: string;
  url: string;
  width?: number;
};

export type EmbedVideo = {
  height?: number;
  proxyUrl?: string;
  url?: string;
  width?: number;
};

export type MessageInteraction = {
  id: bigint;
  type: number;
  name: string;
  user: bigint;
};
