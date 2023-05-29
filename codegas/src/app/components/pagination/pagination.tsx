'use client' 
import React, {useEffect, useState} from 'react';
import {Pagination, Stack } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

export function PaginationTable({total}) {
  const [page, setPage] = useState(0);
  const router = useRouter();
   const pathname = usePathname();
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    router.push(`${pathname}?page=${value}`);
  };
  useEffect(()=>{
    router.push(`${pathname}?page=${page}`);
  }, [])
  return (
    <Stack spacing={2} sx={{padding: 3}}>
        <Pagination 
          variant="outlined" 
          shape="rounded" 
          count={total+10}
          page={page}
          showFirstButton 
          showLastButton 
          onChange={handleChange} 
        />
    </Stack>
  );
}