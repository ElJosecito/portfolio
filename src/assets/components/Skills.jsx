import React from "react";

function Skills() {
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center max-w-7xl w-full h-screen ">
          <h2 className="text-3xl font-extrabold text-blue-600 m-5 mb-10 mt-20">
            Principal Skills
          </h2>
          <div className="flex justify-around w-full">
            {/* HTML */}
            <div className="avatar flex flex-col items-center">
              <div className="w-16 rounded ">
                <img
                  src="https://www.dropbox.com/s/tyehjv9gei864pe/HTML.png?raw=1"
                  alt=""
                />
              </div>
              <h3 className="text-sm font-black font mt-2">HTML</h3>
            </div>
            {/* CSS */}
            <div className="avatar flex flex-col items-center">
              <div className="w-16 rounded ">
                <img
                  src="https://www.dropbox.com/s/vbxe6vbqfzs6ihb/CSS.png?raw=1"
                  alt=""
                />
              </div>
              <h3 className="text-sm font-black font mt-2">CSS</h3>
            </div>
            {/* Javascript */}
            <div className="avatar flex flex-col items-center">
              <div className="w-14 rounded ">
                <img
                  src="https://www.dropbox.com/s/8mlzbk0sfrjxm6s/JS.png?raw=1"
                  alt=""
                  className=""
                />
              </div>
              <h3 className="text-sm font-black font mt-4">JavaScript</h3>
            </div>
          </div>

          {/* FrameWoks And Libraries */}

          <h2 className="text-2xl font-bold text-blue-600 mt-20 mb-10"> Frameworks, Libraries and Tools</h2>
          <div className="flex justify-around w-full">
            {/* BootStrap */}
            <div className="avatar flex flex-col items-center">
              <div className="w-16 rounded ">
                <img
                  src="https://www.dropbox.com/s/19op6dgkh581mps/bootstrap_plain_logo_icon_146619.png?raw=1"
                  alt=""
                />
              </div>
              <h3 className="text-sm font-black font mt-2">BootStrap</h3>
            </div>
            {/* TailwindCSS */}
            <div className="avatar flex flex-col items-center">
              <div className="w-16 rounded">
                <img
                  src="https://www.dropbox.com/s/6pqsucbt5i6wk86/file_type_tailwind_icon_130128.png?raw=1"
                  alt=""
                />
              </div>
              <h3 className="text-sm font-black font mt-2">Tailwind</h3>
            </div>
            {/* Sass */}
            <div className="avatar flex flex-col items-center">
              <div className="w-14 rounded ">
                <img
                  src="https://www.dropbox.com/s/p0gm6d9ykoltday/file_type_sass_icon_130182.png?raw=1"
                  alt=""
                  className=""
                />
              </div>
              <h3 className="text-sm font-black font mt-4">Sass</h3>
            </div>
            {/* React */}
            <div className="avatar flex flex-col items-center">
              <div className="w-16 rounded ">
                <img
                  src="https://www.dropbox.com/s/77nnwv8krqrdtww/react_original_logo_icon_146374.png?raw=1"
                  alt=""
                  className=""
                />
              </div>
              <h3 className="text-sm font-black font mt-4">React</h3>
            </div>
          </div>

          {/*  */}

          <div className="flex justify-around w-full mt-10">
            {/* Figma */}
            <div className="avatar flex flex-col items-center">
              <div className="w-16 rounded ">
                <img
                  src="https://www.dropbox.com/s/dwrwmlptmacwd3p/figma_logo_icon_170157.png?raw=1"
                  alt=""
                />
              </div>
              <h3 className="text-sm font-black font mt-2">Figma</h3>
            </div>
            {/* Git */}
            <div className="avatar flex flex-col items-center">
              <div className="w-16 rounded ">
                <img
                  src="https://www.dropbox.com/s/cqu0n1hlxn1i1bp/file_type_git_icon_130581.png?raw=1"
                  alt=""
                />
              </div>
              <h3 className="text-sm font-black font mt-2">Git</h3>
            </div>
            {/* GitHub */}
            <div className="avatar flex flex-col items-center">
              <div className="w-16 rounded ">
                <img
                  src="https://www.dropbox.com/s/gxodplcdfdus1o2/github_git_icon_145985.png?raw=1"
                  alt=""
                  className=""
                />
              </div>
              <h3 className="text-sm font-black font mt-4">GitHub</h3>
            </div>
            {/* Node */}
            <div className="avatar flex flex-col items-center">
              <div className="w-16 rounded ">
                <img
                  src="https://www.dropbox.com/s/qsu37ymsyt6vcbv/file_type_node_icon_130301.png?raw=1"
                  alt=""
                  className=""
                />
              </div>
              <h3 className="text-sm font-black font mt-4">Node</h3>
            </div>
          </div>

        </div>


      </div>
    </>
  );
}

export default Skills;
