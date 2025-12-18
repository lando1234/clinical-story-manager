/**
 * Domain Events Module
 *
 * Public exports for the domain event infrastructure.
 */

export type {
  DomainEvent,
  DomainEventHandler,
} from "./domain-event";

export {
  domainEventEmitter,
  createDomainEvent,
} from "./domain-event";
