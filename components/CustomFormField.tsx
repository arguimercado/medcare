"use client";

import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Control } from "react-hook-form";
import Image from "next/image";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

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
	const {fieldType,iconSrc,iconAlt,placeholder} = props;
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
						value={field.value}
						onChange={field.onChange}
						className="input-phone"

						
					/>
				</FormControl>
			)
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
