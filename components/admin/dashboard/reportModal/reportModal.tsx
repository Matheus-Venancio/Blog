import { Report } from "@/interfaces/reportInterface";
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

export default function ReportModal({
  isOpen,
  setOpen,
  reportInfo,
}: {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportInfo: Report;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={() => setOpen(false)}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1>{reportInfo.title}</h1>
            </ModalHeader>
            <ModalBody>
              <p>Data: {dayjs(reportInfo.date * 1000).format("DD/MM/YYYY")}</p>
              <p>Tel: {reportInfo.phone ?? "Não fornecido"}</p>
              <p>{reportInfo.location}</p>
              <p>{reportInfo.description}</p>
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
