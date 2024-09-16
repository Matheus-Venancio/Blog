export function mailMessage(name?: string) {
  const initialMessage = `<h3>${
    name ? "O usuário " + name : "Um usuário"
  } entrou em contato pelo website\
   do <a href="https://mblcampinas.org/admin" target="_blank" rel="noreferrer">\
   núcleo de campinas</a></h3><p>Por favor, acesse a plataforma para\
   respondê-lo(a)</p>`;

  return initialMessage;
}
