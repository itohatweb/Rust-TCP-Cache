const cache = await createWorkerCache({
  conn: { port: 6379 },
  pool: { max: 1 },
});

// const now2 = performance.now();
//
// const res2 = await cache.send(fakeGuild());
// console.log(`took: ${performance.now() - now2}`);
// console.log({ res2 });

// const now3 = performance.now();
//
// const res3 = await cache.send(fakeGuild());
// console.log(`took: ${performance.now() - now3}`);
// console.log({ res3 });

// const d = { hey: true };
const raw = {
  "id": 223909216866402304n,
  "name": "Dligence",
  "icon": "308a4387b88a5988309c0ff9634e13cd",
  "description": null,
  "splash": null,
  "discovery_splash": null,
  "features": [
    "MEMBER_VERIFICATION_GATE_ENABLED",
    "NEWS",
    "WELCOME_SCREEN_ENABLED",
    "NEW_THREAD_PERMISSIONS",
    "THREADS_ENABLED",
    "PREVIEW_ENABLED",
    "COMMUNITY",
  ],
  "banner": null,
  "owner_id": 130136895395987456n,
  "application_id": null,
  "region": "us-east",
  "afk_channel_id": null,
  "afk_timeout": 300,
  "system_channel_id": null,
  "widget_enabled": true,
  "widget_channel_id": 450041734307512321n,
  "verification_level": 2,
  "default_message_notifications": 1,
  "mfa_level": 1,
  "explicit_content_filter": 2,
  "max_presences": null,
  "max_members": 500000,
  "max_video_channel_users": 25,
  "vanity_url_code": null,
  "premium_tier": 0,
  "premium_subscription_count": 1,
  "system_channel_flags": 1,
  "preferred_locale": "en-US",
  "rules_channel_id": 273389739091165184n,
  "public_updates_channel_id": 637995617452425226n,
  "hub_type": null,
  "premium_progress_bar_enabled": true,
  "nsfw": false,
  "nsfw_level": 0,
  "large": false,
};
let shouldStats = {
  guilds: 0,
  channels: 0,
  roles: 0,
};

async function foo() {
  // const res = await cache.request({
  //
  //   t: "Nani",
  //
  //   d: 785384884197392384n,
  // });
  const now = performance.now();
  const actual = await cache.request({ op: OpCode.GetStats, d: undefined });
  // const actual = await cache.request({ t: "GetStats" });
  console.log({ actual, expected: shouldStats, took: performance.now() - now });
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
    memberCount: payload.member_count ?? undefined,
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

import {
  createBot,
  GatewayDispatchEventNames,
  startBot,
} from "https://deno.land/x/discordeno@13.0.0-rc33/mod.ts";

// const now = performance.now();

// let id = 0;

const bot = createBot({
  token: "",
  botId: 0n,
  events: {
    async raw(_, data) {
      if (["GUILD_LOADED_DD", "GUILD_CREATE"].includes(data.t as string)) {
        let payload: any = data.d;

        shouldStats.guilds++;

        // console.log({ payload: payload.channels });

        await Promise.all([
          cache.send({
            op: OpCode.CacheGuild,
            d: {
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
              "defaultMessageNotifications":
                payload.default_message_notifications,
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
            },
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
              d: { role: d, guildId: BigInt(payload.id) },
            });
          })),
        ]);

        // throw new Error("F");
      }
    },
    ready(_, p) {
      console.log(`[READY] Shard #${p.shardId}`);
    },
  },
  intents: ["Guilds"],
});

import { walk, walkSync } from "https://deno.land/std@0.136.0/fs/mod.ts";
import { createCache, createWorkerCache } from "./client.ts";
import { Channel, OpCode, Role } from "./types/data.ts";

let paths: string[] = [];
let payloads: { offset: number; data: Object }[] = [];

// Async
async function run() {
  for await (const entry of walk("./mock", { includeDirs: false })) {
    paths.push(entry.path);
  }

  await Promise.all(paths.map(async (path) => {
    const file = JSON.parse(await Deno.readTextFile(path));

    // setTimeout(() => {
    bot.events.raw({} as any, file.data, 0);
    if (file.data.t) {
      bot.handlers
        [file.data.t as GatewayDispatchEventNames | "GUILD_LOADED_DD"]?.(
          bot,
          file.data,
          0,
        );
    }
    // }, 10); // file.offset);
  }));
}

console.log("STARTING TO SEND");

await run();
