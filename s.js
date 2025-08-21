// ===================================================================
// Objeto Gemini: Lida com a comunicação com a API do Google Gemini
// ===================================================================
var Gemini = {
    params: {},
    setParams: function(params) {
        if (typeof params !== 'object') {
            return;
        }
        this.params = params;

        if (typeof this.params.api_key !== 'string' || this.params.api_key === '') {
            throw 'A chave da API para o Gemini é obrigatória.';
        }

        var model = (typeof this.params.model === 'string' && this.params.model !== '')
            ? this.params.model
            : 'gemini-1.5-flash-latest';

        this.params.url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent';
    },

    request: function(data) {
        if (!this.params.api_key) {
            throw 'A chave da API está ausente.';
        }

        var request = new HttpRequest();
        request.addHeader('Content-Type: application/json');
        
        var urlWithKey = this.params.url + '?key=' + this.params.api_key;
        
        Zabbix.log(4, '[ Webhook Gemini ] Enviando requisição para: ' + this.params.url + '\n' + JSON.stringify(data));
        
        var response_str = request.post(urlWithKey, JSON.stringify(data));
        
        Zabbix.log(4, '[ Webhook Gemini ] Resposta recebida com código ' + request.getStatus() + ':\n' + response_str);
        
        if (request.getStatus() < 200 || request.getStatus() >= 300) {
            throw 'A requisição para a API do Gemini falhou com código ' + request.getStatus() + '. Resposta: ' + response_str;
        }
        
        var response_json;
        try {
            response_json = JSON.parse(response_str);
        } catch (e) {
            Zabbix.log(3, '[ Webhook Gemini ] Falha ao analisar a resposta JSON do Gemini. Erro: ' + e);
            throw 'Resposta inválida recebida da API.';
        }
        
        if (response_json.error) {
            throw 'API do Gemini retornou um erro: ' + response_json.error.message;
        }

        return response_json;
    }
};

// ===================================================================
// Função Auxiliar: Busca a Base de Conhecimento a partir de uma URL
// ===================================================================
function getKBContent(url) {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        Zabbix.log(3, '[ Webhook Gemini ] URL da Base de Conhecimento é inválida ou não foi fornecida: ' + url);
        return 'ERRO: Base de conhecimento não fornecida ou URL inválida.';
    }

    try {
        Zabbix.log(4, '[ Webhook Gemini ] Buscando base de conhecimento em: ' + url);
        var request = new HttpRequest();
        var response = request.get(url);

        if (request.getStatus() < 200 || request.getStatus() >= 300) {
            Zabbix.log(3, '[ Webhook Gemini ] Falha ao buscar KB. Status: ' + request.getStatus() + '. Resposta: ' + response);
            return 'ERRO: Falha ao acessar a base de conhecimento no link fornecido (Código: ' + request.getStatus() + ').';
        }
        Zabbix.log(4, '[ Webhook Gemini ] Base de conhecimento carregada com sucesso.');
        return response;
    } catch (e) {
        Zabbix.log(3, '[ Webhook Gemini ] Erro fatal na requisição HTTP para a KB: ' + e);
        return 'ERRO: Exceção ao tentar carregar a base de conhecimento.';
    }
}

// ===================================================================
// FUNÇÃO CORRIGIDA: Extrai o procedimento usando busca precisa (Regex)
// ===================================================================
function extractProcedureFromKB(kb_content, item_key) {
    if (!kb_content || !item_key) {
        return null;
    }

    // Escapa caracteres especiais no item_key para uso seguro em Regex (ex: o ponto em "carga.bat").
    var escaped_item_key = item_key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Cria uma Expressão Regular que busca pelo item_key como uma palavra inteira.
    // \b é uma "fronteira de palavra", garantindo que "carga.bat" não corresponda a "descarga.bat".
    var search_regex = new RegExp('\\b' + escaped_item_key + '\\b');
    
    var sections = kb_content.split('---');
    
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        
        // Usa o método test() do Regex, que é muito mais preciso que indexOf().
        if (search_regex.test(section)) {
            Zabbix.log(4, '[ Webhook Gemini ] Procedimento encontrado para o item "' + item_key + '" usando busca precisa.');
            return section.trim();
        }
    }
    
    Zabbix.log(3, '[ Webhook Gemini ] Procedimento para o item "' + item_key + '" NÃO foi encontrado no manual.');
    return null;
}


// ===================================================================
// Lógica Principal do Webhook 
// (NENHUMA MUDANÇA, pois a correção foi na função auxiliar)
// ===================================================================
try {
    var params = JSON.parse(value);

    var full_kb_content = getKBContent(params.kb_url);
    if (full_kb_content.startsWith('ERRO:')) {
        throw full_kb_content;
    }

    var extracted_procedure = extractProcedureFromKB(full_kb_content, params.item_key);

    var prompt_text;

    if (extracted_procedure) {
        prompt_text = "Você é um assistente de IA especialista para um Centro de Operações de Rede (NOC).\n" +
            "Sua tarefa é formatar de maneira clara e concisa um procedimento técnico que já foi extraído de um manual.\n\n" +
            "**Dados do Alerta:**\n" +
            "- **Host:** " + (params.host_name || 'N/A') + "\n" +
            "- **Alerta:** " + (params.alert_subject || 'N/A') + "\n\n" +
            "**Procedimento Técnico Relevante:**\n" +
            "```\n" +
            extracted_procedure + "\n" +
            "```\n\n" +
            "**SUA TAREFA:**\n" +
            "1.  Com base no **'Procedimento Técnico Relevante'** fornecido, crie uma resposta clara para a equipe de operações.\n" +
            "2.  Estruture a resposta com os títulos **'Causa Provável'**, **'Diagnóstico'** e **'Ação'**.\n" +
            "3.  Mantenha a linguagem direta e focada na solução do problema.\n" +
            "4.  Comece a resposta com um título principal contendo o nome do host e o resumo do problema.";

    } else {
        prompt_text = "Você é um assistente de IA especialista para um Centro de Operações de Rede (NOC).\n" +
            "Sua tarefa é informar ao operador que um procedimento técnico para um alerta específico não foi encontrado na base de conhecimento.\n\n" +
            "**Dados do Alerta sem Procedimento:**\n" +
            "- **Host:** " + (params.host_name || 'N/A') + "\n" +
            "- **Alerta:** " + (params.alert_subject || 'N/A') + "\n" +
            "- **Item Monitorado:** " + (params.item_key || 'N/A') + "\n\n" +
            "**SUA TAREFA:**\n" +
            "Gere uma mensagem curta e clara informando que **não há procedimento documentado no manual técnico para o item '" + (params.item_key || 'N/A') + "'**. Recomende o escalonamento para a equipe de engenharia para análise e criação do procedimento.";
    }
        
    var data = {
        contents: [{
            parts: [{
                text: prompt_text
            }]
        }],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800
        }
    };

    Gemini.setParams({
        api_key: params.api_key,
        model: params.model
    });
    
    var response = Gemini.request(data);
    
    var result = "";
    if (response && response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
        result = response.candidates[0].content.parts[0].text.trim();
    } else {
        Zabbix.log(3, '[ Webhook Gemini ] Resposta da API não contém o conteúdo esperado: ' + JSON.stringify(response));
        throw 'Nenhuma resposta válida foi recebida do Gemini.';
    }
    
    return result;
    
} catch (error) {
    Zabbix.log(3, '[ Webhook Gemini ] ERRO FATAL NO SCRIPT: ' + error);
    throw 'Falha no script do webhook Gemini: ' + error;
}
