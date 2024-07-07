
import FormTesting from "@/components/forms/FormTesting";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.action";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  
   const user = await getUser(userId);

   return (
      <div className="flex h-screen max-h-screen ">
         {/* TODO OTP Verification | Passkey code*/}

         <section className="remove-scrollbar container my-auto">
            <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
               <Image
                  src="/assets/icons/logo-full.svg"
                  height={1000}
                  width={1000}
                  alt="patient"
                  className="mb-12 h-10 w-fit"
               />
             
               <RegisterForm user={user} />
              
               <div className="text-regular-14 mt-10 flex justify-between ">
                  <p className="justify-items-end text-dark-600 xl:text-left">
                     © 2024 Crossworld Health
                  </p>
                  <Link href="/?admin=true" className="text-green-500">
                     Admin
                  </Link>
               </div>
            </div>
         </section>
         <Image
            src="/assets/images/register-img.png"
            height={1000}
            width={1000}
            alt="patient"
            className="side-img max-w-[390px] h-full"
         />
      </div>
   );
};

export default Register;
