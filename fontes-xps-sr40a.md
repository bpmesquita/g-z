# Manual Definitivo de Solução de Problemas: Fontes XPS (SR30A & SR40A)

---
### Alerta: Falha de Comunicação (ICMP/SNMP) (Itens: icmpping, icmppingloss, zabbix[host,snmp,available])
**Causa Provável:**
-   Problema na rede de gerência (cabo desconectado, falha em switch, VLAN incorreta).
-   A controladora da fonte travou e parou de responder aos pacotes de rede (ICMP ou SNMP).
-   O serviço SNMP na controladora travou, mesmo que o equipamento ainda responda ao ping.
**Diagnóstico:**
1.  Tentar pingar outros equipamentos na mesma sub-rede para isolar se a falha é no equipamento ou na rede.
2.  Verificar o status da porta do switch onde a fonte está conectada (UP/DOWN, erros).
3.  Se o ping funciona mas o SNMP não, tentar uma consulta manual (`snmpwalk`) a partir do servidor Zabbix.
**Ação:**
-   Se a falha for na rede, acionar a equipe de **Redes**.
-   Se a rede estiver OK, a controladora pode precisar de um reset físico. Acionar **Equipe de Telecom**.

---
### Alerta: Falha de Energia AC / Baterias em Descarga (Itens: descarga.bat, ac.anormal)
**Causa Provável:**
-   `(descarga.bat)`: Perda total da energia da concessionária (AC). O site está operando 100% em baterias.
-   `(ac.anormal)`: A tensão da concessionária está presente, mas fora dos limites seguros (muito alta ou muito baixa), com risco de danificar os retificadores.
**Diagnóstico:**
1.  Confirmar imediatamente o status de energia de outros equipamentos no local.
2.  Verificar remotamente os parâmetros de tensão de entrada (Vin) na controladora da fonte, se acessível.
**Ação:**
-   **AÇÃO CRÍTICA E IMEDIATA:** Acionar o procedimento padrão de queda de energia, acionando a **Equipe de Telecom**.
-   Notificar a concessionária sobre a falha ou instabilidade da rede elétrica.
-   Preparar para o desligamento controlado do site se a energia não for restabelecida a tempo.

---
### Alerta: Tensão da Bateria Baixa (Item: usccUltimateVBate)
**Causa Provável:**
-   **(Gravidade DESASTRE - <= 48V):** As baterias atingiram um nível de descarga perigoso. **RISCO IMINENTE DE DESLIGAMENTO DO SITE!** Geralmente é consequência de uma falha de AC prolongada.
-   **(Gravidade ALTA - <= 50V):** As baterias estão em processo de descarga, mas ainda não em nível crítico. Indica que a fonte não está conseguindo recarregá-las.
**Diagnóstico:**
1.  Cruzar a informação com alarmes de "Falha de Energia AC". A causa raiz é quase sempre a mesma.
2.  Verificar a corrente de saída total da fonte. Se for zero, as Unidades Retificadoras (URs) podem ter falhado.
**Ação:**
-   **AÇÃO CRÍTICA E IMEDIATA:** Tratar com a mesma urgência do alarme de "Falha de Energia AC", acionando a **Equipe de Telecom**.
-   Se a energia AC estiver normal, a falha é na fonte ou nas baterias. Acionar **Equipe de Telecom Externa** para diagnóstico no local.

---
### Alerta: Fusível do Banco de Baterias Rompido (Item: fusivel.bat)
**Causa Provável:**
-   O fusível de proteção principal do banco de baterias rompeu devido a uma sobrecorrente.
**Diagnóstico:**
-   O alarme indica uma interrupção física no circuito de baterias. O site perdeu a proteção e desligará **instantaneamente** se a energia AC falhar.
**Ação:**
-   Acionar **Equipe de Telecom** com urgência máxima para inspecionar e substituir o fusível.
-   A equipe deve investigar a causa da possível sobrecorrente para evitar reincidência.

---
### Alerta: Banco de Baterias Desconectado (Item: desconectada.bat)
**Causa Provável:**
-   A controladora detectou que o banco de baterias não está conectado ou o disjuntor correspondente está desligado.
**Diagnóstico:**
-   O alarme aponta para uma falha na conexão física do banco de baterias. O site está sem a proteção das baterias e desligará **imediatamente** em caso de falha da rede elétrica.
**Ação:**
-   Acionar **Equipe de Telecom** com urgência máxima para inspecionar, reconectar o banco e/ou religar o disjuntor.
-   Verificar a integridade dos cabos e conexões.

