import React from "react";
import { useRef } from "react";
import emailjs from "@emailjs/browser";

//AOS
import Aos from "aos";
import "aos/dist/aos.css";

function Contact({lenguaje}) {
  const form = useRef();

  return (
    <>

      <section className="w-full min-h-screen flex justify-center bg-[#023047] pt-20" id="contact">
        <div className="flex flex-col items-center max-w-7xl w-full h-screen">
          <h2 className="text-5xl font-extrabold font-frank text-[#ffb703] md:mt-20 " >
            {lenguaje.contact.title}
          </h2>

          <div className="flex justify-center items-center w-full h-full">
            <form
              id="formulary"
              ref={form}
              action="submit"
              className="flex flex-col items-center justify-center max-w-2xl w-full h-full m-4"
              onSubmit={(e) => {
                e.preventDefault();

                emailjs
                  .sendForm(
                    import.meta.env.VITE_YOUR_SERVICE_ID,
                    import.meta.env.VITE_YOUR_TEMPLATE_ID,
                    form.current,
                    "0Z-hpVTbMNTEe4EtJ"
                  )
                  .then(
                    (result) => {
                      console.log(result.text);
                    },
                    (error) => {
                      console.log(error.text);
                    }
                  );
                document.getElementById("formulary").reset();
              }}
            >
              <input
                type="text"
                placeholder={lenguaje.contact.name}
                className="focus:outline-none focus:bg-white focus:bg-opacity-5 transition-all duration-150 bg-transparent border-b-4 border-[#ffb703] w-full max-w-lg p-2 text-nusar text-white"
                name="client_name"
              />
              <input
                type="email"
                placeholder={lenguaje.contact.email}
                className=" focus:outline-none focus:bg-white focus:bg-opacity-5 transition-all duration-150 bg-transparent border-b-4 border-[#ffb703] w-full max-w-lg p-2 text-nusar text-white mt-10"
                name="client_email"
              />

              <textarea
                className="focus:outline-none focus:bg-white focus:bg-opacity-5 transition-all duration-150 bg-transparent border-b-4 border-[#ffb703] w-full max-w-lg p-2 text-nusar text-white  h-52 mt-10"
                placeholder={lenguaje.contact.message}
                name="message"
              ></textarea>
              <button
                type="submit"
                className="bg-[#ffb703] w-24 py-2 rounded-lg text-[#023047] font-semibold self-end mt-7 md:mr-20"
              >
                {lenguaje.contact.btn}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
