const cache = await createWorkerCache({
  conn: { port: 6379 },
  pool: { max: 10 },
});

let shouldStats = {
  channels: 0,
  guilds: 0,
  messages: 0,
  members: 0,
  roles: 0,
  users: 0,
};

async function foo() {
  // const res = await cache.request({
  //
  //   t: "Nani",
  //
  //   d: 785384884197392384n,
  // });
  console.log(
    "REQUESTING --------------------------------------------------------------------------------------",
  );
  const now = performance.now();
  const actual = await cache.request({ op: OpCode.GetStats, d: undefined });
  const used = Deno.memoryUsage();
  let arr: any = {};
  for (let key in used) {
    arr[key] = Math.round(used[key as keyof typeof used] / 1000 / 1000 * 100) /
      100;
  }

  // const actual = await cache.request({ t: "GetStats" });
  console.log({
    actual,
    expected: shouldStats,
    took: performance.now() - now,
    deno: arr,
  });
}

setInterval(() => {
  foo();
}, 10_000);

// for (let i = 0; i < 100; ++i) {
//   foo();
//   // await new Promise((res) => setTimeout(res, 2000));
// }

// const ruf = [...Array(10_000).keys()].map(async (_) => {
//   // const now = performance.now();
//   await foo();
//   // console.log(`took: ${performance.now() - now}`);
// });
//
// const now = performance.now();
// await Promise.all(ruf);
// console.log(`took: ${performance.now() - now}`);

// #######################################################################################

function transformChannel(payload: any): Channel {
  return {
    applicationId: payload.application_id
      ? BigInt(payload.application_id)
      : undefined,
    bitrate: payload.bitrate ?? undefined,
    defaultAutoArchiveDuration: payload.default_auto_archive_duration ??
      undefined,
    guildId: payload.guild_id ? BigInt(payload.guild_id) : undefined,
    icon: payload.icon ?? undefined,
    id: BigInt(payload.id),
    type: payload.type,
    lastMessageId: payload.last_message_id
      ? BigInt(payload.last_message_id)
      : undefined,
    lastPinTimestamp: payload.last_pin_timestamp ?? undefined,
    member: payload.member
      ? {
        flags: payload.member.flags,
        id: payload.member.id ? BigInt(payload.member.id) : undefined,
        joinTimestamp: payload.member.join_timestamp,
        // member: Option<Member>,
        // presence: Option<Presence>,
        userId: payload.member.user_id
          ? BigInt(payload.member.user_id)
          : undefined,
      }
      : undefined,
    memberCount: (payload.member_count < 0 ? 0 : payload.member_count) ??
      undefined,
    messageCount: payload.message_count ?? undefined,
    name: payload.name ?? undefined,
    newlyCreated: payload.newly_created ?? undefined,
    nsfw: payload.nsfw ?? undefined,
    ownerId: payload.owner_id ? BigInt(payload.owner_id) : undefined,
    parentId: payload.parent_id ? BigInt(payload.parent_id) : undefined,
    permissionOverwrites: payload.permission_overwrites
      ? payload.permission_overwrites.map((o: any) => ({
        allow: BigInt(o.allow),
        deny: BigInt(o.deny),
        id: BigInt(o.id),
        type: o.type,
      }))
      : undefined,
    position: payload.position ?? undefined,
    rateLimitPerUser: payload.rate_limit_per_user ?? undefined,
    rtcRegion: payload.rtc_region ?? undefined,
    threadMetadata: payload.thread_metadata
      ? {
        archived: payload.thread_metadata.archived,
        autoArchiveDuration: payload.thread_metadata.auto_archive_duration,
        archiveTimestamp: payload.thread_metadata.archive_timestamp,
        createTimestamp: payload.thread_metadata.create_timestamp,
        invitable: payload.thread_metadata.invitable,
        locked: payload.thread_metadata.locked,
      }
      : undefined,
    topic: payload.topic ?? undefined,
    userLimit: payload.user_limit ?? undefined,
    videoQualityMode: payload.video_quality_mode ?? undefined,
  };
}

function transformRole(payload: any): Role {
  return {
    color: payload.color,
    hoist: payload.hoist,
    icon: payload.icon,
    id: BigInt(payload.id),
    managed: payload.managed,
    mentionable: payload.mentionable,
    name: payload.name,
    permissions: BigInt(payload.permissions),
    position: payload.position,
    tags: payload.tags
      ? {
        botId: payload.bot_id ? BigInt(payload.tags.bot_id) : undefined,
        integrationId: payload.tags.integration_id
          ? BigInt(payload.tags.integration_id)
          : undefined,
        premiumSubscriber: payload.tags.premium_subscriber === null
          ? null
          : undefined,
      }
      : undefined,
    unicodeEmoji: payload.unicode_emoji,
  };
}

