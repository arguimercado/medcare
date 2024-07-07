"use client";

import { E164Number } from "libphonenumber-js/core";
import React, { useState } from "react";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Control } from "react-hook-form";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

export enum FormFieldType {
   INPUT = "input",
   CHECKBOX = "checkbox",
   TEXTAREA = "textarea",
   PHONE_INPUT = "phoneInput",
   DATE_PICKER = "datePicker",
   SELECT = "select",
   SKELETON = "skeleton",
}

interface IProps {
   control: Control<any>;
   fieldType: FormFieldType;
   name: string;
   label?: string;
   placeholder?: string;
   iconSrc?: string;
   iconAlt?: string;
   disabled?: boolean;
   dateFormat?: string;
   showTimeSelect?: boolean;
   children?: React.ReactNode;
   renderSkeleton?: (field: any) => React.ReactNode;
   className?: string;
}

const RenderInputField = ({ field, props }: { field: any; props: IProps }) => {
   const [selectValue, setSelectValue] = useState("");

   const handleValueChange = (value: any) => {
      console.log(value);
      field.onChange(value);
      setSelectValue(value);
   };
   const { fieldType, iconSrc, iconAlt, placeholder } = props;
   switch (fieldType) {
      case FormFieldType.INPUT:
         return (
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
               {props.iconSrc && (
                  <Image
                     src={iconSrc ?? ""}
                     height={24}
                     width={24}
                     alt={iconAlt || "icon"}
                     className="ml-2"
                  />
               )}
               <FormControl>
                  <Input
                     placeholder={placeholder}
                     {...field}
                     className="shad-input border-0"
                  />
               </FormControl>
            </div>
         );
      case FormFieldType.PHONE_INPUT:
         return (
            <FormControl>
               <PhoneInput
                  defaultCountry="PH"
                  international
                  withCountryCallingCode={true}
                  placeholder={placeholder}
                  value={field.value as E164Number | undefined}
                  onChange={field.onChange}
                  className="input-phone"
               />
            </FormControl>
         );
      case FormFieldType.DATE_PICKER:
         return (
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
               <Image
                  src="/assets/icons/calendar.svg"
                  height={24}
                  width={24}
                  alt="calendar"
                  className="ml-2"
               />
               <FormControl>
                  <DatePicker
                     showTimeSelect={props.showTimeSelect ?? false}
                     selected={field.value}
                     onChange={(date) => field.onChange(date)}
                     timeInputLabel="Time:"
                     dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
                     wrapperClassName="date-picker"
                  />
               </FormControl>
            </div>
         );
      case FormFieldType.SELECT:
         return (
            <FormControl>
               <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
               >
                  <FormControl>
                     <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder={props.placeholder} />
                     </SelectTrigger>
                  </FormControl>
                  <SelectContent className="shad-select-content">
                     {props.children}
                  </SelectContent>
               </Select>
            </FormControl>
         );
      case FormFieldType.CHECKBOX:
         return (
            <FormControl>
               <div className="flex items-center gap-4">
                  <Checkbox
                     id={props.name}
                     checked={field.value}
                     onCheckedChange={field.onChange}
                  />
                  <label htmlFor={props.name} className="checkbox-label">
                     {props.label}
                  </label>
               </div>
            </FormControl>
         );
      case FormFieldType.TEXTAREA:
         return (
            <FormControl>
               <Textarea
                  placeholder={props.placeholder}
                  {...field}
                  className="shad-textArea"
                  disabled={props.disabled}
               />
            </FormControl>
         );
      case FormFieldType.SKELETON:
         return props.renderSkeleton ? props.renderSkeleton(field) : null;
      default:
         break;
   }
};

const CustomFormField = (props: IProps) => {
   const { control, fieldType, name, label } = props;
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className="flex-1">
               {fieldType !== FormFieldType.CHECKBOX && label && (
                  <FormLabel>{label}</FormLabel>
               )}
               <RenderInputField field={field} props={props} />
               <FormMessage className="shad-error" />
            </FormItem>
         )}
      />
   );
};

export default CustomFormField;
