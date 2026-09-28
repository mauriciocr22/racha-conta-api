# Regras de Negócio

App para dividir despesas em grupo. Membros registram o que pagaram, o sistema calcula quanto cada um deve e sugere a forma mais simples de acertar as contas.

Cada regra tem um código (ex.: `RN-DES-01`) para ser referenciada nos testes e nos commits.

---

## Glossário

| Termo | Significado |
|---|---|
| **Usuário** | Pessoa cadastrada no sistema. |
| **Grupo** | Conjunto de usuários que dividem despesas entre si (uma viagem, uma república). |
| **Membro** | Usuário que faz parte de um grupo. |
| **Criador** | Membro que criou o grupo. |
| **Despesa** | Um gasto registrado no grupo. |
| **Autor** | Membro que registrou a despesa no app (não necessariamente quem pagou). |
| **Pagador** | Membro que pagou a despesa (tirou o dinheiro do bolso). |
| **Participante** | Membro entre quem o custo da despesa é dividido (quem consumiu). |
| **Divisão** | A forma como o valor da despesa é repartido entre os participantes. |
| **Parte** | Quanto um participante deve de uma despesa. |
| **Pagamento** | Transferência de dinheiro entre dois membros para acertar as contas. |
| **Saldo** | Quanto um membro pagou menos quanto ele consumiu. Positivo = tem a receber. Negativo = deve. |
| **Acerto** | Sugestão de pagamentos que zera os saldos do grupo com o menor número de transferências. |

---

## Usuário

- **RN-USU-01** — Toda ação no sistema (criar grupo, registrar despesa, registrar pagamento) exige um usuário cadastrado e autenticado.
- **RN-USU-02** — O e-mail do usuário é único no sistema.

## Grupo

- **RN-GRU-01** — Todo grupo tem um nome obrigatório.
- **RN-GRU-02** — Quem cria o grupo se torna o criador e é adicionado automaticamente como membro.
- **RN-GRU-03** — Apenas o criador pode adicionar membros.
- **RN-GRU-04** — Membros são adicionados pelo e-mail de um usuário já cadastrado.
- **RN-GRU-05** — Um usuário não pode ser membro do mesmo grupo mais de uma vez.
- **RN-GRU-06** — Um usuário só tem acesso a grupos dos quais é membro.
- **RN-GRU-07** — O criador pode remover um membro, desde que o saldo dele seja zero.
- **RN-GRU-08** — Um membro pode sair do grupo por conta própria, desde que o saldo dele seja zero.
- **RN-GRU-09** — O criador não pode sair nem ser removido do grupo. Se quiser deixá-lo, deve excluir o grupo.
- **RN-GRU-10** — Um grupo só pode ser excluído pelo criador e apenas se todos os saldos estiverem zerados.

## Despesa

- **RN-DES-01** — O valor da despesa deve ser maior que zero.
- **RN-DES-02** — Toda despesa tem exatamente um pagador.
- **RN-DES-03** — O pagador deve ser membro do grupo.
- **RN-DES-04** — Toda despesa tem pelo menos um participante.
- **RN-DES-05** — Todos os participantes devem ser membros do grupo.
- **RN-DES-06** — Um membro não pode aparecer mais de uma vez como participante da mesma despesa.
- **RN-DES-07** — O pagador não precisa ser participante (ex.: pagou a pizza dos outros e não comeu).
- **RN-DES-08** — Não é permitida uma despesa em que o único participante é o próprio pagador, pois ela não altera nenhum saldo.
- **RN-DES-09** — Uma despesa pode ser editada ou excluída depois de criada, mas apenas pelo seu autor.
- **RN-DES-10** — Uma despesa editada deve obedecer a todas as regras de despesa e divisão, como se estivesse sendo criada.

## Divisão

### Regras comuns a todas as formas

- **RN-DIV-01** — A soma das partes deve ser exatamente igual ao valor total da despesa, sem sobrar nem faltar nenhum centavo.
- **RN-DIV-02** — Valores monetários são sempre tratados em centavos inteiros. Nunca em ponto flutuante.
- **RN-DIV-03** — Quando a divisão gera centavos de sobra, eles são distribuídos 1 centavo por vez, começando pelo primeiro participante da lista, até acabar a sobra. A mesma entrada sempre gera a mesma saída.
- *Exemplo: R$ 100,00 igual entre Ana, Bruno e Carla → 33,34 / 33,33 / 33,33.*