function transformMember(payload: any): Member {
  return {
    avatar: payload.avatar,
    communicationDisabledUntil: payload.communication_disabled_until,
    deaf: payload.deaf,
    joinedAt: payload.joined_at,
    mute: payload.mute,
    nick: payload.nick,
    pending: payload.pending,
    premiumSince: payload.premium_since,
    roles: payload.roles.map((r: string) => BigInt(r)),
    userId: BigInt(payload.user.id),
  };
}

function transformUser(payload: any): User {
  return {
    accentColor: payload.accent_color,
    avatar: payload.avatar,
    banner: payload.banner,
    bot: payload.bot,
    discriminator: payload.discriminator,
    email: payload.email,
    flags: payload.flags,
    id: BigInt(payload.id),
    locale: payload.locale,
    mfaEnabled: payload.mfa_enabled,
    username: payload.username,
    premiumType: payload.premium_type,
    publicFlags: payload.public_flags,
    system: payload.system,
    verified: payload.verified,
  };
}

function transformComponent(component: any): Component {
  return {
    components: component.components?.map((c: any) => transformComponent(c)),
    customId: component.custom_id,
    disabled: component.disabled,
    emoji: component.emoji
      ? {
        animated: component.emoji.animated,
        id: component.emoji.id ? BigInt(component.emoji.id) : undefined,
        name: component.emoji.name,
      }
      : undefined,
    type: component.type,
    label: component.label,
    maxLength: component.max_length,
    maxValues: component.max_values,
    minLength: component.min_length,
    minValues: component.min_values,
    options: component.options?.map((o: any) => ({
      default: o.default,
      description: o.description,
      emoji: o.emoji
        ? {
          animated: o.emoji.animated,
          id: o.emoji.id ? BigInt(o.emoji.id) : undefined,
          name: o.name,
        }
        : undefined,
      label: o.label,
      value: o.value,
    })),
    placeholder: component.placeholder,
    required: component.required,
    style: component.style,
    url: component.url,
    value: component.value,
  };
}

function transformMessage(payload: any): Message {
  return {
    attachments: payload.attachments.map((attachment: any) => ({
      contentType: attachment.content_type,
      ephemeral: attachment.ephemeral ?? false,
      filename: attachment.filename,
      description: attachment.description,
      height: attachment.height,
      id: BigInt(attachment.id),
      proxyUrl: attachment.proxy_url,
      size: attachment.size,
      url: attachment.url,
      width: attachment.width,
    })),
    author: BigInt(payload.author.id),
    channelId: BigInt(payload.channel_id),
    components: payload.components.map((c: any) => transformComponent(c)),
    content: payload.content,
    editedTimestamp: payload.edited_timestamp,
    embeds: [] as any, //payload.embeds.map(),
    guildId: payload.guild_id ? BigInt(payload.guild_id) : undefined,
    id: BigInt(payload.id),
    interaction: undefined, // payload.message_interaction, //////////////////////////////////////////////////////////////////
    type: payload.type,
    pinned: payload.pinned,
    referencedMessage: undefined, // payload.referenced_message, //////////////////////////////////////////////////////////////////
    threadId: payload.thread_id ? BigInt(payload.thread_id) : undefined,
    webhookId: payload.webhook_id ? BigInt(payload.webhook_id) : undefined,
  };
}

