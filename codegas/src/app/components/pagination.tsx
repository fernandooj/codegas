'use client' 
import React, {useState} from 'react';
import {Pagination, Stack } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

export function PaginationTable() {
  const [page, setPage] = useState(1);
  const router = useRouter();
   const pathname = usePathname();
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    router.push(`${pathname}?page=${value}`);
  };
  return (
    <Stack spacing={2} sx={{padding: 3}}>
        <Pagination 
          variant="outlined" 
          shape="rounded" 
          count={10}
          page={page}
          showFirstButton 
          showLastButton 
          onChange={handleChange} 
        />
    </Stack>
  );
}