### Igual

- **RN-DIV-IGU-01** — O valor total é dividido igualmente entre todos os participantes.
- *Exemplo: R$ 90,00 entre 3 → 30,00 / 30,00 / 30,00.*

### Valores exatos

- **RN-DIV-EXA-01** — Cada participante recebe um valor informado manualmente.
- **RN-DIV-EXA-02** — Cada valor deve ser maior que zero.
- **RN-DIV-EXA-03** — A soma dos valores deve ser igual ao total da despesa.
- *Exemplo: jantar de R$ 200,00 → Ana 80,00 / Bruno 120,00.*

### Porcentagem

- **RN-DIV-POR-01** — Cada participante recebe um percentual do total.
- **RN-DIV-POR-02** — Cada percentual deve ser maior que zero.
- **RN-DIV-POR-03** — A soma dos percentuais deve ser exatamente 100.
- *Exemplo: aluguel de R$ 1.000,00 → Ana 60% (600,00) / Bruno 40% (400,00).*

### Pesos (cotas)

- **RN-DIV-PES-01** — Cada participante recebe um peso. A parte de cada um é proporcional ao seu peso sobre a soma dos pesos.
- **RN-DIV-PES-02** — Cada peso deve ser um número inteiro maior que zero.
- *Exemplo: jantar de R$ 300,00 → Ana peso 2, Bruno peso 1, Carla peso 1 (soma 4) → 150,00 / 75,00 / 75,00.*

## Pagamento

- **RN-PAG-01** — O valor do pagamento deve ser maior que zero.
- **RN-PAG-02** — Quem paga e quem recebe devem ser membros do grupo.
- **RN-PAG-03** — Um membro não pode fazer um pagamento para si mesmo.
- **RN-PAG-04** — É permitido pagar mais do que se deve. O saldo apenas inverte de sinal (quem pagou a mais passa a ter a receber).
- **RN-PAG-05** — Um pagamento só pode ser registrado por quem pagou ou por quem recebeu. Um terceiro não pode registrar um pagamento entre outros dois membros.

## Saldo e acerto

- **RN-SAL-01** — Saldo de um membro = (total que pagou em despesas + total que pagou em pagamentos) − (total das suas partes em despesas + total que recebeu em pagamentos).
- **RN-SAL-02** — O saldo nunca é armazenado. Ele é sempre calculado a partir do histórico de despesas e pagamentos do grupo.
- **RN-SAL-03** — A soma dos saldos de todos os membros de um grupo é sempre zero.
- **RN-SAL-04** — O acerto sugere pagamentos de quem tem saldo negativo para quem tem saldo positivo, zerando todos os saldos.
- **RN-SAL-05** — O acerto deve usar o menor número de transferências possível (ou próximo disso).
- **RN-SAL-06** — Membros com saldo zero não aparecem no acerto.

---

## Decisões de projeto

Registro do porquê de algumas regras, para consulta futura.

- **Saldo calculado, não armazenado (RN-SAL-02).** Como o saldo sempre vem do histórico, editar ou excluir uma despesa nunca deixa os dados inconsistentes. O custo é recalcular a cada consulta, aceitável no volume de um grupo de amigos.
- **Edição só pelo autor (RN-DES-09).** Evita que um membro altere despesas registradas por outro sem que ele saiba.
- **Pagamento registrado por qualquer uma das duas partes (RN-PAG-05).** Quem recebeu pode registrar caso quem pagou esqueça, mas ninguém de fora mexe na relação entre os dois.
- **Despesa sem efeito é bloqueada (RN-DES-08).** Uma despesa que não muda nenhum saldo só polui o histórico.
- **Sobra de centavos para os primeiros da lista (RN-DIV-03).** Regra simples, previsível e fácil de testar.
- **Criador não sai do grupo (RN-GRU-09).** Garante que todo grupo sempre tenha alguém com permissão para adicionar membros e excluí-lo.

---

## Fora do escopo da v1

Multimoeda · foto de recibo · convites por link · notificações push · app mobile · integração com Pix · gráficos de gastos · categorias de despesa · transferência de posse do grupo.