function transformGuild(payload: any): Guild {
  return {
    "id": BigInt(payload.id),
    "name": payload.name,
    "icon": payload.icon,
    "description": payload.description,
    "splash": payload.splash,
    "discoverySplash": payload.discovery_splash,
    "features": payload.features,
    "banner": payload.banner,
    "ownerId": BigInt(payload.owner_id),
    "applicationId": payload.application_id
      ? BigInt(payload.application_id)
      : undefined,
    "afkChannelId": payload.afk_channel_id
      ? BigInt(payload.afk_channel_id)
      : undefined,
    "afkTimeout": payload.afk_timeout,
    "systemChannelId": payload.system_channel_id
      ? BigInt(payload.system_channel_id)
      : undefined,
    "widgetEnabled": payload.widget_enabled,
    "widgetChannelId": payload.widget_channel_id
      ? BigInt(payload.widget_channel_id)
      : undefined,
    "verificationLevel": payload.verification_level,
    "defaultMessageNotifications": payload.default_message_notifications,
    "mfaLevel": payload.mfa_level,
    "explicitContentFilter": payload.explicit_content_filter,
    "maxPresences": payload.max_presences,
    "maxMembers": payload.max_members,
    "maxVideoChannelUsers": payload.max_video_channel_users,
    "vanityUrlCode": payload.vanity_url_code,
    "premiumTier": payload.premium_tier,
    "premiumSubscriptionCount": payload.premium_subscription_count,
    "systemChannelFlags": payload.system_channel_flags,
    "preferredLocale": payload.preferred_locale,
    "rulesChannelId": payload.rules_channel_id
      ? BigInt(payload.rules_channel_id)
      : undefined,
    "publicUpdatesChannelId": payload.public_updates_channel_id
      ? BigInt(payload.public_updates_channel_id)
      : undefined,
    "premiumProgressBarEnabled": payload.premium_progress_bar_enabled,
    "nsfwLevel": payload.nsfw_level,
    "large": payload.large,
    "unavailable": false,
  };
}

import {
  createBot,
  GatewayDispatchEventNames,
  startBot,
} from "https://deno.land/x/discordeno@13.0.0-rc33/mod.ts";

// const now = performance.now();

// let id = 0;

let users = new Set();

const now = performance.now();
let counter = 0;
const bot = createBot({
  token: "",
  botId: BigInt(atob("MjcwMDEwMzMwNzgyODkyMDMy")),
  events: {
    async raw(_, data, shardId) {
      if (data.t === "MESSAGE_CREATE") {
        shouldStats.messages++;
        cache.send({ op: OpCode.CacheMessage, d: transformMessage(data.d) });
      }
      if (["GUILD_LOADED_DD", "GUILD_CREATE"].includes(data.t as string)) {
        let payload: any = data.d;

        shouldStats.guilds++;

        let existingMembers = new Set();

        // console.log({ payload: payload.channels });

        const guild = transformGuild(payload);

        await Promise.all([
          cache.send({
            op: OpCode.CacheGuild,
            d: guild,
          }),
          Promise.all(
            [...payload.channels, ...payload.threads].map(async (c: any) => {
              shouldStats.channels++;
              const d = transformChannel({
                ...c,
                guild_id: payload.id,
              });
              await cache.send({
                op: OpCode.CacheChannel,
                d,
              });
            }),
          ),
          Promise.all(payload.roles.map(async (r: any) => {
            shouldStats.roles++;

            const d = transformRole(r);
            await cache.send({
              op: OpCode.CacheRole,
              d: { value: d, guildId: BigInt(payload.id) },
            });
          })),
          Promise.all(payload.members.map(async (m: any) => {
            const d = transformMember(m);
            if (existingMembers.has(d.userId)) {
              return;
            }

            existingMembers.add(d.userId);

            shouldStats.members++;

            await cache.send({
              op: OpCode.CacheMember,
              d: { value: d, guildId: BigInt(payload.id) },
            });
          })),
          Promise.all(payload.members.map(async (m: any) => {
            const d = transformUser(m.user);
            if (users.has(d.id)) {
              return;
            }

            users.add(d.id);
            shouldStats.users++;

            await cache.send({ op: OpCode.CacheUser, d: d });
          })),
        ]);

        // throw new Error("F");
      }
    },
    ready(_, p) {
      console.log(`[READY] Shard #${p.shardId}`);
    },
  },
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

import { walk, walkSync } from "https://deno.land/std@0.136.0/fs/mod.ts";
import { createCache, createWorkerCache } from "./client.ts";
import {
  Channel,
  Component,
  Guild,
  Member,
  Message,
  OpCode,
  Role,
  User,
} from "./types/data.ts";
import { decode } from "./cbor.ts";
import { fromUint } from "./utils.ts";

let paths: string[] = [];
let payloads: { offset: number; data: Object }[] = [];

// Async
async function run() {
  for await (const entry of walk("./mock2", { includeDirs: false })) {
    paths.push(entry.path);
  }

  await Promise.all(paths.map(async (path) => {
    const file = JSON.parse(await Deno.readTextFile(path));

    // setTimeout(() => {
    bot.events.raw({} as any, file.data, file.shardId);
    if (file.data.t) {
      bot.handlers
        [file.data.t as GatewayDispatchEventNames | "GUILD_LOADED_DD"]?.(
          bot,
          file.data,
          0,
        );
    }
    // }, file.offset);
  }));
}

console.log("STARTING TO SEND");

await run();
// startBot(bot);
