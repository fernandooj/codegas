import { fireEvent, render } from '@testing-library/react';
import { PaginationTable } from './PaginationTable';

it('should update page on pagination change', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => 'mocked-pathname',
  }));

  const { getByRole } = render(<PaginationTable />);
  const page2Button = getByRole('button', { name: '2' });

  // Verificar que la página inicial sea 1
  expect(getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'true');

  // Simular el cambio de página a la página 2
  fireEvent.click(page2Button);

  // Verificar que la página se haya actualizado a 2
  expect(getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'true');

  // Verificar que se haya llamado a la función router.push con la URL correcta
  expect(mockRouter.push).toHaveBeenCalledWith('mocked-pathname?page=2');
});
