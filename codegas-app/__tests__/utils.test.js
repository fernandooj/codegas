// Test básico para verificar que Jest funciona
describe('Basic Jest Test', () => {
    it('should pass basic test', () => {
        expect(1 + 1).toBe(2);
    });

    it('should test string operations', () => {
        const text = 'CODEGAS';
        expect(text.toLowerCase()).toBe('codegas');
        expect(text.length).toBe(7);
    });

    it('should test array operations', () => {
        const pedidos = [
            { id: 1, estado: 'activo' },
            { id: 2, estado: 'innactivo' }
        ];

        expect(pedidos).toHaveLength(2);
        expect(pedidos[0].estado).toBe('activo');
    });
});
