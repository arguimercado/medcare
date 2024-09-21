"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import {getAppointmentSchema} from "@/lib/validation";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.action";
import { Appointment } from "@/types/appwrite.types";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";

interface IProps {
   userId: string;
   patientId: string;
   type: "create" | "schedule" | "cancel";
   appointment?: Appointment;
   setOpen?: Dispatch<SetStateAction<boolean>>;
   dialogMode?: boolean
}


const getType = (type:string) => {
   let status = "";
   switch (type) {
      case "schedule":
         status = "scheduled";
         break;
      case "cancel":
         status = "cancelled";
         break;
      default:
         status = "pending";
   }

   return status
}
const useAppointmentForm = (options: IProps) => {

   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const AppointmentFormValidation = getAppointmentSchema(options.type);

   const form = useForm<z.infer<typeof AppointmentFormValidation>>({
      resolver: zodResolver(AppointmentFormValidation),
      defaultValues: {
         primaryPhysician: options.appointment ? options.appointment.primaryPhysician : "",
         schedule: options.appointment ?  new Date(options.appointment.schedule) : new Date(),
         reason: options.appointment ? options.appointment.reason : "",
         note: options.appointment ? options.appointment.note : "",
         cancellationReason: options.appointment?.cancellationReason || ""
      },
   });

   const handleSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
      setIsLoading(true);

      let status = getType(options.type);
      try {
         if (options.type === "create" && options.patientId) {
            
            const appointment = {
               userId: options.userId,
               patient: options.patientId,
               primaryPhysician: values.primaryPhysician,
               schedule: new Date(values.schedule),
               reason: values.reason!,
               status: status as Status,
               note: values.note,
            };
            
            const newAppointment = await createAppointment(appointment);

            if (newAppointment) {
               form.reset();
               router.push(
                  `/patients/${options.userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
               );
            }
         }
         else {
            const appointmentToUpdate = {
               userId: options.userId,
               appointmentId: options.appointment?.$id!,
               appointment: {
                  primaryPhysician: values?.primaryPhysician,
                  schedule: new Date(values?.schedule),
                  status: status as Status,
                  cancellationReason: values?.cancellationReason 
               },
               type: options.type
            }

            const updatedAppointment = await updateAppointment(appointmentToUpdate);
            if(updatedAppointment) {
               options.setOpen && options.setOpen(false);
               form.reset();
            }

         }
      } catch (error: any) {

      } finally {
         setIsLoading(false);
      }
   };

   return {
      handleSubmit,
      form,
      isLoading
   }
}

const AppointmentForm = (props: IProps) => {
   

   const {handleSubmit,form,isLoading} = useAppointmentForm(props);
   const { type, dialogMode} = props;


   let buttonLabel = "";
   if (type === "cancel") buttonLabel = "Cancel Appointment";
   else if (type === "schedule") buttonLabel = "Schedule Appointment";
   else buttonLabel = "Create Appointment";

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="flex-1 space-y-12">
            {type === 'create'  && <section className="space-y-4">
               <h1 className="header">New Appointment</h1>
               <p className="text-dark-700">Request new Appointment</p>
            </section>}
            {type !== "cancel" && (
               <>
                  <CustomFormField
                     fieldType={FormFieldType.SELECT}
                     control={form.control}
                     name="primaryPhysician"
                     label="Primary care physician"
                     placeholder="Select a physician"
                  >
                     {Doctors.map((doctor, i) => (
                        <SelectItem key={doctor.name + i} value={doctor.name}>
                           <div className="flex cursor-pointer items-center gap-2">
                              <Image
                                 src={doctor.image}
                                 width={32}
                                 height={32}
                                 alt="doctor"
                                 className="rounded-full border border-dark-500"
                              />
                              <p>{doctor.name}</p>
                           </div>
                        </SelectItem>
                     ))}
                  </CustomFormField>
                  <CustomFormField
                     fieldType={FormFieldType.DATE_PICKER}
                     control={form.control}
                     name="schedule"
                     label="Expected Appointment Date"
                     showTimeSelect
                     dateFormat="MM/dd/yyyy - h:mm aa"
                  />
                  <div className={`flex ${dialogMode ? "flex-col" : "flex-row gap-6"}`}>
                     <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="reason"
                        label="Enter reason for appointment"
                        placeholder="Reason for appointment"
                     />
                     <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="note"
                        label="Enter Notes"
                        placeholder="Enter Notes"
                     />
                  </div>
               </>
            )}

            {type === "cancel" && (
               <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="cancellationReason"
                  label="Reason for cancellation"
                  placeholder="Reason for cancellation"
               />
            )}

            <SubmitButton
               isLoading={isLoading}
               
               clasName={`${
                  type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
               } w-full`}
            >
               {buttonLabel}
            </SubmitButton>
         </form>
      </Form>
   );
};

export default AppointmentForm;
