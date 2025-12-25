/**
 * Système d'événements pour notifier les changements de pages
 * Permet de mettre à jour la navbar/footer en temps réel sans recharger
 */

export type PageEventType = 'page-updated' | 'page-deleted' | 'page-created'

export interface PageEvent {
  type: PageEventType
  pageId?: string
  slug?: string
}

class PageEventEmitter {
  private listeners: Set<(event: PageEvent) => void> = new Set()

  /**
   * Écouter les événements de changement de pages
   */
  on(listener: (event: PageEvent) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Émettre un événement de changement
   */
  emit(event: PageEvent) {
    this.listeners.forEach(listener => listener(event))
  }

  /**
   * Notifier qu'une page a été mise à jour (publication/dépublication)
   */
  pageUpdated(pageId: string, slug: string) {
    this.emit({ type: 'page-updated', pageId, slug })
  }

  /**
   * Notifier qu'une page a été créée
   */
  pageCreated(pageId: string, slug: string) {
    this.emit({ type: 'page-created', pageId, slug })
  }

  /**
   * Notifier qu'une page a été supprimée
   */
  pageDeleted(pageId: string, slug: string) {
    this.emit({ type: 'page-deleted', pageId, slug })
  }
}

export const pageEvents = new PageEventEmitter()
