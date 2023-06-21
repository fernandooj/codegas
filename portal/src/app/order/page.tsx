import React, { ReactElement } from 'react';

import { RenderTanques } from './renderTanques'; 
import InputSearch from "../components/search/search"

const limit=10

const Tanque = ({searchParams}: any): ReactElement => {
  let {page, search} = searchParams
  page = page || 0

  return (
    <>
      <InputSearch search={search} />
      {RenderTanques({limit, search, page})} 
    </>
  )
}

export default Tanque
 