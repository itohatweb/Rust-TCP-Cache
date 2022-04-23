/*
 * The MIT License (MIT)
 *
 * Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Generate a random id (string).
 * The default of 21 characters should be enough for most use cases
 * ~149 billion years needed, in order to have a 1% probability of at least one collision.
 */
export default function nanoid(size = 21) {
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  for (; size--;) {
    const num = 63 & bytes[size];
    id += num < 36
      ? num.toString(36)
      : num < 62
      ? (num - 26).toString(36).toUpperCase()
      : num < 63
      ? "_"
      : "-";
  }
  return id;
}
