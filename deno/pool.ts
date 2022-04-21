/** A lazy pool. idk very lazy code. */
export function createPool<T>(options: CreatePoolOptions<T>) {
  const inner = {
    available: [] as PoolResource<T>[],
    waiting: [] as ((available: PoolResource<T>) => void)[],
    total: 0,

    create: async function (): Promise<PoolResource<T> | undefined> {
      if (this.total === options.max) {
        return;
      }

      this.total += 1;

      const resource = await options.create();

      return {
        resource,
        lastUsed: performance.now(),
      };
    },

    free: function (resource: PoolResource<T>) {
      this.available.push(resource);

      this.next();
    },

    next: async function () {
      if (!this.waiting.length) return;

      let available: PoolResource<T> | undefined = this.available.shift();
      if (!available) {
        available = await this.create();
      }

      if (!available) {
        return;
      }

      available.lastUsed = performance.now();

      const waiting = this.waiting.shift();

      if (!waiting) {
        this.free(available);

        return;
      }

      waiting(available);
    },
  };

  setTimeout(async () => {
    for (let i = 0; i < inner.total; ++i) {
      let available = inner.available.shift();
      if (!available) {
        break;
      }

      // This is not idle,
      // and since how the pool works all other resources won't be idle either
      if (available.lastUsed + options.idleTimeout! > performance.now()) {
        break;
      }

      await options.destroy(available.resource);
      inner.total -= 1;
    }
  }, options.idleTimeout);

  return {
    acquire: async function (): Promise<PoolResource<T>> {
      return new Promise(async (resolve) => {
        inner.waiting.push(resolve);
        await inner.next();
      });
    },

    free: function (resource: PoolResource<T>) {
      inner.free(resource);
    },

    inner,
  };
}

export type CreatePoolOptions<T> = {
  max: number;
  idleTimeout?: number;

  create(): Promise<T>;
  destroy(resource: T): Promise<void>;
};

type PoolResource<T> = {
  resource: T;
  lastUsed: number;
};
