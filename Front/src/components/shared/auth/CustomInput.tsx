"use client"

import { FormControl, InputProps, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react"

interface ICustomInput extends InputProps{
    label: string;
    error?: string;
}

export default function CustomInput ({label, error, ...rest }: ICustomInput) {
    return(
        <FormControl isRequired isInvalid={!!error}>
			<FormLabel>{label}</FormLabel>
				<Input
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