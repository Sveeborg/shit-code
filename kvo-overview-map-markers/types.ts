export type KvoCard = {
  /**
   * идентификатор
   */
  uid: string
  /**
   * название
   */
  name: string
  /**
   * адрес
   */
  address?: string
  /**
   * статус ОН
   */
  status: CodeKvoStatus
  /**
   * координаты
   */
  lngLat: [number, number]
  /**
   * статистика видимых БВС
   */
  droneCounts: KVOSurveillanceCounters
  /**
   * краткая история событий
   * TODO: KvoEvent[]
   */
  shortHistory: unknown[]
}

export type KVOSurveillanceCounters = {
  all: number
  own: number
  violating: number
  noPlan: number
}

/**
 * Статус КВО
 */
export type CodeKvoStatus =
  | 'OPERABLE' // Исправно
  | 'FAILURE' // В Аварии
  | 'WARNING' // Предупреждение
  | 'NO_DATA' // Нет данных
