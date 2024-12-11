"use client"

import { ButtonProps, Button } from "@chakra-ui/react";

interface ISubmitButton extends ButtonProps {
    label : string,
    submittingLabel : string,
    m : string,
    isSubmitting : boolean
}

export default function SubmitButton ({label, submittingLabel, m, isSubmitting} : ISubmitButton)
{
    return(
        <Button //LoginButton
        type="submit"
        borderRadius="md"
        bg="brandblue"
        color={'brandwhite'}
        border="2px solid"
        borderColor={'brandwhite'}
        _hover={{
            bg: 'brandmiddlegray',
            color: 'brandblack',
            borderColor: 'brandblue',
            transition: 'all 0.3s ease', // Animacija prijelaza
        }}
        p="5"

        m={m}
        disabled={isSubmitting}

    >
        {isSubmitting ? submittingLabel : label}
    </Button>
    )
}