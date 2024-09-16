import { Contact } from "@/interfaces/contactInterface";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import dayjs from "dayjs";
import React from "react";

export default function ContactModal({
  isOpen,
  setOpen,
  contactInfo,
}: {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contactInfo: Contact;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={() => setOpen(false)}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1>{contactInfo.subject}</h1>
            </ModalHeader>
            <ModalBody>
              <p>Data: {dayjs(contactInfo.date * 1000).format("DD/MM/YYYY")}</p>
              <p>Tel: {contactInfo.phone ?? "Não fornecido"}</p>
              <p>Email: {contactInfo.email ?? "Não fornecido"}</p>
              <p>{contactInfo.message}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fechar
              </Button>
              <Button color="primary" onPress={onClose}>
                Marcar como resolvido
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
