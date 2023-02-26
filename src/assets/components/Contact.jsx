import React from "react";
import { useRef } from "react";
import emailjs from "@emailjs/browser";

function Contact() {
  const form = useRef();

  return (
    <>
      <section className="w-full min-h-screen flex justify-center">
        <div className="flex flex-col items-center max-w-7xl w-full h-screen">
          <h2 className="text-5xl font-extrabold text-blue-600 md:mt-20">
            Contactame
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
                  document.getElementById("formulary").reset()
              }}
            >
              <input
                type="text"
                placeholder="Nombre"
                className="input input-bordered border-blue-600 focus-visible:outline-none w-full max-w-lg"
                name="client_name"
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered border-blue-600 focus-visible:outline-none w-full max-w-lg mt-10"
                name="client_email"
              />

              <textarea
                className="textarea border-blue-600 focus-visible:outline-none w-full max-w-lg h-52 mt-10"
                placeholder="Mensaje"
                name="message"
              ></textarea>
              <input
                type="submit"
                className="btn btn-primary bg-sky-700 hover:bg-sky-900 border-none self-end mt-7 md:mr-20"
              />
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
