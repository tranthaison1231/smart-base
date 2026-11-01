import "server-only"

import pino from "pino"

type LogEvent = { event: string; [key: string]: unknown }

const output = pino(
  { base: undefined },
  pino.multistream(
    [
      { level: "info", stream: process.stdout },
      { level: "warn", stream: process.stderr },
    ],
    { dedupe: true },
  ),
)

export const logger = {
  info: (details: LogEvent) => output.info(details),
  warn: (details: LogEvent) => output.warn(details),
  error: (details: LogEvent) => output.error(details),
}
