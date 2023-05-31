'use cliente'
import React, { ReactElement } from 'react';

import {DataContext} from "../context/context"
import { RenderZonasUsers } from './renderZonasUsers'; 
import InputSearch from "../components/search/search"

const limit=10
const idZone=110
const type='BySearch'
const Zona = ({searchParams}: any): ReactElement => {
  let {page, search} = searchParams
  page = page || 0
  // search = search || ' '
  // const {user}: any = useContext(DataContext)
  // if(!user) redirect('/'))

  return (
    <>
      <InputSearch search={search} />
      <RenderZonasUsers 
         limit={limit}
         search={search}
         page={page} 
         idZone={idZone}
         type={type}
      />
    </>
  )
}

export default Zona
 