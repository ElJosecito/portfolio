import React from 'react'
import Card from './Card'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { data } from '../../Data/ProjectData.js'

function Portfolio({lenguaje}) {

  const [project, setProject] = useState([]);

   useEffect(() => {
    setProject(data);
  }, []);

  return (
    <>
    <section className='w-full min-h-screen h-fit flex justify-center py-20 bg-[#023047]'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {
        project.map((data) =>(
          <Card key={data.id} id={data.id} img={data.image} title={data.title} description={data.description} github={data.github} demo={data.demo} tec={data.technologies} alt={data.alt} lenguaje={lenguaje}/>
        ))
      }
      </div>
    </section>
    </>
  )
}

export default Portfolio