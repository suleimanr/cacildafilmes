import { type NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Verificar se a última mensagem do usuário contém o comando /whatsapp
    const lastUserMessage = messages[messages.length - 1].content
    if (lastUserMessage.startsWith("/whatsapp")) {
      const phoneNumber = lastUserMessage.slice(9).trim()
      const whatsappLink = `https://wa.me/5511948878572?text=Olá,%20meu%20número%20é%20${phoneNumber}.%20Gostaria%20de%20mais%20informações%20sobre%20os%20serviços%20da%20Punch%20Conteúdo.`
      const response = `Clique no link a seguir para iniciar uma conversa no WhatsApp: /whatsapp${phoneNumber}`
      return new Response(response)
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente especializado na Punch Conteúdo, uma produtora criativa focada em educação corporativa para grandes empresas. Forneça respostas concisas, geralmente 2-3 frases. Use tags [highlight] ao redor das partes mais importantes da sua resposta. Ao mencionar itens do portfólio ou exemplos do trabalho da Punch Conteúdo, sempre use tags [portfolio=VIDEO_ID], onde VIDEO_ID é o ID do vídeo no Vimeo. Exemplos:\n\n" +
              "- Reel da Punch: [portfolio=754713544]\n" +
              "- Grupo Boticário - NPS: [portfolio=774771860]\n" +
              "- Empreendedoras da Beleza: [portfolio=844245615]\n" +
              "- Making of Empreendedoras da Beleza: [portfolio=835540097]\n" +
              "- XP Inc. Entrevista Benchimol: [portfolio=690648788]\n" +
              "- Sonhos - XP Inc.: [portfolio=583171837]\n" +
              "- Teaser Videoaula XP Inc.: [portfolio=583177882]\n\n" +
              "Tente incluir pelo menos um link de portfólio em suas respostas ao discutir os projetos ou capacidades da Punch Conteúdo. Quando mencionar um projeto, inclua sua descrição relevante.\n\n" +
              "Informações de contato da Punch Conteúdo:\n" +
              "Quando o usuário pedir para entrar em contato ou demonstrar interesse nos serviços, instrua-o a usar o comando /whatsapp seguido do número de telefone com DDD para abrir uma conversa direta no WhatsApp.\n\n" +
              "Exemplo: Para entrar em contato conosco via WhatsApp, digite '/whatsapp' seguido do seu número de telefone com DDD. Por exemplo: /whatsapp11987654321",
          },
          ...messages,
        ],
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    let buffer = ""

    const stream = new TransformStream({
      async transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              controller.terminate()
            } else {
              try {
                const parsed = JSON.parse(data)
                const text = parsed.choices[0]?.delta?.content || ""
                if (text) {
                  controller.enqueue(encoder.encode(text))
                }
              } catch (error) {
                console.error("Error parsing JSON:", error)
              }
            }
          }
        }
      },
    })

    return new Response(response.body?.pipeThrough(stream), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 })
  }
}

