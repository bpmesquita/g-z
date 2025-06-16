# Manual de Solução de Problemas para Fonte Retificadora XPS SR40A

---
### Alerta: Falha na Unidade Retificadora (Item: usccUltimateFalhaUr1 ou usccUltimateFalhaUr2)
**Causa Provável:**
- A unidade retificadora (UR) apresentou uma falha interna crítica.
- O disjuntor de proteção da própria UR desarmou.
- Falha de comunicação entre a UR e a controladora.
**Diagnóstico:**
1.  Acessar a interface de gerenciamento da fonte e verificar o status detalhado da UR específica (UR1 ou UR2).
2.  Verificar fisicamente se a UR está com algum LED de alarme aceso (vermelho ou âmbar).
3.  Se houver acesso seguro, verificar o disjuntor individual da UR no bastidor da fonte.
**Ação:**
- Tentar um reset da UR pela controladora, se disponível.
- Se o alarme persistir, a UR deve ser substituída. Acionar equipe de campo com uma unidade reserva.

---
### Alerta: Tensão da Bateria Baixa (Item: usccUltimateVBate)
**Causa Provável:**
- **(Gravidade DESASTRE - <= 40V):** Perda prolongada da energia da concessionária e baterias próximas da descarga total. Risco iminente de desligamento do site!
- **(Gravidade ALTA - <= 50V):** As baterias estão em processo de descarga. A fonte não está conseguindo recarregá-las, seja por falha na recarga ou por falta de energia AC.
- Falha no circuito de recarga da fonte ou em uma ou mais baterias.
**Diagnóstico:**
1.  Verificar imediatamente se há energia da concessionária no site.
2.  Verificar a corrente de saída total da fonte. Se for zero ou muito baixa, as URs podem ter falhado.
3.  Verificar a temperatura do banco de baterias. Temperaturas altas podem indicar falha.
**Ação:**
- **AÇÃO CRÍTICA E IMEDIATA:** Acionar a equipe de campo com urgência para verificar a infraestrutura elétrica. Se for falha de energia, garantir o funcionamento do gerador (se houver).
- Se a energia AC estiver normal, a falha é na fonte ou nas baterias. A equipe de campo precisa diagnosticar no local.

---
### Alerta: Unidade Retificadora Sem Corrente (Item: usccUltimateCorrenteUr1 ou usccUltimateCorrenteUr2)
**Causa Provável:**
- A UR está ligada, mas não está fornecendo corrente para a carga.
- Pode ser um indicativo de que não há demanda (carga baixa) ou que a UR está em modo "standby".
- Falha interna que impede a UR de produzir corrente.
**Diagnóstico:**
1.  Comparar a corrente da UR com a das outras URs. Se as outras estão fornecendo corrente e esta não, é um sinal de falha.
2.  Verificar a carga total (consumo) do site. Se for muito baixa, o comportamento pode ser normal.
3.  Verificar se a UR está habilitada e configurada corretamente na controladora.
**Ação:**
- Se outras URs estão sobrecarregadas e esta está com corrente zero, é um defeito. Tratar como "Falha na Unidade Retificadora".

---
### Alerta: Temperatura Alta (Item: usccUltimateTAmb1)
**Causa Provável:**
- Falha no sistema de climatização (Ar Condicionado) da sala ou abrigo.
- Obstrução do fluxo de ar da fonte (filtros de ar sujos).
- Falha nos coolers/ventiladores da própria fonte retificadora.
**Diagnóstico:**
1.  Verificar remotamente o status de outros sensores de temperatura no mesmo ambiente.
2.  Verificar alarmes do sistema de ar condicionado.
**Ação:**
- Acionar a equipe de infraestrutura/climatização com urgência.
- Se o problema for localizado na fonte (coolers), acionar a equipe de manutenção de energia.

---
### Alerta: Falha de Comunicação (ICMP ou SNMP)
**Causa Provável:**
- Problema na rede de gerência (cabo desconectado, falha em switch).
- A controladora da fonte travou e parou de responder.
- A carga de trabalho da CPU da controladora está em 100%, impedindo a resposta.
**Diagnóstico:**
1.  Tentar pingar outros equipamentos na mesma sub-rede para isolar se a falha é no equipamento ou na rede.
2.  Verificar o status da porta do switch onde a fonte está conectada.
**Ação:**
- Se o problema for na rede, acionar a equipe de redes.
- Se a rede estiver OK, a controladora pode precisar de um reset. Acionar equipe de campo para o procedimento.