---
### Alerta: Falha em Unidade Retificadora (UR) (Itens: ur.falha, usccUltimateFalhaUr1, usccUltimateFalhaUr2)
**Causa Provável:**
-   A unidade retificadora (UR) apresentou uma falha interna crítica e parou de funcionar.
-   O disjuntor de proteção da própria UR desarmou.
-   Falha de comunicação entre a UR e a controladora principal.
**Diagnóstico:**
1.  Acessar a interface de gerenciamento da fonte para identificar qual UR específica falhou.
2.  Verificar se as URs restantes estão com corrente elevada, indicando que assumiram a carga da UR defeituosa.
**Ação:**
-   Tentar um reset da UR pela controladora, se a opção estiver disponível.
-   Se o alarme persistir, acionar **Equipe de Telecom** para substituição da UR. A urgência é definida pela redundância restante.

---
### Alerta: Unidade Retificadora (UR) Sem Corrente (Itens: usccUltimateCorrenteUr1, usccUltimateCorrenteUr2)
**Causa Provável:**
-   A UR está ligada, mas não está fornecendo corrente para a carga (valor <= 0.3A).
-   Pode ser uma falha interna ou a UR pode estar em modo "standby" por baixa demanda de carga.
**Diagnóstico:**
1.  Comparar a corrente da UR alarmada com as outras URs. Se as outras estão fornecendo corrente e esta não, é um sinal de falha.
2.  Verificar a carga total (consumo) do site. Se for muito baixa, o comportamento pode ser normal.
**Ação:**
-   Se a carga do site justifica a operação de todas as URs, tratar como "Falha em Unidade Retificadora" e acionar a **Equipe de Telecom**.

---
### Alerta: Temperatura Ambiente Elevada (Item: usccUltimateTAmb1)
**Causa Provável:**
-   Falha no sistema de climatização (Ar Condicionado) do ambiente.
-   Obstrução do fluxo de ar da fonte (filtros sujos, objetos na frente).
-   A temperatura atingiu um nível de risco (>= 42°C).
**Diagnóstico:**
1.  Verificar alarmes do sistema de ar condicionado do site.
2.  Verificar remotamente outros sensores de temperatura no mesmo ambiente, se disponíveis.
**Ação:**
-   Acionar **Equipe de Telecom** com urgência. O superaquecimento pode levar a uma falha geral.

---
### Alerta: Tensão de Saída Alta no Rack (Item: tensao.alta)
**Causa Provável:**
-   A tensão de saída da fonte para os equipamentos (geralmente -48V) está acima do normal, o que pode danificar os equipamentos alimentados.
**Diagnóstico:**
1.  Acessar a controladora e confirmar o valor exato da tensão de saída (Vout).
2.  Pode ser uma falha de calibração ou um defeito em uma ou mais URs que estão "elevando" a tensão do barramento.
**Ação:**
-   Acionar **Equipe de Telecom** para diagnóstico e ajuste. Pode ser necessário reiniciar a fonte ou isolar uma UR defeituosa.

---
### Informativo: Baterias em Carga (Item: carga.bat)
**Causa Provável:**
-   Informativo. Indica que as baterias estão em processo de recarga, geralmente ocorrendo após o retorno da energia AC que sucedeu uma descarga.
**Diagnóstico:**
-   É um estado normal e esperado do sistema após uma interrupção no fornecimento de energia.
**Ação:**
-   Apenas monitorar. Se o estado de `carga.bat` persistir por um período excessivamente longo (muitas horas), a **Equipe de Telecom** deve investigar se as baterias estão aceitando carga corretamente ou se há alguma falha no sistema de recarga.

---
### Informativo: Reinicialização do Sistema (Item: system.uptime)
**Causa Provável:**
-   Informativo. A controladora foi reiniciada, indicado por um tempo de atividade do sistema (uptime) inferior a 60 minutos.
**Diagnóstico:**
-   Uma reinicialização recente ocorreu. É necessário verificar o log de eventos da fonte (se acessível remotamente ou no local) para identificar a causa do reinício (ex: queda de energia, comando manual, falha de software).
**Ação:**
-   Apenas monitorar. Se as reinicializações se tornarem frequentes, é um indicativo de instabilidade. Uma investigação mais aprofundada pela equipe técnica é necessária para determinar a causa raiz (ex: problemas de alimentação, falha de hardware, bugs de software).
