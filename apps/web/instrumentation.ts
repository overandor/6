import { trace } from "@opentelemetry/api";

export async function register() {
  trace.getTracer("superposition-web").startSpan("bootstrap").end();
}
