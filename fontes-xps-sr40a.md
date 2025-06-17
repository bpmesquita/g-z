Manual Definitivo de Solução de Problemas: Fontes XPS (SR30A & SR40A)
Este documento é a base de conhecimento otimizada para a automação Zabbix-Gemini, cobrindo as fontes retificadoras XPS SR30A e XPS SR40A. Cada procedimento está diretamente mapeado a item.keys específicos extraídos das triggers de monitoramento.
NÍVEL DE RISCO: DESASTRE (AÇÃO IMEDIATA REQUERIDA)
Alerta: Perda Total de Conectividade (ICMP Ping)
(Item: icmpping)
Causa Provável: Falha completa na rede de gerência (cabo, switch, VLAN) ou travamento total da controladora da fonte, que não responde mais a pacotes de rede.
Diagnóstico:
Isolamento de Falha: Tentar pingar outros equipamentos na mesma sub-rede/VLAN para determinar se a falha é no equipamento ou na rede.
Verificação de Rede: Analisar o status da porta do switch onde a fonte está conectada (UP/DOWN, erros, etc.).
Ação Imediata:
Se a falha for na rede, acionar a equipe de Redes com urgência.
Se a rede estiver funcional, a controladora da fonte precisa de um reset físico. Acionar Equipe de Campo.
Alerta: Falha de Energia AC / Baterias em Descarga
(Itens: descarga.bat, ac.anormal)
Causa Provável:
(descarga.bat): Perda total da energia da concessionária (AC). O site está operando 100% em baterias, com autonomia limitada.
(ac.anormal): A tensão da concessionária está presente, mas fora dos limites seguros (muito alta ou muito baixa), arriscando danificar os retificadores.
Diagnóstico:
Confirmar imediatamente o status de energia de outros equipamentos no local.
Verificar remotamente os parâmetros de tensão de entrada (Vin) na controladora da fonte, se acessível.
Ação Imediata:
PRIORIDADE MÁXIMA. Acionar o procedimento padrão de queda de energia.
Notificar a concessionária sobre a falha ou instabilidade da rede elétrica.
Preparar para o desligamento controlado do site se a energia não for restabelecida.
Alerta: Tensão da Bateria em Nível Crítico
(Item: usccUltimateVBate)
Causa Provável: As baterias atingiram um nível de descarga perigoso (gatilho em <= 48V). RISCO IMINENTE DE DESLIGAMENTO DO SITE. Geralmente é consequência de uma falha de AC prolongada.
Diagnóstico:
Cruzar a informação com o alarme de "Falha de Energia AC". A causa raiz é quase sempre a mesma.
Verificar a autonomia restante estimada, se disponível na controladora.
Ação Imediata:
Tratar com a mesma urgência do alarme de "Falha de Energia AC". A autonomia do site está no fim.
Alerta: Fusível Principal da Bateria Aberto
(Item: fusivel.bat)
Causa Provável: O fusível de proteção principal do banco de baterias rompeu. O site perdeu a proteção das baterias e desligará instantaneamente se a energia AC falhar.
Diagnóstico: O alarme é autoexplicativo e indica uma interrupção física no circuito de baterias.
Ação Imediata:
Acionar Equipe de Campo com urgência máxima para inspecionar e substituir o fusível.
A equipe deve investigar a causa da sobrecorrente que levou à queima (curto-circuito, falha de retificador, etc.).
NÍVEL DE RISCO: ALTO (REQUER ATENÇÃO PRIORITÁRIA)
Alerta: Falha em Unidade Retificadora (UR)
(Itens: ur.falha, usccUltimateFalhaUr1, usccUltimateFalhaUr2)
Causa Provável: Uma unidade retificadora (UR) parou de funcionar devido a uma falha interna crítica ou ao desarme de seu disjuntor de proteção.
Diagnóstico:
Acessar a interface de gerenciamento da fonte para identificar qual UR específica falhou.
Verificar se as URs restantes estão com corrente elevada, indicando que assumiram a carga da UR defeituosa e se há risco de sobrecarga.
Ação:
Tentar um reset da UR pela controladora, se a opção estiver disponível.
Se o alarme persistir, acionar Equipe de Campo para substituição da UR. A urgência é definida pela redundância restante (N+1, N+2).
Alerta: Unidade Retificadora (UR) Sem Fornecer Corrente
(Itens: usccUltimateCorrenteUr1, usccUltimateCorrenteUr2)
Causa Provável: A UR está ligada, mas não está fornecendo corrente. Pode ser uma falha interna ou a UR pode estar em modo "standby" por baixa demanda de carga.
Diagnóstico:
Comparar a corrente da UR alarmada (<= 0.3A) com as outras URs. Se as outras estão fornecendo corrente e esta não, é um sinal de falha.
Verificar a carga total (consumo) do site. Se for muito baixa, o comportamento pode ser normal.
Ação:
Se a carga do site justifica a operação de todas as URs, tratar como "Falha em Unidade Retificadora" e acionar a Equipe de Campo.
Alerta: Tensão da Bateria em Nível de Alerta
(Item: usccUltimateVBate)
Causa Provável: As baterias estão em processo de descarga (gatilho em <= 50V), mas ainda não em nível crítico. Indica que a fonte não está conseguindo recarregá-las, seja por falha na recarga ou por falta de energia AC.
Diagnóstico:
Verificar se há um alarme ativo de "Falha de Energia AC".
Verificar a corrente de saída total da fonte. Se for zero ou muito baixa, as URs podem ter falhado.
Ação:
Investigar a causa raiz (falta de AC ou falha na fonte).
Se a energia AC estiver normal, a falha é na fonte ou nas baterias. Acionar Equipe de Campo para diagnóstico.
Alerta: Banco de Baterias Desconectado
(Item: desconectada.bat)
Causa Provável: A controladora detectou que o banco de baterias não está fisicamente conectado ou o disjuntor do banco está desligado. Similar ao "Fusível Aberto", mas pode ser um desarme reversível.
Diagnóstico: O site está sem proteção de baterias. Uma falha de AC resultará em desligamento imediato.
Ação:
Acionar Equipe de Campo para verificar a conexão física e o estado do disjuntor do banco de baterias.
Alerta: Temperatura Ambiente Elevada
(Item: usccUltimateTAmb1)
Causa Provável: Falha no sistema de climatização (Ar Condicionado) do ambiente ou obstrução do fluxo de ar da fonte. A temperatura atingiu um nível de risco (>= 42°C).
Diagnóstico:
Verificar alarmes do sistema de ar condicionado do site.
Verificar remotamente outros sensores de temperatura no mesmo ambiente, se disponíveis.
Ação:
Acionar equipe de Infraestrutura/Climatização com urgência. O superaquecimento reduz a vida útil dos componentes e pode levar a uma falha geral.
Alerta: Tensão de Saída Alta no Rack
(Item: tensao.alta)
Causa Provável: A tensão de saída da fonte para os equipamentos (geralmente -48V) está acima do normal, o que pode danificar os equipamentos alimentados.
Diagnóstico:
Confirmar o valor exato da tensão de saída (Vout) na controladora.
Pode ser uma falha de calibração ou um defeito em uma ou mais URs que estão "elevando" a tensão do barramento.
Ação:
Acionar Equipe de Campo para diagnóstico e ajuste. Pode ser necessário reiniciar a fonte ou isolar uma UR defeituosa.
Alerta: Perda de Pacotes na Rede (ICMP Loss)
(Item: icmppingloss)
Causa Provável: Instabilidade na rede de gerência. A conectividade não foi totalmente perdida, mas pacotes estão sendo descartados, indicando um problema iminente.
Diagnóstico:
Analisar a latência (icmppingsec) para ver se também está alta.
Verificar logs de erros na porta do switch correspondente.
Ação:
Abrir chamado de investigação para a equipe de Redes. Monitorar se o problema evolui para uma perda total de conectividade.
NÍVEL DE RISCO: ATENÇÃO (INFORMATIVO, REQUER ACOMPANHAMENTO)
Alerta: Banco de Baterias em Processo de Recarga
(Item: carga.bat)
Causa Provável: Informativo. Indica que as baterias estão em processo de recarga, geralmente após o retorno da energia AC depois de uma falha.
Diagnóstico: Nenhuma ação de diagnóstico é necessária. É um estado normal e esperado.
Ação:
Apenas monitorar. O alarme deve se resolver sozinho quando as baterias atingirem a carga completa. Se o alarme persistir por muitas horas (ex: > 12h), pode indicar uma falha no processo de recarga e requer investigação.
Alerta: Equipamento Reiniciado
(Item: system.uptime)
Causa Provável: Informativo. A controladora da fonte foi reiniciada (uptime < 60 minutos), seja por um comando manual, uma breve queda de energia ou um travamento seguido de um watchdog.
Diagnóstico: Verificar o log de eventos da fonte (se acessível) para identificar a causa do reboot.
Ação:
Acompanhar. Se os reboots se tornarem frequentes, abrir um chamado para a Equipe de Campo investigar a causa (instabilidade de software, problema de hardware, etc.).
Alerta: Falha na Coleta de Dados SNMP
(Item: zabbix[host,snmp,available])
Causa Provável: O host está respondendo ao ping (ICMP), mas o agente SNMP não está respondendo às consultas do Zabbix. Pode ser um travamento do serviço SNMP na controladora ou um problema de firewall/ACL.
Diagnóstico:
Confirmar que o ping para o host está normal.
Tentar uma consulta SNMP manual a partir do servidor Zabbix (usando snmpwalk).
Ação:
Se a consulta manual falhar, pode ser necessário um reboot da controladora. Acionar Equipe de Campo.
