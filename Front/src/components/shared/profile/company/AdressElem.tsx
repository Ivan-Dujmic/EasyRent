import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
interface IAdressElemProps {
    adress : string | undefined;
    HQ?: boolean;
    onConfirm: () => void;
}

export function AdressElem ({adress, HQ = false, onConfirm}: IAdressElemProps)
{
    const router = useRouter()
    const handleSetHQ = () => {
        router.push(``);
    }
    const handleEdit = () => {
        router.push("edit/location");
    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    return(
        <>
        <Flex justifyContent="space-between" alignItems="center" w="100%" 
        boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
        borderRadius="md"
        bg="brandwhite"
        p="10px"
        >    
            <Text>{adress}</Text>
            <Flex justifyContent="space-evenly" alignItems="center" w="40%">
                {HQ ? (
                    <Text w="108px" textAlign="center">HQ</Text>
                ) : (
                    <Button onClick={handleSetHQ}>
                        Set as HQ
                    </Button>
                )}
                <IconButton
                    icon={<EditIcon/>}
                    aria-label="Edit"
                    onClick={handleEdit}
                />
                <IconButton
                    icon={<DeleteIcon/>}
                    aria-label="Delete"
                    onClick={onOpen}
                />
            </Flex>
        </Flex>

        <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Deletion
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => { onConfirm(); onClose(); }} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
        </>
    )
}