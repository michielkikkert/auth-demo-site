(() => {
  // node_modules/better-auth/dist/chunk-HVHN3Y2L.js
  var PROTO_POLLUTION_PATTERNS = {
    proto: /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
    constructor: /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
    protoShort: /"__proto__"\s*:/,
    constructorShort: /"constructor"\s*:/
  };
  var JSON_SIGNATURE = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
  var SPECIAL_VALUES = {
    true: true,
    false: false,
    null: null,
    undefined: void 0,
    nan: Number.NaN,
    infinity: Number.POSITIVE_INFINITY,
    "-infinity": Number.NEGATIVE_INFINITY
  };
  var ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
  function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }
  function parseISODate(value) {
    const match = ISO_DATE_REGEX.exec(value);
    if (!match)
      return null;
    const [
      ,
      year,
      month,
      day,
      hour,
      minute,
      second,
      ms,
      offsetSign,
      offsetHour,
      offsetMinute
    ] = match;
    let date = new Date(
      Date.UTC(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hour, 10),
        parseInt(minute, 10),
        parseInt(second, 10),
        ms ? parseInt(ms.padEnd(3, "0"), 10) : 0
      )
    );
    if (offsetSign) {
      const offset = (parseInt(offsetHour, 10) * 60 + parseInt(offsetMinute, 10)) * (offsetSign === "+" ? -1 : 1);
      date.setUTCMinutes(date.getUTCMinutes() + offset);
    }
    return isValidDate(date) ? date : null;
  }
  function betterJSONParse(value, options = {}) {
    const {
      strict = false,
      warnings = false,
      reviver,
      parseDates = true
    } = options;
    if (typeof value !== "string") {
      return value;
    }
    const trimmed = value.trim();
    if (trimmed[0] === '"' && trimmed.endsWith('"') && !trimmed.slice(1, -1).includes('"')) {
      return trimmed.slice(1, -1);
    }
    const lowerValue = trimmed.toLowerCase();
    if (lowerValue.length <= 9 && lowerValue in SPECIAL_VALUES) {
      return SPECIAL_VALUES[lowerValue];
    }
    if (!JSON_SIGNATURE.test(trimmed)) {
      if (strict) {
        throw new SyntaxError("[better-json] Invalid JSON");
      }
      return value;
    }
    const hasProtoPattern = Object.entries(PROTO_POLLUTION_PATTERNS).some(
      ([key, pattern]) => {
        const matches = pattern.test(trimmed);
        if (matches && warnings) {
          console.warn(
            `[better-json] Detected potential prototype pollution attempt using ${key} pattern`
          );
        }
        return matches;
      }
    );
    if (hasProtoPattern && strict) {
      throw new Error(
        "[better-json] Potential prototype pollution attempt detected"
      );
    }
    try {
      const secureReviver = (key, value2) => {
        if (key === "__proto__" || key === "constructor" && value2 && typeof value2 === "object" && "prototype" in value2) {
          if (warnings) {
            console.warn(
              `[better-json] Dropping "${key}" key to prevent prototype pollution`
            );
          }
          return void 0;
        }
        if (parseDates && typeof value2 === "string") {
          const date = parseISODate(value2);
          if (date) {
            return date;
          }
        }
        return reviver ? reviver(key, value2) : value2;
      };
      return JSON.parse(trimmed, secureReviver);
    } catch (error) {
      if (strict) {
        throw error;
      }
      return value;
    }
  }
  function parseJSON(value, options = { strict: true }) {
    return betterJSONParse(value, options);
  }

  // node_modules/better-auth/dist/chunk-TQQSPPNA.js
  var _envShim = /* @__PURE__ */ Object.create(null);
  var _getEnv = (useShim) => globalThis.process?.env || //@ts-expect-error
  globalThis.Deno?.env.toObject() || //@ts-expect-error
  globalThis.__env__ || (useShim ? _envShim : globalThis);
  var env = new Proxy(_envShim, {
    get(_, prop) {
      const env2 = _getEnv();
      return env2[prop] ?? _envShim[prop];
    },
    has(_, prop) {
      const env2 = _getEnv();
      return prop in env2 || prop in _envShim;
    },
    set(_, prop, value) {
      const env2 = _getEnv(true);
      env2[prop] = value;
      return true;
    },
    deleteProperty(_, prop) {
      if (!prop) {
        return false;
      }
      const env2 = _getEnv(true);
      delete env2[prop];
      return true;
    },
    ownKeys() {
      const env2 = _getEnv(true);
      return Object.keys(env2);
    }
  });
  function toBoolean(val) {
    return val ? val !== "false" : false;
  }
  var nodeENV = typeof process !== "undefined" && process.env && "development" || "";
  var isTest = nodeENV === "test" || toBoolean(env.TEST);

  // node_modules/better-auth/dist/chunk-UNWCXKMP.js
  var BetterAuthError = class extends Error {
    constructor(message, cause) {
      super(message);
      this.name = "BetterAuthError";
      this.message = message;
      this.cause = cause;
      this.stack = "";
    }
  };

  // node_modules/better-auth/dist/chunk-XFCIANZX.js
  function checkHasPath(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname !== "/";
    } catch (error) {
      throw new BetterAuthError(
        `Invalid base URL: ${url}. Please provide a valid base URL.`
      );
    }
  }
  function withPath(url, path = "/api/auth") {
    const hasPath = checkHasPath(url);
    if (hasPath) {
      return url;
    }
    path = path.startsWith("/") ? path : `/${path}`;
    return `${url.replace(/\/+$/, "")}${path}`;
  }
  function getBaseURL(url, path) {
    if (url) {
      return withPath(url, path);
    }
    const fromEnv = env.BETTER_AUTH_URL || env.NEXT_PUBLIC_BETTER_AUTH_URL || env.PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_AUTH_URL || (env.BASE_URL !== "/" ? env.BASE_URL : void 0);
    if (fromEnv) {
      return withPath(fromEnv, path);
    }
    if (typeof window !== "undefined" && window.location) {
      return withPath(window.location.origin, path);
    }
    return void 0;
  }

  // node_modules/@better-fetch/fetch/dist/index.js
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var BetterFetchError = class extends Error {
    constructor(status, statusText, error) {
      super(statusText || status.toString(), {
        cause: error
      });
      this.status = status;
      this.statusText = statusText;
      this.error = error;
    }
  };
  var initializePlugins = async (url, options) => {
    var _a, _b, _c, _d, _e, _f;
    let opts = options || {};
    const hooks = {
      onRequest: [options == null ? void 0 : options.onRequest],
      onResponse: [options == null ? void 0 : options.onResponse],
      onSuccess: [options == null ? void 0 : options.onSuccess],
      onError: [options == null ? void 0 : options.onError],
      onRetry: [options == null ? void 0 : options.onRetry]
    };
    if (!options || !(options == null ? void 0 : options.plugins)) {
      return {
        url,
        options: opts,
        hooks
      };
    }
    for (const plugin of (options == null ? void 0 : options.plugins) || []) {
      if (plugin.init) {
        const pluginRes = await ((_a = plugin.init) == null ? void 0 : _a.call(plugin, url.toString(), options));
        opts = pluginRes.options || opts;
        url = pluginRes.url;
      }
      hooks.onRequest.push((_b = plugin.hooks) == null ? void 0 : _b.onRequest);
      hooks.onResponse.push((_c = plugin.hooks) == null ? void 0 : _c.onResponse);
      hooks.onSuccess.push((_d = plugin.hooks) == null ? void 0 : _d.onSuccess);
      hooks.onError.push((_e = plugin.hooks) == null ? void 0 : _e.onError);
      hooks.onRetry.push((_f = plugin.hooks) == null ? void 0 : _f.onRetry);
    }
    return {
      url,
      options: opts,
      hooks
    };
  };
  var LinearRetryStrategy = class {
    constructor(options) {
      this.options = options;
    }
    shouldAttemptRetry(attempt, response) {
      if (this.options.shouldRetry) {
        return Promise.resolve(
          attempt < this.options.attempts && this.options.shouldRetry(response)
        );
      }
      return Promise.resolve(attempt < this.options.attempts);
    }
    getDelay() {
      return this.options.delay;
    }
  };
  var ExponentialRetryStrategy = class {
    constructor(options) {
      this.options = options;
    }
    shouldAttemptRetry(attempt, response) {
      if (this.options.shouldRetry) {
        return Promise.resolve(
          attempt < this.options.attempts && this.options.shouldRetry(response)
        );
      }
      return Promise.resolve(attempt < this.options.attempts);
    }
    getDelay(attempt) {
      const delay = Math.min(
        this.options.maxDelay,
        this.options.baseDelay * 2 ** attempt
      );
      return delay;
    }
  };
  function createRetryStrategy(options) {
    if (typeof options === "number") {
      return new LinearRetryStrategy({
        type: "linear",
        attempts: options,
        delay: 1e3
      });
    }
    switch (options.type) {
      case "linear":
        return new LinearRetryStrategy(options);
      case "exponential":
        return new ExponentialRetryStrategy(options);
      default:
        throw new Error("Invalid retry strategy");
    }
  }
  var getAuthHeader = (options) => {
    const headers = {};
    const getValue = (value) => typeof value === "function" ? value() : value;
    if (options == null ? void 0 : options.auth) {
      if (options.auth.type === "Bearer") {
        const token = getValue(options.auth.token);
        if (!token) {
          return headers;
        }
        headers["authorization"] = `Bearer ${token}`;
      } else if (options.auth.type === "Basic") {
        const username = getValue(options.auth.username);
        const password = getValue(options.auth.password);
        if (!username || !password) {
          return headers;
        }
        headers["authorization"] = `Basic ${btoa(`${username}:${password}`)}`;
      } else if (options.auth.type === "Custom") {
        const value = getValue(options.auth.value);
        if (!value) {
          return headers;
        }
        headers["authorization"] = `${getValue(options.auth.prefix)} ${value}`;
      }
    }
    return headers;
  };
  var methods = ["get", "post", "put", "patch", "delete"];
  var applySchemaPlugin = (config) => ({
    id: "apply-schema",
    name: "Apply Schema",
    version: "1.0.0",
    async init(url, options) {
      var _a, _b, _c, _d;
      const schema = ((_b = (_a = config.plugins) == null ? void 0 : _a.find(
        (plugin) => {
          var _a2;
          return ((_a2 = plugin.schema) == null ? void 0 : _a2.config) ? url.startsWith(plugin.schema.config.baseURL || "") || url.startsWith(plugin.schema.config.prefix || "") : false;
        }
      )) == null ? void 0 : _b.schema) || config.schema;
      if (schema) {
        let urlKey = url;
        if ((_c = schema.config) == null ? void 0 : _c.prefix) {
          if (urlKey.startsWith(schema.config.prefix)) {
            urlKey = urlKey.replace(schema.config.prefix, "");
            if (schema.config.baseURL) {
              url = url.replace(schema.config.prefix, schema.config.baseURL);
            }
          }
        }
        if ((_d = schema.config) == null ? void 0 : _d.baseURL) {
          if (urlKey.startsWith(schema.config.baseURL)) {
            urlKey = urlKey.replace(schema.config.baseURL, "");
          }
        }
        const keySchema = schema.schema[urlKey];
        if (keySchema) {
          let opts = __spreadProps(__spreadValues({}, options), {
            method: keySchema.method,
            output: keySchema.output
          });
          if (!(options == null ? void 0 : options.disableValidation)) {
            opts = __spreadProps(__spreadValues({}, opts), {
              body: keySchema.input ? keySchema.input.parse(options == null ? void 0 : options.body) : options == null ? void 0 : options.body,
              params: keySchema.params ? keySchema.params.parse(options == null ? void 0 : options.params) : options == null ? void 0 : options.params,
              query: keySchema.query ? keySchema.query.parse(options == null ? void 0 : options.query) : options == null ? void 0 : options.query
            });
          }
          return {
            url,
            options: opts
          };
        }
      }
      return {
        url,
        options
      };
    }
  });
  var createFetch = (config) => {
    async function $fetch(url, options) {
      const opts = __spreadProps(__spreadValues(__spreadValues({}, config), options), {
        plugins: [...(config == null ? void 0 : config.plugins) || [], applySchemaPlugin(config || {})]
      });
      if (config == null ? void 0 : config.catchAllError) {
        try {
          return await betterFetch(url, opts);
        } catch (error) {
          return {
            data: null,
            error: {
              status: 500,
              statusText: "Fetch Error",
              message: "Fetch related error. Captured by catchAllError option. See error property for more details.",
              error
            }
          };
        }
      }
      return await betterFetch(url, opts);
    }
    return $fetch;
  };
  var JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
  function detectResponseType(request) {
    const _contentType = request.headers.get("content-type");
    const textTypes = /* @__PURE__ */ new Set([
      "image/svg",
      "application/xml",
      "application/xhtml",
      "application/html"
    ]);
    if (!_contentType) {
      return "json";
    }
    const contentType = _contentType.split(";").shift() || "";
    if (JSON_RE.test(contentType)) {
      return "json";
    }
    if (textTypes.has(contentType) || contentType.startsWith("text/")) {
      return "text";
    }
    return "blob";
  }
  function isJSONParsable(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }
  function isJSONSerializable(value) {
    if (value === void 0) {
      return false;
    }
    const t = typeof value;
    if (t === "string" || t === "number" || t === "boolean" || t === null) {
      return true;
    }
    if (t !== "object") {
      return false;
    }
    if (Array.isArray(value)) {
      return true;
    }
    if (value.buffer) {
      return false;
    }
    return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
  }
  function jsonParse(text) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return text;
    }
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function getFetch(options) {
    if (options == null ? void 0 : options.customFetchImpl) {
      return options.customFetchImpl;
    }
    if (typeof globalThis !== "undefined" && isFunction(globalThis.fetch)) {
      return globalThis.fetch;
    }
    if (typeof window !== "undefined" && isFunction(window.fetch)) {
      return window.fetch;
    }
    throw new Error("No fetch implementation found");
  }
  function getHeaders(opts) {
    const headers = new Headers(opts == null ? void 0 : opts.headers);
    const authHeader = getAuthHeader(opts);
    for (const [key, value] of Object.entries(authHeader || {})) {
      headers.set(key, value);
    }
    if (!headers.has("content-type")) {
      const t = detectContentType(opts == null ? void 0 : opts.body);
      if (t) {
        headers.set("content-type", t);
      }
    }
    return headers;
  }
  function detectContentType(body) {
    if (isJSONSerializable(body)) {
      return "application/json";
    }
    return null;
  }
  function getBody(options) {
    if (!(options == null ? void 0 : options.body)) {
      return null;
    }
    const headers = new Headers(options == null ? void 0 : options.headers);
    if (isJSONSerializable(options.body) && !headers.has("content-type")) {
      return JSON.stringify(options.body);
    }
    return options.body;
  }
  function getMethod(url, options) {
    var _a;
    if (options == null ? void 0 : options.method) {
      return options.method.toUpperCase();
    }
    if (url.startsWith("@")) {
      const pMethod = (_a = url.split("@")[1]) == null ? void 0 : _a.split("/")[0];
      if (!methods.includes(pMethod)) {
        return (options == null ? void 0 : options.body) ? "POST" : "GET";
      }
      return pMethod.toUpperCase();
    }
    return (options == null ? void 0 : options.body) ? "POST" : "GET";
  }
  function getTimeout(options, controller) {
    let abortTimeout;
    if (!(options == null ? void 0 : options.signal) && (options == null ? void 0 : options.timeout)) {
      abortTimeout = setTimeout(() => controller == null ? void 0 : controller.abort(), options == null ? void 0 : options.timeout);
    }
    return {
      abortTimeout,
      clearTimeout: () => {
        if (abortTimeout) {
          clearTimeout(abortTimeout);
        }
      }
    };
  }
  function getURL2(url, option) {
    let { baseURL, params, query } = option || {
      query: {},
      params: {},
      baseURL: ""
    };
    let basePath = url.startsWith("http") ? url.split("/").slice(0, 3).join("/") : baseURL;
    if (!basePath) {
      throw new TypeError(
        `Invalid URL ${url}. Are you passing in a relative URL but not setting the baseURL?`
      );
    }
    if (url.startsWith("@")) {
      const m = url.toString().split("@")[1].split("/")[0];
      if (methods.includes(m)) {
        url = url.replace(`@${m}/`, "/");
      }
    }
    if (!basePath.endsWith("/"))
      basePath += "/";
    let [path, urlQuery] = url.replace(basePath, "").split("?");
    const queryParams = new URLSearchParams(urlQuery);
    for (const [key, value] of Object.entries(query || {})) {
      queryParams.set(key, String(value));
    }
    if (params) {
      if (Array.isArray(params)) {
        const paramPaths = path.split("/").filter((p) => p.startsWith(":"));
        for (const [index, key] of paramPaths.entries()) {
          const value = params[index];
          path = path.replace(key, value);
        }
      } else {
        for (const [key, value] of Object.entries(params)) {
          path = path.replace(`:${key}`, String(value));
        }
      }
    }
    path = path.split("/").map(encodeURIComponent).join("/");
    if (path.startsWith("/"))
      path = path.slice(1);
    let queryParamString = queryParams.size > 0 ? `?${queryParams}`.replace(/\+/g, "%20") : "";
    const _url = new URL(`${path}${queryParamString}`, basePath);
    return _url;
  }
  var betterFetch = async (url, options) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const {
      hooks,
      url: __url,
      options: opts
    } = await initializePlugins(url, options);
    const fetch2 = getFetch(opts);
    const controller = new AbortController();
    const signal = (_a = opts.signal) != null ? _a : controller.signal;
    const _url = getURL2(__url, opts);
    const body = getBody(opts);
    const headers = getHeaders(opts);
    const method = getMethod(__url, opts);
    let context = __spreadProps(__spreadValues({}, opts), {
      url: _url,
      headers,
      body,
      method,
      signal
    });
    for (const onRequest of hooks.onRequest) {
      if (onRequest) {
        const res = await onRequest(context);
        if (res instanceof Object) {
          context = res;
        }
      }
    }
    if ("pipeTo" in context && typeof context.pipeTo === "function" || typeof ((_b = options == null ? void 0 : options.body) == null ? void 0 : _b.pipe) === "function") {
      if (!("duplex" in context)) {
        context.duplex = "half";
      }
    }
    const { clearTimeout: clearTimeout2 } = getTimeout(opts, controller);
    let response = await fetch2(context.url, context);
    clearTimeout2();
    const responseContext = {
      response,
      request: context
    };
    for (const onResponse of hooks.onResponse) {
      if (onResponse) {
        const r = await onResponse(__spreadProps(__spreadValues({}, responseContext), {
          response: ((_c = options == null ? void 0 : options.hookOptions) == null ? void 0 : _c.cloneResponse) ? response.clone() : response
        }));
        if (r instanceof Response) {
          response = r;
        } else if (r instanceof Object) {
          response = r.response;
        }
      }
    }
    if (response.ok) {
      const hasBody = context.method !== "HEAD";
      if (!hasBody) {
        return {
          data: "",
          error: null
        };
      }
      const responseType = detectResponseType(response);
      const successContext = {
        data: "",
        response,
        request: context
      };
      if (responseType === "json" || responseType === "text") {
        const text2 = await response.text();
        const parser2 = (_d = context.jsonParser) != null ? _d : jsonParse;
        const data = await parser2(text2);
        successContext.data = data;
      } else {
        successContext.data = await response[responseType]();
      }
      if (context == null ? void 0 : context.output) {
        if (context.output && !context.disableValidation) {
          successContext.data = context.output.parse(
            successContext.data
          );
        }
      }
      for (const onSuccess of hooks.onSuccess) {
        if (onSuccess) {
          await onSuccess(__spreadProps(__spreadValues({}, successContext), {
            response: ((_e = options == null ? void 0 : options.hookOptions) == null ? void 0 : _e.cloneResponse) ? response.clone() : response
          }));
        }
      }
      if (options == null ? void 0 : options.throw) {
        return successContext.data;
      }
      return {
        data: successContext.data,
        error: null
      };
    }
    const parser = (_f = options == null ? void 0 : options.jsonParser) != null ? _f : jsonParse;
    const text = await response.text();
    const errorObject = isJSONParsable(text) ? await parser(text) : {};
    const errorContext = {
      response,
      request: context,
      error: __spreadProps(__spreadValues({}, errorObject), {
        status: response.status,
        statusText: response.statusText
      })
    };
    for (const onError of hooks.onError) {
      if (onError) {
        await onError(__spreadProps(__spreadValues({}, errorContext), {
          response: ((_g = options == null ? void 0 : options.hookOptions) == null ? void 0 : _g.cloneResponse) ? response.clone() : response
        }));
      }
    }
    if (options == null ? void 0 : options.retry) {
      const retryStrategy = createRetryStrategy(options.retry);
      const _retryAttempt = (_h = options.retryAttempt) != null ? _h : 0;
      if (await retryStrategy.shouldAttemptRetry(_retryAttempt, response)) {
        for (const onRetry of hooks.onRetry) {
          if (onRetry) {
            await onRetry(responseContext);
          }
        }
        const delay = retryStrategy.getDelay(_retryAttempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return await betterFetch(url, __spreadProps(__spreadValues({}, options), {
          retryAttempt: _retryAttempt + 1
        }));
      }
    }
    if (options == null ? void 0 : options.throw) {
      throw new BetterFetchError(
        response.status,
        response.statusText,
        errorObject
      );
    }
    return {
      data: null,
      error: __spreadProps(__spreadValues({}, errorObject), {
        status: response.status,
        statusText: response.statusText
      })
    };
  };

  // node_modules/nanostores/clean-stores/index.js
  var clean = Symbol("clean");

  // node_modules/nanostores/atom/index.js
  var listenerQueue = [];
  var lqIndex = 0;
  var QUEUE_ITEMS_PER_LISTENER = 4;
  var epoch = 0;
  var atom = (initialValue) => {
    let listeners = [];
    let $atom = {
      get() {
        if (!$atom.lc) {
          $atom.listen(() => {
          })();
        }
        return $atom.value;
      },
      lc: 0,
      listen(listener) {
        $atom.lc = listeners.push(listener);
        return () => {
          for (let i = lqIndex + QUEUE_ITEMS_PER_LISTENER; i < listenerQueue.length; ) {
            if (listenerQueue[i] === listener) {
              listenerQueue.splice(i, QUEUE_ITEMS_PER_LISTENER);
            } else {
              i += QUEUE_ITEMS_PER_LISTENER;
            }
          }
          let index = listeners.indexOf(listener);
          if (~index) {
            listeners.splice(index, 1);
            if (!--$atom.lc)
              $atom.off();
          }
        };
      },
      notify(oldValue, changedKey) {
        epoch++;
        let runListenerQueue = !listenerQueue.length;
        for (let listener of listeners) {
          listenerQueue.push(
            listener,
            $atom.value,
            oldValue,
            changedKey
          );
        }
        if (runListenerQueue) {
          for (lqIndex = 0; lqIndex < listenerQueue.length; lqIndex += QUEUE_ITEMS_PER_LISTENER) {
            listenerQueue[lqIndex](
              listenerQueue[lqIndex + 1],
              listenerQueue[lqIndex + 2],
              listenerQueue[lqIndex + 3]
            );
          }
          listenerQueue.length = 0;
        }
      },
      /* It will be called on last listener unsubscribing.
         We will redefine it in onMount and onStop. */
      off() {
      },
      set(newValue) {
        let oldValue = $atom.value;
        if (oldValue !== newValue) {
          $atom.value = newValue;
          $atom.notify(oldValue);
        }
      },
      subscribe(listener) {
        let unbind = $atom.listen(listener);
        listener($atom.value);
        return unbind;
      },
      value: initialValue
    };
    if (true) {
      $atom[clean] = () => {
        listeners = [];
        $atom.lc = 0;
        $atom.off();
      };
    }
    return $atom;
  };

  // node_modules/nanostores/lifecycle/index.js
  var MOUNT = 5;
  var UNMOUNT = 6;
  var REVERT_MUTATION = 10;
  var on = (object, listener, eventKey, mutateStore) => {
    object.events = object.events || {};
    if (!object.events[eventKey + REVERT_MUTATION]) {
      object.events[eventKey + REVERT_MUTATION] = mutateStore((eventProps) => {
        object.events[eventKey].reduceRight((event, l) => (l(event), event), {
          shared: {},
          ...eventProps
        });
      });
    }
    object.events[eventKey] = object.events[eventKey] || [];
    object.events[eventKey].push(listener);
    return () => {
      let currentListeners = object.events[eventKey];
      let index = currentListeners.indexOf(listener);
      currentListeners.splice(index, 1);
      if (!currentListeners.length) {
        delete object.events[eventKey];
        object.events[eventKey + REVERT_MUTATION]();
        delete object.events[eventKey + REVERT_MUTATION];
      }
    };
  };
  var STORE_UNMOUNT_DELAY = 1e3;
  var onMount = ($store, initialize) => {
    let listener = (payload) => {
      let destroy = initialize(payload);
      if (destroy)
        $store.events[UNMOUNT].push(destroy);
    };
    return on($store, listener, MOUNT, (runListeners) => {
      let originListen = $store.listen;
      $store.listen = (...args) => {
        if (!$store.lc && !$store.active) {
          $store.active = true;
          runListeners();
        }
        return originListen(...args);
      };
      let originOff = $store.off;
      $store.events[UNMOUNT] = [];
      $store.off = () => {
        originOff();
        setTimeout(() => {
          if ($store.active && !$store.lc) {
            $store.active = false;
            for (let destroy of $store.events[UNMOUNT])
              destroy();
            $store.events[UNMOUNT] = [];
          }
        }, STORE_UNMOUNT_DELAY);
      };
      if (true) {
        let originClean = $store[clean];
        $store[clean] = () => {
          for (let destroy of $store.events[UNMOUNT])
            destroy();
          $store.events[UNMOUNT] = [];
          $store.active = false;
          originClean();
        };
      }
      return () => {
        $store.listen = originListen;
        $store.off = originOff;
      };
    });
  };

  // node_modules/better-auth/dist/chunk-PY47VMWF.js
  var useAuthQuery = (initializedAtom, path, $fetch, options) => {
    const value = atom({
      data: null,
      error: null,
      isPending: true,
      isRefetching: false,
      refetch: () => {
        return fn();
      }
    });
    const fn = () => {
      const opts = typeof options === "function" ? options({
        data: value.get().data,
        error: value.get().error,
        isPending: value.get().isPending
      }) : options;
      return $fetch(path, {
        ...opts,
        async onSuccess(context) {
          if (typeof window !== "undefined") {
            value.set({
              data: context.data,
              error: null,
              isPending: false,
              isRefetching: false,
              refetch: value.value.refetch
            });
          }
          await opts?.onSuccess?.(context);
        },
        async onError(context) {
          const { request } = context;
          const retryAttempts = typeof request.retry === "number" ? request.retry : request.retry?.attempts;
          const retryAttempt = request.retryAttempt || 0;
          if (retryAttempts && retryAttempt < retryAttempts)
            return;
          value.set({
            error: context.error,
            data: null,
            isPending: false,
            isRefetching: false,
            refetch: value.value.refetch
          });
          await opts?.onError?.(context);
        },
        async onRequest(context) {
          const currentValue = value.get();
          value.set({
            isPending: currentValue.data === null,
            data: currentValue.data,
            error: null,
            isRefetching: true,
            refetch: value.value.refetch
          });
          await opts?.onRequest?.(context);
        }
      });
    };
    initializedAtom = Array.isArray(initializedAtom) ? initializedAtom : [initializedAtom];
    let isMounted = false;
    for (const initAtom of initializedAtom) {
      initAtom.subscribe(() => {
        if (isMounted) {
          fn();
        } else {
          onMount(value, () => {
            fn();
            isMounted = true;
            return () => {
              value.off();
              initAtom.off();
            };
          });
        }
      });
    }
    return value;
  };
  var redirectPlugin = {
    id: "redirect",
    name: "Redirect",
    hooks: {
      onSuccess(context) {
        if (context.data?.url && context.data?.redirect) {
          if (typeof window !== "undefined" && window.location) {
            if (window.location) {
              try {
                window.location.href = context.data.url;
              } catch {
              }
            }
          }
        }
      }
    }
  };
  function getSessionAtom($fetch) {
    const $signal = atom(false);
    const session = useAuthQuery($signal, "/get-session", $fetch, {
      method: "GET"
    });
    return {
      session,
      $sessionSignal: $signal
    };
  }
  var getClientConfig = (options) => {
    const isCredentialsSupported = "credentials" in Request.prototype;
    const baseURL = getBaseURL(options?.baseURL);
    const pluginsFetchPlugins = options?.plugins?.flatMap((plugin) => plugin.fetchPlugins).filter((pl) => pl !== void 0) || [];
    const $fetch = createFetch({
      baseURL,
      ...isCredentialsSupported ? { credentials: "include" } : {},
      method: "GET",
      jsonParser(text) {
        return parseJSON(text, {
          strict: false
        });
      },
      customFetchImpl: async (input, init) => {
        try {
          return await fetch(input, init);
        } catch (error) {
          return Response.error();
        }
      },
      ...options?.fetchOptions,
      plugins: options?.disableDefaultFetchPlugins ? [...options?.fetchOptions?.plugins || [], ...pluginsFetchPlugins] : [
        redirectPlugin,
        ...options?.fetchOptions?.plugins || [],
        ...pluginsFetchPlugins
      ]
    });
    const { $sessionSignal, session } = getSessionAtom($fetch);
    const plugins = options?.plugins || [];
    let pluginsActions = {};
    let pluginsAtoms = {
      $sessionSignal,
      session
    };
    let pluginPathMethods = {
      "/sign-out": "POST",
      "/revoke-sessions": "POST",
      "/revoke-other-sessions": "POST",
      "/delete-user": "POST"
    };
    const atomListeners = [
      {
        signal: "$sessionSignal",
        matcher(path) {
          return path === "/sign-out" || path === "/update-user" || path.startsWith("/sign-in") || path.startsWith("/sign-up") || path === "/delete-user";
        }
      }
    ];
    for (const plugin of plugins) {
      if (plugin.getAtoms) {
        Object.assign(pluginsAtoms, plugin.getAtoms?.($fetch));
      }
      if (plugin.pathMethods) {
        Object.assign(pluginPathMethods, plugin.pathMethods);
      }
      if (plugin.atomListeners) {
        atomListeners.push(...plugin.atomListeners);
      }
    }
    const $store = {
      notify: (signal) => {
        pluginsAtoms[signal].set(
          !pluginsAtoms[signal].get()
        );
      },
      listen: (signal, listener) => {
        pluginsAtoms[signal].subscribe(listener);
      },
      atoms: pluginsAtoms
    };
    for (const plugin of plugins) {
      if (plugin.getActions) {
        Object.assign(pluginsActions, plugin.getActions?.($fetch, $store));
      }
    }
    return {
      pluginsActions,
      pluginsAtoms,
      pluginPathMethods,
      atomListeners,
      $fetch,
      $store
    };
  };
  function getMethod2(path, knownPathMethods, args) {
    const method = knownPathMethods[path];
    const { fetchOptions, query, ...body } = args || {};
    if (method) {
      return method;
    }
    if (fetchOptions?.method) {
      return fetchOptions.method;
    }
    if (body && Object.keys(body).length > 0) {
      return "POST";
    }
    return "GET";
  }
  function createDynamicPathProxy(routes, client, knownPathMethods, atoms, atomListeners) {
    function createProxy(path = []) {
      return new Proxy(function() {
      }, {
        get(target, prop) {
          const fullPath = [...path, prop];
          let current = routes;
          for (const segment of fullPath) {
            if (current && typeof current === "object" && segment in current) {
              current = current[segment];
            } else {
              current = void 0;
              break;
            }
          }
          if (typeof current === "function") {
            return current;
          }
          return createProxy(fullPath);
        },
        apply: async (_, __, args) => {
          const routePath = "/" + path.map(
            (segment) => segment.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
          ).join("/");
          const arg = args[0] || {};
          const fetchOptions = args[1] || {};
          const { query, fetchOptions: argFetchOptions, ...body } = arg;
          const options = {
            ...fetchOptions,
            ...argFetchOptions
          };
          const method = getMethod2(routePath, knownPathMethods, arg);
          return await client(routePath, {
            ...options,
            body: method === "GET" ? void 0 : {
              ...body,
              ...options?.body || {}
            },
            query: query || options?.query,
            method,
            async onSuccess(context) {
              await options?.onSuccess?.(context);
              const matches = atomListeners?.find((s) => s.matcher(routePath));
              if (!matches)
                return;
              const signal = atoms[matches.signal];
              if (!signal)
                return;
              const val = signal.get();
              setTimeout(() => {
                signal.set(!val);
              }, 10);
            }
          });
        }
      });
    }
    return createProxy();
  }

  // node_modules/better-auth/dist/chunk-3XTQSPPA.js
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // node_modules/better-auth/dist/chunk-47EOFRJT.js
  function createAuthClient(options) {
    const {
      pluginPathMethods,
      pluginsActions,
      pluginsAtoms,
      $fetch,
      atomListeners,
      $store
    } = getClientConfig(options);
    let resolvedHooks = {};
    for (const [key, value] of Object.entries(pluginsAtoms)) {
      resolvedHooks[`use${capitalizeFirstLetter(key)}`] = value;
    }
    const routes = {
      ...pluginsActions,
      ...resolvedHooks,
      $fetch,
      $store
    };
    const proxy = createDynamicPathProxy(
      routes,
      $fetch,
      pluginPathMethods,
      pluginsAtoms,
      atomListeners
    );
    return proxy;
  }

  // auth.ts
  var authClient = createAuthClient({
    baseURL: new URL(document.location.hostname) + "/auth"
  });
  document.addEventListener("DOMContentLoaded", async () => {
    const userEmailElement = document.getElementById("user-email");
    const userIconElement = document.querySelector("#user-account i");
    if (!userEmailElement || !userIconElement) {
      console.error("Required DOM elements not found");
      return;
    }
    try {
      const session = await authClient.getSession();
      if (session && session.data) {
        console.log(session.data);
        userEmailElement.textContent = session.data.user.email;
        userEmailElement.title = "Sign out";
        userIconElement.className = "fas fa-user";
        userEmailElement.onclick = async () => {
          await authClient.signOut();
          document.location.reload();
        };
      } else {
        userEmailElement.textContent = "Click to sign in";
        userIconElement.className = "fas fa-user-circle";
        userEmailElement.onclick = () => {
          document.location = `/auth/front/signin?returnUrl=${window.location.href}`;
        };
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      userEmailElement.textContent = "";
      userIconElement.className = "fas fa-user-circle";
    }
  });
})();
