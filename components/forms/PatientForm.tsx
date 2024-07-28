"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.action";



const PatientForm = () => {

   const router = useRouter();

   const [isLoading, setIsLoading] = useState(false);
   
   const form = useForm<z.infer<typeof UserFormValidation>>({
      resolver: zodResolver(UserFormValidation),
      defaultValues: {
         name: "",
         email: "",
         phone: ""
      },
   });

   async function  onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
      setIsLoading(true)
      try {
         const userData = {
            name,
            email,
            phone
         }

         const user = await createUser(userData);
      
         if(user)
            router.push(`patients/${user.$id}/register`);

      }
      catch(error: any) {
         console.log(error)
      }
      finally {
         setIsLoading(false);
      }
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex-1"
         >
            <section className="mb-6 space-y-4">
               <h1 className="header">Hi there </h1>
               <p>schedule your first appointment</p>
            </section>
            <CustomFormField
               fieldType={FormFieldType.INPUT}
               control={form.control}
               name="name"
               label="Full Name"
               placeholder="Type you name"
               iconSrc="/assets/icons/user.svg"
               iconAlt="User"
            />
            <CustomFormField
               fieldType={FormFieldType.INPUT}
               control={form.control}
               name="email"
               label="Email"
               placeholder="Type your Email Address"
               iconSrc="/assets/icons/email.svg"
               iconAlt="Email"
            />
              <CustomFormField
               fieldType={FormFieldType.PHONE_INPUT}
               control={form.control}
               name="phone"
               label="Phone number"
               placeholder="(555) 123-4567"
              
            />
            <SubmitButton 
               isLoading={isLoading}>Get Started</SubmitButton>
         </form>
      </Form>
   );
};

export default PatientForm;
