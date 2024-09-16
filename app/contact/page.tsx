import React from "react";
import styles from "./contact.module.css";
import ContactForm from "@/components/ContactForm/ContactForm";

export default function Contact() {
  return (
    <div className={styles.container}>
      <section className="flex-1 mb-10 sm:mr-12 sm:mb-0 [&>p]:text-xl [&>a]:text-xl [&>a]:text-blue-600">
        <h1 className="text-4xl mb-3">Contato</h1>
        <h4 className="text-2xl mb-3">Endereço</h4>
        <p className="mb-2">Rua José Paulino, 1244 - Sala 72</p>
        <h4 className="text-2xl mb-3">Telefone (WhatsApp)</h4>
        <a
          className="inline-block mb-2"
          href="https://wa.me/5519996813766"
          target="_blank"
          rel="noreferrer"
        >
          (19) 99681-3766
        </a>
        <h4 className="text-2xl mb-3">E-mail</h4>
        <a href="mailto:mblivre.campinas@gmail.com">
          mblivre.campinas@gmail.com
        </a>
      </section>
      <section className={styles.formContainer}>
        <h1 className="mb-3 text-3xl">Envie uma mensagem</h1>
        <ContactForm />
      </section>
    </div>
  );
}
