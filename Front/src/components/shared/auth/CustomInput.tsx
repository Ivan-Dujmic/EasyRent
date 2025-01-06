"use client"

import { FormControl, InputProps, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react"

interface ICustomInput extends InputProps{
    label: string;
    type: string;
    placeholder: string;
    error?: string;
}

export default function CustomInput ({label, type, placeholder, error, ...rest }: ICustomInput) {
    return(
        <FormControl isRequired isInvalid={!!error}>
			<FormLabel>{label}</FormLabel>
				<Input
					type={type}
					placeholder={placeholder}
                    {...rest}
				/>
				{error && (
					<FormErrorMessage color={'red'}>
						{error}
					</FormErrorMessage>
				)}
		</FormControl>
        )
}