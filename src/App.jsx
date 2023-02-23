import './assets/styles/tailwind.css'
import Hero from './assets/components/Hero'

function App() {

  return (
   <>
    {/* <Navbar/> */}
    <div className="drawer">
  <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
  <div className="drawer-content flex flex-col">
    {/* <!-- Navbar --> */}
    <div className="w-full navbar flex justify-between bg-base-100 fixed">
      
      <div className="btn btn-ghost normal-case text-xl">Navbar Title</div>
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal px-1">
          {/* <!-- Navbar menu content here --> */}
          <li><a>Navbar Item 1</a></li>
          <li><a>Navbar Item 2</a></li>
        </ul>
      </div>

      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div> 
    </div>
    {/* <!-- Page content here --> */}
    <Hero/>
    {/* Page content ends here */}
  </div> 
  <div className="drawer-side">
    <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
    <ul className="menu p-4 w-80 bg-base-100">
      {/* <!-- Sidebar content here --> */}
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
      
    </ul>
    
  </div>
</div>
   </>
  )
}

export default App
