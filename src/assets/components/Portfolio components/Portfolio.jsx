import React from 'react'
import Card from './Card'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import {data} from '../../Data/ProjectData.js'

function Portfolio() {

  const [project, setProject] = useState([]);

   useEffect(() => {
    setProject(data);
  }, []);

  return (
    <>
    <section className='w-full min-h-screen h-screen'>

      {
        project.map((data) =>(
          <Card key={data.id} img={data.image} title={data.title} description={data.description} github={data.github} demo={data.demo} tec={data.technologies}/>
        ))
      }
    </section>
    <Footer/>
    </>
  )
}

export default Portfolio