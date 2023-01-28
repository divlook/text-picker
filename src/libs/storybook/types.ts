export interface Parameters {
    layout?: 'centered' | 'fullscreen' | 'padded'
    backgrounds?: {
        default?: string
        values?: { name: string; value: string }[]
    }
}
