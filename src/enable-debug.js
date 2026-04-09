
export function getDebugChanges() {
    const debugChanges = {
        _writes: {
            'debugMode=': {
                data: '0xAC258850',
                metadata: {
                    address: '0x000D9364',
                    element: {
                        structure: 'value',
                        type: 'u32'
                    }
                }
            }
        }
    }
    const result = {
        changeType: 'merge',
        merge: debugChanges,
    }
    return result
}
