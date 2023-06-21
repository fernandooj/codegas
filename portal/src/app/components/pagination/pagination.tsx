'use client' 
import React, {useEffect} from 'react';
import {Pagination, Stack } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function PaginationTable({total}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('search');

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`${pathname}?page=${value}&search=${search ?? undefined}`);
  };
  useEffect(()=>{
    router.push(`${pathname}?page=0`);
  }, [])


  return (
    <Stack spacing={2} sx={{padding: 3}}>
      <Pagination
        variant="outlined"
        shape="rounded"
        count={Math.ceil(total/10)}
        page={Number(searchParams.get('page')) ?? 1}
        showFirstButton
        showLastButton
        onChange={handleChange} 
      />
    </Stack>
  );
}