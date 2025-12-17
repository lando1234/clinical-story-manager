/**
 * Domain Event Infrastructure
 *
 * Provides a simple in-memory pub/sub pattern for domain events.
 * Events are emitted synchronously and handlers are called in registration order.
 *
 * This is NOT for clinical timeline events (ClinicalEvent model).
 * Domain events are transient, in-memory signals for cross-cutting concerns.
 */

/**
 * Base interface for all domain events.
 */
export interface DomainEvent<T = unknown> {
  /** Unique event type identifier */
  readonly eventType: string;
  /** When the event occurred */
  readonly occurredAt: Date;
  /** Event-specific payload */
  readonly payload: T;
  /** Optional correlation ID for tracing */
  readonly correlationId?: string;
}

/**
 * Type-safe event handler function.
 */
export type DomainEventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

/**
 * Singleton event emitter for domain events.
 *
 * Usage:
 * ```typescript
 * // Subscribe to events
 * domainEventEmitter.on('AppointmentScheduled', (event) => {
 *   console.log('Appointment scheduled:', event.payload);
 * });
 *
 * // Emit events
 * domainEventEmitter.emit({
 *   eventType: 'AppointmentScheduled',
 *   occurredAt: new Date(),
 *   payload: { appointmentId: '123', patientId: '456' }
 * });
 * ```
 */
class DomainEventEmitter {
  private handlers: Map<string, DomainEventHandler[]> = new Map();

  /**
   * Subscribe to a specific event type.
   *
   * @param eventType - The event type to listen for
   * @param handler - Function to call when event is emitted
   * @returns Unsubscribe function
   */
  on<T extends DomainEvent>(
    eventType: string,
    handler: DomainEventHandler<T>
  ): () => void {
    const handlers = this.handlers.get(eventType) ?? [];
    handlers.push(handler as DomainEventHandler);
    this.handlers.set(eventType, handlers);

    // Return unsubscribe function
    return () => {
      const currentHandlers = this.handlers.get(eventType);
      if (currentHandlers) {
        const index = currentHandlers.indexOf(handler as DomainEventHandler);
        if (index > -1) {
          currentHandlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit a domain event to all registered handlers.
   *
   * Handlers are called synchronously in registration order.
   * Errors in handlers are logged but do not stop other handlers.
   *
   * @param event - The event to emit
   */
  emit<T extends DomainEvent>(event: T): void {
    const handlers = this.handlers.get(event.eventType);
    if (!handlers || handlers.length === 0) {
      return;
    }

    for (const handler of handlers) {
      try {
        const result = handler(event);
        // If handler returns a promise, we don't await it
        // but we catch any rejections to prevent unhandled promise rejections
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(
              `Async error in domain event handler for ${event.eventType}:`,
              error
            );
          });
        }
      } catch (error) {
        console.error(
          `Error in domain event handler for ${event.eventType}:`,
          error
        );
      }
    }
  }

  /**
   * Remove all handlers for a specific event type.
   *
   * @param eventType - The event type to clear handlers for
   */
  off(eventType: string): void {
    this.handlers.delete(eventType);
  }

  /**
   * Remove all handlers for all event types.
   * Useful for testing.
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Get the count of handlers for a specific event type.
   * Useful for testing.
   */
  handlerCount(eventType: string): number {
    return this.handlers.get(eventType)?.length ?? 0;
  }
}

/**
 * Singleton instance of the domain event emitter.
 * Use this for all domain event operations.
 */
export const domainEventEmitter = new DomainEventEmitter();

/**
 * Helper to create a typed domain event.
 */
export function createDomainEvent<T>(
  eventType: string,
  payload: T,
  correlationId?: string
): DomainEvent<T> {
  return {
    eventType,
    occurredAt: new Date(),
    payload,
    correlationId,
  };
}
